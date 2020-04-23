package com.tencent.tic.core.impl.utils;

import com.tencent.liteav.basic.log.TXCLog;
import com.tencent.tic.core.TICManager;

public class CallbackUtil {

    public static void notifySuccess(TICManager.TICCallback callBack, Object data) {
        if (null != callBack) {
            callBack.onSuccess(data);
        }
    }

    public static void notifyError(TICManager.TICCallback callBack, String module, int errCode, String errMsg) {
        if (null != callBack) {
            callBack.onError(module, errCode, errMsg);
        }
        TXCLog.e(module, errMsg);
    }
}
