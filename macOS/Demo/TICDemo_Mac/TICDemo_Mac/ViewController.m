#import "ViewController.h"
#import "TICConfig.h"
#import "ColorPickViewController.h"
#import "ThumbItem.h"
#import <SDWebImage/SDWebImage.h>
#import <WebKit/WebKit.h>
#import "IMManager.h"
#import "BoardManager.h"

typedef NS_ENUM(NSInteger, TICModule) {
    TICMODULE_IMSDK     = 0,     //IMSDK模块
    TICMODULE_BOARD     = 2,     //BOARD模块
};

@interface ViewController () <TEduBoardDelegate, NSTableViewDelegate, NSTableViewDataSource, NSPopoverDelegate, NSCollectionViewDelegate, NSCollectionViewDataSource, V2TIMSDKListener, IMManagerListener>
@property (weak) IBOutlet NSPopUpButton *userPopUpButton;
@property (weak) IBOutlet NSPopUpButton *toolTypePopUpButton;
@property (weak) IBOutlet NSPopUpButton *customGraphPopUpButton;


@property (weak) IBOutlet NSTableView *boardTableView;
@property (weak) IBOutlet NSTableView *fileTableView;


@property (weak) IBOutlet NSTextField *brushColorTextField;
@property (weak) IBOutlet NSTextField *backgroundColorTextField;
@property (weak) IBOutlet NSTextField *textColorTextField;

@property (weak) IBOutlet NSTextField *h5BackTextField;

@property (weak) IBOutlet NSView *boardView;
@property (weak) IBOutlet NSTextField *classIdTextField;
@property (weak) IBOutlet NSTextField *messageTextField;
@property (unsafe_unretained) IBOutlet NSTextView *chatTextView;

@property (nonatomic, assign) int setColorIndex;
@property (nonatomic, strong) NSArray *thumbUrls;

@property (weak) IBOutlet NSTextField *imsdkVerLabel;
@property (weak) IBOutlet NSTextField *boardVerLabel;


@property (nonatomic, strong) NSMutableArray *customGraphArray;

//登陆tab按钮
@property (weak) IBOutlet NSView *userGroupContainer;
@property (weak) IBOutlet NSButton *loginButton;
@property (weak) IBOutlet NSButton *logoutButton;


//房间tab按钮
@property (weak) IBOutlet NSView *roomGroupContainer;
@property (weak) IBOutlet NSButton *joinRoomButton;
@property (weak) IBOutlet NSButton *quitRoomButton;

//白板tab按钮
@property (weak) IBOutlet NSButton *undoButton;
@property (weak) IBOutlet NSButton *redoButton;
@property (weak) IBOutlet NSButton *resetStepButton;
@property (weak) IBOutlet NSView *boardGroupContainer;
@property (weak) IBOutlet NSCollectionView *thumbView;
@property (weak) IBOutlet NSTextField *thumbTip;
@property (weak) IBOutlet NSTextField *h5FileTextField;
@property (weak) IBOutlet NSTextField *videoTextField;
@property (weak) IBOutlet NSTextField *imageTextFiled;

@property (weak) IBOutlet NSTabView *tabView;
@property (strong) NSView *cursorView;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setupViews];
    [self initTIC];
    [self setupUsers];
    [self setupToolTypes];
    [self setupCustomGraph];
    [self setupThumbView];
    
    //版本信息
    self.imsdkVerLabel.stringValue = [[V2TIMManager sharedInstance] getVersion];
    self.boardVerLabel.stringValue = [TEduBoardController getVersion];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(screenResize) name:NSWindowDidResizeNotification object:nil];
    [IMManager sharedInstance].delegate = self;
}

- (void)dealloc {
    [[IMManager sharedInstance] unInit];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:NSWindowDidResizeNotification object:nil];
    [IMManager sharedInstance].delegate = nil;
}

- (void)screenResize {
    self.boardGroupContainer.frame = CGRectMake(self.boardGroupContainer.frame.origin.x, 20, self.view.frame.size.width - self.boardGroupContainer.frame.origin.x - 20, self.view.frame.size.height - 40);
    NSView *board = [[BoardManager sharedInstance].boardController getBoardRenderView];
    if (board && board.superview == self.boardView) {
        board.frame = self.boardView.bounds;

    }

}

