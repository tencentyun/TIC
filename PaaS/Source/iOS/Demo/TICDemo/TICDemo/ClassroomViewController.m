#define SCREEN_WIDTH [[UIScreen mainScreen] bounds].size.width
#define SCREEN_HEIGHT [[UIScreen mainScreen] bounds].size.height
#define kBoardH ceil([[UIScreen mainScreen] bounds].size.width*9/16.0)
#define kVideoH ceil([[UIScreen mainScreen] bounds].size.width*1/5.0)

static const NSString *staticClassID = @"";

#import "ClassroomViewController.h"
#import "UIViewController+Utils.h"
#import "MenuTableViewController.h"
#import "TICRenderView.h"
#import <TEduBoard/TEduBoard.h>

@interface ClassroomViewController () <UITextFieldDelegate, MenuTableViewControllerDelegate, TEduBoardDelegate>
//视频渲染视图容器
@property (weak, nonatomic) IBOutlet UIView *renderViewContainer;
//白板视图容器
@property (weak, nonatomic) IBOutlet UIView *boardViewContainer;
//聊天内容容器
@property (weak, nonatomic) IBOutlet UITextView *chatView;
//消息发送内容
@property (weak, nonatomic) IBOutlet UITextField *messageTextField;
//菜单控制器
@property (nonatomic, strong) MenuTableViewController *menuController;

@property (nonatomic, strong) NSMutableArray *renderViews;
@end

@implementation ClassroomViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = _classId;
    
    //初始化菜单控制器
    UIStoryboard *story = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
    self.menuController = [story instantiateViewControllerWithIdentifier:@"MenuTableViewController"];
    self.menuController.delegate = self;
    self.menuController.view.frame = CGRectMake(self.view.bounds.size.width / 2, 0, self.view.bounds.size.width / 2, self.view.bounds.size.height);
    [self addChildViewController:self.menuController];
    [self.view addSubview:self.menuController.view];
    self.menuController.view.hidden = YES;
    
    //初始化导航栏
    UIBarButtonItem *lefBarItem = [[UIBarButtonItem alloc] initWithTitle:@"退出课堂" style:UIBarButtonItemStylePlain target:self action:@selector(onQuitClassRoom)];
    self.navigationItem.leftBarButtonItem = lefBarItem;
    UIBarButtonItem *rightBarItem = [[UIBarButtonItem alloc] initWithTitle:@"菜单" style:UIBarButtonItemStylePlain target:self action:@selector(onMenu)];
    self.navigationItem.rightBarButtonItem = rightBarItem;
    
    //监听事件键盘
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
    
    //白板视图
    [[[TICManager sharedInstance] getBoardController] addDelegate:self];
    UIView *boardView = [[[TICManager sharedInstance] getBoardController] getBoardRenderView];
    boardView.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.width * 9 / 16);
    [self.boardViewContainer addSubview:boardView];
    
    //更新视频视图
    [self updateRenderViewsLayout];
}

#pragma mark - board delegate
- (void)onTEBRedoStatusChanged:(BOOL)canRedo
{
    [self.menuController setCanRedo:canRedo];
}

- (void)onTEBUndoStatusChanged:(BOOL)canUndo
{
    [self.menuController setCanUndo:canUndo];
}

#pragma mark - button action
- (IBAction)onSendMessage:(id)sender
{
    __weak typeof(self) ws = self;
    NSString *message = self.messageTextField.text;
    [[TICManager sharedInstance] sendGroupTextMessage:message callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            // 将自己发送的消息展示在界面上
            NSString *msgInfo = [NSString stringWithFormat:@"[我] %@", message];
            ws.chatView.text = [NSString stringWithFormat:@"%@\n%@", ws.chatView.text, msgInfo];
            [ws.chatView scrollRangeToVisible:NSMakeRange(self.chatView.text.length, 1)];
            ws.messageTextField.text = nil;
        }
    }];
    [self.messageTextField resignFirstResponder];
}

- (void)onQuitClassRoom
{
    [[[TICManager sharedInstance] getBoardController] removeDelegate:self];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [[TICManager sharedInstance] removeEventListener:self];
    [[TICManager sharedInstance] removeMessageListener:self];
    __weak typeof(self) ws = self;
    [[TICManager sharedInstance] quitClassroom:NO callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            //退出课堂成功
        }
        else{
            //退出课堂失败
        }
        [ws.navigationController popViewControllerAnimated:YES];
    }];
}

- (void)onMenu
{
    self.menuController.view.hidden = !self.menuController.view.hidden;
}


