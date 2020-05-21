#import "ViewController.h"
#import "TICManager.h"
#import "TICRenderView.h"
#import "TICConfig.h"
#import "ColorPickViewController.h"
#import "ThumbItem.h"
#import <SDWebImage/SDWebImage.h>

@interface ViewController () <TICMessageListener, TICEventListener, TICStatusListener, TEduBoardDelegate, NSTableViewDelegate, NSTableViewDataSource, NSPopoverDelegate, NSCollectionViewDelegate, NSCollectionViewDataSource>
@property (weak) IBOutlet NSPopUpButton *userPopUpButton;
@property (weak) IBOutlet NSPopUpButton *cameraPopUpButton;
@property (weak) IBOutlet NSPopUpButton *micPopUpButton;
@property (weak) IBOutlet NSPopUpButton *screenPopUpButton;
@property (weak) IBOutlet NSPopUpButton *toolTypePopUpButton;

@property (weak) IBOutlet TICRenderView *remoteView1;
@property (weak) IBOutlet TICRenderView *remoteView2;
@property (weak) IBOutlet TICRenderView *remoteView3;
@property (weak) IBOutlet TICRenderView *localView;
@property (weak) IBOutlet TICRenderView *screenView;

@property (weak) IBOutlet NSTableView *boardTableView;
@property (weak) IBOutlet NSTableView *fileTableView;


@property (weak) IBOutlet NSTextField *brushColorTextField;
@property (weak) IBOutlet NSTextField *backgroundColorTextField;
@property (weak) IBOutlet NSTextField *textColorTextField;

@property (weak) IBOutlet NSTextField *h5TextField;
@property (weak) IBOutlet NSTextField *h5BackTextField;

@property (weak) IBOutlet NSView *boardView;
@property (weak) IBOutlet NSTextField *classIdTextField;
@property (weak) IBOutlet NSTextField *messageTextField;
@property (unsafe_unretained) IBOutlet NSTextView *chatTextView;

@property (nonatomic, strong) NSMutableArray *cameraIdArray;
@property (nonatomic, strong) NSMutableArray *micIdArray;
@property (nonatomic, strong) NSMutableArray *screenArray;
@property (nonatomic, strong) NSMutableArray *renderViews;
@property (nonatomic, assign) int setColorIndex;
@property (nonatomic, strong) NSArray *thumbUrls;

@property (weak) IBOutlet NSTextField *trtcVerLabel;
@property (weak) IBOutlet NSTextField *imsdkVerLabel;
@property (weak) IBOutlet NSTextField *boardVerLabel;



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
@property (weak) IBOutlet NSButton *goBackButton;
@property (weak) IBOutlet NSButton *goForwardButton;
@property (weak) IBOutlet NSTextField *imageTextFiled;

//视频tab
@property (weak) IBOutlet NSButton *cameraButton;
@property (weak) IBOutlet NSButton *micButton;
@property (weak) IBOutlet NSButton *screenButton;
@property (weak) IBOutlet NSView *videoGroupContainer;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setupViews];
    [self initTIC];
    [self setupUsers];
    [self setupCameras];
    [self setupMics];
    [self setupScreens];
    [self setupToolTypes];
    [self setupThumbView];
    
    //版本信息
    self.trtcVerLabel.stringValue = [TRTCCloud getSDKVersion];
    self.imsdkVerLabel.stringValue = [[TIMManager sharedInstance] GetVersion];
    self.boardVerLabel.stringValue = [TEduBoardController getVersion];
}

#pragma mark - 初始化
- (void)initTIC{
    NSString *sdkAppId = [TICConfig shareInstance].sdkAppId;
    [[TICManager sharedInstance] addStatusListener:self];
    [[TICManager sharedInstance] addEventListener:self];
    [[TICManager sharedInstance] init:[sdkAppId intValue] callback:nil];
}
#pragma mark - 用户

