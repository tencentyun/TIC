//
//  BoardManager.m
//  TICDebugDemo
//
//  Created by 张小桥 on 2022/5/9.
//

#import "BoardManager.h"


@interface BoardManager ()<TEduBoardDelegate>

@property (nonatomic, copy) CreteBoardCallback initBlock;
@property (nonatomic, assign) BOOL isEnterRoom;

@end


@implementation BoardManager

+ (instancetype)sharedInstance
{
    static BoardManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[BoardManager alloc] init];
    });
    return instance;
}

- (void)creteBoard:(NSString*)sdkAppId
           userId:(NSString*)userId
          userSig:(NSString*)userSig
          classId:(NSString*)classId
         callback:(CreteBoardCallback)callback {
    if (self.isEnterRoom) {
        if (callback) {
            callback(-1, @"请先退出当前白板", nil);
        }
        return;
    }
    self.sdkAppID = sdkAppId;
    self.userId = userId;
    self.userSig = userSig;
    self.classId = classId;
    self.initBlock = callback;
    
    TEduBoardAuthParam *authParam = [[TEduBoardAuthParam alloc] init];
    authParam.sdkAppId = [sdkAppId intValue];
    authParam.userId = userId;
    authParam.userSig = userSig;
    
    TEduBoardInitParam *initParam = [[TEduBoardInitParam alloc] init];

//    initParam.authConfig.customCursorIcon = YES;
    initParam.config.offlineWarningTimeout = 10;
    initParam.userConfig.nickname = userId;
    self.boardController = [[TEduBoardController alloc] initWithAuthParam:authParam
                                                   roomId:(UInt32)[classId integerValue]
                                                initParam:initParam];
    [self.boardController addDelegate:self];
}

- (void)destroyBoard {
    [self.boardController unInit];
    
    TEView *renderView = [self.boardController getBoardRenderView];
    if(renderView.superview){
        [renderView removeFromSuperview];
    }
    [self.boardController removeDelegate:self];
    self.isEnterRoom = NO;
    self.boardController = nil;
}
#pragma mark - board delegate

- (void)onTEBInit {
    [self.boardController setLogLevel:TEduBoardLogLevelALL];
    [self.boardController setScrollBarVisible:TRUE];
    if (self.initBlock) {
        self.initBlock(0, @"", self.boardController);
    }
    TEduBoardUserInfo *userinfo = [[TEduBoardUserInfo alloc] init];
    userinfo.nickname = self.userId;
    [self.boardController setUserInfo:userinfo];
    TEduBoardToolTypeTitleStyle *style = [[TEduBoardToolTypeTitleStyle alloc] init];
    style.position = TEDU_BOARD_POSITION_RIGHT_TOP;
    style.color = [UIColor redColor];
    style.size = 200;
    style.style = TEDU_BOARD_TEXT_STYLE_NORMAL;
    [self.boardController setToolTypeTitle:self.userId style:style toolType:TEDU_BOARD_TOOL_TYPE_PEN];
    self.initBlock = nil;
    self.isEnterRoom = YES;
}

- (void)onTEBError:(TEduBoardErrorCode)code msg:(NSString *)msg
{
    if (self.initBlock) {
        self.initBlock((int)code, msg, nil);
    }
    [self.boardController removeDelegate:self];
    [self.boardController unInit];
    self.boardController = nil;
    self.initBlock = nil;
}

@end