#pragma mark - 初始化
- (void)initTIC{
    int sdkAppid = [[TICConfig shareInstance].sdkAppId intValue];
    BOOL sucess = [[IMManager sharedInstance] initSDK:sdkAppid listener:self];
    if (!sucess) {
        NSLog(@"IM初始化失败！");
    }
}

#pragma mark - 用户

- (IBAction)onLogin:(id)sender {
    NSInteger index = self.userPopUpButton.indexOfSelectedItem;
    NSString *userId = [TICConfig shareInstance].userIds[index];
    NSString *userSig = [TICConfig shareInstance].userSigs[index];
    __weak typeof(self) ws = self;
    [[IMManager sharedInstance] login:userId userSig:userSig callback:^(int code, NSString * _Nullable desc) {
        [ws showAlert:TICMODULE_IMSDK code:code desc:desc];
        if(code == 0){
            [ws enableGroup:ws.roomGroupContainer enable:YES];
            [ws enableLogin:NO];
            [ws enableJoin:YES];
        }
    }];
}
- (IBAction)onLogout:(id)sender {
    __weak typeof(self) ws = self;
    [[IMManager sharedInstance] logout:^(int code, NSString * _Nullable desc) {
        [ws showAlert:TICMODULE_IMSDK code:code desc:desc];
        [ws enableGroup:ws.roomGroupContainer enable:NO];
        [ws enableGroup:ws.boardGroupContainer enable:NO];
        [ws enableGroup:ws.userGroupContainer enable:NO];
        [ws enableLogin:YES];
    }];
}

#pragma mark - 房间

- (IBAction)onCreate:(id)sender {
    NSString *classId = self.classIdTextField.stringValue;
    if (classId.length <= 0) {
        return;
    }
    __weak typeof(self) ws = self;
    [[IMManager sharedInstance] createIMGroup:classId callback:^(int code, NSString * _Nullable desc) {
        if(code == 0){
        }
        else{
            if(code == 10021){
                desc = @"该课堂已被他人创建，请\"加入课堂\"";
            }
            else if(code == 10025){
                desc = @"该课堂已创建，请\"加入课堂\"";
            }
        }
        [ws showAlert:TICMODULE_IMSDK code:code desc:desc];
    }];
}
- (IBAction)onDestroy:(id)sender {
    NSString *classId = self.classIdTextField.stringValue;
    if (classId.length <= 0) {
        return;
    }
    __weak typeof(self) ws = self;
    [[IMManager sharedInstance] destroyIMGroup:classId callback:^(int code, NSString * _Nullable desc) {
        if(code == 0){
        }
        else if(code == 10010){
            desc = @"课堂不存在";
        }
        else if(code == 10007){
            desc = @"非创建者没有权限销毁课堂";
        }
        [ws showAlert:TICMODULE_IMSDK code:code desc:desc];
    }];
}
- (IBAction)onJoin:(id)sender {
    NSString *classId = self.classIdTextField.stringValue;
    if (classId.length <= 0) {
        return;
    }
    __weak typeof(self) ws = self;
    [[IMManager sharedInstance] joinIMGroup:classId callback:^(int code, NSString *desc) {
        if (code == 0) {
            [[BoardManager sharedInstance] creteBoard:[TICConfig shareInstance].sdkAppId
                                                  userId:[IMManager sharedInstance].userId
                                                 userSig:[IMManager sharedInstance].userSig
                                                 classId:classId
                                                callback:^(int code, NSString * _Nullable desc, TEduBoardController * _Nullable boardController) {
                if (code == 0) {
                    //加入白板View
                    NSView *board = [boardController getBoardRenderView];
                    board.frame = ws.boardView.bounds;
                    [ws.boardView addSubview:board];
                    
                    //添加白板事件监听
                    [boardController addDelegate:self];
                    //更新按钮状态
                    [ws enableGroup:ws.userGroupContainer enable:NO];
                    [ws enableGroup:ws.boardGroupContainer enable:YES];
                    [ws enableJoin:NO];
                }
                [ws showAlert:TICMODULE_BOARD code:code desc:desc];
            }];
        }
        else {
            [ws showAlert:TICMODULE_IMSDK code:code desc:desc];
        }
    }];
}
- (IBAction)onQuit:(id)sender {
    __weak typeof(self) ws = self;
    [[BoardManager sharedInstance].boardController removeDelegate:self];
    [[BoardManager sharedInstance] destroyBoard];
    [IMManager sharedInstance].delegate = nil;
    [[IMManager sharedInstance] quitIMGroup:[IMManager sharedInstance].classId callback:^(int code, NSString * _Nullable desc) {
        [ws showAlert:TICMODULE_IMSDK code:code desc:desc];
        [ws resetViews];
        //更新按钮状态
        [ws enableGroup:ws.userGroupContainer enable:YES];
        [ws enableGroup:ws.boardGroupContainer enable:NO];
        [ws enableJoin:YES];
        [ws enableLogin:NO];
    }];
}