- (IBAction)onLogin:(id)sender {
    NSInteger index = self.userPopUpButton.indexOfSelectedItem;
    NSString *userId = [TICConfig shareInstance].userIds[index];
    NSString *userSig = [TICConfig shareInstance].userSigs[index];
    __weak typeof(self) ws = self;
    [[TICManager sharedInstance] login:userId userSig:userSig callback:^(TICModule module, int code, NSString *desc) {
        [ws showAlert:module code:code desc:desc];
        if(code == 0){
            [ws enableGroup:ws.roomGroupContainer enable:YES];
            [ws enableLogin:NO];
            [ws enableJoin:YES];
        }
    }];
}
- (IBAction)onLogout:(id)sender {
    __weak typeof(self) ws = self;
    [[TICManager sharedInstance] logout:^(TICModule module, int code, NSString *desc) {
        [ws showAlert:module code:code desc:desc];
        [ws enableGroup:ws.roomGroupContainer enable:NO];
        [ws enableGroup:ws.videoGroupContainer enable:NO];
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
    [[TICManager sharedInstance] createClassroom:[classId intValue] classScene:TIC_CLASS_SCENE_VIDEO_CALL callback:^(TICModule module, int code, NSString *desc) {
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
        [ws showAlert:module code:code desc:desc];
    }];
}
- (IBAction)onDestroy:(id)sender {
    NSString *classId = self.classIdTextField.stringValue;
    if (classId.length <= 0) {
        return;
    }
    __weak typeof(self) ws = self;
    [[TICManager sharedInstance] destroyClassroom:[classId intValue] callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
        }
        else if(code == 10010){
            desc = @"课堂不存在";
        }
        else if(code == 10007){
            desc = @"非创建者没有权限销毁课堂";
        }
        [ws showAlert:module code:code desc:desc];
    }];
}
- (IBAction)onJoin:(id)sender {
    NSString *classId = self.classIdTextField.stringValue;
    if (classId.length <= 0) {
        return;
    }
    TICClassroomOption *option = [[TICClassroomOption alloc] init];
    option.classId = [classId intValue];
    __weak typeof(self) ws = self;
    [[TICManager sharedInstance] addMessageListener:self];
    [[TICManager sharedInstance] joinClassroom:option callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            //加入白板View
            NSView *board = [[[TICManager sharedInstance] getBoardController] getBoardRenderView];
            board.frame = ws.boardView.bounds;
            [ws.boardView addSubview:board];
            //添加白板事件监听
            [[[TICManager sharedInstance] getBoardController] addDelegate:self];
            //更新按钮状态
            [ws enableGroup:ws.userGroupContainer enable:NO];
            [ws enableGroup:ws.videoGroupContainer enable:YES];
            [ws enableGroup:ws.boardGroupContainer enable:YES];
            [ws enableJoin:NO];
        }
        else{
            if(code == 10015){
                desc = @"课堂不存在，请\"创建课堂\"";
            }
        }
        [ws showAlert:module code:code desc:desc];
    }];
}
- (IBAction)onQuit:(id)sender {
    __weak typeof(self) ws = self;
    [[TICManager sharedInstance] removeMessageListener:self];
    [[TICManager sharedInstance] quitClassroom:NO callback:^(TICModule module, int code, NSString *desc) {
        [ws showAlert:module code:code desc:desc];
        [ws resetViews];
        //更新按钮状态
        [ws enableGroup:ws.userGroupContainer enable:YES];
        [ws enableGroup:ws.videoGroupContainer enable:NO];
        [ws enableGroup:ws.boardGroupContainer enable:NO];
        [ws enableJoin:YES];
        [ws enableLogin:NO];
    }];
}

#pragma mark - 设备

- (IBAction)onCameraChecked:(id)sender {
    NSButton *check = (NSButton *)sender;
    NSString *deviceId = self.cameraIdArray[self.cameraPopUpButton.indexOfSelectedItem];
    TRTCCloud *trtc = [[TICManager sharedInstance] getTRTCCloud];
    if(check.state == NSControlStateValueOn){
        [trtc setCurrentCameraDevice:deviceId];
        [trtc startLocalPreview:self.localView];
    }
    else{
        [trtc stopLocalPreview];
    }
}

- (IBAction)onMicChecked:(id)sender {
    NSButton *check = (NSButton *)sender;
    NSString *deviceId = self.micIdArray[self.micPopUpButton.indexOfSelectedItem];
    TRTCCloud *trtc = [[TICManager sharedInstance] getTRTCCloud];
    if(check.state == NSControlStateValueOn){
        [trtc setCurrentMicDevice:deviceId];
        [trtc startLocalAudio];
    }
    else{
        [trtc stopLocalAudio];
    }
}

