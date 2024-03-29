package com.tencent.tic.demo.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;

import com.tencent.smtt.sdk.WebSettings;
import com.tencent.smtt.sdk.WebView;
import com.tencent.smtt.sdk.WebViewClient;
import com.tencent.tic.core.IMManager;
import com.tencent.tic.demo.R;

import java.util.Random;


public class TICClassManagerActivity extends BaseActvity {

    // 课堂id
    EditText etRoomIdInput;

    WebView mWebView;
    FrameLayout webviewContainer;

    // IM掉线
    @Override
    public void onConnectFailed(int code, String error) {
        finish();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manager_layout);

        //用户信息
        mUserID = getIntent().getStringExtra(USER_ID);
        mUserSig = getIntent().getStringExtra(USER_SIG);

        mRoomId = resumeFromCache();

        etRoomIdInput = (EditText) findViewById(R.id.et_roomid);

        etRoomIdInput.setText(String.valueOf(mRoomId));

        initwebView();

        webviewContainer = (FrameLayout) findViewById(R.id.webview_container);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
        webviewContainer.addView(mWebView, layoutParams);
    }

    void initwebView() {

        WebViewClient myWebClient = new WebViewClient() {

            @Override
            public void onPageFinished(WebView view, String url) {
                String result = "";

                super.onPageFinished(view, url);
            }
        };


        if (mWebView == null) {
            mWebView = new WebView(this);
        }
        else {
            mWebView.loadUrl("about:blank");
        }



        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);        //缓存
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAppCacheEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setTextZoom(100);

        mWebView.setWebViewClient(myWebClient);

        final String url = "http://debugtbs.qq.com?" + String.valueOf(System.currentTimeMillis());
        mWebView.loadUrl(url);
    }



    @Override
    protected void onStop() {
        super.onStop();
        writeToCache(mRoomId);
    }

    public void writeToCache(int roomId) {
        SharedPreferences sharedPreferences = getSharedPreferences(TAG, 0);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt(USER_ROOM, roomId);
        editor.commit();
    }

    public int resumeFromCache() {
        Random ran = new Random(System.currentTimeMillis());
        int randRoom = ran.nextInt(1000); //课堂号假设小于1000
        SharedPreferences sharedPreferences = getSharedPreferences(TAG, 0);
        int roomId = sharedPreferences.getInt(USER_ROOM, randRoom);
        return roomId;
    }

    /**
     * 退出
     */
    public void onExit(View v) {
        finish();
    }

    /**
     * 创建课堂
     */
    public void onCreateClsssroomClick(View v) {

        String inputString = etRoomIdInput.getText().toString().trim();
        if (TextUtils.isEmpty(inputString) || !TextUtils.isDigitsOnly(inputString)) {
            postToast("创建课堂失败, 房间号为空或者非数字:"  + inputString, true);
            return;
        }

        mRoomId = Integer.valueOf(inputString);
        IMManager.getInstance().createIMGroup(inputString, new IMManager.IMCallBack() {
            @Override
            public void onComplete(int errCode, String errMsg) {
                if (errCode == 0) {
                    postToast("创建课堂 成功, 房间号："  + mRoomId, true);
                }
                else if (errCode == 10021) {
                    postToast("该课堂已被他人创建，请\"加入课堂\"", true);
                }
                else if (errCode == 10025) {
                    postToast("该课堂已创建，请\"加入课堂\"", true);
                }
                else {
                    postToast("创建课堂失败, 房间号：" + mRoomId + " err:" + errCode + " msg:" + errMsg, true);
                }
            }
        });
    }

    public void onDestroyClassroomClick(View v) {

        String roomInputId = etRoomIdInput.getText().toString().trim();
        if (TextUtils.isEmpty(roomInputId) || !TextUtils.isDigitsOnly(roomInputId)) {
            postToast("请检查账号信息是否正确");
            return;
        }
        mRoomId = Integer.valueOf(roomInputId);

        IMManager.getInstance().destroyIMGroup(roomInputId, new IMManager.IMCallBack() {
            @Override
            public void onComplete(int errCode, String errMsg) {
                if (errCode == 0) {
                    postToast("销毁课堂成功: " + mRoomId);
                }
                else {
                    postToast("销毁课堂失败: " + mRoomId + " err:" + errCode + " msg:" + errMsg);
                }
            }
        });
    }

    /**
     * 进入课堂
     */
    public void onJoinClsssroomClick(View v) {

        String roomInputId = etRoomIdInput.getText().toString().trim();
        if (TextUtils.isEmpty(roomInputId) || !TextUtils.isDigitsOnly(roomInputId)) {
            postToast("创建课堂失败, 房间号为空或者非数字:"  + roomInputId, true);
            return;
        }
        mRoomId = Integer.valueOf(roomInputId);
        launcherClassroomLiveActivity();

        postToast("正在进入课堂，请稍等。。。", true);
    }

    private void launcherClassroomLiveActivity() {
        Intent intent = new Intent(this, TICClassMainActivity.class);
        intent.putExtra(USER_ID, mUserID);
        intent.putExtra(USER_SIG, mUserSig);
        intent.putExtra(USER_ROOM, mRoomId);
        startActivity(intent);
    }
}
