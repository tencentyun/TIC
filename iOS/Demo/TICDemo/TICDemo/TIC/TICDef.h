//
//  TICDef.h
//  TICDemo
//
//  Created by kennethmiao on 2019/3/27.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import <Foundation/Foundation.h>
#if TARGET_OS_IPHONE
#import <TXLiteAVSDK_TRTC/TXLiteAVSDK.h>
#import <TEduBoard/TEduBoard.h>
#elif TARGET_OS_MAC
#import <TXLiteAVSDK_TRTC_Mac/TXLiteAVSDK.h>
#import <TEduBoard_Mac/TEduBoard.h>
#endif

#define TICBLOCK_SAFE_RUN(block, ...) \
if(block){ \
if([NSThread isMainThread]){ \
block(__VA_ARGS__); \
} \
else{ \
dispatch_async(dispatch_get_main_queue(), ^{ \
block(__VA_ARGS__); \
}); \
} \
}


//白板消息标识
#define kTICEduBoardCmd     @"TXWhiteBoardExt"
//录制消息标识
#define kTICEduRecordCmd    @"TXConferenceExt"

/**
 * 内部模块
 **/
typedef NS_ENUM(NSInteger, TICModule) {
    TICMODULE_IMSDK     = 0,     //IMSDK模块
    TICMODULE_TRTC      = 1,     //TRTC模块
    TICMODULE_BOARD     = 2,     //BOARD模块
    TICMODULE_TIC       = 3,     //TIC模块
};

/**
 * 课堂场景
 **/
typedef NS_ENUM(NSInteger, TICClassScene) {
    TIC_CLASS_SCENE_VIDEO_CALL     = 0,     //实时通话模式，支持1000人以下场景，低延时
    TIC_CLASS_SCENE_LIVE           = 1,     //直播模式，支持1000人以上场景，会增加600ms左右延时
};

/**
 * 房间角色
 * @brief 仅适用于直播场景（TIC_CLASS_SCENE_LIVE），角色TIC_ROLE_TYPE_ANCHOR具有上行权限
 **/
typedef NS_ENUM(NSInteger, TICRoleType) {
    TIC_ROLE_TYPE_ANCHOR     = 20,     //主播
    TIC_ROLE_TYPE_AUDIENCE   = 21,     //观众
};

/**
 * 禁用模块
 * @brief 如果外部使用了TRTC，可以禁用TIC内部的TRTC模块。
 * @brief 如果禁用TRTC，TRTC相关初始化参数都无效
 **/
typedef NS_ENUM(NSInteger, TICDisableModule) {
    TIC_DISABLE_MODULE_NONE   = 0,        //默认全部启用
    TIC_DISABLE_MODULE_TRTC   = (1 << 1), //禁用TRTC
};


/**
 * 回调
 * @param module        当前模块
 * @param code          错误码
 * @param desc          错误信息
 **/
typedef void (^TICCallback)(TICModule module, int code, NSString *desc);


/*********************************************************************************************************
 *
 *                                             加入课堂参数
 *
 ********************************************************************************************************/
@interface TICClassroomOption : NSObject
/**
 * 课堂Id
 **/
@property (nonatomic, assign) UInt32 classId;
#if TARGET_OS_IPHONE
/**
 * 是否开启前置摄像头【默认NO】
 **/
@property (nonatomic, assign) BOOL bFrontCamera;
#endif
/**
 * 是否开启摄像头【默认NO】
 **/
@property (nonatomic, assign) BOOL bOpenCamera;
/**
 * 是否麦克风【默认NO】
 **/
@property (nonatomic, assign) BOOL bOpenMic;
/**
 * 画面渲染view
 **/
@property (nonatomic, strong) TXView *renderView;
#if !TARGET_OS_IPHONE && TARGET_OS_MAC
/**
 * 摄像头Id
 * @brief 为空则打开默认摄像头
 **/
@property (nonatomic, strong) NSString *cameraId;
/**
 * 麦克风Id
 * @brief 为空则打开默认麦克风
 **/
@property (nonatomic, strong) NSString *micId;
#endif
/**
 * ntp服务器
 * @brief 进房成功后从ntp服务器获取服务器时间戳作为白板课后录制的对时信息，默认使用time1.cloud.tencent.com。为保证对时信息的高度一致，建议各端使用一样的对时地址。
 **/
@property (nonatomic, strong) NSString *ntpServer;
/**
 * 白板初始化参数（如果为nil，则使用默认参数）
 **/
