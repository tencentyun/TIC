//
//  TICManager.m
//  TICDemo
//
//  Created by kennethmiao on 2019/3/27.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import "TICManager.h"
#if TARGET_OS_IPHONE
#import <TXLiteAVSDK_TRTC/TXLiteAVSDK.h>
#import <ImSDK/ImSDK.h>
#else
#import <TXLiteAVSDK_TRTC_Mac/TXLiteAVSDK.h>
#import <ImSDKForMac/ImSDK.h>
#endif
#import "TICRecorder.h"
#import "TICReport.h"
#import "TICWeakProxy.h"

typedef id(^WeakRefBlock)(void);
typedef id(^MakeWeakRefBlock)(id);
id makeWeakRef (id object) {
    __weak id weakref = object;
    WeakRefBlock block = ^(){
        return weakref;
    };
    return block();
}

@interface TICManager () <TIMUserStatusListener, TIMMessageListener, TRTCCloudDelegate, TEduBoardDelegate, TIMGroupEventListener>
@property (nonatomic, assign) int sdkAppId;
@property (nonatomic, strong) TICClassroomOption *option;
@property (nonatomic, strong) NSString *userId;
@property (nonatomic, strong) NSString *userSig;

@property (nonatomic, strong) NSMutableArray<id<TICMessageListener>> *messageListeners;
@property (nonatomic, strong) NSMutableArray<id<TICEventListener>> *eventListeners;
@property (nonatomic, strong) NSMutableArray<id<TICStatusListener>> *statusListeners;

@property (nonatomic, assign) BOOL isEnterRoom;
@property (nonatomic, strong) TICCallback enterCallback;

@property (nonatomic, strong) TEduBoardController *boardController;
@property (nonatomic, strong) TICRecorder *recorder;


@property (nonatomic, strong) NSTimer *syncTimer;
@property (nonatomic, assign) TICDisableModule disableModule;
@end

@implementation TICManager


+ (instancetype)sharedInstance
{
    static TICManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[TICManager alloc] init];;
        instance.messageListeners = [NSMutableArray array];
        instance.eventListeners = [NSMutableArray array];
        instance.statusListeners = [NSMutableArray array];
    });
    return instance;
}

- (void)init:(int)sdkAppId disableModule:(TICDisableModule)disableModule callback:(TICCallback)callback;
{
    _disableModule = disableModule;
    [self init:sdkAppId callback:callback];
}

- (void)init:(int)sdkAppId callback:(TICCallback)callback;
{
    _sdkAppId = sdkAppId;
    TIMSdkConfig *config = [[TIMSdkConfig alloc] init];
    config.sdkAppId = sdkAppId;
    [self report:TIC_REPORT_INITSDK_START];
    int ret = [[TIMManager sharedInstance] initSdk:config];
    [self report:TIC_REPORT_INITSDK_END code:ret msg:nil];
    
    if(ret == 0){
        [[TIMManager sharedInstance] addMessageListener:self];
        TIMUserConfig *userConfig = [[TIMUserConfig alloc] init];
        userConfig.userStatusListener = self;
        userConfig.groupEventListener = self;
        userConfig.disableAutoReport = NO;
        [[TIMManager sharedInstance] setUserConfig:userConfig];
    }
    TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, ret, nil);
}

- (void)unInit
{
    [[TIMManager sharedInstance] removeMessageListener:self];
    [[TIMManager sharedInstance] unInit];
}

- (void)login:(NSString *)userId userSig:(NSString *)userSig callback:(TICCallback)callback
{
    _userId = userId;
    _userSig = userSig;
    TIMLoginParam *loginParam = [TIMLoginParam new];
    loginParam.identifier = userId;
    loginParam.userSig = userSig;
    loginParam.appidAt3rd = [@(_sdkAppId) stringValue];
    [self report:TIC_REPORT_LOGIN_START];
    __weak typeof(self) ws = self;
    int ret = [[TIMManager sharedInstance] login:loginParam succ:^{
        [ws report:TIC_REPORT_LOGIN_END];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, 0, nil);
    } fail:^(int code, NSString *msg) {
        [ws report:TIC_REPORT_LOGIN_END code:code msg:msg];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, code, msg);
    }];
    if(ret != 0){
        [ws report:TIC_REPORT_LOGIN_END code:ret msg:nil];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, ret, nil);
    }
}