#pragma mark - 涂鸦

- (IBAction)onCanDrawChecked:(id)sender {
    NSButton *check = (NSButton *)sender;
    if(check.state == NSControlStateValueOn){
        [[BoardManager sharedInstance].boardController setDrawEnable:YES];
    }
    else{
        [[BoardManager sharedInstance].boardController setDrawEnable:NO];
    }
}

- (IBAction)onNickNameVisiableChecked:(id)sender {
    NSButton *check = (NSButton *)sender;
    if(check.state == NSControlStateValueOn){
        [[BoardManager sharedInstance].boardController setOwnerNickNameVisible:YES];
    }
    else{
        [[BoardManager sharedInstance].boardController setOwnerNickNameVisible:NO];
    }
}

- (IBAction)onUndo:(id)sender {
    [[BoardManager sharedInstance].boardController undo];
}
- (IBAction)onRedo:(id)sender {
    [[BoardManager sharedInstance].boardController redo];
}
- (IBAction)onClearDraws:(id)sender {
    [[BoardManager sharedInstance].boardController clearDraws];
}
- (IBAction)onClear:(id)sender {
    [[BoardManager sharedInstance].boardController clear];
}
- (IBAction)onSetBackgroundImage:(id)sender {
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    [panel setMessage:@"选择图片"];
    [panel beginSheetModalForWindow:self.view.window completionHandler:^(NSModalResponse result) {
        if(result == NSModalResponseOK){
            NSURL *url = [[panel URLs] firstObject];
            NSString *path = [url path];
            [[BoardManager sharedInstance].boardController setBackgroundImage:path mode:TEDU_BOARD_IMAGE_FIT_MODE_CENTER];
        }
    }];
}
- (IBAction)onSetBackgroundH5:(id)sender {
    NSString *url = self.h5BackTextField.stringValue;
    if(url.length > 0){
        [[BoardManager sharedInstance].boardController setBackgroundH5:url];
    }
}


- (IBAction)onSetBrushColor:(id)sender {
    self.setColorIndex = 0;
    [self setColor:self.brushColorTextField];
}
- (IBAction)onSetBackgroundColor:(id)sender {
    self.setColorIndex = 1;
    [self setColor:self.backgroundColorTextField];
}
- (IBAction)onSetTextColor:(id)sender {
    self.setColorIndex = 2;
    [self setColor:self.textColorTextField];
}
- (IBAction)onBrushThinChanged:(id)sender {
    int value = ((NSSlider *)sender).intValue;
    [[BoardManager sharedInstance].boardController setBrushThin:value];
}
- (IBAction)onTextSizeChanged:(id)sender {
    int value = ((NSSlider *)sender).intValue;
    [[BoardManager sharedInstance].boardController setTextSize:value];
}
- (IBAction)onToolTypeChanged:(id)sender {
    NSInteger index = self.toolTypePopUpButton.indexOfSelectedItem;
    [[BoardManager sharedInstance].boardController setToolType:(TEduBoardToolType)index];
}
- (IBAction)onCustomGraphChanged:(id)sender {
    NSInteger index = self.customGraphPopUpButton.indexOfSelectedItem;
    NSString *url = [self.customGraphArray objectAtIndex:index];
    [[BoardManager sharedInstance].boardController addElement:url type:TEDU_BOARD_ELEMENT_CUSTOM_GRAPH];
}
- (void)setupToolTypes
{
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"鼠标"];
    [array addObject:@"画笔"];
    [array addObject:@"橡皮擦"];
    [array addObject:@"激光笔"];
    [array addObject:@"直线"];
    [array addObject:@"空心椭圆"];
    [array addObject:@"空心矩形"];
    [array addObject:@"实心椭圆"];
    [array addObject:@"实心矩形"];
    [array addObject:@"点选工具"];
    [array addObject:@"框选工具"];
    [array addObject:@"文本工具"];
    [array addObject:@"缩放移动"];
    [array addObject:@"空心正方形"];
    [array addObject:@"实心正方形"];
    [array addObject:@"空心正圆形"];
    [array addObject:@"实心正圆形"];
    [array addObject:@"自定义图形"];
    [self.toolTypePopUpButton removeAllItems];
    [self.toolTypePopUpButton addItemsWithTitles:array];
}

