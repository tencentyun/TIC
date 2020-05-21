package com.tencent.tic.demo.activities;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import com.tencent.tic.core.TICManager;
import com.tencent.tic.demo.TICSDKDemoApp;


public class BaseActvity extends AppCompatActivity implements TICManager.TICIMStatusListener{

    final String TAG = this.getClass().getSimpleName();
    final static int REQUEST_CODE = 1;

    protected final static String USER_ID = "USER_ID";
    protected final static String USER_SIG = "USER_SIG";
    protected final static String USER_ROLE = "USER_ROLE";
    protected final static String USER_ROOM = "USER_ROOM";

    protected TICManager mTicManager;

    //账号信息
    protected String mUserID;
    protected String mUserSig;
    protected int mRoomId;

    //日志信息
    String logMsg = "";
    TextView tvLog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mTicManager = ((TICSDKDemoApp)getApplication()).getTICManager();
        mTicManager.addIMStatusListener(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mTicManager.removeIMStatusListener(this);
    }

    @Override
    public void onTICForceOffline() {
        postToast("您已被踢下线，请检查后重新登录", true);
    }

    @Override
    public void onTICUserSigExpired() {
        postToast("用户签名已过期！", true);
    }

    protected void postToast(String msg) {
        postToast(msg, false);
    }

    protected void postToast(final String msg, final boolean toast) {
        Log.i(TAG, msg);

        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (toast) {
                    Toast.makeText(BaseActvity.this, msg, Toast.LENGTH_SHORT).show();
                }
                addLog(msg);
            }
        });
    }

    protected void addLog(String logs) {
        if (tvLog != null) {
            logMsg = logMsg + "\r\n" + logs;
            tvLog.setText(logMsg + "\r\n");

            int offset = tvLog.getLineCount() * tvLog.getLineHeight();
            if (offset > tvLog.getHeight()) {
                tvLog.scrollTo(0, offset - tvLog.getHeight());
            }
        }
    }

}