- (void)logout:(TICCallback)callback
{
    [self report:TIC_REPORT_LOGOUT_START];
    __weak typeof(self) ws = self;
    int ret = [[TIMManager sharedInstance] logout:^{
        [ws report:TIC_REPORT_LOGOUT_END];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, 0, nil);
    } fail:^(int code, NSString *msg) {
        [ws report:TIC_REPORT_LOGOUT_END code:code msg:msg];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, code, msg);
    }];
    if(ret != 0){
        [ws report:TIC_REPORT_LOGOUT_END code:ret msg:nil];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, ret, nil);
    }
};

- (void)createClassroom:(int)classId classScene:(TICClassScene)scene callback:(TICCallback)callback
{
    TIMCreateGroupInfo *groupInfo = [[TIMCreateGroupInfo alloc] init];
    NSString *roomIdStr = [@(classId) stringValue];
    groupInfo.group = roomIdStr;
    groupInfo.groupName = roomIdStr;
    if(scene == TIC_CLASS_SCENE_LIVE){
        groupInfo.groupType = @"AVChatRoom";
    }
    else{
        groupInfo.groupType = @"Public";
    }
    groupInfo.setAddOpt = YES;
    groupInfo.addOpt = TIM_GROUP_ADD_ANY;
    [self report:TIC_REPORT_CREATE_GROUP_START];
    __weak typeof(self) ws = self;
    [[TIMGroupManager sharedInstance] createGroup:groupInfo succ:^(NSString *groupId) {
        [ws report:TIC_REPORT_CREATE_GROUP_END];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, 0, nil);
    } fail:^(int code, NSString *msg) {
        [ws report:TIC_REPORT_CREATE_GROUP_END code:code msg:msg];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, code, msg);
    }];
}

- (void)destroyClassroom:(int)classId callback:(TICCallback)callback
{
    [self report:TIC_REPORT_DELETE_GROUP_START];
    __weak typeof(self) ws = self;
    [[TIMGroupManager sharedInstance] deleteGroup:[@(classId) stringValue] succ:^{
        [ws report:TIC_REPORT_DELETE_GROUP_END];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, 0, nil);
    } fail:^(int code, NSString *msg) {
        [ws report:TIC_REPORT_DELETE_GROUP_END code:code msg:msg];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, code, msg);
    }];
}

- (void)joinClassroom:(TICClassroomOption *)option callback:(TICCallback)callback
{
    _option = option;
    _enterCallback = callback;
    
    //白板初始化
    __weak typeof(self) ws = self;
    void (^createBoard)(void) = ^(void){
        TEduBoardAuthParam *authParam = [[TEduBoardAuthParam alloc] init];
        authParam.sdkAppId = ws.sdkAppId;
        authParam.userId = ws.userId;
        authParam.userSig = ws.userSig;
        TEduBoardInitParam *initParam = option.boardInitParam;
        if(!initParam){
            initParam = [[TEduBoardInitParam alloc] init];
        }
        [ws report:TIC_REPORT_INIT_BOARD_START];
        ws.boardController = [[TEduBoardController alloc] initWithAuthParam:authParam roomId:ws.option.classId initParam:initParam];
        [ws.boardController addDelegate:ws];
        if(option.boardDelegate){
            [ws.boardController addDelegate:option.boardDelegate];
        }
    };
    
    [self report:TIC_REPORT_JOIN_GROUP_START];
    //IM进房
    void (^succ)(void) = ^{
        [ws report:TIC_REPORT_JOIN_GROUP_END];
        createBoard();
    };
    
    void (^fail)(int, NSString*) = ^(int code, NSString *msg){
        [ws report:TIC_REPORT_JOIN_GROUP_END code:code msg:msg];
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, code, msg);
    };
    
    [self joinIMGroup:[@(_option.classId) stringValue] succ:^{
        if(ws.option.compatSaas){
            NSString *chatGroup = [self getChatGroup];
            [self joinIMGroup:chatGroup succ:^{
                succ();
            } fail:^(int code, NSString *msg) {
                fail(code, msg);
            }];
        }
        else{
            succ();
        }
    } fail:^(int code, NSString *msg) {
        fail(code, msg);
    }];
};

