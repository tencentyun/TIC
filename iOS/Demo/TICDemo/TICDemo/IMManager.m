//
//  TIMImpManager.m
//  TICDebugDemo
//
//  Created by 张小桥 on 2022/5/9.
//

#import "IMManager.h"
// 白板消息标识
#define kTICEduBoardCmd     @"TXWhiteBoardExt"

@interface IMManager ()<V2TIMAdvancedMsgListener>

@property (nonatomic, assign) BOOL isInited;
@property (nonatomic, assign) BOOL isLogin;

@end

@implementation IMManager

+ (instancetype)sharedInstance
{
    static IMManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[IMManager alloc] init];
    });
    return instance;
}

- (BOOL)initSDK:(int)sdkAppID listener:(id<V2TIMSDKListener>)listener {
    self.sdkAppID = [NSString stringWithFormat:@"%d", sdkAppID];
    V2TIMSDKConfig *config = [[V2TIMSDKConfig alloc] init];
    config.logLevel = V2TIM_LOG_WARN;
    self.isInited = [[V2TIMManager sharedInstance] initSDK:sdkAppID config:config];
    [[V2TIMManager sharedInstance] addIMSDKListener:listener];
    [[V2TIMManager sharedInstance] addAdvancedMsgListener:self];
    return self.isInited;
}

- (void)unInit {
    self.isInited = false;
    [[V2TIMManager sharedInstance] removeAdvancedMsgListener:self];
    [[V2TIMManager sharedInstance] unInitSDK];
}
- (void)login:(NSString *)userID userSig:(NSString *)userSig callback:(IMCallback)callback {
    if (self.isLogin) {
        if (callback) {
            callback(-1, [NSString stringWithFormat:@"用户%@已登录， 请先退出登录", self.userId]);
        }
        return;
    }
    __weak typeof(self) ws = self;
    [[V2TIMManager sharedInstance] login:userID userSig:userSig succ:^{
        ws.userId = userID;
        ws.userSig = userSig;
        ws.isLogin = YES;
        if (callback) {
            callback(0, @"");
        }
    } fail:^(int code, NSString *desc) {
        if (callback) {
            callback(code, desc);
        }
    }];
}

- (void)logout:(IMCallback)callback {
    __weak typeof(self) ws = self;
    [[V2TIMManager sharedInstance] logout:^{
        ws.classId = @"";
        ws.isLogin = NO;
        if (callback) {
            callback(0, @"");
        }
    } fail:^(int code, NSString *desc) {
        if (callback) {
            callback(code, desc);
        }
    }];
}

// IM被踢
- (void)kickout {
    self.classId = @"";
    self.isLogin = NO;
}

// 创建IM群组
- (void)createIMGroup:(NSString*)classId callback:(IMCallback)callback {
    V2TIMGroupInfo *groupInfo = [[V2TIMGroupInfo alloc] init];
    groupInfo.groupID = classId;
    groupInfo.groupName = classId;
    groupInfo.groupType = @"Public";
    groupInfo.groupAddOpt = V2TIM_GROUP_ADD_ANY;
    __weak typeof(self) ws = self;
    [[V2TIMManager sharedInstance] createGroup:groupInfo memberList:nil succ:^(NSString *groupID) {
        ws.classId = classId;
        if (callback) {
            callback(0, @"");
        }
    } fail:^(int code, NSString *desc) {
        if (callback) {
            callback(code, desc);
        }
    }];
}

- (void)destroyIMGroup:(NSString*)classId callback:(IMCallback)callback {
    __weak typeof(self) ws = self;
    [[V2TIMManager sharedInstance] dismissGroup:classId succ:^{
        ws.classId = @"";
        if (callback) {
            callback(0, @"");
        }
    } fail:^(int code, NSString *desc) {
        if (callback) {
            callback(code, desc);
        }
    }];
}

// 加入IM群组
- (void)joinIMGroup:(NSString*)classId callback:(IMCallback)callback {
    if (self.classId.length > 0) {
        if ([self.classId isEqualToString:classId]) {
            if (callback) {
                callback(0, @"");
            }
        }
        else {
            __weak typeof(self) ws = self;
            //先退出群，然后再加入新群
            [self quitIMGroup:self.classId callback:^(int code, NSString * _Nullable desc) {
                ws.classId = @"";
                [ws joinIMGroup:classId callback:callback];
            }];
        }
        return;
    }
    __weak typeof(self) ws = self;
    // 第1步：尝试创建IM群组
    [self createIMGroup:classId callback:^(int code, NSString *desc) {
        // 0表示创建成功，10021和10025表示群组已存在
        if(code == 0 || code == 10021 || code == 10025){
            // 第2步：加入IM群组
            [[V2TIMManager sharedInstance] joinGroup:classId msg:nil succ:^{
                ws.classId = classId;
                if (callback) {
                    callback(0, @"");
                }
            } fail:^(int code, NSString *desc) {
                if(code == 10013){
                    //已经在群中
                    ws.classId = classId;
                    if (callback) {
                        callback(0, @"");
                    }
                }
                else{
                    if (callback) {
                        callback(code, desc);
                    }
                }
            }];
        }
        else {
            if (callback) {
                callback(code, desc);
            }
        }
    }];
}

// 退出IM群组
- (void)quitIMGroup:(NSString*)classId callback:(IMCallback)callback {
    __weak typeof(self) ws = self;
    [[V2TIMManager sharedInstance] quitGroup:classId succ:^{
        ws.classId = @"";
        if (callback) {
            callback(0, @"");
        }
    } fail:^(int code, NSString *desc) {
        if (code == 10009) {
            //群主退群失败
            ws.classId = @"";
            if (callback) {
                callback(0, @"");
            }
        }
        else{
            if (callback) {
                callback(code, desc);
            }
        }
    }];
}

#pragma mark - V2TIMAdvancedMsgListener
- (void)onRecvNewMessage:(V2TIMMessage *)msg {
    // 非本群组消息，返回
    if (![msg.groupID isEqualToString:self.classId]) {
        if (msg.elemType == V2TIM_ELEM_TYPE_TEXT) {
            if (_delegate && [_delegate respondsToSelector:@selector(onRecvCTCTextMessage:fromUserId:)]) {
                [_delegate onRecvCTCTextMessage:msg.textElem.text fromUserId:msg.sender];
            }
        }
        return;
    }
    if ([self isBoardMessage:msg]) {
        return;
    }
    if (msg.elemType == V2TIM_ELEM_TYPE_TEXT) {
        if (_delegate && [_delegate respondsToSelector:@selector(onRecvGroupTextMessage:groupId:fromUserId:)]) {
            [_delegate onRecvGroupTextMessage:msg.textElem.text groupId:self.classId fromUserId:msg.sender];
        }
    }
}
#pragma mark - im method
- (BOOL)isBoardMessage:(V2TIMMessage *)message {
    return [message isKindOfClass:V2TIMMessage.class]
        && message.elemType == V2TIM_ELEM_TYPE_CUSTOM
        && [message.customElem.extension isEqualToString:kTICEduBoardCmd];
}

- (void)sendGroupTextMessage:(NSString *)text callback:(IMCallback)callback {
    [[V2TIMManager sharedInstance] sendGroupTextMessage:text to:self.classId priority:0 succ:^{
        if (callback) {
            callback(0, nil);
        }
    } fail:^(int code, NSString *desc) {
        if (callback) {
            callback(code, desc);
        }
    }];
}

@end
