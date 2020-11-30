#pragma once

#include <TIMCloud.h>
#include <TRTC/ITRTCCloud.h>
#include <TEduBoard.h>

#include <stdint.h>
#include <functional>
#include <vector>
#include <string>
#include <Windows.h>

#include "./jsoncpp/json.h"

#ifdef TIC_EXPORTS //若要将TIC导出为DLL,在DLL项目属性中增加预处理器TIC_EXPORTS即可
#define TIC_API __declspec(dllexport)
#else
#define TIC_API
#endif

/**
 * 内部模块
 */ 
enum TICModule{
	TICMODULE_IMSDK = 0,		//IMSDK模块
	TICMODULE_TRTC  = 1,		//TRTC模块
	TICMODULE_BOARD = 2,		//BOARD模块
	TICMODULE_TIC   = 3,		//TIC模块
};

/**
 * 课堂场景
 **/
enum TICClassScene{
	TIC_CLASS_SCENE_VIDEO_CALL = 0,	//实时通话模式，支持1000人以下场景，低延时
	TIC_CLASS_SCENE_LIVE = 1,		//直播模式，支持1000人以上场景，会增加600ms左右延时
};

/**
 * 房间角色
 * @brief 仅适用于直播模式(TIC_CLASS_SCENE_LIVE)，角色TIC_ROLE_TYPE_ANCHOR具有上行权限
 **/
enum TICRoleType{
	TIC_ROLE_TYPE_ANCHOR = 20,		//主播
	TIC_ROLE_TYPE_AUDIENCE = 21,	//观众
};

/**
 * 禁用模块
 * @brief 如果外部使用了TRTC，可以禁用TIC内部的TRTC模块。
 * @brief 如果禁用TRTC，TRTC相关初始化参数都无效
 **/
enum TICDisableModule {
	TIC_DISABLE_MODULE_NONE = 0,		//默认全部启用
	TIC_DISABLE_MODULE_TRTC = (1 << 1), //禁用TRTC
};

/**
 * TIC通用回调
 * @param module	出错的模块
 * @param code		错误码
 * @param desc		错误描述
 */ 
typedef std::function<void(TICModule /*module*/, int /*code*/, const char * /*desc*/)> TICCallback;


/**
 * IM消息回调
 */ 
struct TICMessageListener
{
	/**
	 * 收到C2C文本消息
	 * @param fromUserId		发送此消息的用户id
	 * @param text				收到消息的内容
	 */ 
	virtual void onTICRecvTextMessage(const std::string& fromUserId, const std::string& text) {}

	/**
	 * 收到C2C自定义消息
	 * @param fromUserId		发送此消息的用户id
	 * @param data				收到消息的内容
	 */ 
	virtual void onTICRecvCustomMessage(const std::string& fromUserId, const std::string& data) {}
	
	/**
	 * 收到群文本消息
	 * @param fromUserId		发送此消息的用户id
	 * @param text				收到消息的内容
	 */ 
	virtual void onTICRecvGroupTextMessage(const std::string& fromUserId, const std::string& text) {}

	/**
	 * 收到群自定义消息
	 * @param fromUserId		发送此消息的用户id
	 * @param data				收到消息的内容
	 */ 
	virtual void onTICRecvGroupCustomMessage(const std::string& fromUserId, const std::string& data) {}
	
	/**
	 * 所有消息
	 * @param jsonMsg			收到的IM消息内容
	 * @note 所有收到的消息都会在此回调进行通知，包括前面已经封装的文本和自定义消息;
	 */ 
	virtual void onTICRecvMessage(const std::string& jsonMsg) {}
};

/**
 * IM状态回调
 */ 
struct TICIMStatusListener
{
	/**
	 * 被踢下线(账号在其他设备登录)
	 */ 
	virtual void onTICForceOffline() {}

	/**
	 * Sig过期
	 */ 
	virtual void onTICUserSigExpired() {}
};

/**
 * 事件回调
 */ 
struct TICEventListener
{
	/**
	 * userId对应的远端主路画面(即摄像头)的状态通知
	 * @param userId			用户标识
	 * @param available			true:视频可播放，false:视频被关闭
	 */ 
	virtual void onTICUserVideoAvailable(const std::string& userId, bool available) {}

	/**
	 * userId对应的远端辅路画面(即屏幕分享\播片等)的状态通知
	 * @param userId			用户标识
	 * @param available			true:视频可播放，false:视频被关闭
	 */ 
	virtual void onTICUserSubStreamAvailable(const std::string& userId, bool available) {}

