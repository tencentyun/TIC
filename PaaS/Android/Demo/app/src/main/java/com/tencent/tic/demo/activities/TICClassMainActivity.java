package com.tencent.tic.demo.activities;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
//import android.support.v4.app.ActivityCompat;
//import android.support.v4.content.ContextCompat;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;

import android.view.WindowManager;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.tencent.teduboard.TEduBoardController;

import com.tencent.imsdk.TIMElem;
import com.tencent.imsdk.TIMMessage;
import com.tencent.rtmp.TXLog;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.tic.core.TICClassroomOption;
import com.tencent.tic.core.TICManager;
import com.tencent.tic.demo.R;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class TICClassMainActivity extends BaseActvity
        implements View.OnClickListener,
        TICManager.TICMessageListener,
        TICManager.TICEventListener
        {
    private final static String TAG = "TICClassMainActivity";

     TICMenuDialog moreDlg;
     MySettingCallback mySettingCallback;
     boolean mEnableAudio = true;
     boolean mEnableCamera = true;
     boolean mEnableFrontCamera = true;
     boolean mEnableAudioRouteSpeaker = true; //扬声器
     boolean mCanRedo = false;
     boolean mCanUndo = false;

    /**
     * 白板视图控件
     */
    FrameLayout mBoardContainer;
    TEduBoardController mBoard;
    MyBoardCallback mBoardCallback;
    boolean mHistroyDataSyncCompleted = false;
    //trtc
    TRTCCloud mTrtcCloud;

     // 实时音视频视图控件
    TICVideoRootView mTrtcRootView;

    // 消息输入
    EditText etMessageInput;
    String mImgsFid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_class_ex);

        //在白板上文本输入时，避免出现软键盘盖住情况。
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);

        //1、获取用户信息
        mUserID = getIntent().getStringExtra(USER_ID);
        mUserSig = getIntent().getStringExtra(USER_SIG);
        mRoomId = getIntent().getIntExtra(USER_ROOM, 0);

        //检查权限
        checkCameraAndMicPermission();

        //2.白板
        mBoard = mTicManager.getBoardController();

        //3、初始化View
        initView();

        initTrtc();

        joinClass();

        mTicManager.addIMMessageListener(this);
        mTicManager.addEventListener(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mTicManager.quitClassroom(false, null);

        unInitTrtc();
        removeBoardView();

        mTicManager.removeIMMessageListener(this);
        mTicManager.removeEventListener(this);
    }

    private void initView() {
        //Title
        findViewById(R.id.tv_double_room_back_button).setOnClickListener(this);
        findViewById(R.id.tv_memu).setOnClickListener(this);
        ((TextView)findViewById(R.id.tv_room_id)).setText(String.valueOf(mRoomId));

        tvLog = (TextView) findViewById(R.id.tv_log);
        etMessageInput = (EditText) findViewById(R.id.et_message_input);
        tvLog.setMovementMethod(ScrollingMovementMethod.getInstance());

        //发送消息
        findViewById(R.id.btn_send).setOnClickListener(this);
        }

     //---------trtc--------------

    private void initTrtc() {
        //1、获取trtc
        mTrtcCloud = mTicManager.getTRTCClound();

        if (mTrtcCloud != null) {
            //2、TRTC View
            mTrtcRootView = (TICVideoRootView) findViewById(R.id.trtc_root_view);
            mTrtcRootView.setUserId(mUserID);
            TXCloudVideoView localVideoView = mTrtcRootView.getCloudVideoViewByIndex(0);
            localVideoView.setUserId(mUserID);

            //3、开始本地视频图像
            startLocalVideo(true);

            //4. 开始音频
            enableAudioCapture(true);
        }
    }

    private void unInitTrtc() {
        if (mTrtcCloud != null) {
            //3、停止本地视频图像
            mTrtcCloud.stopLocalPreview();
            enableAudioCapture(false);
        }
    }

    private void startLocalVideo(boolean enable) {
        if (mTrtcCloud != null) {
            final String usrid = mUserID;
            TXCloudVideoView localVideoView = mTrtcRootView.getCloudVideoViewByUseId(usrid);;
            localVideoView.setUserId(usrid);
            localVideoView.setVisibility(View.VISIBLE);
            if (enable) {
                mTrtcCloud.startLocalPreview(mEnableFrontCamera, localVideoView);
            } else {
                mTrtcCloud.stopLocalPreview();
            }
        }
    }

    private void enableAudioCapture(boolean bEnable) {
        if (mTrtcCloud != null) {
            if (bEnable) {
                mTrtcCloud.startLocalAudio();
            }
            else {
                mTrtcCloud.stopLocalAudio();
            }
        }

    }

    //------------  From TICEventListener  ------//
    @Override
    public void onTICUserVideoAvailable(final String userId, boolean available) {

        Log.i(TAG,"onTICUserVideoAvailable:" + userId + "|" + available);

        if (available) {
            final TXCloudVideoView renderView = mTrtcRootView.onMemberEnter(userId+ TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
            if (renderView != null) {
                // 启动远程画面的解码和显示逻辑，FillMode 可以设置是否显示黑边
                mTrtcCloud.setRemoteViewFillMode(userId, TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FIT);
                mTrtcCloud.startRemoteView(userId, renderView);
                renderView.setUserId(userId+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
            }

        } else {
            mTrtcCloud.stopRemoteView(userId);
            mTrtcRootView.onMemberLeave(userId+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
        }
    }

    @Override
    public void onTICUserSubStreamAvailable(String userId, boolean available) {

        if (available) {
            final TXCloudVideoView renderView = mTrtcRootView.onMemberEnter(userId+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB);
            if (renderView != null) {
                renderView.setUserId(userId+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB);
                mTrtcCloud.setRemoteViewFillMode(userId, TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FIT);
                mTrtcCloud.startRemoteSubStreamView(userId, renderView);
            }
        }
        else {
            mTrtcCloud.stopRemoteSubStreamView(userId);
            mTrtcRootView.onMemberLeave(userId+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB);
        }
    }

    @Override
    public void onTICUserAudioAvailable(String userId, boolean available) {
        if (available) {
            final TXCloudVideoView renderView = mTrtcRootView.onMemberEnter(userId+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
            if (renderView != null) {
                renderView.setVisibility(View.VISIBLE);
            }
        }
    }

    @Override
    public void onTICMemberJoin(List<String> userList) {

        for (String user : userList) {
            // 创建一个View用来显示新的一路画面，在自已进房间时，也会给这个回调
            if (!user.equals(mUserID)) {
                TXCloudVideoView renderView = mTrtcRootView.onMemberEnter(user+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
                if (renderView != null) {
                    renderView.setVisibility(View.VISIBLE);
                }
                postToast(user + " join.", false);
            }
        }
    }

    @Override
    public void onTICMemberQuit(List<String> userList) {
        for (String user : userList) {
            final String userID_Big = user.equals(mUserID) ? mUserID : user+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG;
            //停止观看画面
            mTrtcCloud.stopRemoteView(userID_Big);
            mTrtcRootView.onMemberLeave(userID_Big);

            final String userID_Sub = user.equals(mUserID) ? mUserID : user+TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB;
            mTrtcCloud.stopRemoteSubStreamView(userID_Sub);
            mTrtcRootView.onMemberLeave(userID_Sub);

            postToast(user + " quit.", false);
        }
    }


    //------回调设置的处理------
    class MySettingCallback implements TICMenuDialog.IMoreListener {

        @Override
        public void onEnableAudio(boolean bEnableAudio) {
            mEnableAudio = bEnableAudio;
            enableAudioCapture(mEnableAudio);
        }

        @Override
        public void onSwitchAudioRoute(boolean speaker) {
            mEnableAudioRouteSpeaker = speaker;
            mTrtcCloud.setAudioRoute(mEnableAudioRouteSpeaker ? TRTCCloudDef.TRTC_AUDIO_ROUTE_SPEAKER : TRTCCloudDef.TRTC_AUDIO_ROUTE_EARPIECE);
        }

        @Override
        public void onEnableCamera(boolean bEnableCamera) {
            mEnableCamera = bEnableCamera;
            startLocalVideo(mEnableCamera);
        }

        @Override
        public void onSwitchCamera(boolean bFrontCamera) {
            mEnableFrontCamera = bFrontCamera;
            mTrtcCloud.switchCamera();
        }

        //------------board------------
        @Override
        public void onSetDrawEnable(boolean SetDrawEnable) {
            mBoard.setDrawEnable(SetDrawEnable);
        }

        @Override
        public void onSyncDrawEnable(boolean syncDrawEnable) {
            mBoard.setDataSyncEnable(syncDrawEnable);
        }

        @Override
        public void onSetHandwritingEnable(boolean writingEnable) {
            mBoard.setHandwritingEnable(writingEnable);
        }

        @Override
        public void onSetToolType(int type) {
            mBoard.setToolType(type);
        }

        @Override
        public void onBrushThin(int size) {
            mBoard.setBrushThin(size);
        }

        @Override
        public void onSetTextSize(int size) {
            mBoard.setTextSize(size);
        }

        @Override
        public void onSetBrushColor(int color) {
            TEduBoardController.TEduBoardColor eduBoardColor = new TEduBoardController.TEduBoardColor(color);
            mBoard.setBrushColor(eduBoardColor);
        }

        @Override
        public void onSetTextColor(int color) {
            TEduBoardController.TEduBoardColor eduBoardColor = new TEduBoardController.TEduBoardColor(color);
            mBoard.setTextColor(eduBoardColor);
        }

        @Override
        public void onSetTextStyle(int style) {
            mBoard.setTextStyle(style);
        }

        @Override
        public void onSetBackgroundColore(int color) {
            TEduBoardController.TEduBoardColor eduBoardColor = new TEduBoardController.TEduBoardColor(color);
            mBoard.setBackgroundColor(eduBoardColor);
        }

        @Override
        public void onSetBackgroundImage(String path) {
            if (!TextUtils.isEmpty(path)) {
                mBoard.setBackgroundImage(path, TEduBoardController.TEduBoardImageFitMode.TEDU_BOARD_IMAGE_FIT_MODE_CENTER);
            }
        }

        @Override
        public void onSetBackgroundH5(String url) {
            if (!TextUtils.isEmpty(url)) {
                mBoard.setBackgroundH5(url);
            }
        }

        @Override
        public void onUndo() {
            mBoard.undo();
        }

        @Override
        public void onRedo() {
            mBoard.redo();
        }

        @Override
        public void onClear() {
            mBoard.clear(true);
        }

        @Override
        public void onReset() {
            mBoard.reset();
        }

        @Override
        public void onAddBoard(String id) {
            mBoard.addBoard(id);
        }

        @Override
        public void onDeleteBoard(String boardId) {
            mBoard.deleteBoard(boardId);
        }

        @Override
        public void onGotoBoard(String boardId) {
            mBoard.gotoBoard(boardId);
        }

        @Override
        public void onPrevStep() {
            mBoard.prevStep();
        }

        @Override
        public void onNextStep() {
            mBoard.nextStep();
        }

        @Override
        public void onPrevBoard() {
            mBoard.prevBoard();
        }

        @Override
        public void onNextBoard() {
            mBoard.nextBoard();
        }

        @Override
        public void onScale(int scale) {
            mBoard.setBoardScale(scale);
        }

        @Override
        public void onSetRatio(String ratio) {
            mBoard.setBoardRatio(ratio);
        }

        @Override
        public void onSetFitMode(int mode) {
            mBoard.setBoardContentFitMode(mode);
        }

        @Override
        public void onTransCodeFile(TEduBoardController.TEduBoardTranscodeFileResult myresult) {
            mBoard.addTranscodeFile(myresult);
        }

        @Override
        public void onAddH5File(String url) {
            mBoard.addH5File(url);
        }

        @Override
        public void onDeleteFile(String fileId) {
            mBoard.deleteFile(fileId);
        }

        @Override
        public void onGotoFile(String fid) {
            mBoard.switchFile(fid);
        }

        @Override
        public void onAddImagesFile(List<String> urls) {
            mImgsFid = mBoard.addImagesFile(urls);
        }

        @Override
        public void onPlayVideoFile(String url) {
            mBoard.addVideoFile(url);
        }

        @Override
        public void onShowVideoCtrl(boolean value) {
            mBoard.showVideoControl(value);
        }
    }

    void addBoardView() {
        mBoardContainer = (FrameLayout) findViewById(R.id.board_view_container);
        View boardview = mBoard.getBoardRenderView();
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
        mBoardContainer.addView(boardview, layoutParams);

        //设置透明
        //boardview.setBackgroundColor(Color.TRANSPARENT);
        //boardview.getBackground().setAlpha(0); // 设置填充透明度 范围：0-255
        //mBoard.setGlobalBackgroundColor(new TEduBoardController.TEduBoardColor(0, 0,0, 0));
        //mBoard.setBackgroundColor(new TEduBoardController.TEduBoardColor(0, 0,10, 0));

        postToast("正在使用白板：" + TEduBoardController.getVersion(), true);
    }

    private void removeBoardView() {
        if (mBoard != null) {
            View boardview = mBoard.getBoardRenderView();
            if (mBoardContainer != null && boardview != null) {
                mBoardContainer.removeView(boardview);
            }
        }
    }

    private  void onTEBHistroyDataSyncCompleted() {
        mHistroyDataSyncCompleted = true;
        postToast("历史数据同步完成", false);
    }


    @Override
    public void onClick(View v) {

        switch (v.getId()) {

            case R.id.tv_double_room_back_button: //返回
                quitClass();
                break;

            case R.id.tv_memu: //菜单
            {
                if (!mHistroyDataSyncCompleted) { //
                    postToast("请在历史数据同步完成后开始测试", true);
                    return;
                }
                if (mySettingCallback == null) {
                    mySettingCallback = new MySettingCallback();
                }

                if (moreDlg == null) {
                    moreDlg = new TICMenuDialog(this, mySettingCallback);
                }


                TICMenuDialog.SettingCacheData  settingCacheData = new TICMenuDialog.SettingCacheData();

                //trtc
                settingCacheData.AudioEnable = mEnableAudio;
                settingCacheData.AudioRoute = mEnableAudioRouteSpeaker;
                settingCacheData.CameraEnable = mEnableCamera;
                settingCacheData.CameraFront = mEnableFrontCamera;

                //board
                settingCacheData.isDrawEnable = mBoard.isDrawEnable();
                settingCacheData.isSynDrawEnable = mBoard.isDataSyncEnable();
                settingCacheData.isHandwritingEnable = mBoard.isHandwritingEnable();
                settingCacheData.ToolType = mBoard.getToolType();
                settingCacheData.BrushThin = mBoard.getBrushThin();
                settingCacheData.BrushColor = mBoard.getBrushColor().toInt();
                settingCacheData.TextColor = mBoard.getTextColor().toInt();
                settingCacheData.BackgroundColor = mBoard.getBackgroundColor().toInt();
                settingCacheData.GlobalBackgroundColor = mBoard.getGlobalBackgroundColor().toInt();
                settingCacheData.TextSize = mBoard.getTextSize();
                settingCacheData.ScaleSize = mBoard.getBoardScale();
                settingCacheData.ration = mBoard.getBoardRatio();
                settingCacheData.FitMode = mBoard.getBoardContentFitMode();

                settingCacheData.TextStyle = mBoard.getTextStyle();
                settingCacheData.canRedo = mCanRedo;
                settingCacheData.canUndo = mCanUndo;

                settingCacheData.currentBoardId = mBoard.getCurrentBoard();
                settingCacheData.boardIds = mBoard.getBoardList();

                settingCacheData.currentFileId = mBoard.getCurrentFile();
                settingCacheData.files = mBoard.getFileInfoList();

                moreDlg.show(settingCacheData);
            }
                break;

            case R.id.btn_send: //发送按钮
                final String msg = ((EditText)findViewById(R.id.et_message_input)).getText().toString();
                if (!TextUtils.isEmpty(msg)) {
                    sendGroupMessage(msg);
                }
                break;
        }
    }

    @Override
    public void onBackPressed() {
        quitClass();
    }

    /**
     * 进入课堂
     */
    private void joinClass() {

        //1、设置白板的回调
        mBoardCallback = new MyBoardCallback(this);

        //2、如果用户希望白板显示出来时，不使用系统默认的参数，就需要设置特性缺省参数，如是使用默认参数，则填null。
        TEduBoardController.TEduBoardInitParam initParam = new TEduBoardController.TEduBoardInitParam();
        initParam.brushColor = new TEduBoardController.TEduBoardColor(255, 0, 0, 255);
        initParam.smoothLevel = 0; //用于指定笔迹平滑级别，默认值0.1，取值[0, 1]

        TICClassroomOption classroomOption = new TICClassroomOption();
        classroomOption.classId = mRoomId;
        classroomOption.boardCallback = mBoardCallback;
        classroomOption.boardInitPara = initParam;

        mTicManager.joinClassroom(classroomOption, new TICManager.TICCallback() {
            @Override
            public void onSuccess(Object data) {
                postToast("进入课堂成功:" + mRoomId);
            }

            @Override
            public void onError(String module, int errCode, String errMsg) {
               if(errCode == 10015){
                   postToast("课堂不存在:" + mRoomId + " err:" + errCode + " msg:" + errMsg);
                }
                else {
                   postToast("进入课堂失败:" + mRoomId + " err:" + errCode + " msg:" + errMsg);
               }
            }
        });
    }

    private void quitClass() {

        //如果是老师，可以清除；
        //如查是学生一般是不要清除数据
        boolean clearBoard = false;
        mTicManager.quitClassroom(clearBoard, new TICManager.TICCallback() {
            @Override
            public void onSuccess(Object data) {
                postToast("quitClassroom#onSuccess: " + data, true);
                finish();
            }

            @Override
            public void onError(String module, int errCode, String errMsg) {
                postToast("quitClassroom#onError: errCode = " + errCode + "  description " + errMsg);
                finish();
            }
        });
    }

    /**
     * 退出课堂
     */
    public void onQuitClsssroomClick(View v) {
        quitClass();
    }

    // ------------ FROM TICMessageListener ---------------------
    @Override
    public void onTICRecvTextMessage(String fromId, String text) {
        postToast(String.format("[%s]（C2C）说: %s", fromId, text));
    }

    @Override
    public void onTICRecvCustomMessage(String fromId, byte[] data) {
        postToast(String.format("[%s]（C2C:Custom）说: %s", fromId, new String(data)));
    }
    @Override
    public void onTICRecvGroupTextMessage(String fromId, String text) {
        postToast(String.format("[%s]（Group:Custom）说: %s", fromId, text));
    }

    @Override
    public void onTICRecvGroupCustomMessage(String fromUserId, byte[] data) {
        postToast(String.format("[%s]（Group:Custom）说: %s", fromUserId, new String(data)));
    }

    @Override
    public void onTICRecvMessage(TIMMessage message) {
        handleTimElement(message);
    }



    private void handleTimElement(TIMMessage message) {

        for (int i = 0; i < message.getElementCount(); i++) {
            TIMElem elem = message.getElement(i);
            switch (elem.getType()) {
                case Text:
                    postToast("This is Text message.");
                    break;
                case Custom:
                    postToast("This is Custom message.");
                    break;
                case GroupTips:
                    postToast("This is GroupTips message.");
                    continue;
                default:
                    postToast("This is other message");
                    break;
            }
        }
    }


    //---------------------- TICEventListener-----------------
    @Override
    public void onTICVideoDisconnect(int errCode, String errMsg) {
    }

    private void sendGroupMessage(final String msg) {
        mTicManager.sendGroupTextMessage( msg, new TICManager.TICCallback() {
            @Override
            public void onSuccess(Object data) {
                postToast("[我]说: " + msg);
            }

            @Override
            public void onError(String module, int errCode, String errMsg) {
                postToast("sendGroupMessage##onError##" + errMsg);

            }
        });
    }

    private void sendGroupMessage(final byte[] msg) {
        mTicManager.sendGroupCustomMessage( msg, new TICManager.TICCallback() {
            @Override
            public void onSuccess(Object data) {
                postToast("[我]说: " + new String(msg));
            }

            @Override
            public void onError(String module, int errCode, String errMsg) {
                postToast("sendGroupMessage##onError##" + errMsg);
            }
        });
    }

    private void sendCustomMessage(final String usrid, final byte[] msg) {
        mTicManager.sendCustomMessage(usrid, msg, new TICManager.TICCallback() {
            @Override
            public void onSuccess(Object data) {
                postToast("[我]对[" + usrid + "]说: " + msg);
            }

            @Override
            public void onError(String module, int errCode, String errMsg) {
                postToast("sendCustomMessage##onError##" + errMsg);

            }
        });
    }

    @Override
    public void onTICForceOffline() {
        super.onTICForceOffline();

        //1、退出TRTC
        if (mTrtcCloud != null ) {
            mTrtcCloud.exitRoom();
        }

        //2.退出房间
        mTicManager.quitClassroom(false, new TICManager.TICCallback() {
            @Override
            public void onSuccess(Object data) {
                postToast("onForceOffline##quitClassroom#onSuccess: " + data);
                Intent intent = new Intent(TICClassMainActivity.this, TICLoginActivity.class);
                startActivity(intent);
                finish();
            }

            @Override
            public void onError(String module, int errCode, String errMsg) {
                postToast("onForceOffline##quitClassroom#onError: errCode = " + errCode + "  description " + errMsg);
            }
        });

    }

    @Override
    public void onTICClassroomDestroy() {
        postToast("课堂已销毁");
    }

    @Override
    public void onTICSendOfflineRecordInfo(int code, String desc) {
        postToast("同步录制信息失败,code:" + code);

        //可以在此提示用户录制信息有误，然后让用户选择是否重新触发同步录制信息;
//        new  AlertDialog.Builder(this)
//                .setTitle("同步录制信息失败")
//                .setMessage("重试吗？" )
//                .setPositiveButton("要重试" ,  new DialogInterface.OnClickListener() {
//                    @Override
//                    public void onClick(DialogInterface dialog, int which) {
//                        mTicManager.sendOfflineRecordInfo();
//                    }
//                } )
//                .setNegativeButton("不重试" , null)
//                .show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        //super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {


        }
    }


    //--------------------权限检查-----------------------//

    protected void checkCameraAndMicPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return;
        }

        List<String> permissionList = new ArrayList();
        if (!checkPermissionAudioRecorder()) {
            permissionList.add(Manifest.permission.RECORD_AUDIO);
        }

        if (!checkPermissionCamera()) {
            permissionList.add(Manifest.permission.CAMERA);
        }

        if (!checkPermissionStorage()) {
            permissionList.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }

        if (permissionList.size() < 1) {
            return;
        }
        String[] permissions = permissionList.toArray(new String[0]);
        ActivityCompat.requestPermissions(this, permissions, REQUEST_CODE);
    }


    private boolean checkPermissionAudioRecorder() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        return true;
    }

    private boolean checkPermissionCamera() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        return true;
    }

    private boolean checkPermissionStorage() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == REQUEST_CODE) {
            for (int i = 0; i < grantResults.length; i++) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                    //判断是否勾选禁止后不再询问
                    boolean showRequestPermission = ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[i]);
                    if (showRequestPermission) {
                        postToast(permissions[i] + " 权限未申请");
                    }
                }
            }
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

     //Board Callback
    static private class MyBoardCallback implements TEduBoardController.TEduBoardCallback {
        WeakReference<TICClassMainActivity> mActivityRef;

        MyBoardCallback(TICClassMainActivity activityEx) {
            mActivityRef = new WeakReference<>(activityEx);
        }

        @Override
        public void onTEBError(int code, String msg) {
            TXLog.i(TAG, "onTEBError:" + code + "|" + msg);
        }

        @Override
        public void onTEBWarning(int code, String msg) {
            TXLog.i(TAG, "onTEBWarning:" + code + "|" + msg);
        }

        @Override
        public void onTEBInit() {
            TICClassMainActivity activity = mActivityRef.get();
            if (activity != null) {
                activity.addBoardView();
            }
        }

        @Override
        public void onTEBHistroyDataSyncCompleted() {
            TICClassMainActivity activityEx = mActivityRef.get();
            if (activityEx != null) {
                activityEx.onTEBHistroyDataSyncCompleted();
            }
        }

        @Override
        public void onTEBSyncData(String data) {

        }


        @Override
        public void onTEBAddBoard(List<String> boardId, final String fileId) {
            TXLog.i(TAG, "onTEBAddBoard:" + fileId);
        }

        @Override
        public void onTEBDeleteBoard(List<String> boardId, final String fileId) {
            TXLog.i(TAG, "onTEBDeleteBoard:" + fileId + "|" + boardId);
        }

        @Override
        public void onTEBGotoBoard(String boardId, final String fileId) {
            TXLog.i(TAG, "onTEBGotoBoard:" + fileId + "|" + boardId);
        }

         @Override
         public void onTEBGotoStep(int currentStep, int total) {
             TXLog.i(TAG, "onTEBGotoStep:" + currentStep + "|" + total);
         }

         @Override
         public void onTEBRectSelected() {
             TXLog.i(TAG, "onTEBRectSelected:" );
         }

         @Override
        public void onTEBDeleteFile(String fileId) {
        }

        @Override
        public void onTEBSwitchFile(String fileId) {
        }

         @Override
         public void onTEBAddTranscodeFile(String s) {
             TXLog.i(TAG, "onTEBAddTranscodeFile:" + s);
         }

         @Override
        public void onTEBUndoStatusChanged(boolean canUndo) {
            TICClassMainActivity activityEx = mActivityRef.get();
            if (activityEx != null) {
                activityEx.mCanUndo = canUndo;
            }
        }

        @Override
        public void onTEBRedoStatusChanged(boolean canredo){
            TICClassMainActivity activityEx = mActivityRef.get();
            if (activityEx != null) {
                activityEx.mCanRedo = canredo;
            }
        }

        @Override
        public void onTEBFileUploadProgress(final String path, int currentBytes, int totalBytes, int uploadSpeed, float percent) {
            TXLog.i(TAG, "onTEBFileUploadProgress:" + path + " percent:" + percent);
        }

         @Override
         public void onTEBFileUploadStatus(final String path, int status, int code, String statusMsg) {
             TXLog.i(TAG, "onTEBFileUploadStatus:" + path + " status:" + status);
         }

         @Override
         public void onTEBFileTranscodeProgress(String s, String s1, String s2, TEduBoardController.TEduBoardTranscodeFileResult tEduBoardTranscodeFileResult) {

         }

         @Override
         public void onTEBH5FileStatusChanged(String fileId, int status) {

         }

         @Override
         public void onTEBAddImagesFile(String fileId) {
             Log.i(TAG, "onTEBAddImagesFile:" + fileId);
             TICClassMainActivity activityEx = mActivityRef.get();
             TEduBoardController.TEduBoardFileInfo fileInfo = activityEx.mBoard.getFileInfo(fileId);
         }

         @Override
         public void onTEBVideoStatusChanged(String fileId, int status, float progress, float duration) {
             Log.i(TAG, "onTEBVideoStatusChanged:" + fileId + " | " + status + "|" + progress);
         }

         @Override
         public void onTEBImageStatusChanged(String boardId, String url, int status) {
             TXLog.i(TAG, "onTEBImageStatusChanged:" + boardId + "|" + url + "|" + status);
         }

         @Override
         public void onTEBSetBackgroundImage(final String url){
             Log.i(TAG, "onTEBSetBackgroundImage:" + url);
         }

         @Override
         public void onTEBAddImageElement(final String url){
             Log.i(TAG, "onTEBAddImageElement:" + url);
         }

         @Override
         public void onTEBBackgroundH5StatusChanged(String boardId, String url, int status) {
             Log.i(TAG, "onTEBBackgroundH5StatusChanged:" + boardId  + " url:" + boardId + " status:" + status);
         }
     }



}
