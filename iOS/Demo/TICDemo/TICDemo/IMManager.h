//
//  TIMImpManager.h
//  TIM集成示例
//
//  Created by 张小桥 on 2022/5/9.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#if TARGET_OS_IPHONE
#import <ImSDK_Plus/ImSDK_Plus.h>
#else
#import <ImSDKForMac/ImSDK.h>
#endif



NS_ASSUME_NONNULL_BEGIN

typedef void (^IMCallback)(int code, NSString * _Nullable desc);

@protocol IMManagerListener <NSObject>
@optional
// 接收到群组文本消息
- (void)onRecvGroupTextMessage:(NSString *)text groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId;

// 接收到个人文本消息
- (void)onRecvCTCTextMessage:(NSString *)text fromUserId:(NSString *)fromUserId;
@end

@interface IMManager : NSObject

@property (nonatomic, strong) NSString *sdkAppID;
@property (nonatomic, strong) NSString *userId;
@property (nonatomic, strong) NSString *userSig;
@property (nonatomic, strong) NSString *classId;
@property (nonatomic, weak) id<IMManagerListener> delegate;

+ (instancetype)sharedInstance;
// IM初始化
- (BOOL)initSDK:(int)sdkAppID listener:(id<V2TIMSDKListener>)listener;
// 销毁IM资源
- (void)unInit;

// IM登录
- (void)login:(NSString *)userID userSig:(NSString *)userSig callback:(IMCallback)callback;
// IM登出
- (void)logout:(IMCallback)callback;
// IM被踢
- (void)kickout;

// 创建IM群组
- (void)createIMGroup:(NSString*)classId callback:(IMCallback)callback;
// 加入IM群组（含创建IM群组逻辑）
- (void)joinIMGroup:(NSString*)classId callback:(IMCallback)callback;
// 销毁群组
- (void)destroyIMGroup:(NSString*)classId callback:(IMCallback)callback;
// 退出IM群组
- (void)quitIMGroup:(NSString*)classId callback:(IMCallback)callback;
//发送群组消息
- (void)sendGroupTextMessage:(NSString *)text callback:(IMCallback)callback;
@end

NS_ASSUME_NONNULL_END