- (void)setupCustomGraph
{
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"选择图形"];
    [array addObject:@"三角形"];
    [array addObject:@"爱心"];
    [array addObject:@"五角星"];
    [self.customGraphPopUpButton removeAllItems];
    [self.customGraphPopUpButton addItemsWithTitles:array];
    self.customGraphArray = [NSMutableArray array];
    [self.customGraphArray addObject:@""];
    [self.customGraphArray addObject:@"https://demo.qcloudtiw.com/resource/triangle.svg"];
    [self.customGraphArray addObject:@"https://demo.qcloudtiw.com/resource/heart.svg"];
    [self.customGraphArray addObject:@"https://demo.qcloudtiw.com/resource/star.svg"];
    
}

- (void)setColor:(NSTextField *)textField
{
    NSStoryboard *story = [NSStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
    ColorPickViewController *pick = [story instantiateControllerWithIdentifier:@"ColorPickViewController"];
    [pick setDefaultColor:textField.backgroundColor];
    pick.block = ^(NSColor *color){
        textField.backgroundColor = color;
    };
    NSPopover *pop = [[NSPopover alloc] init];
    pop.delegate = self;
    pop.contentViewController = pick;
    pop.behavior = NSPopoverBehaviorTransient;
    [pop showRelativeToRect:textField.bounds ofView:textField preferredEdge:NSRectEdgeMinY];
}

- (void)popoverWillClose:(NSNotification *)notification
{
    NSPopover *pop = notification.object;
    ColorPickViewController *pick = (ColorPickViewController *)pop.contentViewController;
    if(self.setColorIndex == 0){
        [[BoardManager sharedInstance].boardController setBrushColor:[pick getPickColor]];
    }
    else if(self.setColorIndex == 1){
        [[BoardManager sharedInstance].boardController setBackgroundColor:[pick getPickColor]];
    }
    else if(self.setColorIndex == 2){
        [[BoardManager sharedInstance].boardController setTextColor:[pick getPickColor]];
    }
}

#pragma mark - 白板

- (IBAction)onPreStep:(id)sender {
    [[BoardManager sharedInstance].boardController prevStep];
}
- (IBAction)onNextStep:(id)sender {
    [[BoardManager sharedInstance].boardController nextStep];
}

- (IBAction)onPreBoard:(id)sender {
    BOOL resetStep = (self.resetStepButton.state == NSControlStateValueOn ? YES : NO);
    [[BoardManager sharedInstance].boardController preBoard:resetStep];
}
- (IBAction)onNextBoard:(id)sender {
    BOOL resetStep = (self.resetStepButton.state == NSControlStateValueOn ? YES : NO);
    [[BoardManager sharedInstance].boardController nextBoard:resetStep];
}
- (IBAction)onAddBoard:(id)sender {
    [[BoardManager sharedInstance].boardController addBoard:nil model:TEDU_BOARD_IMAGE_FIT_MODE_CENTER type:TEDU_BOARD_BACKGROUND_IMAGE needSwitch:YES];
}
- (IBAction)onGotoBoard:(id)sender {
    BOOL resetStep = (self.resetStepButton.state == NSControlStateValueOn ? YES : NO);
    NSInteger index = self.boardTableView.selectedRow;
    if(index >= 0){
        NSArray<NSString *> *boardIds = [[BoardManager sharedInstance].boardController getBoardList];
        [[BoardManager sharedInstance].boardController gotoBoard:boardIds[index] resetStep:resetStep];
    }
}
- (IBAction)onDeleteBoard:(id)sender {
    NSInteger index = self.boardTableView.selectedRow;
    if(index >= 0){
        NSArray<NSString *> *boardIds = [[BoardManager sharedInstance].boardController getBoardList];
        NSString *boardId = boardIds[index];
        if ([[boardId uppercaseString] isEqualToString:@"#DEFAULT"]) {
            NSAlert *alert = [[NSAlert alloc] init];
            [alert setMessageText:@"不能删除默认白板"];
            [alert addButtonWithTitle:@"确认"];
            [alert beginSheetModalForWindow:self.view.window completionHandler:nil];
            return;
        }
        [[BoardManager sharedInstance].boardController deleteBoard:boardId];
    }
}
- (IBAction)onAddImageElement:(id)sender {
    NSString *url = self.imageTextFiled.stringValue;
    if(url.length != 0){
        [[BoardManager sharedInstance].boardController addElement:url type:TEDU_BOARD_ELEMENT_IMAGE];
    }
}

- (void)onTEBBoardCursorPosition:(CGPoint)position {
    NSLog(@"onTEBBoardCursorPosition, x = %.1f, y= %.1f......", position.x, position.y);
//    NSView *view = [[BoardManager sharedInstance].boardController getBoardRenderView];
//    if (self.cursorView == nil) {
//        self.cursorView = [NSImageView imageViewWithImage:[NSImage imageNamed:@"surfboard"]];
//        [view addSubview:self.cursorView];
//    }
//    [self.cursorView setFrame:CGRectMake(position.x, position.y, 32, 32)];
}
#pragma mark - 文件


- (IBAction)onAddFile:(id)sender {
    NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText:@"白板转码2.6.5已废弃，如需文档转码请参阅https://cloud.tencent.com/document/product/1137/46197"];
    [alert addButtonWithTitle:@"确认"];
    [alert beginSheetModalForWindow:self.view.window completionHandler:nil];
    return;
//    NSOpenPanel *panel = [NSOpenPanel openPanel];
//    [panel setMessage:@"选择ppt/pdf"];
//    [panel beginSheetModalForWindow:self.view.window completionHandler:^(NSModalResponse result) {
//        if(result == NSModalResponseOK){
//            NSURL *url = [[panel URLs] firstObject];
//            NSString *path = [url path];
//            NSString *ext = [[path pathExtension] lowercaseString];
//            if([ext isEqualToString:@"ppt"] || [ext isEqualToString:@"pptx"] || [ext isEqualToString:@"pdf"]) {
//                TEduBoardTranscodeConfig *config = [[TEduBoardTranscodeConfig alloc] init];
//                config.thumbnailResolution = @"200x200";
////                2.6.5废弃
////                [[BoardManager sharedInstance].boardController applyFileTranscode:path config:config];
//            }
//            else{
//                [self showAlert:TICMODULE_BOARD code:-1 desc:@"请选择ppt/pptx/pdf格式文件"];
//            }
//        }
//    }];
}