- (IBAction)onScreenChecked:(id)sender {
    NSButton *check = (NSButton *)sender;
    TRTCScreenCaptureSourceInfo *source = self.screenArray[self.screenPopUpButton.indexOfSelectedItem];
    TRTCCloud *trtc = [[TICManager sharedInstance] getTRTCCloud];
    if(check.state == NSControlStateValueOn){
        [trtc selectScreenCaptureTarget:source rect:CGRectZero capturesCursor:NO highlight:NO];
        [trtc startScreenCapture:self.screenView];
    }
    else{
        [trtc stopScreenCapture];
    }
}

- (void)setupCameras
{
    NSArray<TRTCMediaDeviceInfo *> *cameras = [[[TICManager sharedInstance] getTRTCCloud] getCameraDevicesList];
    [self.cameraPopUpButton removeAllItems];
    self.cameraIdArray = [NSMutableArray array];
    for (TRTCMediaDeviceInfo *camera in cameras) {
        [self.cameraPopUpButton addItemWithTitle:camera.deviceName];
        [self.cameraIdArray addObject:camera.deviceId];
    }
    
}

- (void)setupMics
{
    NSArray<TRTCMediaDeviceInfo *> *mics = [[[TICManager sharedInstance] getTRTCCloud] getMicDevicesList];
    [self.micPopUpButton removeAllItems];
    self.micIdArray = [NSMutableArray array];
    for (TRTCMediaDeviceInfo *mic in mics) {
        [self.micPopUpButton addItemWithTitle:mic.deviceName];
        [self.micIdArray addObject:mic.deviceId];
    }
}

- (void)setupScreens
{
    NSArray<TRTCScreenCaptureSourceInfo*>* screens = [[[TICManager sharedInstance] getTRTCCloud] getScreenCaptureSourcesWithThumbnailSize:CGSizeZero iconSize:CGSizeZero];
    [self.screenPopUpButton removeAllItems];
    self.screenArray = [NSMutableArray array];
    for (TRTCScreenCaptureSourceInfo *screen in screens) {
        [self.screenPopUpButton addItemWithTitle:screen.sourceName];
        [self.screenArray addObject:screen];
    }
    
}

#pragma mark - 涂鸦

- (IBAction)onCanDrawChecked:(id)sender {
    NSButton *check = (NSButton *)sender;
    if(check.state == NSControlStateValueOn){
        [[[TICManager sharedInstance] getBoardController] setDrawEnable:YES];
    }
    else{
        [[[TICManager sharedInstance] getBoardController] setDrawEnable:NO];
    }
}
- (IBAction)onUndo:(id)sender {
    [[[TICManager sharedInstance] getBoardController] undo];
}
- (IBAction)onRedo:(id)sender {
    [[[TICManager sharedInstance] getBoardController] redo];
}
- (IBAction)onClearDraws:(id)sender {
    [[[TICManager sharedInstance] getBoardController] clearDraws];
}
- (IBAction)onClear:(id)sender {
    [[[TICManager sharedInstance] getBoardController] clear];
}
- (IBAction)onSetBackgroundImage:(id)sender {
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    [panel setMessage:@"选择图片"];
    [panel beginSheetModalForWindow:self.view.window completionHandler:^(NSModalResponse result) {
        if(result == NSModalResponseOK){
            NSURL *url = [[panel URLs] firstObject];
            NSString *path = [url path];
            [[[TICManager sharedInstance] getBoardController] setBackgroundImage:path mode:TEDU_BOARD_IMAGE_FIT_MODE_CENTER];
        }
    }];
}
- (IBAction)onSetBackgroundH5:(id)sender {
    NSString *url = self.h5BackTextField.stringValue;
    if(url.length > 0){
        [[[TICManager sharedInstance] getBoardController] setBackgroundH5:url];
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
    [[[TICManager sharedInstance] getBoardController] setBrushThin:value];
}
- (IBAction)onTextSizeChanged:(id)sender {
    int value = ((NSSlider *)sender).intValue;
    [[[TICManager sharedInstance] getBoardController] setTextSize:value];
}
- (IBAction)onToolTypeChanged:(id)sender {
    NSInteger index = self.toolTypePopUpButton.indexOfSelectedItem;
    [[[TICManager sharedInstance] getBoardController] setToolType:(TEduBoardToolType)index];
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
    [self.toolTypePopUpButton removeAllItems];
    [self.toolTypePopUpButton addItemsWithTitles:array];
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
        [[[TICManager sharedInstance] getBoardController] setBrushColor:[pick getPickColor]];
    }
    else if(self.setColorIndex == 1){
        [[[TICManager sharedInstance] getBoardController] setBackgroundColor:[pick getPickColor]];
    }
    else if(self.setColorIndex == 2){
        [[[TICManager sharedInstance] getBoardController] setTextColor:[pick getPickColor]];
    }
}