- (void)joinIMGroup:(NSString *)group succ:(void (^)(void))succ fail:(void (^)(int, NSString*))fail{
    [[TIMGroupManager sharedInstance] joinGroup:group msg:nil succ:^{
        succ();
    } fail:^(int code, NSString *msg) {
        if(code == 10013){
            //已经在群中
            succ();
        }
        else{
            fail(code, msg);
        }
    }];
}

- (void)quitClassroom:(BOOL)clearBoard callback:(TICCallback)callback
{
    __weak typeof(self) ws = self;
    TICBLOCK_SAFE_RUN(^{
        //停止同步
        [ws stopSyncTimer];
        //清除白板
        if(clearBoard){
            [ws.boardController reset];
        }
        [ws.boardController unInit];
        UInt32 classId = ws.option.classId;
        TEView *renderView = [ws.boardController getBoardRenderView];
        if(renderView.superview){
            [renderView removeFromSuperview];
        }
        [ws.boardController removeDelegate:ws];
        if(ws.option.boardDelegate){
            [ws.boardController removeDelegate:ws.option.boardDelegate];
        }
        ws.isEnterRoom = NO;
        ws.option = nil;
        ws.boardController = nil;
        //退出TRTC房间
        if((ws.disableModule & TIC_DISABLE_MODULE_TRTC) != TIC_DISABLE_MODULE_TRTC){
            [[TRTCCloud sharedInstance] exitRoom];
        }
        [ws report:TIC_REPORT_QUIT_GROUP_START];
        
        //退出成功回调
        void (^succ)(void) = ^{
            [ws report:TIC_REPORT_QUIT_GROUP_END];
            TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, 0, nil)
        };
        //退出失败回调
        void (^fail)(int, NSString *) = ^(int code, NSString *msg){
            [ws report:TIC_REPORT_QUIT_GROUP_END code:code msg:msg];
            TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, code, msg);
        };
        //退出IM群组
        [ws quitIMGroup:[@(classId) stringValue] succ:^{
            if(ws.option.compatSaas){
                NSString *chatGroup = [ws getChatGroup];
                [ws quitIMGroup:chatGroup succ:^{
                    succ();
                } fail:^(int code, NSString *msg) {
                    fail(code, msg);
                }];
            }
            else{
                succ();
            }
        } fail:^(int code, NSString *msg) {
            fail(code, msg);
        }];
    });
}

- (void)quitIMGroup:(NSString *)group succ:(void (^)(void))succ fail:(void (^)(int, NSString*))fail{
    [[TIMGroupManager sharedInstance] quitGroup:group succ:^{
        succ();
    } fail:^(int code, NSString *msg) {
        if (code == 10009) {
            //群主退群失败
            succ();
        }
        else{
            fail(code, msg);
        }
    }];
}

- (void)switchRole:(TICRoleType)role
{
    [[TRTCCloud sharedInstance] switchRole:(TRTCRoleType)role];
    if(role == TIC_ROLE_TYPE_ANCHOR){
        [self startSyncTimer];
    }
    else{
        [self stopSyncTimer];
    }
}
#pragma mark - manager
- (TEduBoardController *)getBoardController
{
    return _boardController;
}
 
- (TRTCCloud *)getTRTCCloud
{
    return [TRTCCloud sharedInstance];
}
#pragma mark - listener

- (void)addMessageListener:(id<TICMessageListener>)listener
{
    [_messageListeners addObject:makeWeakRef(listener)];
}

- (void)addEventListener:(id<TICEventListener>)listener
{
    [_eventListeners addObject:makeWeakRef(listener)];
}

- (void)addStatusListener:(id<TICStatusListener>)listener
{
    [_statusListeners addObject:makeWeakRef(listener)];
}

- (void)removeMessageListener:(id<TICMessageListener>)listener
{
    [_messageListeners removeObject:listener];
}

- (void)removeEventListener:(id<TICEventListener>)listener
{
    [_eventListeners removeObject:listener];
}

- (void)removeStatusListener:(id<TICStatusListener>)listener
{
    [_statusListeners removeObject:listener];
}

#pragma mark - im method
- (void)sendTextMessage:(NSString *)text toUserId:(NSString *)toUserId callback:(TICCallback)callback
{
    TIMTextElem *elem = [[TIMTextElem alloc] init];
    elem.text = text;
    [self sendMessageWithElem:elem type:TIM_C2C receiver:toUserId callback:callback];
}