#pragma mark - menu delegate
- (void)onSwitchCamera
{
    [[[TICManager sharedInstance] getTRTCCloud] switchCamera];
}
- (void)onCameraStateChanged:(BOOL)state
{
    if(state){
        TICRenderView *render = [[TICRenderView alloc] init];
        render.userId = _userId;
        render.streamType = TICStreamType_Main;
        [self.renderViewContainer addSubview:render];
        [self.renderViews addObject:render];
        [[[TICManager sharedInstance] getTRTCCloud] startLocalPreview:YES view:render];
    }
    else{
        TICRenderView *render = [self getRenderView:_userId streamType:TICStreamType_Main];
        [self.renderViews removeObject:render];
        [render removeFromSuperview];
        [[[TICManager sharedInstance] getTRTCCloud] stopLocalPreview];
    }
    [self updateRenderViewsLayout];
}

- (void)onMicStateChaged:(BOOL)state
{
    if(state){
        [[[TICManager sharedInstance] getTRTCCloud] startLocalAudio];
    }
    else{
        [[[TICManager sharedInstance] getTRTCCloud] stopLocalAudio];
    }
}

- (void)onSpeakerStateChaged:(BOOL)state
{
    [[[TICManager sharedInstance] getTRTCCloud] setAudioRoute:(TRTCAudioRoute)(!state)];
}

- (void)onSelectToolType:(int)toolType
{
    [[[TICManager sharedInstance] getBoardController] setToolType:(TEduBoardToolType)toolType];
}

- (void)onSelectBrushColor:(UIColor *)color
{
    [[[TICManager sharedInstance] getBoardController] setBrushColor:color];
}

- (void)onBrushThinChanged:(float)thin
{
    [[[TICManager sharedInstance] getBoardController] setBrushThin:thin];
}


- (void)onSelectTextColor:(UIColor *)color
{
    [[[TICManager sharedInstance] getBoardController] setTextColor:color];
}

- (void)onSelectBackgroundColor:(UIColor *)color
{
    [[[TICManager sharedInstance] getBoardController] setBackgroundColor:color];
}

- (void)onTextSizeChanged:(float)thin
{
    [[[TICManager sharedInstance] getBoardController] setTextSize:thin];
}

- (void)onDrawStateChanged:(BOOL)state
{
    [[[TICManager sharedInstance] getBoardController] setDrawEnable:state];
}

- (void)onSyncDataChanged:(BOOL)state
{
    [[[TICManager sharedInstance] getBoardController] setDataSyncEnable:state];
}

- (void)onSetBackgroundH5:(NSString *)url
{
    [[[TICManager sharedInstance] getBoardController] setBackgroundH5:url];
}

- (void)onAddH5File:(NSString *)url
{
    [[[TICManager sharedInstance] getBoardController] addH5File:url];
}

- (void)onSetTextStyle:(int)style
{
    [[[TICManager sharedInstance] getBoardController] setTextStyle:(TEduBoardTextStyle)style];
}

- (void)onUndo
{
    [[[TICManager sharedInstance] getBoardController] undo];
}

- (void)onRedo
{
    [[[TICManager sharedInstance] getBoardController] redo];
}
- (void)onClear
{
    [[[TICManager sharedInstance] getBoardController] clear];
}
- (void)onClearDraw
{
    [[[TICManager sharedInstance] getBoardController] clearDraws];
}

- (void)onReset
{
    [[[TICManager sharedInstance] getBoardController] reset];
}

- (void)onSetBackgroundImage:(NSString *)path
{
    [[[TICManager sharedInstance] getBoardController] setBackgroundImage:path mode:TEDU_BOARD_IMAGE_FIT_MODE_CENTER];
}

- (void)onAddBoard
{
    [[[TICManager sharedInstance] getBoardController] addBoardWithBackgroundImage:nil];
}

- (void)onDeleteBoard:(NSString *)boardId
{
    [[[TICManager sharedInstance] getBoardController] deleteBoard:boardId];
}

- (void)onGotoBoard:(NSString *)boardId resetStep:(BOOL)resetStep
{
    [[[TICManager sharedInstance] getBoardController] gotoBoard:boardId resetStep:resetStep];
}

- (void)onBoardScaleChanged:(int)scale
{
    [[[TICManager sharedInstance] getBoardController] setBoardScale:scale];
}

- (void)onBoardContentFitMode:(int)mode
{
    [[[TICManager sharedInstance] getBoardController] setBoardContentFitMode:(TEduBoardContentFitMode)mode];
}

