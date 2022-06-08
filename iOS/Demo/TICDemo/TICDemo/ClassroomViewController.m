#define SCREEN_WIDTH [[UIScreen mainScreen] bounds].size.width
#define SCREEN_HEIGHT [[UIScreen mainScreen] bounds].size.height
#define kBoardH ceil([[UIScreen mainScreen] bounds].size.width*9/16.0)
#define kVideoH ceil([[UIScreen mainScreen] bounds].size.width*1/5.0)

#import "ClassroomViewController.h"
#import "UIViewController+Utils.h"
#import "MenuTableViewController.h"
#import "IMManager.h"
#import "BoardManager.h"
#import "JMToast.h"

static const NSString *staticClassID = @"";

@interface ClassroomViewController () <UITextFieldDelegate, MenuTableViewControllerDelegate, TEduBoardDelegate, IMManagerListener>
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
    [self.boardController addDelegate:self];
    UIView *boardView = [self.boardController getBoardRenderView];
    boardView.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.width * 9 / 16);
    [self.boardViewContainer addSubview:boardView];
    [IMManager sharedInstance].delegate = self;
}

#pragma mark - 白板回调
- (void)onTEBRedoStatusChanged:(BOOL)canRedo {
    [self.menuController setCanRedo:canRedo];
}

- (void)onTEBUndoStatusChanged:(BOOL)canUndo {
    [self.menuController setCanUndo:canUndo];
}

- (void)onTEBHistroyDataSyncCompleted {
}

- (void)onTEBWarning:(TEduBoardWarningCode)code msg:(NSString *)msg {
}

- (void)onTEBVideoStatusChanged:(NSString *)fileId status:(TEduBoardVideoStatus)status progress:(CGFloat)progress duration:(CGFloat)duration {
    NSLog(@"video progress = %.f", progress);
}

#pragma mark - Api使用示例
// 添加文本元素
- (void)addTextElement {
    [self.boardController addTextElement:@"我是测试文本" fontColor:@"#ff0000" fontSize:500 fontFace:@"PingFangSC-Regular" fontStyle:TEDU_BOARD_TEXT_STYLE_BOLD];
}

// 添加数学函数图像
- (void)addMathGraphElement {
    TEduBoardElementMathBoard *mathboard = [[TEduBoardElementMathBoard alloc] init];
    mathboard.axisColor = UIColor.orangeColor;
    NSString *boardid = [self.boardController addElementWithBoard:mathboard options:nil];
    TEduBoardElementMathGraph *mathGraph = [[TEduBoardElementMathGraph alloc] init];
    mathGraph.mathBoardId = [NSString stringWithFormat:@"%@", boardid];
    mathGraph.expression = @"cos(x)";
    mathGraph.color = UIColor.orangeColor;
    [self.boardController addElementWithGraph:mathGraph options:nil];
}

// 添加图片元素
- (void)addImageElement {
    TEduBoardAddElementOptions *op = [[TEduBoardAddElementOptions alloc] init];
    op.left = @"100px";
    op.top = @"100px";
    [self.boardController addElement:@"https://main.qcloudimg.com/raw/be5d8bc407204d0e1dea30bacd6d006b.png" type:TEDU_BOARD_ELEMENT_IMAGE options:op];
}

// 添加视频元素
- (void)addVideoElement {
    [self.boardController  addVideoFile:@"http://test-1259648581.cos.ap-shanghai.myqcloud.com/media/%5B%E6%B8%85%E6%99%B0%20480P%5D%20%E6%9C%AA%E6%9D%A5%E5%BB%BA%E7%AD%91-%E8%85%BE%E8%AE%AF%E6%BB%A8%E6%B5%B7%E5%A4%A7%E5%8E%A6.mp4" title:@"测试视频" needSwitch:YES];
}

// 设置自定义字体
- (void)setCustomFont {
    [self.boardController addTextFontFamily:@"myFont" fontUrl:@"https://tic-res-1259648581.cos.ap-shanghai.myqcloud.com/board/dev_board/zhutao/fonts/XiaoDouDaoFengWuShiJianFan-Shan%28REEJI-Xiaodou-PoemGBT-Flash%29-2.ttf"];
            [self.boardController setTextFontFamily:@"myFont"];
    NSString *currentFont = [self.boardController getTextFontFamily];
    NSLog(@"currentFont = %@", currentFont);
}