- (IBAction)onSwitchFile:(id)sender {
    NSInteger index = self.fileTableView.selectedRow;
    if(index >= 0){
        NSArray<TEduBoardFileInfo *> *files = [[BoardManager sharedInstance].boardController getFileInfoList];
        NSString *fileId = files[index].fileId;
        [[BoardManager sharedInstance].boardController switchFile:fileId];
    }
}
- (IBAction)onDeleteFile:(id)sender {
    NSInteger index = self.fileTableView.selectedRow;
    if(index >= 0){
        NSArray<TEduBoardFileInfo *> *files = [[BoardManager sharedInstance].boardController getFileInfoList];
        NSString *fileId = files[index].fileId;
        if ([[fileId uppercaseString] isEqualToString:@"#DEFAULT"]) {
            NSAlert *alert = [[NSAlert alloc] init];
            [alert setMessageText:@"不能删除默认白板"];
            [alert addButtonWithTitle:@"确认"];
            [alert beginSheetModalForWindow:self.view.window completionHandler:nil];
            return;
        }
        [[BoardManager sharedInstance].boardController deleteFile:fileId];
    }
}

- (IBAction)onAddH5File:(id)sender {
    NSString *url = self.h5FileTextField.stringValue;
    [[BoardManager sharedInstance].boardController addH5File:url title:@"" needSwitch:YES];
}

