//
//  Copyright © 2019 Tencent. All rights reserved.
//

#pragma once

#include <stdio.h>

#include <functional>
#include <memory>
#include <string>
#include <vector>

#include "../TICManager.h"

/**
 *  授权参数
 */
struct TEduRecordAuthParam {
  TEduRecordAuthParam() {}
  TEduRecordAuthParam(int appId, std::string userId, std::string userSig) {
    this->appId = appId;
    this->userId = userId;
    this->userSig = userSig;
  }

  int appId = 0;
  std::string userId;
  std::string userSig;
};

struct RecordKey {
  RecordKey() {}
  RecordKey(int appid, int classid, std::string& userid, std::string& taskid,
            int index, int size) {
    this->appid = appid;
    this->class_id = classid;
    this->user_id = userid;
    this->task_id = taskid;

    this->index = index;
    this->size = size;
  }
  int appid = 0;
  int class_id = 0;     // 不填写，表示全部
  std::string user_id;  // 不填写，表示全部
  std::string task_id;  // 不填写，表示全部

  int index = 0;  // 从第0组开始拉起
  int size = 30;  // 每次拉取30个
};

/**
 *  视频参数
 */
struct TEduRecordParam {
  // 【字段含义】视频采集帧率
  // 【推荐取值】10fps 或 20fps，10fps 以下会有轻微卡顿感，5fps
  // 以下卡顿感明显，20fps 以上的帧率则过于浪费（电影的帧率也只有 24fps）。
  int videoFps = 10;

  // 【字段含义】视频发送码率
  int videoBps = 1000;  // 1000kpbs

  // 【字段含义】视频录制窗口x位置
  int x = 0;

  // 【字段含义】视频录制窗口Y
  int y = 0;

  // 【字段含义】视频录制窗口宽度，0表示整个窗口宽度
  int width = 0;

  // 【字段含义】视频录制窗口高度, 0表示整个窗口高度
  int Height = 0;

  // 被录制进程名称
  std::string AppProc;  // 如QQMusic.exe

  // 被录制窗口wndId
  int Wnd = 0;

  // 是否录制音频
  bool enableAudio = true;

  // 是否上传到后台
  bool enableUpload = true;

  // 录制的课堂ID
  int classId = 0;
};

class AuthState {
 public:
  std::string UserId;
  std::string State;
};

class RecordingState {
 public:
  std::string RecordId;
  std::string State;
  int Duration = 0;
};

class UploadState {
 public:
  std::string RecordId;
  std::string State;
  int Duration = 0;  // 已上传时长
  int Total = 0;     // 录制总时长
  bool IsCurrentRecoding = false;
};

class RecordState {
 public:
  AuthState auth;
  RecordingState recording;
  std::vector<UploadState> upload;
};

/**
 * 录制事件回调接口
 */
class TEduRecordCallback {
 public:
  virtual void onGotStatus(const RecordState& state) = 0;
};

class TICLocalRecorder {
 public:
  virtual ~TICLocalRecorder() {}
  const std::string RecordExe = "TXCloudRecord.exe";

 public:
  /**
   * 获取TICLocalRecord单例对象
   */
  static TICLocalRecorder* GetInstance();

  void setListener(std::weak_ptr<TEduRecordCallback> listen);

  /**
   * 启动本地录制服务
   * @param path 		录制服务的可执行文件exe路径
   */
  virtual bool startService(const std::string& path) = 0;

  /**
   * 初始化
   * @param authParam 		授权参数
   */
  virtual int init(const TEduRecordAuthParam& authParam,
                   TICCallback callback) = 0;

  /**
   * 视频本地录制, 支持不推流录制。
   * @param szRecordPath:视频录制后存储路径，目前传flv后缀文件。
   * @return
   *          0 成功；
   *          -1 路径非法
   *          -2 上次录制未结束，请先stopRecord
   */
  virtual int startLocalRecord(const TEduRecordParam& para,
                               const char* szRecordPath,
                               TICCallback callback) = 0;

  /**
   * 结束录制短视频，停止推流后，如果视频还在录制中，SDK内部会自动结束录制
   * @return
   *       0 成功；
   *      -1 不存在录制任务；
   */
  virtual int stopLocalRecord(TICCallback callback) = 0;

  /**
   * 暂停本地录制，暂停期间的音视频不会录制
   * @return：成功 or 失败，内存分配、资源申请失败等原因可能会导致返回失败
   */
  virtual int pauseLocalRecord(TICCallback callback) = 0;

  /**
   *  恢复本地录制
   */
  virtual int resumeLocalRecord(TICCallback callback) = 0;

  /**
   * 停止所有录制和推流并退出进程
   */
  virtual int exit(TICCallback callback) = 0;

  /**
   * 获取录制的状态
   */
  virtual int getState(TICCallback callback) = 0;

  /**
   * 获取录制的结果
   */
  virtual int getRecordResult(const TEduRecordAuthParam& authParam,
                              const RecordKey& key, TICCallback callback) = 0;

 protected:
  std::weak_ptr<TEduRecordCallback> mCallback;
};