// 添加公式元素
- (void)addExpressionElement {
    [self.boardController addElementWithExpression:@"f(x) = \\\\int_{-\\\\infty}^\\\\infty \\\\hat{f}(\\\\xi)\\\\,e^{2 \\\\pi i \\\\xi x} \\\\,d\\\\xi" type:TEDU_BOARD_ELEMENT_FORMULA];
}

- (void)gotoPPTStep {
    NSArray<TEduBoardFileInfo *> *fileList = [self.boardController getFileInfoList];
    for (TEduBoardFileInfo *file in fileList) {
        if (TEduBoardH5_COURSEWARE == file.fileType && file.boardInfoList.count > 0) {
            NSString *boardid = file.boardInfoList.firstObject.boardId;
            [self.boardController gotoStep:2 ofBoard:boardid];
        }
    }
}

- (void)addTranscodeFile {
    {
        TEduBoardTranscodeFileResult *result = [[TEduBoardTranscodeFileResult alloc] init];
        result.url = @"https://test-1259648581.file.myqcloud.com/ppt/0001nngov3gvpvfe9p5c/";
        result.pages = 137;
        result.resolution = @"959x539";
        result.title = @"《红星照耀中国》.pdf";
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self.boardController addTranscodeFile:result needSwitch:YES];
        });
    }

    {
        TEduBoardTranscodeFileResult *result = [[TEduBoardTranscodeFileResult alloc] init];
        result.url = @"https://test-1259648581.file.myqcloud.com/ppt/000sedd4ish31fn0kq5c/index.html";
        result.pages = 72;
        result.resolution = @"960x540";
        result.title = @"第五讲定稿1635074138348e5bb779d11b8c.pptx";
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(10 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self.boardController addTranscodeFile:result needSwitch:YES];
        });
    }

}