- (IBAction)onAddVideo:(id)sender {
    NSString *url = self.videoTextField.stringValue;
    [[BoardManager sharedInstance].boardController addVideoFile:url title:@"" needSwitch:YES];
}
#pragma mark - 白板和文件列表

- (NSInteger)numberOfRowsInTableView:(NSTableView *)tableView
{
    if(self.boardTableView == tableView){
        NSArray *boardIds = [[BoardManager sharedInstance].boardController getBoardList];
        return boardIds.count;
    }
    else if(self.fileTableView == tableView){
        NSArray *files = [[BoardManager sharedInstance].boardController getFileInfoList];
        return files.count;
    }
    return 0;
}

- (nullable NSView *)tableView:(NSTableView *)tableView viewForTableColumn:(NSTableColumn *)tableColumn row:(NSInteger)row
{
    if(self.boardTableView == tableView){
        NSArray<NSString *> *boardIds = [[BoardManager sharedInstance].boardController getBoardList];
        NSTableCellView *cell = [tableView makeViewWithIdentifier:@"board" owner:self];
        cell.textField.stringValue = boardIds[row];
        return cell;
    }
    else if(self.fileTableView == tableView){
        NSArray<TEduBoardFileInfo *> *files = [[BoardManager sharedInstance].boardController getFileInfoList];
        NSTableCellView *cell = [tableView makeViewWithIdentifier:@"file" owner:self];
        if(tableColumn == tableView.tableColumns[0]){
            cell.textField.stringValue = files[row].fileId;
        }
        else if(tableColumn == tableView.tableColumns[1]){
            cell.textField.stringValue = files[row].title;
        }
        return cell;
    }
    return nil;
}

#pragma mark - 消息

- (IBAction)onSendMessage:(id)sender {
    __weak typeof(self) ws = self;
    NSString *message = self.messageTextField.stringValue;
    if(message.length == 0){
        return;
    }
    [[IMManager sharedInstance] sendGroupTextMessage:message callback:^(int code, NSString * _Nullable desc) {
        if(code == 0){
            // 将自己发送的消息展示在界面上
            NSString *msgInfo = [NSString stringWithFormat:@"[我] %@", message];
            ws.chatTextView.string = [NSString stringWithFormat:@"%@\n%@", ws.chatTextView.string, msgInfo];
            [ws.chatTextView scrollRangeToVisible:NSMakeRange(self.chatTextView.string.length, 1)];
            ws.messageTextField.stringValue = @"";
        }
    }];
}
#pragma mark - 界面
- (void)showAlert:(TICModule)module code:(int)code desc:(NSString *)desc{
    NSString *msg = nil;
    if(code == 0){
        msg = @"成功";
    }
    else{
        NSString *moduleStr = nil;
        switch (module) {
            case TICMODULE_IMSDK:
                moduleStr = @"imsdk";
                break;
            case TICMODULE_BOARD:
                moduleStr = @"board";
                break;
            default:
                break;
        }
        msg = [NSString stringWithFormat:@"失败\nmodule:%@\ncode:%d\ndesc:%@", moduleStr, code, desc];
    }
    NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText:msg];
    [alert addButtonWithTitle:@"确认"];
    [alert beginSheetModalForWindow:self.view.window completionHandler:nil];
}

- (void)setupViews
{
    //background
    [self.boardView setWantsLayer:YES];
    self.boardView.layer.backgroundColor = [NSColor whiteColor].CGColor;

    
    //禁用按钮
    [self enableGroup:self.userGroupContainer enable:NO];
    [self enableGroup:self.roomGroupContainer enable:NO];
    [self enableGroup:self.boardGroupContainer enable:NO];
    //启用登陆
    [self enableLogin:YES];
}

- (void)resetViews
{
    
    //白板
    for (NSView *board in self.boardView.subviews) {
        [board removeFromSuperview];
    }
    [self.fileTableView reloadData];
    [self.boardTableView reloadData];
    
    //消息
    self.chatTextView.string = @"";
    self.messageTextField.stringValue = @"";
}

- (void)setupUsers
{
    NSArray *users = [TICConfig shareInstance].userIds;
    [self.userPopUpButton removeAllItems];
    [self.userPopUpButton addItemsWithTitles:users];
}

