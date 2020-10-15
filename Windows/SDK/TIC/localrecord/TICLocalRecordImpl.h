//
//  Copyright © 2019 Tencent. All rights reserved.
//

#pragma once

#include <stdio.h>

#include <functional>
#include <string>

#include "../HttpClient.h"
#include "TICLocalRecord.h"

struct BaseCallback;

class TICLocalRecorderImpl
    : public TICLocalRecorder,
      public std::enable_shared_from_this<TICLocalRecorderImpl> {
 public:
  TICLocalRecorderImpl();
  virtual ~TICLocalRecorderImpl();
  bool startService(const std::string& path) override;
  int init(const TEduRecordAuthParam& authParam, TICCallback callback) override;
  int startLocalRecord(const TEduRecordParam& para, const char* szRecordPath,
                       TICCallback callback) override;
  int stopLocalRecord(TICCallback callback) override;
  int pauseLocalRecord(TICCallback callback) override;
  int resumeLocalRecord(TICCallback callback) override;
  int exit(TICCallback callback) override;
  int getState(TICCallback callback) override;
  int getRecordResult(const TEduRecordAuthParam& authParam,
                      const RecordKey& key, TICCallback callback) override;

  struct Result {
    Result() {}
    Result(int code, const std::string& msg) {
      this->code = code;
      this->msg = msg;
    }
    int code = 0;
    std::string msg;
  };

 protected:
  void sendCmd(const std::string& cmd, const std::string& content,
               const TICCallback callback);
  void sendRequest(const std::wstring& cmd, const std::string& reqBody,
                   BaseCallback* mycallback);

  void StartTimer();
  void StopTimer();
  void onTimer();

 protected:
  UINT_PTR syncTimer_ = 0;
  TEduRecordAuthParam mAuth;
  HttpClient http;
};