#pragma mark - button action
- (IBAction)onSendMessage:(id)sender
{
    __weak typeof(self) ws = self;
    NSString *message = self.messageTextField.text;
    [[IMManager sharedInstance] sendGroupTextMessage:message callback:^(int code, NSString * _Nullable desc) {
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
    [self.boardController removeDelegate:self];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    
    [[BoardManager sharedInstance] destroyBoard];
    
    __weak typeof(self) ws = self;
    [IMManager sharedInstance].delegate = nil;
    [[IMManager sharedInstance] quitIMGroup:self.classId callback:^(int code, NSString * _Nullable desc) {
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


#pragma mark - MenuTableViewController点击

- (void)onMagicPenChanged:(BOOL)state {
    [self.boardController setPenAutoFittingMode: state ? TEduBoardPenFittingModeAuto : TEduBoardPenFittingModeNone];
}

- (void)onPiecewiseErasureChanged:(BOOL)state {
    [self.boardController setPiecewiseErasureEnable:state];
}

- (void)onSelectToolType:(int)toolType
{
    [self.boardController setToolType:(TEduBoardToolType)toolType];
}

- (void)onSelectCustomGraph:(NSString *)url
{
    [self.boardController addElement:url type:TEDU_BOARD_ELEMENT_CUSTOM_GRAPH];
}

- (void)onSelectBrushColor:(UIColor *)color
{
    [self.boardController setBrushColor:color];
}

- (void)onBrushThinChanged:(float)thin
{
    [self.boardController setBrushThin:thin];
}


- (void)onSelectTextColor:(UIColor *)color
{
    [self.boardController setTextColor:color];
}

- (void)onSelectBackgroundColor:(UIColor *)color
{
    [self.boardController setBackgroundColor:color];
}

- (void)onTextSizeChanged:(float)thin
{
    [self.boardController setTextSize:thin];
}

- (void)onDrawStateChanged:(BOOL)state
{
    [self.boardController setDrawEnable:state];
}

- (void)onSyncDataChanged:(BOOL)state
{
    [self.boardController setDataSyncEnable:state];
}

- (void)onSetBackgroundH5:(NSString *)url
{
    [self.boardController setBackgroundH5:url];
}

- (void)onAddH5File:(NSString *)url
{
    [self.boardController addH5File:url title:@"" needSwitch:YES];
}

- (void)onSetTextStyle:(int)style
{
    [self.boardController setTextStyle:(TEduBoardTextStyle)style];
}

- (void)onUndo
{
    [self.boardController undo];
}

- (void)onRedo
{
    [self.boardController redo];
}
- (void)onClear
{
    [self.boardController clear];
}
- (void)onClearDraw
{
    [self.boardController clearDraws];
}

- (void)onReset
{
    [self.boardController reset];
}

- (void)onSetBackgroundImage:(NSString *)path
{
    [self.boardController setBackgroundImage:path mode:TEDU_BOARD_IMAGE_FIT_MODE_CENTER];
}

- (void)onAddBoard
{
    [self.boardController addBoard:nil model:TEDU_BOARD_IMAGE_FIT_MODE_CENTER type:TEDU_BOARD_BACKGROUND_IMAGE needSwitch:YES];
}

- (void)onDeleteBoard:(NSString *)boardId
{
    [self.boardController deleteBoard:boardId];
}

- (void)onGotoBoard:(NSString *)boardId resetStep:(BOOL)resetStep
{
    [self.boardController gotoBoard:boardId resetStep:resetStep];
}

- (void)onBoardScaleChanged:(int)scale
{
    [self.boardController setBoardScale:scale];
}

- (void)onBoardContentFitMode:(int)mode
{
    [self.boardController setBoardContentFitMode:(TEduBoardContentFitMode)mode];
}

- (int)getBoardContentFitMode
{
    return (int)[self.boardController getBoardContentFitMode];
}

- (void)onBoardRatioChanged:(NSString *)ratio
{
    [self.boardController setBoardRatio:ratio];
}

- (NSString *)getBoardRatio
{
    return [self.boardController getBoardRatio];
}

- (NSArray<NSString *> *)getBoardList
{
    return [self.boardController getBoardList];
}

- (NSString *)getCurrentBoard
{
    return [self.boardController getCurrentBoard];
}

- (void)onPreStep
{
    [self.boardController prevStep];
}
- (void)onNextStep
{
    [self.boardController nextStep];
}

- (void)onPreBoard:(BOOL)resetStep
{
    [self.boardController preBoard:resetStep];
}
- (void)onNextBoard:(BOOL)resetStep
{
    [self.boardController nextBoard:resetStep];
}

- (void)onSwitchFile:(NSString *)fileId
{
    [self.boardController switchFile:fileId];
}

- (void)onDeleteFile:(NSString *)fileId
{
    if ([[fileId uppercaseString] isEqualToString:@"#DEFAULT"]) {
        [[JMToast sharedToast] showDialogWithMsg:@"不能删除默认白板"];
        return;
    }
    [self.boardController deleteFile:fileId];
}

- (void)onTEBBoardCursorPosition:(CGPoint)position {
    NSLog(@"onTEBBoardCursorPosition, x = %.1f, y= %.1f......", position.x, position.y);
}

- (void)onSetOwnerNickNameVisible:(BOOL)state {
    [self.boardController setOwnerNickNameVisible:state];
}

- (NSArray<NSString *> *)getFileList
{
    NSArray<TEduBoardFileInfo *> *files = [self.boardController getFileInfoList];
    NSMutableArray *names = [NSMutableArray array];
    for (TEduBoardFileInfo *file in files) {
        [names addObject:file.fileId];
    }
    return names;
}
- (NSString *)getCurrentFile
{
    return [self.boardController getCurrentFile];
}

- (void)onAddMathBoard {
    TEduBoardElementMathBoard *mathboard = [[TEduBoardElementMathBoard alloc] init];
    mathboard.axisColor = UIColor.orangeColor;
    [self.boardController addElementWithBoard:mathboard options:nil];
}

- (void)onSetMathGraphType:(NSInteger)type {
    [self.boardController setMathGraphType:type mouseTool:YES];
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


#pragma mark - IMManagerListener

- (void)onRecvGroupTextMessage:(NSString *)text groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId
{
    // 接收到房间内其他成员发出的文本消息，将消息按"[发送者] 消息内容"格式展示在界面上
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",fromUserId, text];
    self.chatView.text = [NSString stringWithFormat:@"%@\n%@",self.chatView.text, msgInfo];
    [self.chatView scrollRangeToVisible:NSMakeRange(self.chatView.text.length, 1)];
}

// 接收到个人文本消息
- (void)onRecvCTCTextMessage:(NSString *)text fromUserId:(NSString *)fromUserId {
    NSString *msgInfo = [NSString stringWithFormat:@"[%@]（私聊）：%@",fromUserId, text];
    self.chatView.text = [NSString stringWithFormat:@"%@\n%@",self.chatView.text, msgInfo];
    [self.chatView scrollRangeToVisible:NSMakeRange(self.chatView.text.length, 1)];
}

@end
