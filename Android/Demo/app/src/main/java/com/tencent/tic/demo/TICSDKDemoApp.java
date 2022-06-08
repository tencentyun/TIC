package com.tencent.tic.demo;

import android.app.Application;

import com.tencent.tic.core.IMManager;

/**
 * Created by ericczhuangzhang on 2017/9/29.
 */
public class TICSDKDemoApp extends Application {
    private final static String TAG = "TICSDKDemoApp";
    private TRTCGetUserIDAndUserSig mUserInfoLoader;
    public TRTCGetUserIDAndUserSig getConfig() {
        return mUserInfoLoader;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        mUserInfoLoader = new TRTCGetUserIDAndUserSig(this);
        IMManager.getInstance().initSDK(this,mUserInfoLoader.getSdkAppIdFromConfig());
    }


    public  abstract class Test implements testIMEListener{
        @Override
        public void callTest() {
            
        }
    }

    public interface  testIMEListener{
        void callTest();
    }
  
    @Override
    public void onTerminate() {
        IMManager.getInstance().unInitSDK();
        super.onTerminate();
    }

}