#pragma mark - 白板

- (IBAction)onPreStep:(id)sender {
    [[[TICManager sharedInstance] getBoardController] prevStep];
}
- (IBAction)onNextStep:(id)sender {
    [[[TICManager sharedInstance] getBoardController] nextStep];
}

- (IBAction)onPreBoard:(id)sender {
    BOOL resetStep = (self.resetStepButton.state == NSControlStateValueOn ? YES : NO);
    [[[TICManager sharedInstance] getBoardController] preBoard:resetStep];
}
- (IBAction)onNextBoard:(id)sender {
    BOOL resetStep = (self.resetStepButton.state == NSControlStateValueOn ? YES : NO);
    [[[TICManager sharedInstance] getBoardController] nextBoard:resetStep];
}
- (IBAction)onAddBoard:(id)sender {
    [[[TICManager sharedInstance] getBoardController] addBoardWithBackgroundImage:nil];
}
- (IBAction)onGotoBoard:(id)sender {
    BOOL resetStep = (self.resetStepButton.state == NSControlStateValueOn ? YES : NO);
    NSInteger index = self.boardTableView.selectedRow;
    if(index >= 0){
        NSArray<NSString *> *boardIds = [[[TICManager sharedInstance] getBoardController] getBoardList];
        [[[TICManager sharedInstance] getBoardController] gotoBoard:boardIds[index] resetStep:resetStep];
    }
}
- (IBAction)onDeleteBoard:(id)sender {
    NSInteger index = self.boardTableView.selectedRow;
    if(index >= 0){
        NSArray<NSString *> *boardIds = [[[TICManager sharedInstance] getBoardController] getBoardList];
        [[[TICManager sharedInstance] getBoardController] deleteBoard:boardIds[index]];
    }
}
- (IBAction)onAddImageElement:(id)sender {
    NSString *url = self.imageTextFiled.stringValue;
    if(url.length != 0){
        [[[TICManager sharedInstance] getBoardController] addImageElement:url];
    }
}


#pragma mark - 文件


- (IBAction)onAddFile:(id)sender {
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    [panel setMessage:@"选择ppt/pdf"];
    [panel beginSheetModalForWindow:self.view.window completionHandler:^(NSModalResponse result) {
        if(result == NSModalResponseOK){
            NSURL *url = [[panel URLs] firstObject];
            NSString *path = [url path];
            NSString *ext = [[path pathExtension] lowercaseString];
            if([ext isEqualToString:@"ppt"] || [ext isEqualToString:@"pptx"] || [ext isEqualToString:@"pdf"]) {
                TEduBoardTranscodeConfig *config = [[TEduBoardTranscodeConfig alloc] init];
                config.thumbnailResolution = @"200x200";
                [[[TICManager sharedInstance] getBoardController] applyFileTranscode:path config:config];
            }
            else{
                [self showAlert:TICMODULE_TIC code:-1 desc:@"请选择ppt/pptx/pdf格式文件"];
            }
        }
    }];
}

- (IBAction)onSwitchFile:(id)sender {
    NSInteger index = self.fileTableView.selectedRow;
    if(index >= 0){
        NSArray<TEduBoardFileInfo *> *files = [[[TICManager sharedInstance] getBoardController] getFileInfoList];
        NSString *fileId = files[index].fileId;
        [[[TICManager sharedInstance] getBoardController] switchFile:fileId];
    }
}
- (IBAction)onDeleteFile:(id)sender {
    NSInteger index = self.fileTableView.selectedRow;
    if(index >= 0){
        NSArray<TEduBoardFileInfo *> *files = [[[TICManager sharedInstance] getBoardController] getFileInfoList];
        [[[TICManager sharedInstance] getBoardController] deleteFile:files[index].fileId];
    }
}

- (IBAction)onAddH5File:(id)sender {
    NSString *url = self.h5FileTextField.stringValue;
    [[[TICManager sharedInstance] getBoardController] addH5File:url];
}

- (IBAction)onAddVideo:(id)sender {
    NSString *url = self.videoTextField.stringValue;
    [[[TICManager sharedInstance] getBoardController] addVideoFile:url];
}
#pragma mark - 白板和文件列表