- (void)enableGroup:(NSView *)group enable:(BOOL)enable
{
    if(group.subviews.count != 0){
        for (NSView *view in group.subviews) {
            [self enableGroup:view enable:enable];
        }
    }
    if([group isKindOfClass:[NSButton class]]){
        ((NSButton *)group).enabled = enable;
    }
}

- (void)enableLogin:(BOOL)enable
{
    self.loginButton.enabled = enable;
    self.logoutButton.enabled = !enable;
    self.userPopUpButton.enabled = enable;
}

- (void)enableJoin:(BOOL)enable
{
    self.joinRoomButton.enabled = enable;
    self.quitRoomButton.enabled = !enable;
}

#pragma mark - 白板事件监听
- (void)onTEBInit {
    [[BoardManager sharedInstance].boardController setOwnerNickNameVisible:YES];
}

- (void)onTEBError:(TEduBoardErrorCode)code msg:(NSString *)msg {
    
}

- (void)onTEBWarning:(TEduBoardWarningCode)code msg:(NSString *)msg {
}


- (void)onTEBHistroyDataSyncCompleted
{
    //更新列表
    [self.fileTableView reloadData];
    [self.boardTableView reloadData];
    NSString *fileId = [[BoardManager sharedInstance].boardController getCurrentFile];
    [self loadThumb:fileId];
}


- (void)onTEBRedoStatusChanged:(BOOL)canRedo
{
    self.redoButton.enabled = canRedo;
}
- (void)onTEBUndoStatusChanged:(BOOL)canUndo
{
    self.undoButton.enabled = canUndo;
}


- (void)onTEBH5FileStatusChanged:(NSString *)fileId status:(TEduBoardH5FileStatus)status
{
    if(status == TEDU_BOARD_H5_FILE_STATUS_LOADED){
        [self.fileTableView reloadData];
    }
}

- (void)onTEBVideoStatusChanged:(NSString *)fileId status:(TEduBoardVideoStatus)status progress:(CGFloat)progress duration:(CGFloat)duration
{
    if(status == TEDU_BOARD_VIDEO_STATUS_LOADED){
        [self.fileTableView reloadData];
    }
}

- (void)onTEBFileTranscodeProgress:(TEduBoardTranscodeFileResult *)result path:(NSString *)path errorCode:(NSString *)errorCode errorMsg:(NSString *)errorMsg
{
    NSString *fileName = [path lastPathComponent];
    NSString *statusStr = nil;
    if(result.status == TEDU_BOARD_FILE_TRANSCODE_UPLOADING){
        statusStr = [NSString stringWithFormat:@"上传中 %ld", result.progress];
    }
    else if(result.status == TEDU_BOARD_FILE_TRANSCODE_CREATED){
        statusStr = @"创建转码任务";
    }
    else if(result.status == TEDU_BOARD_FILE_TRANSCODE_QUEUED){
        statusStr = @"排队中";
    }
    else if(result.status == TEDU_BOARD_FILE_TRANSCODE_PROCESSING){
        statusStr = [NSString stringWithFormat:@"转码中 %ld", result.progress];
    }
    else if(result.status == TEDU_BOARD_FILE_TRANSCODE_FINISHED){
        statusStr = @"转码完成";
        [[BoardManager sharedInstance].boardController addTranscodeFile:result needSwitch:true];
        
    }
    else if(result.status == TEDU_BOARD_FILE_TRANSCODE_ERROR){
        statusStr = [NSString stringWithFormat:@"转码错误 %@/%@", errorCode, errorMsg];
    }

    NSString *msg = [NSString stringWithFormat:@"%@ %@", fileName, statusStr];
    self.chatTextView.string = [NSString stringWithFormat:@"%@\n%@", self.chatTextView.string, msg];
    [self.chatTextView scrollRangeToVisible:NSMakeRange(self.chatTextView.string.length, 1)];
}
    
- (void)onTEBAddTranscodeFile:(NSString *)fileId
{
    [self.fileTableView reloadData];
}

- (void)onTEBAddBoard:(NSArray *)boardIds fileId:(NSString *)fileId
{
    [self.boardTableView reloadData];
}
- (void)onTEBDeleteFile:(NSArray *)fileId
{
    [self.fileTableView reloadData];
}
- (void)onTEBDeleteBoard:(NSString *)boardId fileId:(NSString *)fileId
{
    [self.boardTableView reloadData];
}
- (void)onTEBBackgroundH5StatusChanged:(NSString *)boardId url:(NSString *)url status:(TEduBoardBackgroundH5Status)status
{
    NSLog(@"onTEBBackgroundH5StatusChanged boardId=%@, url=%@, status=%ld", boardId, url, status);
}