- (void)sendCustomMessage:(NSData *)data toUserId:(NSString *)toUserId callback:(TICCallback)callback
{
    TIMCustomElem *elem = [[TIMCustomElem alloc] init];
    elem.data = data;
    [self sendMessageWithElem:elem type:TIM_C2C receiver:toUserId callback:callback];
}

- (void)sendMessage:(TIMMessage *)message toUserId:(NSString *)toUserId callback:(TICCallback)callback
{
    [message setPriority:TIM_MSG_PRIORITY_HIGH];
    [self sendMessage:message type:TIM_C2C receiver:toUserId callback:callback];
}

- (void)sendGroupTextMessage:(NSString *)text callback:(TICCallback)callback
{
    NSString *chatGroup = [self getChatGroup];
    TIMTextElem *elem = [[TIMTextElem alloc] init];
    elem.text = text;
    [self sendMessageWithElem:elem type:TIM_GROUP receiver:chatGroup callback:callback];
}

- (void)sendGroupCustomMessage:(NSData *)data callback:(TICCallback)callback
{
    NSString *chatGroup = [self getChatGroup];
    TIMCustomElem *elem = [[TIMCustomElem alloc] init];
    elem.data = data;
    [self sendMessageWithElem:elem type:TIM_GROUP receiver:chatGroup callback:callback];
}

- (void)sendGroupMessage:(TIMMessage *)message callback:(TICCallback)callback
{
    NSString *chatGroup = [self getChatGroup];
    [self sendMessage:message type:TIM_GROUP receiver:chatGroup callback:callback];
}

- (void)sendMessageWithElem:(TIMElem *)elem type:(TIMConversationType)type receiver:(NSString *)receiver callback:(TICCallback)callback
{
    TIMMessage *message = [[TIMMessage alloc] init];
    [message addElem:elem];
    [self sendMessage:message type:type receiver:receiver callback:callback];
}

- (void)sendMessage:(TIMMessage *)message type:(TIMConversationType)type receiver:(NSString *)receiver callback:(TICCallback)callback
{
    TIMConversation *conversation = [[TIMManager sharedInstance] getConversation:type receiver:receiver];
    if(conversation){
        [conversation sendMessage:message succ:^{
            TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, 0, nil);
        } fail:^(int code, NSString *msg) {
            TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, code, msg);
        }];
    }
    else{
        TICBLOCK_SAFE_RUN(callback, TICMODULE_IMSDK, -1, @"conversation not exits!!");
    }
}



#pragma mark - trtc delegate
- (void)onError:(TXLiteAVError)errCode errMsg:(NSString *)errMsg extInfo:(NSDictionary *)extInfo
{
    if(errCode == ERR_ROOM_ENTER_FAIL
       || errCode == ERR_ENTER_ROOM_PARAM_NULL
       || errCode == ERR_SDK_APPID_INVALID
       || errCode == ERR_ROOM_ID_INVALID
       || errCode == ERR_USER_ID_INVALID
       || errCode == ERR_USER_SIG_INVALID){
        [[TRTCCloud sharedInstance] exitRoom];
        [self report:TIC_REPORT_ENTER_ROOM_END code:errCode msg:errMsg];
        TICBLOCK_SAFE_RUN(self->_enterCallback, TICMODULE_TRTC, errCode, errMsg);
    }
}

- (void)onEnterRoom:(NSInteger)elapsed
{
    if (elapsed >= 0) {
        [self report:TIC_REPORT_ENTER_ROOM_END];
        _isEnterRoom = YES;
        //录制对时
        [self sendOfflineRecordInfo];
        //进房回调
        TICBLOCK_SAFE_RUN(self->_enterCallback, TICMODULE_TRTC, 0, nil);
        _enterCallback = nil;
        //启动对时
        if(_option.classScene == TIC_CLASS_SCENE_LIVE && _option.roleType == TIC_ROLE_TYPE_ANCHOR) {
            [self startSyncTimer];
        }
    }
}

- (void)onExitRoom:(NSInteger)reason
{
    [TRTCCloud destroySharedIntance];
}