@property (nonatomic, strong) TEduBoardInitParam *boardInitParam;
/**
 * 白板回调
 * @brief 业务层设置此字段可以处理白板更多回调
 **/
@property (nonatomic, weak) id<TEduBoardDelegate> boardDelegate;
/**
 * 课堂场景（默认TIC_CLASS_SCENE_VIDEO_CALL）
 **/
@property (nonatomic, assign) TICClassScene classScene;
/**
 * 课堂角色
 * @brief 只有在classScene为TIC_CLASS_SCENE_LIVE时有效，默认TIC_ROLE_TYPE_ANCHOR
 **/
@property (nonatomic, assign) TICRoleType roleType;
/**
 * 是否兼容SaaS
 * @brief 开启SaaS兼容模式，内部会多创建一个聊天群组
 **/
@property (nonatomic, assign) BOOL compatSaas;
@end

/*********************************************************************************************************
 *
 *                                             消息回调
 *
 ********************************************************************************************************/
@class TIMMessage;
@protocol TICMessageListener <NSObject>
/**
 * 收到C2C文本消息
 * @param text          文本消息
 * @param fromUserId    发送者Id
 **/
- (void)onTICRecvTextMessage:(NSString *)text fromUserId:(NSString *)fromUserId;
/**
 * 收到C2C自定义消息
 * @param data          自定义消息
 * @param fromUserId    发送者Id
 **/
- (void)onTICRecvCustomMessage:(NSData *)data fromUserId:(NSString *)fromUserId;
/**
 * 收到Group文本消息
 * @param text          文本消息
 * @param groupId       所在群组
 * @param fromUserId    发送者Id
 **/
- (void)onTICRecvGroupTextMessage:(NSString *)text groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId;
/**
 * 收到Group自定义消息
 * @param data          自定义消息
 * @param groupId       所在群组
 * @param fromUserId    发送者Id
 **/
- (void)onTICRecvGroupCustomMessage:(NSData *)data groupId:(NSString *)groupId fromUserId:(NSString *)fromUserId;
/**
 * 收到IM所有消息（IM消息透传接口）
 * @param message       IM消息体
 **/
- (void)onTICRecvMessage:(TIMMessage *)message;
@end

/*********************************************************************************************************
 *
 *                                             事件回调
 *
 ********************************************************************************************************/
@protocol TICEventListener <NSObject>

/**
 * userId对应的远端音频的状态通知
 * @param userId    用户标识
 * @param available 音频是否开启
 **/
- (void)onTICUserAudioAvailable:(NSString *)userId available:(BOOL)available;
/**
 * userId对应的远端主路（即摄像头）画面的状态通知
 * @param userId    用户标识
 * @param available 画面是否开启
 **/
- (void)onTICUserVideoAvailable:(NSString *)userId available:(BOOL)available;
/**
 * userId对应的远端辅路（屏幕分享等）画面的状态通知
 * @param userId    用户标识
 * @param available 屏幕分享是否开启
 **/
- (void)onTICUserSubStreamAvailable:(NSString *)userId available:(BOOL)available;
/**
 * 成员加入课堂
 * @param members   成员Id
 **/
- (void)onTICMemberJoin:(NSArray *)members;
/**
 * 成员退出课堂
 * @param members   成员Id
 **/
- (void)onTICMemberQuit:(NSArray *)members;
/**
 * 课堂销毁
 **/
- (void)onTICClassroomDestroy;
/**
 * 发送离线录制对时信息通知
 * @param code  错误码;0表示成功，其他值为失败;
 * @param desc  错误信息;
 * @brief 进房成功后,TIC会自动发送离线录制需要的对时信息;只有成功发送对时信息的课堂才能进行课后离线录制
 */
- (void)onTICSendOfflineRecordInfo:(int)code desc:(NSString *)desc;

#if !TARGET_OS_IPHONE && TARGET_OS_MAC
/**
 * 本地设备通断回调
 * @param deviceId 设备id
 * @param deviceType 设备类型 @see TRTCMediaDeviceType
 * @param state   0: 设备断开   1: 设备连接
 */
- (void)onTICDevice:(NSString *)deviceId type:(TRTCMediaDeviceType)deviceType stateChanged:(NSInteger)state;
#endif
@end

/*********************************************************************************************************
 *
 *                                             状态回调
 *
 ********************************************************************************************************/
@protocol TICStatusListener <NSObject>
/**
 *  踢下线通知
 */
- (void)onTICForceOffline;
/**
 *  用户登录的userSig过期（用户需要重新获取userSig后登录）
 */
- (void)onTICUserSigExpired;
@end