- (int)getBoardContentFitMode
{
    return [[[TICManager sharedInstance] getBoardController] getBoardContentFitMode];
}

- (void)onBoardRatioChanged:(NSString *)ratio
{
    [[[TICManager sharedInstance] getBoardController] setBoardRatio:ratio];
}

- (NSString *)getBoardRatio
{
    return [[[TICManager sharedInstance] getBoardController] getBoardRatio];
}

- (NSArray<NSString *> *)getBoardList
{
    return [[[TICManager sharedInstance] getBoardController] getBoardList];
}

- (NSString *)getCurrentBoard
{
    return [[[TICManager sharedInstance] getBoardController] getCurrentBoard];
}

- (void)onPreStep
{
    [[[TICManager sharedInstance] getBoardController] prevStep];
}
- (void)onNextStep
{
    [[[TICManager sharedInstance] getBoardController] nextStep];
}

- (void)onPreBoard:(BOOL)resetStep
{
    [[[TICManager sharedInstance] getBoardController] preBoard:resetStep];
}
- (void)onNextBoard:(BOOL)resetStep
{
    [[[TICManager sharedInstance] getBoardController] nextBoard:resetStep];
}

- (void)onSwitchFile:(NSString *)fileId
{
    [[[TICManager sharedInstance] getBoardController] switchFile:fileId];
}

- (void)onDeleteFile:(NSString *)fileId
{
    [[[TICManager sharedInstance] getBoardController] deleteFile:fileId];
}

- (NSArray<NSString *> *)getFileList
{
    NSArray<TEduBoardFileInfo *> *files = [[[TICManager sharedInstance] getBoardController] getFileInfoList];
    NSMutableArray *names = [NSMutableArray array];
    for (TEduBoardFileInfo *file in files) {
        [names addObject:file.fileId];
    }
    return names;
}
- (NSString *)getCurrentFile
{
    return [[[TICManager sharedInstance] getBoardController] getCurrentFile];
}

#pragma mark - keyboard

//当键盘出现或改变时调用
- (void)keyboardWillShow:(NSNotification *)note {
    if(!self.messageTextField.isFirstResponder){
        return;
    }
    NSDictionary *info = note.userInfo;
    CGSize keyboardSize = [[info objectForKeyedSubscript:UIKeyboardFrameEndUserInfoKey] CGRectValue].size;
    CGRect frame = self.view.frame;
    frame.origin.y = -keyboardSize.height;
    CGFloat duration = [note.userInfo[UIKeyboardAnimationDurationUserInfoKey] floatValue];
    __weak typeof(self) ws = self;
    [UIView animateWithDuration:duration animations:^{
        ws.view.frame = frame;
    }];
}

//当键盘消失时调用
- (void)keyboardWillHide:(NSNotification *)note {
    if(!self.messageTextField.isFirstResponder){
        return;
    }
    double duration = [note.userInfo[UIKeyboardAnimationDurationUserInfoKey] doubleValue];
    CGRect frame = self.view.frame;
    frame.origin.y = 0;
    __weak typeof(self) ws = self;
    [UIView animateWithDuration:duration animations:^{
        ws.view.frame = frame;
    }];
    
}

#pragma mark - text field delegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [textField resignFirstResponder];
    return YES;
}

#pragma mark - Custom Action

- (UIColor *)randomColor{
    CGFloat hue = ( arc4random() % 256 / 256.0 );
    CGFloat saturation = ( arc4random() % 128 / 256.0 ) + 0.5;
    CGFloat brightness = ( arc4random() % 128 / 256.0 ) + 0.5;
    return [UIColor colorWithHue:hue saturation:saturation brightness:brightness alpha:1];
}


#pragma mark - message listener

- (void)onTICRecvTextMessage:(NSString *)text fromUserId:(NSString *)fromUserId
{
}

- (void)onTICRecvCustomMessage:(NSData *)data fromUserId:(NSString *)fromUserId
{
}

- (void)onTICRecvMessage:(TIMMessage *)message
{
}

- (void)onTICRecvGroupTextMessage:(NSString *)text groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId
{
    // 接收到房间内其他成员发出的文本消息，将消息按"[发送者] 消息内容"格式展示在界面上
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",fromUserId, text];
    self.chatView.text = [NSString stringWithFormat:@"%@\n%@",self.chatView.text, msgInfo];
    [self.chatView scrollRangeToVisible:NSMakeRange(self.chatView.text.length, 1)];
}