- (void)onUserExit:(NSString *)userId reason:(NSInteger)reason
{
    [self onUserAudioAvailable:userId available:NO];
    [self onUserVideoAvailable:userId available:NO];
    [self onUserSubStreamAvailable:userId available:NO];
}

- (void)onUserVideoAvailable:(NSString *)userId available:(BOOL)available
{
    NSString *data = [NSString stringWithFormat:@"{userId:%@,available:%d}", userId, available];
    [self report:TIC_REPORT_VIDEO_AVAILABLE code:0 msg:nil data:data];
    for (id<TICEventListener> listener in _eventListeners) {
        if(listener && [listener respondsToSelector:@selector(onTICUserVideoAvailable:available:)]){
            [listener onTICUserVideoAvailable:userId available:available];
        }
    }
}

- (void)onUserSubStreamAvailable:(NSString *)userId available:(BOOL)available
{
    NSString *data = [NSString stringWithFormat:@"{userId:%@,available:%d}", userId, available];
    [self report:TIC_REPORT_SUB_STREAM_AVAILABLE code:0 msg:nil data:data];
    for (id<TICEventListener> listener in _eventListeners) {
        if(listener && [listener respondsToSelector:@selector(onTICUserSubStreamAvailable:available:)]){
            [listener onTICUserSubStreamAvailable:userId available:available];
        }
    }
}

- (void)onUserAudioAvailable:(NSString *)userId available:(BOOL)available
{
    NSString *data = [NSString stringWithFormat:@"{userId:%@,available:%d}", userId, available];
    [self report:TIC_REPORT_AUDIO_AVAILABLE code:0 msg:nil data:data];
    for (id<TICEventListener> listener in _eventListeners) {
        if(listener && [listener respondsToSelector:@selector(onTICUserAudioAvailable:available:)]){
            [listener onTICUserAudioAvailable:userId available:available];
        }
    }
}

#if !TARGET_OS_IPHONE
- (void)onDevice:(NSString *)deviceId type:(TRTCMediaDeviceType)deviceType stateChanged:(NSInteger)state
{
    for (id<TICEventListener> listener in _eventListeners) {
        if(listener && [listener respondsToSelector:@selector(onTICDevice:type:stateChanged:)]){
            [listener onTICDevice:deviceId type:deviceType stateChanged:state];
        }
    }
}
#endif

#pragma mark - board method

- (BOOL)isBoardMessage:(TIMMessage *)message
{
    TIMOfflinePushInfo *info = message.getOfflinePushInfo;
    return [info.ext hasPrefix:kTICEduBoardCmd];
}

- (BOOL)isBoardMessageElem:(TIMElem *)elem
{
    if ([elem isKindOfClass:[TIMCustomElem class]]) {
        TIMCustomElem *cusElem = (TIMCustomElem *)elem;
        return [cusElem.ext hasPrefix:kTICEduBoardCmd];
    }
    else if ([elem isKindOfClass:[TIMFileElem class]]) {
        TIMFileElem *fileElem = (TIMFileElem *)elem;
        return [fileElem.filename hasPrefix:kTICEduBoardCmd];
    }
    return NO;
}

- (BOOL)isRecordMessageElem:(TIMElem *)elem
{
    if ([elem isKindOfClass:[TIMCustomElem class]]) {
        TIMCustomElem *cusElem = (TIMCustomElem *)elem;
        return [cusElem.ext hasPrefix:kTICEduRecordCmd];
    }
    return NO;
}

- (NSString *)getChatGroup
{
    NSString *chatGroup = [@(_option.classId) stringValue];
    if(_option.compatSaas){
        chatGroup = [NSString stringWithFormat:@"%ld_chat", (long)_option.classId];
    }
    return chatGroup;
}

