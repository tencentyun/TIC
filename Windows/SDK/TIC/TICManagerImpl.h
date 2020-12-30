//
//  Copyright © 2019 Tencent. All rights reserved.
//

#pragma once

#include <mutex>
#include "TICManager.h"

struct TICBoardInitParam {
  std::string ratio;
  bool drawEnable;
  TEduBoardColor globalBackgroundColor;
  TEduBoardToolType toolType;
  TEduBoardColor brushColor;
  uint32_t brushThin;
  TEduBoardColor textColor;
  uint32_t textSize;
  TEduBoardTextStyle textStyle;
  bool timSync;
  bool dataSyncEnable;
  uint32_t preloadDepth;
  double smoothLevel;
  TEduBoardContentFitMode contentFitMode;

  void copy(const TEduBoardInitParam &param) {
    ratio = param.ratio;
    drawEnable = param.drawEnable;
    globalBackgroundColor = param.globalBackgroundColor;
    toolType = param.toolType;
    brushColor = param.brushColor;
    brushThin = param.brushThin;
    textColor = param.textColor;
    textSize = param.textSize;
    textStyle = param.textStyle;
    timSync = param.timSync;
    dataSyncEnable = param.dataSyncEnable;
    preloadDepth = param.preloadDepth;
    smoothLevel = param.smoothLevel;
    contentFitMode = param.contentFitMode;
  }

  TEduBoardInitParam get() {
    TEduBoardInitParam param;
    param.ratio = ratio.c_str();
    param.drawEnable = drawEnable;
    param.globalBackgroundColor = globalBackgroundColor;
    param.toolType = toolType;
    param.brushColor = brushColor;
    param.brushThin = brushThin;
    param.textColor = textColor;
    param.textSize = textSize;
    param.textStyle = textStyle;
    param.timSync = timSync;
    param.dataSyncEnable = dataSyncEnable;
    param.preloadDepth = preloadDepth;
    param.smoothLevel = smoothLevel;
    param.contentFitMode = contentFitMode;
    return param;
  }
};

class TICManagerImpl;

struct TICCallbackUtil {
  TICManagerImpl *pThis = nullptr;
  TICCallback callback = nullptr;

  TICCallbackUtil(TICManagerImpl *pThis, TICCallback callback)
      : pThis(pThis), callback(callback) {

  }

  void IMCallback(int code, const char *desc) {
    if (callback) {
      callback(TICMODULE_IMSDK, code, desc);
    }
  }

  void TRTCCallback(int code, const char *desc) {
    if (callback) {
      callback(TICMODULE_TRTC, code, desc);
    }
  }

  void BoardCallback(int code, const char *desc) {
    if (callback) {
      callback(TICMODULE_BOARD, code, desc);
    }
  }
};

class TICManagerImpl : public TICManager, public ITRTCCloudCallback, public TEduBoardCallback {
 public:
  TICManagerImpl();
  ~TICManagerImpl();

  //TICManager
  virtual void Init(int sdkAppId, TICCallback callback, uint32_t disableModule) override;
  virtual void Uninit(TICCallback callback) override;

  virtual void Login(const std::string &userId, const std::string &userSig, TICCallback callback) override;
  virtual void Logout(TICCallback callback) override;

  virtual void CreateClassroom(uint32_t classId, TICClassScene classScene, TICCallback callback) override;
  virtual void DestroyClassroom(uint32_t classId, TICCallback callback) override;

  virtual void JoinClassroom(const TICClassroomOption &option, TICCallback callback) override;
  virtual void QuitClassroom(bool clearBoard, TICCallback callback) override;

  virtual void SwitchRole(TICRoleType role) override;

  virtual void SendTextMessage(const std::string &userId, const std::string &text, TICCallback callback) override;
  virtual void SendCustomMessage(const std::string &userId, const std::string &data, TICCallback callback) override;
  virtual void SendMessage(const std::string &userId, const std::string &jsonMsg, TICCallback callback) override;

  virtual void SendGroupTextMessage(const std::string &text, TICCallback callback) override;
  virtual void SendGroupCustomMessage(const std::string &data, TICCallback callback) override;
  virtual void SendGroupMessage(const std::string &jsonMsg, TICCallback callback) override;