- (void)onTICRecvGroupCustomMessage:(NSData *)data groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId
{
    // 接收到房间内其他成员发出的自定义消息，将消息按"[发送者] 消息内容"格式展示在界面上
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",fromUserId, @"CUSTOM"];
    self.chatView.text = [NSString stringWithFormat:@"%@\n%@",self.chatView.text, msgInfo];
    [self.chatView scrollRangeToVisible:NSMakeRange(self.chatView.text.length, 1)];
}

#pragma mark - render view
- (void)updateRenderViewsLayout
{
    NSArray *rects = [self getRenderViewFrames];
    if(rects.count != self.renderViews.count){
        return;
    }
    for (int i = 0; i < self.renderViews.count; ++i) {
        UIView *view = self.renderViews[i];
        CGRect frame = [rects[i] CGRectValue];
        view.frame = frame;
        if(!view.superview){
            [self.renderViewContainer addSubview:view];
        }
    }
}

- (NSArray *)getRenderViewFrames
{
    CGFloat height = self.renderViewContainer.frame.size.height;
    CGFloat width = self.renderViewContainer.frame.size.width / 5;
    CGFloat xOffset = 0;
    NSMutableArray *array = [NSMutableArray array];
    for (int i = 0; i < self.renderViews.count; i++) {
        CGRect frame = CGRectMake(xOffset, 0, width, height);
        [array addObject:[NSValue valueWithCGRect:frame]];
        xOffset += width;
    }
    return array;
}

- (TICRenderView *)getRenderView:(NSString *)userId streamType:(TICStreamType)streamType
{
    for (TICRenderView *render in self.renderViews) {
        if([render.userId isEqualToString:userId] && render.streamType == streamType){
            return render;
        }
    }
    return nil;
}

#pragma mark - event listener
- (void)onTICUserVideoAvailable:(NSString *)userId available:(BOOL)available
{
    if(available){
        TICRenderView *render = [[TICRenderView alloc] init];
        render.userId = userId;
        render.streamType = TICStreamType_Main;
        [self.renderViewContainer addSubview:render];
        [self.renderViews addObject:render];
        [[[TICManager sharedInstance] getTRTCCloud] startRemoteView:userId view:render];
    }
    else{
        TICRenderView *render = [self getRenderView:userId streamType:TICStreamType_Main];
        [self.renderViews removeObject:render];
        [render removeFromSuperview];
        [[[TICManager sharedInstance] getTRTCCloud] stopRemoteView:userId];
    }
    [self updateRenderViewsLayout];
}

- (void)onTICUserSubStreamAvailable:(NSString *)userId available:(BOOL)available
{
    if(available){
        TICRenderView *render = [[TICRenderView alloc] init];
        render.userId = userId;
        render.streamType = TICStreamType_Sub;
        [self.renderViewContainer addSubview:render];
        [self.renderViews addObject:render];
        [[[TICManager sharedInstance] getTRTCCloud] startRemoteSubStreamView:userId view:render];
    }
    else{
        TICRenderView *render = [self getRenderView:userId streamType:TICStreamType_Sub];
        [self.renderViews removeObject:render];
        [render removeFromSuperview];
        [[[TICManager sharedInstance] getTRTCCloud] stopRemoteSubStreamView:userId];
    }
    [self updateRenderViewsLayout];
}


-(void)onTICMemberJoin:(NSArray*)members {
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",members.firstObject, @"加入了房间"];
    self.chatView.text = [NSString stringWithFormat:@"%@\n%@",self.chatView.text, msgInfo];;
}

-(void)onTICMemberQuit:(NSArray*)members {

    if ([members.firstObject isEqualToString:[[TIMManager sharedInstance] getLoginUser]]) {
        [self showAlertWithTitle:@"退出课堂" msg:@"你被老师踢出了房间" handler:^(UIAlertAction *action) {
            [self.navigationController popViewControllerAnimated:YES];
        }];
    }
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",members.firstObject, @"退出了房间"];
    self.chatView.text = [NSString stringWithFormat:@"%@\n%@",self.chatView.text, msgInfo];;
}


-(void)onTICClassroomDestroy {
    [self showAlertWithTitle:@"课程结束" msg:@"老师已经结束了该堂课程" handler:^(UIAlertAction *action) {
        [self.navigationController popViewControllerAnimated:YES];
    }];
    
}

#pragma mark - Accessor
- (NSMutableArray *)renderViews
{
    if(!_renderViews){
        _renderViews = [NSMutableArray array];
    }
    return _renderViews;
}

@end
