//
//  Copyright © 2019 Tencent. All rights reserved.
//

#include "TICRecorder.h"

#include <chrono>

#include "HttpClient.h"
#include "NTP.h"

void TICRecorder::sendOfflineRecordInfo(const std::string& ntpServer,
                                        std::string groupId,
                                        TICCallback callback) {
  // 重试3次，每次间隔500ms
  NTP::getNTPServerTime(
      ntpServer, 8, [=](int code, const char* desc, int64_t serverTime) {
        if (code != 0) {
          callback(TICMODULE_TIC, code, desc);
          return;
        }

        // 发送对时信息
        int64_t avTime = ::GetTickCount();  // TRTC时间戳
        int64_t boardTime =
            std::chrono::system_clock::now().time_since_epoch().count() *
            _XTIME_NSECS_PER_TICK / 1000000;  //白板时间戳

        Json::Value value;
        value["type"] = 1008;
        value["avsdk_time"] = avTime;
        value["board_time"] = boardTime;
        value["time_line"] = serverTime;

        Json::FastWriter writer;
        std::string msg = writer.write(value);

        Json::Value jsonMsgElem;
        jsonMsgElem[kTIMElemType] = kTIMElem_Custom;
        jsonMsgElem[kTIMCustomElemData] = msg;
        jsonMsgElem[kTIMCustomElemExt] = "TXConferenceExt";

        Json::Value jsonMsg;
        jsonMsg[kTIMMsgElemArray].append(jsonMsgElem);

        jsonMsg[kTIMMsgClientTime] = time(NULL);
        jsonMsg[kTIMMsgServerTime] = time(NULL);
        jsonMsg[kTIMMsgConvId] = groupId;
        jsonMsg[kTIMMsgConvType] = kTIMConv_Group;

        TICCallback* pCB = new TICCallback();
        *pCB = callback;
        int nRet = TIMMsgSendNewMsg(
            groupId.c_str(), kTIMConv_Group, jsonMsg.toStyledString().c_str(),
            [](int32_t code, const char* desc, const char* json_params,
               const void* user_data) {
              TICCallback* pCB = (TICCallback*)user_data;
              if (pCB) {
                (*pCB)(TICMODULE_IMSDK, code, desc);
                delete pCB;
              }
            },
            pCB);
        if (nRet != TIM_SUCC) {
          (*pCB)(TICMODULE_IMSDK, nRet, "TIMMsgSendNewMsg() failed.");
          delete pCB;
        }
      });
}

void TICRecorder::reportGroupId(bool bTest, int sdkappid,
                                const std::string& userId,
                                const std::string& userSig,
                                const std::string& groupId) {
  const std::string kServer = "https://yun.tim.qq.com/v4/ilvb_edu/record";
  const std::string kTestServer = "https://yun.tim.qq.com/v4/ilvb_test/record";

  std::string url = bTest ? kTestServer : kServer;
  url += "?sdkappid=" + std::to_string(sdkappid);
  url += "&identifier=" + userId;
  url += "&usersig=" + userSig;
  url += "&contenttype=json";

  Json::Value value;
  value["cmd"] = "open_record_svc";
  value["sub_cmd"] = "report_group";
  value["group_id"] = groupId;
  Json::FastWriter writer;
  std::string reqBody = writer.write(value);

  HttpClient http;
  http.asynPost(HttpClient::a2w(url), reqBody,
                [](int code, const HttpHeaders& rspHeaders,
                   const std::string& rspBody) {});
}