#pragma mark - board delegate
- (void)onTEBHistroyDataSyncCompleted
{
    [self report:TIC_REPORT_SYNC_BOARD_HISTORY_END];
}
- (void)onTEBInit
{
    [self report:TIC_REPORT_INIT_BOARD_END];
    if ((_disableModule & TIC_DISABLE_MODULE_TRTC) == TIC_DISABLE_MODULE_TRTC){
        //屏蔽了TRTC模块
        [self onEnterRoom:0];
    }
    else {
        TRTCParams *params = [[TRTCParams alloc] init];
            params.sdkAppId = _sdkAppId;
            params.userId = _userId;
            params.userSig = _userSig;
            params.roomId = _option.classId;
            if(_option.classScene == TIC_CLASS_SCENE_LIVE){
                params.role = (TRTCRoleType)_option.roleType;
            }
            [[TRTCCloud sharedInstance] setDelegate:self];
            [self report:TIC_REPORT_ENTER_ROOM_START];
            [[TRTCCloud sharedInstance] enterRoom:params appScene:(TRTCAppScene)_option.classScene];
        #if TARGET_OS_IPHONE
            if(_option.bOpenCamera && _option.renderView){
                [[TRTCCloud sharedInstance] startLocalPreview:_option.bFrontCamera view:_option.renderView];
            }
            if(_option.bOpenMic){
                [[TRTCCloud sharedInstance] startLocalAudio];
            }
        #else
            if(_option.cameraId.length != 0){
                [[TRTCCloud sharedInstance] setCurrentCameraDevice:_option.cameraId];
            }
            if(_option.bOpenCamera && _option.renderView){
                [[TRTCCloud sharedInstance] startLocalPreview:_option.renderView];
            }
            if(_option.micId.length != 0){
                [[TRTCCloud sharedInstance] setCurrentMicDevice:_option.micId];
            }
            if(_option.bOpenMic){
                [[TRTCCloud sharedInstance] startLocalAudio];
            }
        #endif
    }
}

- (void)onTEBError:(TEduBoardErrorCode)code msg:(NSString *)msg
{
    [self report:TIC_REPORT_BOARD_ERROR code:(int)code msg:msg];
    if(code == TEDU_BOARD_ERROR_AUTH || code == TEDU_BOARD_ERROR_LOAD || code == TEDU_BOARD_ERROR_INIT || code == TEDU_BOARD_ERROR_AUTH_TIMEOUT){
        [self report:TIC_REPORT_INIT_BOARD_END code:(int)code msg:msg];
        TICBLOCK_SAFE_RUN(self->_enterCallback, TICMODULE_TRTC, (int)code, msg);
        _enterCallback = nil;
    }
}

- (void)onTEBWarning:(TEduBoardWarningCode)code msg:(NSString *)msg
{
    [self report:TIC_REPORT_BOARD_WARNING code:(int)code msg:msg];
}

