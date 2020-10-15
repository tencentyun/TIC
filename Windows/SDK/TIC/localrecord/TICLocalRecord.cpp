//
//  Copyright © 2019 Tencent. All rights reserved.
//

#include "TICLocalRecord.h"

#include <mutex>

#include "TICLocalRecordImpl.h"
/**
 * 获取TICLocalRecord单例对象
 */
static TICLocalRecorder* g_pTICRecorder = nullptr;
static std::mutex ticRecord_mex;

TICLocalRecorder* TICLocalRecorder::GetInstance() {
  if (g_pTICRecorder == NULL) {
    ticRecord_mex.lock();
    if (g_pTICRecorder == NULL) {
      g_pTICRecorder = new TICLocalRecorderImpl();
    }
    ticRecord_mex.unlock();
  }
  return (TICLocalRecorder*)g_pTICRecorder;
}

void TICLocalRecorder::setListener(std::weak_ptr<TEduRecordCallback> listen) {
  mCallback = listen;
}
