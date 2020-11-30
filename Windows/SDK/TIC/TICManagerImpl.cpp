#include "TICManagerImpl.h"
#include <TIMCloud.h>
#include <chrono>
#include <thread>
#include <Windows.h>
#include <ShlObj.h>

#pragma comment(lib, "liteav.lib")
#pragma comment(lib, "imsdk.lib")
#pragma comment(lib, "TEduBoard.lib")

static std::string wstr2str(const std::wstring &wstr, unsigned int codePage = CP_ACP)
{
	const int nSize = WideCharToMultiByte(codePage, 0, wstr.c_str(), wstr.size(), nullptr, 0, nullptr, nullptr);
	if (nSize <= 0) return "";

	std::string str(nSize, '\0');
	WideCharToMultiByte(codePage, 0, wstr.c_str(), wstr.size(), &str[0], str.size(), nullptr, nullptr);

	return str;
}

TICManagerImpl::TICManagerImpl()
{
	
}

TICManagerImpl::~TICManagerImpl()
{
	destroyTRTCShareInstance();
}

void TICManagerImpl::Init(int sdkappid, TICCallback callback, uint32_t disableModule)
{
	TICCallbackUtil util(this, callback);
	if (sdkAppId_ != 0) {
		util.IMCallback(0, "IMSDK init succeed");
		return;
	}

	sdkAppId_ = sdkappid;

	disableTRTC_ = ((disableModule & TIC_DISABLE_MODULE_TRTC) != 0);

	timRecvNewMsgCallback_ = [](const char *json_msg_array, const void *user_data) {
		TICManagerImpl *pThis = (TICManagerImpl*)user_data;
		pThis->OnIMNewMsg(json_msg_array);
	};
	TIMAddRecvNewMsgCallback(timRecvNewMsgCallback_, this);

	TIMSetKickedOfflineCallback([](const void *user_data) {
		TICManagerImpl *pThis = (TICManagerImpl*)user_data;
		pThis->OnIMKickedOffline();
	}, this);

	TIMSetUserSigExpiredCallback([](const void *user_data) {
		TICManagerImpl *pThis = (TICManagerImpl*)user_data;
		pThis->OnIMUserSigExpired();
	}, this);

	TIMSetGroupTipsEventCallback([](const char* json_group_tip_array, const void* user_data) {
		TICManagerImpl *pThis = (TICManagerImpl*)user_data;
		pThis->OnIMGroupTipsEvent(json_group_tip_array);
	}, this);

	Json::Value json_user_config;
	json_user_config[kTIMUserConfigIsSyncReport] = true; //服务端删掉已读状态
	Json::Value json_config;
	json_config[kTIMSetConfigUserConfig] = json_user_config;
	TIMSetConfig(json_config.toStyledString().c_str(), nullptr, nullptr);

	//获取APPDATA路径
	wchar_t my_documents[MAX_PATH] = { 0 };
	HRESULT result = SHGetFolderPath(NULL, CSIDL_APPDATA, NULL, SHGFP_TYPE_CURRENT, my_documents);
	std::wstring szIMLogDir = my_documents;
	szIMLogDir += L"\\Tencent\\imsdk";

	std::wstring configFile = szIMLogDir + L"\\imsdk_config";
	DeleteFileW(configFile.c_str());

	//指定IMSDK日志路径
	Json::Value json_value_init;
	json_value_init[kTIMSdkConfigLogFilePath] = wstr2str(szIMLogDir, CP_UTF8).c_str();
	json_value_init[kTIMSdkConfigConfigFilePath] = wstr2str(szIMLogDir, CP_UTF8).c_str();

	int ret = TIMInit(sdkappid, json_value_init.toStyledString().c_str());

	if (!disableTRTC_) {
		getTRTCShareInstance()->addCallback(this);
	}

	if(ret == TIM_SUCC) {
		util.IMCallback(0, "IMSDK init succeed");
	}
	else {
		util.IMCallback(ret, "IMSDK init failed");
	}
}

