package com.tencent.tic.demo;

import android.app.Application;

import com.tencent.tic.core.TICManager;
import com.tencent.tic.core.impl.utils.SdkUtil;

/**
 * Created by ericczhuangzhang on 2017/9/29.
 */
public class TICSDKDemoApp extends Application {
    private final static String TAG = "TICSDKDemoApp";
    private TICManager mTIC;
    public TICManager getTICManager() {
        return mTIC;
    }
    @Override
    public void onCreate() {
        super.onCreate();

        if (SdkUtil.isMainProcess(this)) {    // 仅在主线程初始化
            // 初始化TIC
            mTIC = TICManager.getInstance();
            mTIC.init(this, Constants.APPID);
        }
    }

    @Override
    public void onTerminate() {
        if (mTIC != null)
            mTIC.unInit();

        super.onTerminate();
    }

}