	/**
	 * userId对应的远端音频的状态通知
	 * @param userId			用户标识
	 * @param available			true:音频可播放，false:音频被关闭
	 */ 
	virtual void onTICUserAudioAvailable(const std::string& userId, bool available) {}

	/**
	 * 用户进入房间
	 * @param userIds			进入房间的用户id列表
	 */
	virtual void onTICMemberJoin(const std::vector<std::string>& userIds) {}

	/**
	 * 用户退出房间
	 * @param userIds			退出房间的用户id列表
	 */
	virtual void onTICMemberQuit(const std::vector<std::string>& userIds) {}

	/**
	 * 课堂被销毁
	 */
	virtual void onTICClassroomDestroy() {}

	/**
	 * 设备事件通知
	 * @param deviceId			设备ID
	 * @param type				设备类型
	 * @param state				事件类型
	 */ 
	virtual void onTICDevice(const std::string& deviceId, TRTCDeviceType type, TRTCDeviceState state) {}
};

/**
 * 课堂参数配置
 */ 
struct TICClassroomOption
{
	uint32_t classId		= 0;		//课堂ID，32位整型，取值范围[1, 4294967294]，由业务侧维护

	bool openCamera			= false;	//指示进房成功后是否自动打开摄像头
	std::string cameraId	= "";		//指示要打开的摄像头ID，传""表示打开默认摄像头		
	
	bool openMic			= false;	//指示进房成功后是否自动打开麦克风
	std::string micId		= "";		//指示要打开的麦克风ID，传""表示打开默认麦克风		
	
	HWND rendHwnd			= nullptr;	//指示用于渲染本地画面的窗口HWND
	
	TEduBoardInitParam boardInitParam;	//初始化白板参数
	TEduBoardCallback* boardCallback = nullptr; //白板事件回调监听;请在此设置白板事件监听,不推荐自己使用白板sdk的AddCallback()函数;
	
	TICClassScene classScene = TIC_CLASS_SCENE_VIDEO_CALL; //课堂场景;默认TIC_CLASS_SCENE_VIDEO_CALL
	TICRoleType roleType = TIC_ROLE_TYPE_ANCHOR; //课堂角色;只有在classScene为TIC_CLASS_SCENE_LIVE时有效，默认TIC_ROLE_TYPE_ANCHOR
	
	bool compatSaas = false; //是否兼容SaaS; 开启SaaS兼容模式，内部会多加入一个聊天群组;
};

/**
 * TIC业务管理类，主要负责课堂资源管理，互动管理
 */ 
class TIC_API TICManager
{
public:
	/**
	 * 获取TIC单例对象
	 */
	static TICManager& GetInstance();
	
	/*********************************************************************************************
	 *
	 *										一、基本流程接口
	 *
	 *********************************************************************************************/ 

	/**
	 * 初始化;
	 * @param sdkAppId			在腾讯云申请的sdkAppId
	 * @param callback			回调
	 * @return 错误码,0表示成功
	 */ 
	virtual void Init(int sdkAppId, TICCallback callback, uint32_t disableModule = TIC_DISABLE_MODULE_NONE) = 0;

	/**
	 * 释放;
	 * @param callback			回调
	 * @return 错误码,0表示成功
	 */ 
	virtual void Uninit(TICCallback callback) = 0;

	/**
	 * 登录
	 * @param userId			用户id
	 * @param userSig			IM用户鉴权票据
	 * @param callback			回调
	 */ 
	virtual void Login(const std::string& userId, const std::string& userSig, TICCallback callback) = 0;

	/**
	 * 登出
	 * @param callback			回调
	 */ 
	virtual void Logout(TICCallback callback) = 0;

	/**
	 * 创建课堂
	 * @param classId			课堂ID，32位整型，取值范围[1, 4294967294]，由业务生成和维护
	 * @param callback			回调
	 */ 
	virtual void CreateClassroom(uint32_t classId, TICClassScene classScene, TICCallback callback) = 0;

	/**
	 * 销毁课堂
	 * @param classId			课堂ID，32位整型，取值范围[1, 4294967294]，由业务生成和维护
	 * @param callback			回调
	 */ 
	virtual void DestroyClassroom(uint32_t classId, TICCallback callback) = 0;

	/**
	 * 加入课堂
	 * @param option			加入课堂参数选项，参见TICClassroomOption
	 * @param callback			回调
	 * @note 房间人数超过200人，建议启用大房间模式，详细配置请参考 https://cloud.tencent.com/document/product/680/35954#.E4.B8.87.E4.BA.BA.E5.A4.A7.E6.88.BF.E9.97.B4
	 */ 
	virtual void JoinClassroom(const TICClassroomOption& option, TICCallback callback) = 0;