- (void)onTEBFileUploadStatus:(NSString *)path status:(TEduBoardUploadStatus)status statusMsg:(NSString *)statusMsg
{
    NSLog(@"onTEBFileUploadStatus path=%@, status=%ld, statusMsg=%@", path, status, statusMsg);
}

- (void)onTEBImageStatusChanged:(NSString *)boardId url:(NSString *)url status:(TEduBoardImageStatus)status
{
    NSLog(@"onTEBImageStatusChanged boardId=%@, url=%@, status=%ld", boardId, url, status);
}

- (void)onTEBFileUploadProgress:(NSString *)path currentBytes:(int)currentBytes totalBytes:(int)totalBytes uploadSpeed:(int)uploadSpeed
{
    NSLog(@"onTEBFileUploadProgress path=%@, currentBytes=%d, totalBytes=%d, uploadSpeed=%d", path, currentBytes, totalBytes, uploadSpeed);
}
#pragma mark - 用户状态监听
- (void)onKickedOffline
{
    [self showAlert:TICMODULE_IMSDK code:-1 desc:@"账号被踢"];
    [self resetViews];
}

- (void)onUserSigExpired
{
    [self showAlert:TICMODULE_IMSDK code:-1 desc:@"userSig过期"];
    [self resetViews];
}

#pragma mark - 消息监听
- (void)onRecvGroupTextMessage:(NSString *)text groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId
{
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",fromUserId, text];
    self.chatTextView.string = [NSString stringWithFormat:@"%@\n%@",self.chatTextView.string, msgInfo];
    [self.chatTextView scrollRangeToVisible:NSMakeRange(self.chatTextView.string.length, 1)];
}

- (void)onRecvCTCTextMessage:(NSString *)text fromUserId:(NSString *)fromUserId;
{
    NSString *msgInfo = [NSString stringWithFormat:@"[%@](私聊) %@",fromUserId, text];
    self.chatTextView.string = [NSString stringWithFormat:@"%@\n%@",self.chatTextView.string, msgInfo];
    [self.chatTextView scrollRangeToVisible:NSMakeRange(self.chatTextView.string.length, 1)];
}


#pragma mark -缩略图

- (void)onTEBSwitchFile:(NSString *)fileId
{
    [self loadThumb:fileId];
}

- (void)setupThumbView{
    self.thumbTip.stringValue = @"文件缩略图";
    self.thumbView.delegate = self;
    self.thumbView.dataSource = self;
    [self.thumbView setSelectable:YES];
    [self.thumbView registerClass:[ThumbItem class] forItemWithIdentifier:@"ThumbItem"];
}

- (void)loadThumb:(NSString *)fid {
    self.thumbUrls = [[BoardManager sharedInstance].boardController getThumbnailImages:fid];
    if(self.thumbUrls.count != 0){
        self.thumbTip.stringValue = @"";
    }
    else {
        self.thumbTip.stringValue = @"该文件不支持缩略图";
    }
    [self.thumbView reloadData];
}

- (NSInteger)collectionView:(nonnull NSCollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.thumbUrls.count;
}

- (nonnull NSCollectionViewItem *)collectionView:(nonnull NSCollectionView *)collectionView itemForRepresentedObjectAtIndexPath:(nonnull NSIndexPath *)indexPath {
    ThumbItem *item = [collectionView makeItemWithIdentifier:@"ThumbItem" forIndexPath:indexPath];
    NSString *url = self.thumbUrls[indexPath.item];
    [item.imageView sd_setImageWithURL:[NSURL URLWithString:url]];
    return item;
}

- (void)collectionView:(NSCollectionView *)collectionView didSelectItemsAtIndexPaths:(NSSet<NSIndexPath *> *)indexPaths{
    TEduBoardController *controller = [BoardManager sharedInstance].boardController;
    NSString *fileId = [controller getCurrentFile];
    NSArray *boarIds = [controller getFileBoardList:fileId];
    NSString *boardId = boarIds[indexPaths.allObjects[0].item];
    [controller gotoBoard:boardId];
}
@end