- (NSInteger)numberOfRowsInTableView:(NSTableView *)tableView
{
    if(self.boardTableView == tableView){
        NSArray *boardIds = [[[TICManager sharedInstance] getBoardController] getBoardList];
        return boardIds.count;
    }
    else if(self.fileTableView == tableView){
        NSArray *files = [[[TICManager sharedInstance] getBoardController] getFileInfoList];
        return files.count;
    }
    return 0;
}

- (nullable NSView *)tableView:(NSTableView *)tableView viewForTableColumn:(NSTableColumn *)tableColumn row:(NSInteger)row
{
    if(self.boardTableView == tableView){
        NSArray<NSString *> *boardIds = [[[TICManager sharedInstance] getBoardController] getBoardList];
        NSTableCellView *cell = [tableView makeViewWithIdentifier:@"board" owner:self];
        cell.textField.stringValue = boardIds[row];
        return cell;
    }
    else if(self.fileTableView == tableView){
        NSArray<TEduBoardFileInfo *> *files = [[[TICManager sharedInstance] getBoardController] getFileInfoList];
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
    [[TICManager sharedInstance] sendGroupTextMessage:message callback:^(TICModule module, int code, NSString *desc) {
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
            case TICMODULE_TRTC:
                moduleStr = @"trtc";
                break;
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
    [self.remoteView1 setWantsLayer:YES];
    [self.remoteView2 setWantsLayer:YES];
    [self.remoteView3 setWantsLayer:YES];
    [self.localView setWantsLayer:YES];
    [self.screenView setWantsLayer:YES];
    [self.boardView setWantsLayer:YES];
    self.remoteView1.layer.backgroundColor = [NSColor whiteColor].CGColor;
    self.remoteView2.layer.backgroundColor = [NSColor whiteColor].CGColor;
    self.remoteView3.layer.backgroundColor = [NSColor whiteColor].CGColor;
    self.localView.layer.backgroundColor = [NSColor whiteColor].CGColor;
    self.screenView.layer.backgroundColor = [NSColor whiteColor].CGColor;
    self.boardView.layer.backgroundColor = [NSColor whiteColor].CGColor;

    self.renderViews = [NSMutableArray array];
    [self.renderViews addObject:self.remoteView1];
    [self.renderViews addObject:self.remoteView2];
    [self.renderViews addObject:self.remoteView3];
    
    //禁用按钮
    [self enableGroup:self.userGroupContainer enable:NO];
    [self enableGroup:self.roomGroupContainer enable:NO];
    [self enableGroup:self.videoGroupContainer enable:NO];
    [self enableGroup:self.boardGroupContainer enable:NO];
    //启用登陆
    [self enableLogin:YES];
}

- (void)resetViews
{
    //视频
    self.remoteView1.userId = nil;
    self.remoteView2.userId = nil;
    self.remoteView3.userId = nil;
    self.remoteView1.streamType = TICStreamType_Main;
    self.remoteView2.streamType = TICStreamType_Main;
    self.remoteView3.streamType = TICStreamType_Main;
    self.cameraButton.state = NSControlStateValueOff;
    self.micButton.state = NSControlStateValueOff;
    self.screenButton.state = NSControlStateValueOff;
    
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
#pragma mark - TRTC事件监听
- (void)onTICUserVideoAvailable:(NSString *)userId available:(BOOL)available
{
    if(available){
        for (int i = 0; i < self.renderViews.count; ++i){
            TICRenderView *view = self.renderViews[i];
            if(view.userId.length == 0){
                view.userId = userId;
                view.streamType = TICStreamType_Main;
                [[[TICManager sharedInstance] getTRTCCloud] startRemoteView:userId view:view];
                [[[TICManager sharedInstance] getTRTCCloud] setRemoteViewFillMode:userId mode:TRTCVideoFillMode_Fit];
                break;
            }
        }
    }
    else{
        for (int i = 0; i < self.renderViews.count; ++i){
            TICRenderView *view = self.renderViews[i];
            if([view.userId isEqualToString:userId] && view.streamType == TICStreamType_Main){
                view.userId = nil;
                self.renderViews[i] = view;
                break;
            }
        }
        [[[TICManager sharedInstance] getTRTCCloud] stopRemoteView:userId];
    }
}

- (void)onTICUserSubStreamAvailable:(NSString *)userId available:(BOOL)available
{
    if(available){
        for (TICRenderView *view in self.renderViews) {
            if(view.userId.length == 0){
                view.userId = userId;
                view.streamType = TICStreamType_Sub;
                [[[TICManager sharedInstance] getTRTCCloud] startRemoteSubStreamView:userId view:view];
                break;
            }
        }
    }
    else{
        for (TICRenderView *view in self.renderViews) {
            if([view.userId isEqualToString:userId] && view.streamType == TICStreamType_Sub){
                view.userId = nil;
                break;
            }
        }
        [[[TICManager sharedInstance] getTRTCCloud] stopRemoteSubStreamView:userId];
    }
}

-(void)onTICMemberJoin:(NSArray*)members {
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",members.firstObject, @"加入了房间"];
    self.chatTextView.string = [NSString stringWithFormat:@"%@\n%@",self.chatTextView.string, msgInfo];;
}

-(void)onTICMemberQuit:(NSArray*)members {
    
    if ([members.firstObject isEqualToString:[[TIMManager sharedInstance] getLoginUser]]) {
        [self showAlert:TICMODULE_IMSDK code:-1 desc:@"你被老师踢出了房间"];
        return;
    }
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",members.firstObject, @"退出了房间"];
    self.chatTextView.string = [NSString stringWithFormat:@"%@\n%@",self.chatTextView.string, msgInfo];;
}


-(void)onTICClassroomDestroy {
    //TODO
    
}

- (void)onTICDevice:(NSString *)deviceId type:(TRTCMediaDeviceType)deviceType stateChanged:(NSInteger)state
{
    switch (deviceType) {
        case TRTCMediaDeviceTypeVideoWindow:
            [self setupScreens];
            break;
        case TRTCMediaDeviceTypeVideoScreen:
            [self setupScreens];
            break;
        case TRTCMediaDeviceTypeVideoCamera:
            [self setupCameras];
            break;
        case TRTCMediaDeviceTypeAudioInput:
            [self setupMics];
            break;
            
        default:
            break;
    }
}


#pragma mark - 白板事件监听
- (void)onTEBRedoStatusChanged:(BOOL)canRedo
{
    self.redoButton.enabled = canRedo;
}
- (void)onTEBUndoStatusChanged:(BOOL)canUndo
{
    self.undoButton.enabled = canUndo;
}
- (void)onTEBHistroyDataSyncCompleted
{
    //更新列表
    [self.fileTableView reloadData];
    [self.boardTableView reloadData];
    NSString *fileId = [[[TICManager sharedInstance] getBoardController] getCurrentFile];
    [self loadThumb:fileId];
}

- (void)onTEBH5FileStatusChanged:(NSString *)fileId status:(TEduBoardH5FileStatus)status
{
    if(status == TEDU_BOARD_H5_FILE_STATUS_LOADED){
        [self.fileTableView reloadData];
        TEduBoardController *controller = [[TICManager sharedInstance] getBoardController];
//        self.goForwardButton.enabled = [controller canGoForward];
//        self.goBackButton.enabled = [controller canGoBack];
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
        [[[TICManager sharedInstance] getBoardController] addTranscodeFile:result];
        
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
- (void)onTICForceOffline
{
    [self showAlert:TICMODULE_IMSDK code:-1 desc:@"账号被踢"];
    [self resetViews];
}

- (void)onTICUserSigExpired
{
    [self showAlert:TICMODULE_IMSDK code:-1 desc:@"userSig过期"];
    [self resetViews];
}

#pragma mark - 消息监听
- (void)onTICRecvGroupTextMessage:(NSString *)text groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId
{
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",fromUserId, text];
    self.chatTextView.string = [NSString stringWithFormat:@"%@\n%@",self.chatTextView.string, msgInfo];
    [self.chatTextView scrollRangeToVisible:NSMakeRange(self.chatTextView.string.length, 1)];
}

- (void)onTICRecvGroupCustomMessage:(NSData *)data groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId
{
    NSString *msgInfo = [NSString stringWithFormat:@"[%@] %@",fromUserId, @"CUSTOM"];
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
    self.thumbUrls = [[[TICManager sharedInstance] getBoardController] getThumbnailImages:fid];
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
    TEduBoardController *controller = [[TICManager sharedInstance] getBoardController];
    NSString *fileId = [controller getCurrentFile];
    NSArray *boarIds = [controller getFileBoardList:fileId];
    NSString *boardId = boarIds[indexPaths.allObjects[0].item];
    [controller gotoBoard:boardId];
}
@end