void TICManagerImpl::Uninit(TICCallback callback)
{
	sdkAppId_ = 0;
	TIMRemoveRecvNewMsgCallback(timRecvNewMsgCallback_);
	TIMSetKickedOfflineCallback(nullptr, nullptr);
	TIMSetUserSigExpiredCallback(nullptr, nullptr);

	int ret = TIMUninit();

	if (!disableTRTC_) {
		getTRTCShareInstance()->removeCallback(this);
	}

	TICCallbackUtil util(this, callback);
	util.IMCallback(ret, (ret == 0) ? "" : "IMSDK unInit failed");
}

void TICManagerImpl::Login(const std::string& userId, const std::string& userSig, TICCallback callback)
{
	userId_ = userId;
	userSig_ = userSig;

	int ret = TIMLogin(userId.c_str(), userSig.c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK login failed");
	}
}

void TICManagerImpl::Logout(TICCallback callback)
{
	int ret = TIMLogout([](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK logout failed");
	}
}

void TICManagerImpl::CreateClassroom(uint32_t classId, TICClassScene classScene, TICCallback callback)
{
	std::string groupId = std::to_string(classId);
	Json::Value json_value_param;
	json_value_param[kTIMCreateGroupParamGroupId] = groupId;
	json_value_param[kTIMCreateGroupParamGroupType] = (classScene == TIC_CLASS_SCENE_LIVE) ? kTIMGroup_AVChatRoom : kTIMGroup_Public;
	json_value_param[kTIMCreateGroupParamGroupName] = groupId;
	json_value_param[kTIMCreateGroupParamGroupMemberArray] = Json::Value(Json::arrayValue);
	json_value_param[kTIMCreateGroupParamAddOption] = kTIMGroupAddOpt_Any;

	int ret = TIMGroupCreate(json_value_param.toStyledString().c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK create group failed");
	}
}

void TICManagerImpl::DestroyClassroom(uint32_t classId, TICCallback callback)
{
	std::string groupId = std::to_string(classId);
	int ret = TIMGroupDelete(groupId.c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK destroy group failed");
	}
}

void TICManagerImpl::JoinClassroom(const TICClassroomOption &option, TICCallback callback)
{
	classId_ = option.classId;
	groupId_ = std::to_string(classId_);
	groupIdChat_ = groupId_ + "_chat";
	openCamera_ = option.openCamera;
	cameraId_ = option.cameraId;
	openMic_ = option.openMic;
	micId_ = option.micId;
	rendHwnd_ = option.rendHwnd;
	boardInitParam_.copy(option.boardInitParam);
	boardCallback_ = option.boardCallback;
	classScene_ = option.classScene;
	roleType_ = option.roleType;
	compatSaas_ = option.compatSaas;

	JoinIMGroup(groupId_.c_str(), [this, callback](TICModule module, int code, const char * desc) {
		if (code != TIM_SUCC)
		{
			TICCallbackUtil util(this, callback);
			util.IMCallback(code, desc);
			return;
		}

		//不用兼容Saas
		if (!compatSaas_) {
			OnJoinIMGroupComplete(callback);
			return;
		}

		//兼容Saas
		JoinIMGroup(groupIdChat_.c_str(), [this, callback](TICModule module, int code, const char * desc) {
			if (code != TIM_SUCC)
			{
				TICCallbackUtil util(this, callback);
				util.IMCallback(code, desc);
				return;
			}

			OnJoinIMGroupComplete(callback);
		});
	});
}

void TICManagerImpl::QuitClassroom(bool clearBoard, TICCallback callback)
{
	StopSyncTimer();
	TRTCExitRoom(); //执行TRTC退房
	BoardDestroy(clearBoard); //销毁白板控制器

	QuitIMGroup(groupId_.c_str(), [this, callback](TICModule module, int code, const char * desc) {
		if (!compatSaas_) {
			TICCallbackUtil util(this, callback);
			util.IMCallback(code, desc);
			return;
		}

		QuitIMGroup(groupIdChat_.c_str(), [this, callback](TICModule module, int code, const char * desc) {
			TICCallbackUtil util(this, callback);
			util.IMCallback(code, desc);
			return;
		});
	});
}

void TICManagerImpl::SwitchRole(TICRoleType role)
{
	if (disableTRTC_) return;

	getTRTCShareInstance()->switchRole((TRTCRoleType)role);
	if (role == TIC_ROLE_TYPE_ANCHOR)
	{
		StartSyncTimer();
	}
	else
	{
		StopSyncTimer();
	}

	roleType_ = role;
}

void TICManagerImpl::SendTextMessage(const std::string& userId, const std::string& text, TICCallback callback)
{
	Json::Value jsonMsgElem;
	jsonMsgElem[kTIMElemType] = kTIMElem_Text;
	jsonMsgElem[kTIMTextElemContent] = text;

	Json::Value jsonMessage;
	jsonMessage[kTIMMsgElemArray].append(jsonMsgElem);
	jsonMessage[kTIMMsgSender] = userId_;
	jsonMessage[kTIMMsgClientTime] = time(NULL);
	jsonMessage[kTIMMsgServerTime] = time(NULL);
	jsonMessage[kTIMMsgConvId] = userId;
	jsonMessage[kTIMMsgConvType] = kTIMConv_C2C;

	int ret = TIMMsgSendNewMsg(userId.c_str(), kTIMConv_C2C, jsonMessage.toStyledString().c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK send c2c text message failed");
	}
}

void TICManagerImpl::SendCustomMessage(const std::string& userId, const std::string& data, TICCallback callback)
{
	Json::Value jsonMsgElem;
	jsonMsgElem[kTIMElemType] = kTIMElem_Custom;
	jsonMsgElem[kTIMCustomElemData] = data;

	Json::Value jsonMessage;
	jsonMessage[kTIMMsgElemArray].append(jsonMsgElem);
	jsonMessage[kTIMMsgSender] = userId_;
	jsonMessage[kTIMMsgClientTime] = time(NULL);
	jsonMessage[kTIMMsgServerTime] = time(NULL);
	jsonMessage[kTIMMsgConvId] = userId;
	jsonMessage[kTIMMsgConvType] = kTIMConv_C2C;

	int ret = TIMMsgSendNewMsg(userId.c_str(), kTIMConv_C2C, jsonMessage.toStyledString().c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK send c2c custom message failed");
	}
}

void TICManagerImpl::SendMessage(const std::string& userId, const std::string& jsonMsg, TICCallback callback)
{
	int ret = TIMMsgSendNewMsg(userId.c_str(), kTIMConv_C2C, jsonMsg.c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK send c2c message failed");
	}
}

void TICManagerImpl::SendGroupTextMessage(const std::string& text, TICCallback callback)
{
	Json::Value jsonMsgElem;
	jsonMsgElem[kTIMElemType] = kTIMElem_Text;
	jsonMsgElem[kTIMTextElemContent] = text;

	std::string groupId = compatSaas_ ? groupIdChat_ : groupId_;

	Json::Value jsonMessage;
	jsonMessage[kTIMMsgElemArray].append(jsonMsgElem);
	jsonMessage[kTIMMsgSender] = userId_;
	jsonMessage[kTIMMsgClientTime] = time(NULL);
	jsonMessage[kTIMMsgServerTime] = time(NULL);
	jsonMessage[kTIMMsgConvId] = groupId;
	jsonMessage[kTIMMsgConvType] = kTIMConv_Group;

	int ret = TIMMsgSendNewMsg(groupId.c_str(), kTIMConv_Group, jsonMessage.toStyledString().c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK send group text message failed");
	}
}

void TICManagerImpl::SendGroupCustomMessage(const std::string& data, TICCallback callback)
{
	Json::Value jsonMsgElem;
	jsonMsgElem[kTIMElemType] = kTIMElem_Custom;
	jsonMsgElem[kTIMCustomElemData] = data;

	std::string groupId = compatSaas_ ? groupIdChat_ : groupId_;

	Json::Value jsonMessage;
	jsonMessage[kTIMMsgElemArray].append(jsonMsgElem);
	jsonMessage[kTIMMsgSender] = userId_;
	jsonMessage[kTIMMsgClientTime] = time(NULL);
	jsonMessage[kTIMMsgServerTime] = time(NULL);
	jsonMessage[kTIMMsgConvId] = groupId;
	jsonMessage[kTIMMsgConvType] = kTIMConv_Group;

	int ret = TIMMsgSendNewMsg(groupId.c_str(), kTIMConv_Group, jsonMessage.toStyledString().c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK send group custom message failed");
	}
}

void TICManagerImpl::SendGroupMessage(const std::string& jsonMsg, TICCallback callback)
{
	std::string groupId = compatSaas_ ? groupIdChat_ : groupId_;
	int ret = TIMMsgSendNewMsg(groupId.c_str(), kTIMConv_Group, jsonMsg.c_str(), [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK send group text message failed");
	}
}

TEduBoardController *TICManagerImpl::GetBoardController()
{
	return boardCtrl_;
}

ITRTCCloud *TICManagerImpl::GetTRTCCloud()
{
	return getTRTCShareInstance();
}

void TICManagerImpl::AddMessageListener(TICMessageListener *listener)
{
	if (!listener) return;

	std::lock_guard<std::mutex> lk(mutMsgListeners_);
	for (auto iter = msgListeners_.begin(); iter != msgListeners_.end(); ++iter)
	{
		if (*iter == listener) return;
	}
	msgListeners_.push_back(listener);
}

void TICManagerImpl::RemoveMessageListener(TICMessageListener *listener)
{
	std::lock_guard<std::mutex> lk(mutMsgListeners_);
	for (auto iter = msgListeners_.begin(); iter != msgListeners_.end(); ++iter)
	{
		if (*iter == listener)
		{
			msgListeners_.erase(iter);
			break;
		}
	}
}

void TICManagerImpl::AddEventListener(TICEventListener *listener)
{
	if (!listener) return;

	std::lock_guard<std::mutex> lk(mutEventListeners_);
	for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
	{
		if (*iter == listener) return;
	}
	eventListeners_.push_back(listener);
}

void TICManagerImpl::RemoveEventListener(TICEventListener *listener)
{
	std::lock_guard<std::mutex> lk(mutEventListeners_);
	for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
	{
		if (*iter == listener)
		{
			eventListeners_.erase(iter);
			break;
		}
	}
}

void TICManagerImpl::AddStatusListener(TICIMStatusListener *listener)
{
	if (!listener) return;

	std::lock_guard<std::mutex> lk(mutStatusListeners_);
	for (auto iter = statusListeners_.begin(); iter != statusListeners_.end(); ++iter)
	{
		if (*iter == listener) return;
	}
	statusListeners_.push_back(listener);
}

void TICManagerImpl::RemoveStatusListener(TICIMStatusListener *listener)
{
	std::lock_guard<std::mutex> lk(mutStatusListeners_);
	for (auto iter = statusListeners_.begin(); iter != statusListeners_.end(); ++iter)
	{
		if (*iter == listener)
		{
			statusListeners_.erase(iter);
			break;
		}
	}
}

void TICManagerImpl::onError(TXLiteAVError errCode, const char *errMsg, void *arg)
{
	if (errCode >= ERR_USER_SIG_INVALID && errCode <= ERR_ROOM_ENTER_FAIL) {
		if (joinClassroomCallbackUtil) { //进房失败，错误回调
			joinClassroomCallbackUtil->TRTCCallback(errCode, errMsg);
			delete joinClassroomCallbackUtil;
			joinClassroomCallbackUtil = nullptr;
			return;
		}
	}
	//TODO TRTC 错误处理
}

void TICManagerImpl::onWarning(TXLiteAVWarning warningCode, const char *warningMsg, void *arg)
{
	//TODO TRTC 警告处理
}

void TICManagerImpl::onEnterRoom(int result)
{
	bInTRTCRoom_ = true;

	//TRTC进房成功，触发进房回调
	if (joinClassroomCallbackUtil) {
		joinClassroomCallbackUtil->BoardCallback(0, "Join classroom success");
		delete joinClassroomCallbackUtil;
		joinClassroomCallbackUtil = nullptr;
	}

	if (!disableTRTC_) {
		if (classScene_ == TIC_CLASS_SCENE_LIVE && roleType_ == TIC_ROLE_TYPE_ANCHOR)
		{
			StartSyncTimer();
		}
	}
}

void TICManagerImpl::onExitRoom(int reason)
{
	bInTRTCRoom_ = false;
}

void TICManagerImpl::onConnectOtherRoom(const char * userId, TXLiteAVError errCode, const char *errMsg)
{
}

void TICManagerImpl::onDisconnectOtherRoom(TXLiteAVError errCode, const char *errMsg)
{
}

void TICManagerImpl::onUserEnter(const char *userId)
{
}

void TICManagerImpl::onUserExit(const char *userId, int reason)
{
	onUserAudioAvailable(userId, false);
	onUserVideoAvailable(userId, false);
	onUserSubStreamAvailable(userId, false);
}

void TICManagerImpl::onUserVideoAvailable(const char *userId, bool available)
{
	std::lock_guard<std::mutex> lk(mutEventListeners_);
	for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
	{
		(*iter)->onTICUserVideoAvailable(userId, available);
	}
}

void TICManagerImpl::onUserSubStreamAvailable(const char *userId, bool available)
{
	std::lock_guard<std::mutex> lk(mutEventListeners_);
	for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
	{
		(*iter)->onTICUserSubStreamAvailable(userId, available);
	}
}

void TICManagerImpl::onUserAudioAvailable(const char *userId, bool available)
{
	std::lock_guard<std::mutex> lk(mutEventListeners_);
	for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
	{
		(*iter)->onTICUserAudioAvailable(userId, available);
	}
}

void TICManagerImpl::onDeviceChange(const char * deviceId, TRTCDeviceType type, TRTCDeviceState state)
{
	std::lock_guard<std::mutex> lk(mutEventListeners_);
	for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
	{
		(*iter)->onTICDevice(deviceId, type, state);
	}
}

void TICManagerImpl::onRecvSEIMsg(const char* userId, const uint8_t* message, uint32_t msgSize)
{
	if (!boardCtrl_) return;

	Json::Reader reader;
	Json::Value root;
	if (!reader.parse(std::string((const char*)message, msgSize), root)) return;
	if (root["syncTime"].isNull()) return;
	uint64_t syncTime = root["syncTime"].asUInt64();
	
	boardCtrl_->SyncRemoteTime(userId, syncTime);
}

void TICManagerImpl::onTEBError(TEduBoardErrorCode code, const char * msg)
{
	if (code == TEDU_BOARD_ERROR_INIT || code == TEDU_BOARD_ERROR_AUTH || code == TEDU_BOARD_ERROR_TIM_INVALID) {
		if (joinClassroomCallbackUtil) { //白板初始化失败、鉴权失败、腾讯IMSDK调用失败，错误回调
			joinClassroomCallbackUtil->BoardCallback(code, msg);
			delete joinClassroomCallbackUtil;
			joinClassroomCallbackUtil = nullptr;
			return;
		}
	}
	//TODO Board 错误处理
}

void TICManagerImpl::onTEBWarning(TEduBoardWarningCode code, const char * msg)
{
	//TODO Board 警告处理
}

void TICManagerImpl::onTEBInit()
{
	//白板初始化成功，执行TRTC进房
	TRTCEnterRoom();
}

void TICManagerImpl::JoinIMGroup(const char* groupId, TICCallback callback)
{
	int ret = TIMGroupJoin(groupId, NULL, [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		if (code == 10013) { // 已在房间，忽略
			code = TIM_SUCC;
		}
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK join group failed");
	}
}

void TICManagerImpl::QuitIMGroup(const char* groupId, TICCallback callback)
{
	int ret = TIMGroupQuit(groupId, [](int32_t code, const char *desc, const char *json_params, const void *user_data) {
		TICCallbackUtil *util = (TICCallbackUtil*)user_data;
		if (code == ERR_SVR_GROUP_SUPER_NOT_ALLOW_QUIT || code == ERR_SVR_GROUP_NOT_FOUND) //群主不允许退出群(只能解散群)||群组已解散;
		{
			code = TIM_SUCC;
			desc = "";
		}
		util->IMCallback(code, desc);
		delete util;
	}, new TICCallbackUtil(this, callback));
	if (ret != TIM_SUCC) //返回值不是TIM_SUCC时不会触发回调，因此要自己调用回调
	{
		TICCallbackUtil util(this, callback);
		util.IMCallback(ret, "IMSDK quit group failed");
	}
}

void TICManagerImpl::OnJoinIMGroupComplete(TICCallback callback)
{
	joinClassroomCallbackUtil = new TICCallbackUtil(this, callback); //记录下回调信息
	BoardCreateAndInit(); //创建白板及初始化
}

void TICManagerImpl::TRTCEnterRoom()
{
	if (disableTRTC_) {
		onEnterRoom(0);
		return;
	}

	//填充进房参数并进房
	TRTCParams params;
	params.sdkAppId = sdkAppId_;
	params.userId = userId_.c_str();
	params.userSig = userSig_.c_str();
	params.roomId = classId_;
	params.role = TRTCRoleType(roleType_);
	//bool (ITRTCCloud::*ptr)(const uint8_t*, uint32_t, int32_t) = &ITRTCCloud::sendSEIMsg;
	//printf("sendSEIMsg Ptr: %p\n", ptr);
	getTRTCShareInstance()->enterRoom(params, TRTCAppScene(classScene_));

	//判断是否需要打开摄像头设备
	if (openCamera_) {
		//判断是否需要选择摄像头设备
		if (!cameraId_.empty()) {
			getTRTCShareInstance()->setCurrentCameraDevice(cameraId_.c_str());
		}
		getTRTCShareInstance()->startLocalPreview(rendHwnd_);
	}
	//判断是否需要打开麦克风设备
	if (openMic_) {
		//判断是否需要选择麦克风设备
		if (!micId_.empty()) {
			getTRTCShareInstance()->setCurrentMicDevice(micId_.c_str());
		}
		getTRTCShareInstance()->startLocalAudio();
	}
}

void TICManagerImpl::BoardCreateAndInit()
{
	//创建白板控制器
	boardCtrl_ = CreateTEduBoardController();
	if (boardCtrl_) {
		// 设置回调
		boardCtrl_->AddCallback(this);
		if (boardCallback_) boardCtrl_->AddCallback(boardCallback_);
		//填充参数并初始化白板
		TEduBoardAuthParam authParam;
		authParam.sdkAppId = sdkAppId_;
		authParam.userId = userId_.c_str();
		authParam.userSig = userSig_.c_str();
		TEduBoardInitParam initParam = boardInitParam_.get();
		boardCtrl_->Init(authParam, classId_, initParam);
	}
	else {
		this->onTEBError(TEDU_BOARD_ERROR_INIT, "CreateTEduBoardController method sho");
	}
}

void TICManagerImpl::BoardDestroy(bool clearBoard)
{
	if(clearBoard) boardCtrl_->Reset();
	boardCtrl_->RemoveCallback(this);
	if (boardCallback_)
	{
		boardCtrl_->RemoveCallback(boardCallback_);
		boardCallback_ = nullptr;
	}
	DestroyTEduBoardController(&boardCtrl_);
}

void TICManagerImpl::TRTCExitRoom()
{
	if (disableTRTC_) {
		onExitRoom(0);
		return;
	}

	if (openCamera_) {
		getTRTCShareInstance()->stopLocalPreview();
	}
	if (openMic_) {
		getTRTCShareInstance()->stopLocalAudio();
	}
	getTRTCShareInstance()->exitRoom();
}

void TICManagerImpl::StartSyncTimer()
{
	StopSyncTimer();
	syncTimer_ = ::SetTimer(NULL, 0, 5000, [](HWND hwnd, UINT msg, UINT_PTR timerid, DWORD dwTime) {
		TICManagerImpl* pThis = static_cast<TICManagerImpl*>(&TICManager::GetInstance());
		if (pThis) pThis->SendSEISyncMsg();
	});
}

void TICManagerImpl::StopSyncTimer()
{
	if (syncTimer_ != 0)
	{
		::KillTimer(0, syncTimer_);
		syncTimer_ = 0;
	}
}

void TICManagerImpl::SendSEISyncMsg()
{
	if (!boardCtrl_) return;

	Json::Value root;
	root["syncTime"] = boardCtrl_->GetSyncTime();
	Json::FastWriter writer;
	writer.omitEndingLineFeed();
	std::string strSend = writer.write(root);

	bool bRet = getTRTCShareInstance()->sendSEIMsg((const uint8_t*)strSend.data(), strSend.length(), 1);
}

void TICManagerImpl::OnIMNewMsg(const char *json_msg_array)
{
	if (strlen(json_msg_array) == 0) return;

	Json::Reader reader;
	Json::Value jsonMsgs;
	if (!reader.parse(json_msg_array, jsonMsgs)) return;

	bool bFilted = false; //是否为需要过滤掉的消息
	for (Json::ArrayIndex i = 0; i < jsonMsgs.size(); ++i)
	{
		const Json::Value &jsonMsg = jsonMsgs[i];
		TIMConvType convType = (TIMConvType)jsonMsg[kTIMMsgConvType].asInt();
		switch (convType)
		{
		case kTIMConv_C2C:
		{
			OnIMC2CMsg(jsonMsg);
			break;
		}
		case kTIMConv_Group:
		{
			bFilted = OnIMGroupMsg(jsonMsg);
			break;
		}
		case kTIMConv_System:
		{
			OnIMSystemMsg(jsonMsg);
			break;
		}
		default: break;
		}
	}

	if (!bFilted)
	{
		std::lock_guard<std::mutex> lk(mutMsgListeners_);
		for (auto iter = msgListeners_.begin(); iter != msgListeners_.end(); ++iter)
		{
			(*iter)->onTICRecvMessage(json_msg_array);
		}
	}
}

void TICManagerImpl::OnIMC2CMsg(const Json::Value  &jsonMsg)
{
	std::string szFromUserId = jsonMsg[kTIMMsgSender].asString();

	Json::Value jsonMsgElems = jsonMsg[kTIMMsgElemArray];
	for (Json::ArrayIndex i = 0; i < jsonMsgElems.size(); ++i)
	{
		TIMElemType eleType = (TIMElemType)jsonMsgElems[i][kTIMElemType].asInt();
		switch (eleType)
		{
		case kTIMElem_Text:
		{
			std::string szText = jsonMsgElems[i][kTIMTextElemContent].asString();
			std::lock_guard<std::mutex> lk(mutMsgListeners_);
			for (auto iter = msgListeners_.begin(); iter != msgListeners_.end(); ++iter)
			{
				(*iter)->onTICRecvTextMessage(szFromUserId, szText);
			}
			break;
		}
		case kTIMElem_Custom:
		{
			std::string szCustomData = jsonMsgElems[i][kTIMCustomElemData].asString();
			std::lock_guard<std::mutex> lk(mutMsgListeners_);
			for (auto iter = msgListeners_.begin(); iter != msgListeners_.end(); ++iter)
			{
				(*iter)->onTICRecvCustomMessage(szFromUserId, szCustomData);
			}
			break;
		}
		default: break;
		}
	}
}

bool TICManagerImpl::OnIMGroupMsg(const Json::Value &jsonMsg)
{
	bool bFilted = false; //是否为需要过滤掉的消息

	std::string szGroupId = jsonMsg[kTIMMsgConvId].asString();
	std::string szFromUserId = jsonMsg[kTIMMsgSender].asString();

	if (compatSaas_) { //兼容Saas
		if (szGroupId == groupId_) return true; //过滤掉白板信令群
	}
	else {
		if (szGroupId != groupId_) return false; //不处理非当前课堂对应群组的消息
	}

	Json::Value jsonMsgElems = jsonMsg[kTIMMsgElemArray];
	for (Json::ArrayIndex i = 0; i < jsonMsgElems.size(); ++i)
	{
		TIMElemType eleType = (TIMElemType)jsonMsgElems[i][kTIMElemType].asInt();
		switch (eleType)
		{
		case kTIMElem_Text:
		{
			std::string szText = jsonMsgElems[i][kTIMTextElemContent].asString();
			std::lock_guard<std::mutex> lk(mutMsgListeners_);
			for (auto iter = msgListeners_.begin(); iter != msgListeners_.end(); ++iter)
			{
				(*iter)->onTICRecvGroupTextMessage(szFromUserId, szText);
			}
			break;
		}
		case kTIMElem_Custom:
		{
			std::string szExt = jsonMsgElems[i][kTIMCustomElemExt].asString();
			if (szExt == "TXWhiteBoardExt" || szExt == "TXConferenceExt") //过滤掉内部信令相关的消息
			{
				bFilted = true;
				break;
			}

			std::string szCustomData = jsonMsgElems[i][kTIMCustomElemData].asString();
			std::lock_guard<std::mutex> lk(mutMsgListeners_);
			for (auto iter = msgListeners_.begin(); iter != msgListeners_.end(); ++iter)
			{
				(*iter)->onTICRecvGroupCustomMessage(szFromUserId, szCustomData);
			}
			break;
		}
		case kTIMElem_GroupTips:
		{
			break;
		}
		default: break;
		}
	}

	return bFilted;
}

void TICManagerImpl::OnIMSystemMsg(const Json::Value  &jsonMsg)
{
	Json::Value jsonMsgElems = jsonMsg[kTIMMsgElemArray];
	for (Json::ArrayIndex i = 0; i < jsonMsgElems.size(); ++i)
	{
		TIMElemType eleType = (TIMElemType)jsonMsgElems[i][kTIMElemType].asInt();
		switch (eleType)
		{
		case kTIMElem_GroupReport:
		{
			TIMGroupReportType groupReportType = (TIMGroupReportType)jsonMsgElems[i][kTIMGroupReportElemReportType].asInt();
			if (groupReportType == kTIMGroupReport_Delete)
			{
				std::string szReportGroupId = jsonMsgElems[i][kTIMGroupReportElemGroupId].asString();

				std::string groupId = compatSaas_ ? groupIdChat_ : groupId_;
				if (groupId == szReportGroupId)
				{
					std::lock_guard<std::mutex> lk(mutEventListeners_);
					for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
					{
						(*iter)->onTICClassroomDestroy();
					}
				}
			}
			break;
		}
		default: 
			break;
		}
	}
}

void TICManagerImpl::OnIMKickedOffline()
{
	if(boardCtrl_) BoardDestroy(false); //销毁白板控制器
	if(bInTRTCRoom_) TRTCExitRoom(); //退出TRTC房间

	std::lock_guard<std::mutex> lk(mutStatusListeners_);
	for (auto iter = statusListeners_.begin(); iter != statusListeners_.end(); ++iter)
	{
		(*iter)->onTICForceOffline();
	}
}

void TICManagerImpl::OnIMUserSigExpired()
{
	if (boardCtrl_) BoardDestroy(false); //销毁白板控制器
	if (bInTRTCRoom_) TRTCExitRoom(); //退出TRTC房间

	std::lock_guard<std::mutex> lk(mutStatusListeners_);
	for (auto iter = statusListeners_.begin(); iter != statusListeners_.end(); ++iter)
	{
		(*iter)->onTICUserSigExpired();
	}
}

void TICManagerImpl::OnIMGroupTipsEvent(const char *jsonTips)
{
	Json::Value root;
	if (!Json::Reader().parse(jsonTips, root)) return;

	std::string szGroupId = root[kTIMGroupTipsElemGroupId].asString();
	std::string groupId = compatSaas_ ? groupIdChat_ : groupId_;
	if (szGroupId != groupId) return; //不处理非当前课堂对应群组的事件通知

	TIMGroupTipType groupTipType = (TIMGroupTipType)root[kTIMGroupTipsElemTipType].asInt();
	if (groupTipType == kTIMGroupTip_Invite) //进群
	{
		std::vector<std::string> userIds;
		const Json::Value& userArray = root[kTIMGroupTipsElemUserArray];
		for (Json::ArrayIndex idx = 0; idx < userArray.size(); ++idx)
		{
			std::string szUserId = userArray[idx].asString();
			if (szUserId != userId_) userIds.emplace_back(szUserId);
		}
		std::lock_guard<std::mutex> lk(mutEventListeners_);
		for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
		{
			(*iter)->onTICMemberJoin(userIds);
		}
	}
	else if (groupTipType == kTIMGroupTip_Quit) //退群
	{
		std::vector<std::string> userIds;
		std::string userId = root[kTIMGroupTipsElemOpUser].asString();
		userIds.emplace_back(userId);
		std::lock_guard<std::mutex> lk(mutEventListeners_);
		for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
		{
			(*iter)->onTICMemberQuit(userIds);
		}
	}
	else if (groupTipType == kTIMGroupTip_Kick) //踢出群
	{
		std::vector<std::string> userIds;
		const Json::Value& userArray = root[kTIMGroupTipsElemUserArray];
		for (Json::ArrayIndex idx = 0; idx < userArray.size(); ++idx)
		{
			userIds.emplace_back(userArray[idx].asString());
		}
		std::lock_guard<std::mutex> lk(mutEventListeners_);
		for (auto iter = eventListeners_.begin(); iter != eventListeners_.end(); ++iter)
		{
			(*iter)->onTICMemberQuit(userIds);
		}
	}
}

