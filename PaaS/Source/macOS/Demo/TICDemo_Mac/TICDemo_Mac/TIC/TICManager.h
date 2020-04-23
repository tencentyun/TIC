//
//  TICManager.h
//  TICDemo
//
//  Created by kennethmiao on 2019/3/27.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import <Foundation/Foundation.h>
#if TARGET_OS_IPHONE
#import <TXLiteAVSDK_TRTC/TXLiteAVSDK.h>
#import <TEduBoard/TEduBoard.h>
#import <ImSDK/ImSDK.h>
#else
#import <TXLiteAVSDK_TRTC_Mac/TXLiteAVSDK.h>
#import <TEduBoard_Mac/TEduBoard.h>
#import <ImSDKForMac/ImSDK.h>
#endif

#import "TICDef.h"


@interface TICManager : NSObject

/*********************************************************************************************************
 *
 *                                             基本流程接口
 *
 ********************************************************************************************************/
+ (instancetype)new __attribute__((unavailable("Use +sharedInstance instead")));
+ (instancetype)init __attribute__((unavailable("Use +sharedInstance instead")));
/**
 * 获取单例
 **/
+ (instancetype)sharedInstance;
/**
 * 初始化
 * @param sdkAppId 应用标识【必填】
 * @param callback 回调【选填】
 **/
- (void)init:(int)sdkAppId callback:(TICCallback)callback;
/**
* 初始化
* @param sdkAppId 应用标识【必填】
* @param disableModule 禁用内部TIC相关模块
* @param callback 回调【选填】
**/
- (void)init:(int)sdkAppId disableModule:(TICDisableModule)disableModule callback:(TICCallback)callback;
/**
 * 反初始化
 **/
- (void)unInit;
/**
 * 登录
 * @param userId   用户标识【必填】
 * @param userSig  用户签名【必填】
 * @param callback 回调【选填】
 **/
- (void)login:(NSString *)userId userSig:(NSString *)userSig callback:(TICCallback)callback;
/**
 * 登出
 * @param callback 回调【选填】
 **/
- (void)logout:(TICCallback)callback;

/**
 * 创建课堂
 * @param classId 课堂Id【必填】
 * @param scene   课堂场景【必填】
 * @param callback 回调【选填】
 **/
- (void)createClassroom:(int)classId classScene:(TICClassScene)scene callback:(TICCallback)callback;
/**
 * 销毁课堂
 * @param classId 课堂Id【必填】
 * @param callback 回调【选填】
 **/
- (void)destroyClassroom:(int)classId callback:(TICCallback)callback;
/**
 * 加入课堂
 * @param option 课堂配置【必填】
 * @param callback 回调【选填】
 * @brief 房间人数超过200人，建议启用大房间模式，详细配置请参考 https://cloud.tencent.com/document/product/680/35955#.E4.B8.87.E4.BA.BA.E5.A4.A7.E6.88.BF.E9.97.B4
 **/
- (void)joinClassroom:(TICClassroomOption *)option callback:(TICCallback)callback;
/**
 * 退出课堂
 * @param clearBoard 是否清空白板
 * @param callback 回调【选填】
 **/
- (void)quitClassroom:(BOOL)clearBoard callback:(TICCallback)callback;

/**
 * 切换角色
 * @param role 角色
 * @brief 只在classScene为TIC_CLASS_SCENE_LIVE时有效
 **/
- (void)switchRole:(TICRoleType)role;

/*********************************************************************************************************
 *
 *                                             IM消息接口
 *
 ********************************************************************************************************/
/**
 * 发送C2C文本消息
 * @param text      文本消息【必填】
 * @param toUserId  接收者【必填】
 * @param callback  回调【选填】
 **/
- (void)sendTextMessage:(NSString *)text toUserId:(NSString *)toUserId callback:(TICCallback)callback;
/**
 * 发送C2C自定义消息
 * @param data      自定义消息【必填】
 * @param toUserId  接收者【必填】
 * @param callback  回调【选填】
 **/
- (void)sendCustomMessage:(NSData *)data toUserId:(NSString *)toUserId callback:(TICCallback)callback;
/**
 * 发送C2C消息
 * @param message   消息【必填】
 * @param toUserId  接收者【必填】
 * @param callback  回调【选填】
 **/
- (void)sendMessage:(TIMMessage *)message toUserId:(NSString *)toUserId callback:(TICCallback)callback;
/**
 * 发送Group文本消息
 * @param text      文本消息【必填】
 * @param callback  回调【选填】
 **/
- (void)sendGroupTextMessage:(NSString *)text callback:(TICCallback)callback;
/**
 * 发送Group自定义消息
 * @param data      自定义消息【必填】
 * @param callback  回调【选填】
 **/
- (void)sendGroupCustomMessage:(NSData *)data callback:(TICCallback)callback;
/**
 * 发送Group消息
 * @param message   消息【必填】
 * @param callback  回调【选填】
 **/
- (void)sendGroupMessage:(TIMMessage *)message callback:(TICCallback)callback;

/*********************************************************************************************************
 *
 *                                             内部模块管理类
 *
 ********************************************************************************************************/
/**
 * 获取白板控制器
 * @return TEduBoardController  白板控制器
 **/
- (TEduBoardController *)getBoardController;
/**
 * 获取音视频实例
 * @return TRTCCloud  TRTC音视频实例
 **/
- (TRTCCloud *)getTRTCCloud;
/*********************************************************************************************************
 *
 *                                             监听回调
 *
 ********************************************************************************************************/
/**
 * 添加IM消息监听
 * @param listener  监听对象【必填】
 **/
- (void)addMessageListener:(id<TICMessageListener>)listener;
/**
 * 移除IM消息监听
 * @param listener  监听对象【必填】
 **/
- (void)removeMessageListener:(id<TICMessageListener>)listener;
/**
 * 添加音视频事件监听
 * @param listener  监听对象【必填】
 **/
- (void)addEventListener:(id<TICEventListener>)listener;
/**
 * 移除音视频事件监听
 * @param listener  监听对象【必填】
 **/
- (void)removeEventListener:(id<TICEventListener>)listener;
/**
 * 添加状态事件监听
 * @param listener  监听对象【必填】
 **/
- (void)addStatusListener:(id<TICStatusListener>)listener;
/**
 * 移除状态事件监听
 * @param listener  监听对象【必填】
 **/
- (void)removeStatusListener:(id<TICStatusListener>)listener;
/*********************************************************************************************************
 *
 *                                             录制相关
 *
 ********************************************************************************************************/
/**
 * 发送课后录制对时信息
 * @brief TIC内部进房成功后会自动发送离线录制对时信息，如果发送失败回调onTICSendOfflineRecordInfo接口且code!=0，调用此接口触发重试
 **/
- (void)sendOfflineRecordInfo;
@end