	/**
	 * 退出课堂
	 * @param clearBoard		是否清空白板
	 * @param callback			回调
	 */ 
	virtual void QuitClassroom(bool clearBoard, TICCallback callback) = 0;

	/**
	 * 切换角色
	 * @param role 角色
	 * @brief 只在classScene为TIC_CLASS_SCENE_LIVE时有效
	 **/
	virtual void SwitchRole(TICRoleType role) = 0;

	/*********************************************************************************************
	 *
	 *										二、IM消息接口
	 *
	 *********************************************************************************************/

	/**
	 * 发送C2C文本消息
	 * @param userId			消息接收者
	 * @param text				文本消息内容
	 * @param callback			回调
	 */ 
	virtual void SendTextMessage(const std::string& userId, const std::string& text, TICCallback callback) = 0;

	/**
	 * 发送C2C自定义消息
	 * @param userId			消息接收者
	 * @param data				自定义消息内容
	 * @param callback			回调
	 */ 
	virtual void SendCustomMessage(const std::string& userId, const std::string& data, TICCallback callback) = 0;

	/**
	 * 发送C2C消息
	 * @param userId			消息接收者
	 * @param jsonMsg			IM消息(Json字符串)
	 * @param callback			回调
	 */ 
	virtual void SendMessage(const std::string& userId, const std::string& jsonMsg, TICCallback callback) = 0;

	/**
	 * 发送群文本消息
	 * @param text				文本消息内容
	 * @param callback			回调
	 */
	virtual void SendGroupTextMessage(const std::string& text, TICCallback callback) = 0;

	/**
	 * 发送群自定义消息
	 * @param data				自定义消息内容
	 * @param callback			回调
	 */
	virtual void SendGroupCustomMessage(const std::string& data, TICCallback callback) = 0;

	/**
	 * 发送群消息
	 * @param jsonMsg			IM消息(Json字符串)
	 * @param callback			回调
	 */
	virtual void SendGroupMessage(const std::string& jsonMsg, TICCallback callback) = 0;


	/*********************************************************************************************
	 *
	 *										三、内部模块管理接口
	 *
	 *********************************************************************************************/

	 /**
	  * 获取白板控制器
	  * @return 白板控制器
	  * @note 只有进房后才能获取，否则返回值为空;
	  */
	virtual TEduBoardController *GetBoardController() = 0;

	/**
	 * 获取音视频实例
	 * @return TRTC音视频实例
	 */
	virtual ITRTCCloud *GetTRTCCloud() = 0;

	/*********************************************************************************************
	 *
	 *										四、回调监听管理接口
	 *
	 *********************************************************************************************/
	
	/**
	 * 添加IM消息监听回调
	 * @param listener			回调
	 * @note 不能在TICMessageListener的回调中调用AddMessageListener()\RemoveMessageListener(),否则死锁;
	 */ 
	virtual void AddMessageListener(TICMessageListener *listener) = 0;

	/**
	 * 移除IM消息监听回调
	 * @param listener			回调
	 * @note 不能在TICMessageListener的回调中调用AddMessageListener()\RemoveMessageListener(),否则死锁;
	 */ 
	virtual void RemoveMessageListener(TICMessageListener *listener) = 0;

	/**
	 * 添加事件监听回调
	 * @param listener			回调
	 * @note 不能在TICEventListener的回调中调用AddEventListener()\RemoveEventListener(),否则死锁;
	 */
	virtual void AddEventListener(TICEventListener *listener) = 0;

	/**
	 * 移除事件监听回调
	 * @param listener			回调
	 * @note 不能在TICEventListener的回调中调用AddEventListener()\RemoveEventListener(),否则死锁;
	 */
	virtual void RemoveEventListener(TICEventListener *listener) = 0;

	/**
	 * 添加IM状态监听回调
	 * @param listener			回调
	 * @note 不能在TICIMStatusListener的回调中调用AddStatusListener()\RemoveStatusListener(),否则死锁;
	 */ 
	virtual void AddStatusListener(TICIMStatusListener *listener) = 0;

	/**
	 * 移除IM状态监听回调
	 * @param listener			回调
	 * @note 不能在TICIMStatusListener的回调中调用AddStatusListener()\RemoveStatusListener(),否则死锁;
	 */ 
	virtual void RemoveStatusListener(TICIMStatusListener *listener) = 0;
};
