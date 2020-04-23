package com.tencent.tic.core.impl;

import android.os.Handler;
import android.text.TextUtils;

import com.instacart.library.truetime.TrueTime;

import java.io.IOException;
import java.lang.ref.WeakReference;


public class NTPController {
    final static int SUCC = 0;
    final static int FAILED = 1;
    final static int MAX_RETRY = 5;
    final static String NTP_HOST = "time1.cloud.tencent.com";

    public interface TrueTimeListener {
        void onGotTrueTimeRusult(int code, final String msg);
    }
    WeakReference<TrueTimeListener> mWeakListener;
    Handler mHandler;

    public NTPController(TrueTimeListener listener) {
        TrueTime.clearCachedInfo();
        mHandler = new Handler();
        mWeakListener = new WeakReference<>(listener);
    }

    public void start(final String ntpServer) {
        if (!TrueTime.build().isInitialized()) {
            new Thread(new MyRunnable(this, ntpServer)).start();
        }
        else {
            //直接回调成功
            callback(SUCC);
        }
    }

    void callback (final int result) {
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                TrueTimeListener listener = mWeakListener.get();
                if (listener != null) {
                    listener.onGotTrueTimeRusult(result, (result == SUCC)?"succ":"ntp time out");
                }
            }
        });
    }

    static class MyRunnable implements Runnable {

        WeakReference<NTPController> mRef;
        final String mNtpServer;

        MyRunnable(NTPController controller, final String ntpServer) {
            mRef = new WeakReference<NTPController>(controller);
            mNtpServer = TextUtils.isEmpty(ntpServer) ? NTP_HOST : ntpServer;
        }

        @Override
        public void run() {
            int result = FAILED;
            for (int i = 0; i < MAX_RETRY; i++) {
                try {
                    TrueTime.build().withNtpHost(mNtpServer).initialize();
                    result = SUCC;
                    break;
                }  catch (IOException e) {
                    e.printStackTrace();
                }
            }

            NTPController controller = mRef.get();
            if (controller != null) {
                controller.callback(result);
            }
        }
    }
}