  virtual TEduBoardController *GetBoardController() override;
  virtual ITRTCCloud *GetTRTCCloud() override;

  virtual void AddMessageListener(TICMessageListener *listener) override;
  virtual void RemoveMessageListener(TICMessageListener *listener) override;

  virtual void AddEventListener(TICEventListener *listener) override;
  virtual void RemoveEventListener(TICEventListener *listener) override;

  virtual void AddStatusListener(TICIMStatusListener *listener) override;
  virtual void RemoveStatusListener(TICIMStatusListener *listener) override;

 private:
  // ͨ�� ITRTCCloudCallback �̳�
  virtual void onError(TXLiteAVError errCode, const char *errMsg, void *arg) override;
  virtual void onWarning(TXLiteAVWarning warningCode, const char *warningMsg, void *arg) override;
  virtual void onEnterRoom(int result) override;
  virtual void onExitRoom(int reason) override;
  virtual void onConnectOtherRoom(const char *userId, TXLiteAVError errCode, const char *errMsg) override;
  virtual void onDisconnectOtherRoom(TXLiteAVError errCode, const char *errMsg) override;
  virtual void onUserEnter(const char *userId) override;
  virtual void onUserExit(const char *userId, int reason) override;
  virtual void onUserVideoAvailable(const char *userId, bool available) override;
  virtual void onUserSubStreamAvailable(const char *userId, bool available) override;
  virtual void onUserAudioAvailable(const char *userId, bool available) override;
  virtual void onDeviceChange(const char *deviceId, TRTCDeviceType type, TRTCDeviceState state) override;
  virtual void onRecvSEIMsg(const char *userId, const uint8_t *message, uint32_t msgSize) override;

  // ͨ�� TEduBoardCallback �̳�
  virtual void onTEBError(TEduBoardErrorCode code, const char *msg) override;
  virtual void onTEBWarning(TEduBoardWarningCode code, const char *msg) override;
  virtual void onTEBInit() override;

 private:
  void JoinIMGroup(const char *groupId, TICCallback callback);
  void QuitIMGroup(const char *groupId, TICCallback callback);
  void OnJoinIMGroupComplete(TICCallback callback);

  void TRTCEnterRoom();
  void BoardCreateAndInit();
  void BoardDestroy(bool clearBoard);
  void TRTCExitRoom();

  void StartSyncTimer();
  void StopSyncTimer();
  void SendSEISyncMsg();

  void OnIMNewMsg(const char *json_msg_array);
  void OnIMC2CMsg(const Json::Value &jsonMsg);
  bool OnIMGroupMsg(const Json::Value &jsonMsg);
  void OnIMSystemMsg(const Json::Value &jsonMsg);

  void OnIMKickedOffline();
  void OnIMUserSigExpired();

  void OnIMGroupTipsEvent(const char *jsonTips);

 private:
  int sdkAppId_ = 0;
  std::string userId_;
  std::string userSig_;

  bool bInTRTCRoom_ = false;

  uint32_t classId_ = 0;
  std::string groupId_;
  std::string groupIdChat_;
  bool openCamera_ = true;
  std::string cameraId_;
  bool openMic_ = true;
  std::string micId_;
  HWND rendHwnd_ = nullptr;
  TICBoardInitParam boardInitParam_;
  TEduBoardCallback *boardCallback_ = nullptr;

  TEduBoardController *boardCtrl_ = nullptr;

  UINT_PTR syncTimer_ = 0;

  TICClassScene classScene_ = TIC_CLASS_SCENE_VIDEO_CALL;
  TICRoleType roleType_ = TIC_ROLE_TYPE_ANCHOR;

  bool compatSaas_ = false;

  bool disableTRTC_ = false;

  TICCallbackUtil *joinClassroomCallbackUtil = nullptr;

  std::mutex mutMsgListeners_;
  std::vector<TICMessageListener *> msgListeners_;

  std::mutex mutStatusListeners_;
  std::vector<TICIMStatusListener *> statusListeners_;

  std::mutex mutEventListeners_;
  std::vector<TICEventListener *> eventListeners_;

  TIMRecvNewMsgCallback timRecvNewMsgCallback_ = nullptr;
};