#pragma mark - im delegate
- (void)onNewMessage:(NSArray *)msgs
{
    NSString *chatGroup = [self getChatGroup];
    
    for (TIMMessage *msg in msgs) {
        if ([msg elemCount] <= 0) {
            continue;
        }

        TIMConversation *conv = [msg getConversation];
        NSString *convId = [conv getReceiver];
        TIMConversationType type = [conv getType];
        if(type == TIM_GROUP && ![convId isEqualToString:chatGroup]){
            //收到其他群消息
            continue;
        }
        if ([self isBoardMessage:msg]) {
            //白板消息
            continue;
        }

        for (id<TICMessageListener> listener in _messageListeners) {
            if (listener && [listener respondsToSelector:@selector(onTICRecvMessage:)]) {
                [listener onTICRecvMessage:msg];
            }
        }
        
        for (int index = 0; index < msg.elemCount; index++) {
            TIMElem *elem = [msg getElem:index];
            if([self isBoardMessageElem:elem] || [self isRecordMessageElem:elem]){
                continue;
            }
            if ([elem isKindOfClass:[TIMTextElem class]]) {
                TIMTextElem *textElem = (TIMTextElem *)elem;
                switch (type)
                {
                    case TIM_C2C:
                        for (id<TICMessageListener> listener in _messageListeners) {
                            if (listener && [listener respondsToSelector:@selector(onTICRecvTextMessage:fromUserId:)]){
                                [listener onTICRecvTextMessage:textElem.text fromUserId:msg.sender];
                            }
                        }
                        break;
                    case TIM_GROUP:
                        for (id<TICMessageListener> listener in _messageListeners) {
                            if (listener && [listener respondsToSelector:@selector(onTICRecvGroupTextMessage:groupId:fromUserId:)]){
                                NSString *convId = [conv getReceiver];
                                if ([convId isEqualToString:chatGroup]){
                                    [listener onTICRecvGroupTextMessage:textElem.text groupId:convId fromUserId:msg.sender];
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            } else if ([elem isKindOfClass:[TIMCustomElem class]]) {
                TIMCustomElem *cusElem = (TIMCustomElem *)elem;
                switch (type)
                {
                    case TIM_C2C:
                        for (id<TICMessageListener> listener in _messageListeners) {
                            if (listener && [listener respondsToSelector:@selector(onTICRecvCustomMessage:fromUserId:)]){
                                [listener onTICRecvCustomMessage:cusElem.data fromUserId:msg.sender];
                            }
                        }
                        break;
                    case TIM_GROUP:
                    {
                        NSString *convId = [conv getReceiver];
                        for (id<TICMessageListener> listener in _messageListeners) {
                            if([convId isEqualToString:chatGroup]
                               && listener
                               && [listener respondsToSelector:@selector(onTICRecvGroupCustomMessage:groupId:fromUserId:)]){
                                [listener onTICRecvGroupCustomMessage:cusElem.data groupId:convId fromUserId:msg.sender];
                            }
                        }
                    }
                        break;
                    default:
                        break;
                }
            }
            else if ([elem isKindOfClass:[TIMGroupTipsElem class]]) {
                
            } else if ([elem isKindOfClass:[TIMGroupSystemElem class]]) {
                TIMGroupSystemElem *sysElem = (TIMGroupSystemElem *)elem;
                switch (sysElem.type) {
                    case TIM_GROUP_SYSTEM_DELETE_GROUP_TYPE: // 群被解散
                    case TIM_GROUP_SYSTEM_REVOKE_GROUP_TYPE: // 群被回收
                    {
                        if ([chatGroup isEqualToString:sysElem.group]) {
                            for (id<TICEventListener> listener in _eventListeners) {
                                if (listener && [listener respondsToSelector:@selector(onTICClassroomDestroy)]) {
                                    // 退出房间
                                    [self quitClassroom:YES callback:nil];
                                    // 触发回调
                                    [listener onTICClassroomDestroy];
                                }
                            }
                        }
                    }
                        break;
                    case TIM_GROUP_SYSTEM_KICK_OFF_FROM_GROUP_TYPE: // 用户被踢出群（只有被踢的人能收到）
                    {
                        if ([chatGroup isEqualToString:sysElem.group]) {
                            for (id<TICEventListener> listener in _eventListeners) {
                                if (listener && [listener respondsToSelector:@selector(onTICMemberQuit:)]) {
                                    // 退出房间
                                    [self quitClassroom:NO callback:nil];
                                    // 触发回调
                                    [listener onTICMemberQuit:@[_userId]];
                                }
                            }
                        }
                    }
                        break;

                    default:
                        break;
                }
            }
        }
    }
}


- (void)onForceOffline
{
    [self report:TIC_REPORT_FORCE_OFFLINE];
    if(_isEnterRoom){
        if((_disableModule & TIC_DISABLE_MODULE_TRTC) != TIC_DISABLE_MODULE_TRTC){
            [[TRTCCloud sharedInstance] exitRoom];
        }
        [_boardController removeDelegate:self];
        if(_option.boardDelegate){
            [_boardController removeDelegate:_option.boardDelegate];
        }
        _boardController = nil;
    }
    for (id<TICStatusListener> listener in _statusListeners) {
        if(listener && [listener respondsToSelector:@selector(onTICForceOffline)]){
            [listener onTICForceOffline];
        }
    }
}

- (void)onUserSigExpired
{
    [self report:TIC_REPORT_SIG_EXPIRED];
    if(_isEnterRoom){
        if((_disableModule & TIC_DISABLE_MODULE_TRTC) != TIC_DISABLE_MODULE_TRTC){
            [[TRTCCloud sharedInstance] exitRoom];
        }
        [_boardController removeDelegate:self];
        if(_option.boardDelegate){
            [_boardController removeDelegate:_option.boardDelegate];
        }
        _boardController = nil;
    }
    for (id<TICStatusListener> listener in _statusListeners) {
        if(listener && [listener respondsToSelector:@selector(onTICUserSigExpired)]){
            [listener onTICUserSigExpired];
        }
    }
}

- (void)sendOfflineRecordInfo
{
    if(_recorder == nil){
        _recorder = [[TICRecorder alloc] init];
    }
    [self report:TIC_REPORT_RECORD_INFO_START];
    __weak typeof(self) ws = self;
    //录制对时
    [_recorder sendOfflineRecordInfo:[@(_option.classId) stringValue] ntpServer:_option.ntpServer callback:^(TICModule module, int code, NSString *desc) {
        [ws report:TIC_REPORT_RECORD_INFO_END code:code msg:desc];
        for (id<TICEventListener> listener in ws.eventListeners) {
            if (listener && [listener respondsToSelector:@selector(onTICSendOfflineRecordInfo:desc:)]) {
                [listener onTICSendOfflineRecordInfo:code desc:desc];
            }
        }
    }];
    //群ID上报
    [_recorder reportGroupId:[@(_option.classId) stringValue] sdkAppId:_sdkAppId userId:_userId userSig:_userSig];
}

- (void)onGroupTipsEvent:(TIMGroupTipsElem *)elem
{
    NSString *chatGroup = [self getChatGroup];
    
    switch (elem.type) {
        case TIM_GROUP_TIPS_TYPE_INVITE: // 用户加入群
        {
            if([chatGroup isEqualToString:elem.group]) {
                for (id<TICEventListener> listener in _eventListeners) {
                    if (listener && [listener respondsToSelector:@selector(onTICMemberJoin:)]) {
                        [listener onTICMemberJoin:elem.userList];
                    }
                }
            }
        }
            break;
        case TIM_GROUP_TIPS_TYPE_QUIT_GRP: // 用户退出群
        case TIM_GROUP_TIPS_TYPE_KICKED: // 用户被踢出群
        {
            if([chatGroup isEqualToString:elem.group]) {
                for (id<TICEventListener> listener in _eventListeners) {
                    if (listener && [listener respondsToSelector:@selector(onTICMemberQuit:)]) {
                        NSArray *arr = elem.userList;
                        if (elem.userList.count == 0) {
                            arr = @[elem.opUser];
                        }
                        [listener onTICMemberQuit:arr];
                    }
                }
            }
        }
            break;
        default:
            break;
    }
}
#pragma mark - LIVE
- (void)startSyncTimer
{
    [self stopSyncTimer];
    _syncTimer = [NSTimer scheduledTimerWithTimeInterval:5 target:[TICWeakProxy proxyWithTarget:self] selector:@selector(syncRemoteTime) userInfo:nil repeats:YES];
}

- (void)stopSyncTimer
{
    if(_syncTimer){
        [_syncTimer invalidate];
        _syncTimer = nil;
    }
}
- (void)syncRemoteTime
{
    uint64_t syncTime = [[[TICManager sharedInstance] getBoardController] getSyncTime];
    NSMutableDictionary *dataDic = [NSMutableDictionary dictionary];
    [dataDic setObject:[NSNumber numberWithLongLong:syncTime] forKey:@"syncTime"];
    NSData *data = [NSJSONSerialization dataWithJSONObject:dataDic options:0 error:nil];
    [[[TICManager sharedInstance] getTRTCCloud] sendSEIMsg:data repeatCount:1];
}

- (void)onRecvSEIMsg:(NSString *)userId message:(NSData *)message
{
    NSError *error;
    NSDictionary *dataDic = [NSJSONSerialization JSONObjectWithData:message options:0 error:&error];
    if(!error){
        if([dataDic isKindOfClass:[NSDictionary class]]){
            NSNumber *remoteTimeNum = [dataDic objectForKey:@"syncTime"];
            if(remoteTimeNum){
                uint64_t remoteTime = [remoteTimeNum longLongValue];
                [[[TICManager sharedInstance] getBoardController] syncRemoteTime:userId timestamp:remoteTime];
            }
        }
    }
}

#pragma mark - report
- (void)report:(TICReportEvent)event
{
    [self report:event code:0 msg:@""];
}
- (void)report:(TICReportEvent)event code:(int)code msg:(NSString*)msg
{
    [self report:event code:code msg:msg data:nil];
}
- (void)report:(TICReportEvent)event code:(int)code msg:(NSString*)msg data:(NSString *)data
{
    TICReportParam *param = [[TICReportParam alloc] init];
    param.sdkAppId = _sdkAppId;
    param.userId = _userId;
    param.roomId = _option.classId;
    param.errorCode = code;
    param.errorMsg = msg;
    param.event = event;
    param.data = data;
    [TICReport report:param];
}

@end
