package com.tencent.tic.demo.activities;

import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Point;
import android.os.Bundle;
import android.os.Environment;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.tencent.smtt.sdk.QbSdk;
import com.tencent.teduboard.TEduBoardController;
import com.tencent.tic.core.BoardManager;
import com.tencent.tic.core.IMManager;
import com.tencent.tic.demo.R;
import com.tencent.tic.demo.TICSDKDemoApp;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

public class TICClassMainActivity extends BaseActvity
        implements View.OnClickListener {
    private final static String TAG = "TICClassMainActivity";

    TICMenuDialog moreDlg;
    MySettingCallback mySettingCallback;
    boolean mEnableAudio = true;
    boolean mEnableCamera = true;
    boolean mEnableFrontCamera = true;
    boolean mEnableAudioRouteSpeaker = true; //扬声器
    boolean mCanRedo = false;
    boolean mCanUndo = false;
    boolean nickNameVisiable = true;
    /**
     * 白板视图控件
     */
    FrameLayout mBoardContainer;
    TEduBoardController mBoard;
    MyBoardCallback mBoardCallback;
    boolean mHistroyDataSyncCompleted = false;

    // 消息输入
    String mImgsFid;
    String mAudioElementId;

    private EditText inputEt;
    private String textH5Id;
    private String textH5Status;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_class_ex);
        //在白板上文本输入时，避免出现软键盘盖住情况。
        // getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        //1、获取用户信息
        mUserID = getIntent().getStringExtra(USER_ID);
        mUserSig = getIntent().getStringExtra(USER_SIG);
        mRoomId = getIntent().getIntExtra(USER_ROOM, 0);

        //3、初始化View
        initView();

        QbSdk.forceSysWebView();

        joinClass();
    }


    @Override
    protected void onStop() {
        if (isFinishing()) {
            BoardManager.getInstance().destroyBoard();
        }
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        removeBoardView();
        super.onDestroy();
    }


    private void initView() {
        //Title
        findViewById(R.id.tv_double_room_back_button).setOnClickListener(this);
        findViewById(R.id.tv_memu).setOnClickListener(this);
        ((TextView) findViewById(R.id.tv_room_id)).setText(String.valueOf(mRoomId));

        tvLog = (TextView) findViewById(R.id.tv_log);
      //  tvLog.setMovementMethod(ScrollingMovementMethod.getInstance());
        ((EditText) findViewById(R.id.test_color)).setText("#FF00FF00");
        findViewById(R.id.btn_color).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String color = ((EditText) findViewById(R.id.test_color)).getText().toString();
                int tempColor = Color.parseColor(color);
                boardview.setBackgroundColor(tempColor);
            }
        });
    }

    boolean checkPermissions() {
        String[] PERMISSIONS = {
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE" };
//检测是否有写的权限
        int permission = ContextCompat.checkSelfPermission(this,
                "android.permission.WRITE_EXTERNAL_STORAGE");
        if (permission != PackageManager.PERMISSION_GRANTED) {
            // 没有写的权限，去申请写的权限，会弹出对话框
            ActivityCompat.requestPermissions(this, PERMISSIONS,1);
            return false;
        }
        return true;
    }
    //------回调设置的处理------
    class MySettingCallback implements TICMenuDialog.IMoreListener {

        @Override
        public void onEnableAudio(boolean bEnableAudio) {
            mEnableAudio = bEnableAudio;
        }

        @Override
        public void onSwitchAudioRoute(boolean speaker) {
            mEnableAudioRouteSpeaker = speaker;
        }

        @Override
        public void onEnableCamera(boolean bEnableCamera) {
            mEnableCamera = bEnableCamera;
        }

        @Override
        public void onSwitchCamera(boolean bFrontCamera) {
            mEnableFrontCamera = bFrontCamera;
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
        public void onStartSnapshot() {
            if (checkPermissions()) {
                TEduBoardController.TEduBoardSnapshotInfo snapshotInfo = new TEduBoardController.TEduBoardSnapshotInfo();
                long now = System.currentTimeMillis();
                snapshotInfo.path = Environment.getExternalStorageDirectory().getPath() + "/DCIM/ScreenShots/" + now + ".png";
                mBoard.snapshot(snapshotInfo);
            }
        }

        @Override
        public void onNextTextInput(String textContent, boolean keepFocus) {
            mBoard.setNextTextInput(textContent, keepFocus);
        }

        @Override
        public void onTipTextInput(String textContent) {
            TEduBoardController.TEduBoardToolTypeTitleStyle titleStyle
                    = new TEduBoardController.TEduBoardToolTypeTitleStyle();
            titleStyle.color = "#FF0000";
            titleStyle.size = 1000;
            titleStyle.style = TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_BOLD_ITALIC;
            titleStyle.position = TEduBoardController.TEduBoardPosition.TEDU_BOARD_POSITION_RIGHT_TOP;

            mBoard.setToolTypeTitle(textContent, titleStyle, TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER);
        }

        @Override
        public void onWipeNumInput(int num) {
            mBoard.setEraseLayerLimit(num);
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
        public void onAddElement(int type, String url) {
            String elementId = mBoard.addElement(type, url);
            if (type == 4) {
                mAudioElementId = elementId;
            }
            Log.d("evaluateJs", "onAddElement elementId: " + elementId + " mAudioElementId: " + mAudioElementId);
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
        public void setWipeType(int wipeType) {
            List<Integer> typeArray = new ArrayList<>();
            typeArray.add(wipeType);
            mBoard.setEraseLayerType(typeArray);
        }

        @Override
        public void onSetNickNameVisiable(boolean visiable) {
            nickNameVisiable = visiable;
            mBoard.setOwnerNickNameVisible(visiable);
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
        public void onAddBoard(String url) {
            mBoard.addBoard(url, 0, 0, true);
        }

        @Override
        public void onDeleteBoard(String boardId) {
            mBoard.deleteBoard(boardId);
        }

        @Override
        public void onGotoBoard(String boardId) {
            //   mBoard.gotoBoard(boardId);
            for (int i = 0; i < 50; i++) {
                String fileId = mBoard.getCurrentFile();
                mBoard.getFileInfo(fileId);
            }
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
            mBoard.addTranscodeFile(myresult, true);
        }

        @Override
        public void onAddH5File(String url) {
            mBoard.addH5File(url,null,true);
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
            mImgsFid = mBoard.addImagesFile(urls,null,true);
        }

        @Override
        public void onPlayVideoFile(String url) {
            mBoard.addVideoFile(url,null,true);
        }

        @Override
        public void onPlayAudio() {
            if (!TextUtils.isEmpty(mAudioElementId)) {
                mBoard.playAudio(mAudioElementId);
                // mBoard.seekAudio(mAudioElementId, 120);
                //     mBoard.setAudioVolume(mAudioElementId,0.7f);
            }
        }

        @Override
        public void onPauseAudio() {
            if (!TextUtils.isEmpty(mAudioElementId)) {
                mBoard.pauseAudio(mAudioElementId);
                // mBoard.getAudioVolume(mAudioElementId);
                mBoard.getBoardElementList("");
            }

        }

        @Override
        public void onAddBackupDomain() {
            mBoard.addBackupDomain("https://test2.tencent.com", "http://b.hiphotos.baidu.com", 0);
        }

        @Override
        public void onRemoveBackupDomain() {
            mBoard.removeBackupDomain("https://test2.tencent.com", "http://b.hiphotos.baidu.com");

        }

        @Override
        public void onShowVideoCtrl(boolean value) {
            mBoard.showVideoControl(value);
        }

        @Override
        public void onSyncAndReload() {
            mBoard.syncAndReload();
        }

        @Override
        public void onSetSystemCursorEnable(boolean systemCursorEnable) {
            mBoard.setSystemCursorEnable(systemCursorEnable);
        }

        @Override
        public void onAddBoardToClassGroup(String groupId, String boardId) {
            mBoard.addBoardToClassGroup(groupId, boardId);
        }

        @Override
        public void onAddUserToClassGroup(String groupId, String userId) {
            mBoard.addUserToClassGroup(groupId, userId);
        }

        @Override
        public void onGetAllClassGroupIds() {
            mBoard.getAllClassGroupIds();
        }

        @Override
        public void onGetClassGroupEnable() {
            mBoard.getClassGroupEnable();
        }

        @Override
        public void onGetClassGroupIdByUserId(String userId) {
            mBoard.getClassGroupIdByUserId(userId);
        }

        @Override
        public void onGetClassGroupInfoByGroupId(String groupId) {
            mBoard.getClassGroupInfoByGroupId(groupId);
        }

        @Override
        public void onGotoClassGroupBoard(String boardId) {
            mBoard.gotoClassGroupBoard(boardId);
        }

        @Override
        public void onRemoveBoardInClassGroup(String groupId, String boardId) {
            mBoard.removeBoardInClassGroup(groupId, boardId);
        }

        @Override
        public void onRemoveClassGroup(String groupId) {
            mBoard.removeClassGroup(groupId);
        }

        @Override
        public void onRemoveUserInClassGroup(String groupId, String userId) {
            mBoard.removeUserInClassGroup(groupId, userId);
        }

        @Override
        public void onResetClassGroup() {
            mBoard.resetClassGroup();
        }

        @Override
        public void onSetClassGroup(String groupId, List<String> boards, List<String> users, String title, String currentBoardId) {
            mBoard.setClassGroup(groupId, boards, users, title, currentBoardId);
        }

        @Override
        public void onSetClassGroupEnable(boolean enable) {
            mBoard.setClassGroupEnable(enable);
        }

        @Override
        public void onSetClassGroupTitle(String groupId, String title) {
            mBoard.setClassGroupTitle(groupId, title);
        }
    }

    View boardview;

    void addBoardView() {
        mBoardContainer = (FrameLayout) findViewById(R.id.board_view_container);
        boardview = mBoard.getBoardRenderView();
        //  boardview.setBackgroundColor(Color.RED);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
        //  mBoardContainer.addView(boardview, layoutParams);
        mBoard.addBoardViewToContainer(mBoardContainer,boardview, layoutParams);
        //  boardview.setBackgroundColor(getResources().getColor(R.color.colorRed));
     /*   TEduBoardController.TEduBoardColor boardColor = new TEduBoardController.TEduBoardColor(0, 0, 255, 1);
        mBoard.setBackgroundColor(boardColor);*/
        //   Log.d(TAG, "boardview tag: " + mBoard.getBoardRenderView().getTag());
     /*   DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);
        int width = dm.widthPixels;
        int height = dm.heightPixels;
        FrameLayout.LayoutParams linearParams = (FrameLayout.LayoutParams) boardview.getLayoutParams();
        linearParams.height = height;
        linearParams.width = width;
        boardview.setLayoutParams(linearParams);*/
       /* boardview.addOnLayoutChangeListener(new View.OnLayoutChangeListener() {
            @Override
            public void onLayoutChange(View v, int left, int top, int right, int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom) {
                int width = v.getWidth();
                int height = v.getHeight();
                TLogger.i(TAG, "board_size_change mBoardContainer", "width:" + width + " height:" + height);
            }
        });*/

        //设置透明
        //boardview.setBackgroundColor(Color.TRANSPARENT);
        //boardview.getBackground().setAlpha(0); // 设置填充透明度 范围：0-255
        //mBoard.setGlobalBackgroundColor(new TEduBoardController.TEduBoardColor(0, 0,0, 0));
        //mBoard.setBackgroundColor(new TEduBoardController.TEduBoardColor(0, 0,10, 0));
        //mBoard.showVideoControl(false); //不显示视频控制栏
        postToast("正在使用白板：" + TEduBoardController.getVersion(), true);
    }

    public void testBoardSizeChange(boolean change) {
        FrameLayout.LayoutParams linearParams = (FrameLayout.LayoutParams) boardview.getLayoutParams();
        if (change) {
            linearParams.height = 600;
            linearParams.width = 200;
        } else {
            DisplayMetrics dm = new DisplayMetrics();
            getWindowManager().getDefaultDisplay().getMetrics(dm);
            int width = dm.widthPixels;
            int height = dm.heightPixels;
            linearParams.height = height;
            linearParams.width = width;
        }
        boardview.setLayoutParams(linearParams);
    }

    private void removeBoardView() {
        if (mBoard != null) {
            View boardview = mBoard.getBoardRenderView();
            if (mBoardContainer != null && boardview != null) {
                mBoardContainer.removeView(boardview);
            }
        }
    }

    private void onTEBHistroyDataSyncCompleted() {
        mHistroyDataSyncCompleted = true;
        postToast("历史数据同步完成", false);
    }

    boolean isChange = true;

    @Override
    public void onClick(View v) {

        switch (v.getId()) {

            case R.id.tv_double_room_back_button: //返回
                quitClass();
          //      String expression = "f(x) = \\int_{-\\infty}^\\infty \\hat{f}(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi";
          //      mBoard.addElementFormula(expression);
                //     quitClass();
                //    testBoardSizeChange(isChange);
                //     isChange = !isChange;
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


                TICMenuDialog.SettingCacheData settingCacheData = new TICMenuDialog.SettingCacheData();

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

                settingCacheData.isNickNameVisiable = nickNameVisiable;
                moreDlg.show(settingCacheData);
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

        // 1、 IM进房
        final Context ctx = this;
        IMManager.getInstance().joinIMGroup(String.format("%d", mRoomId), new IMManager.IMCallBack() {
            @Override
            public void onComplete(int errCode, String errMsg) {
                if (errCode == 0) {
                    // 2、 创建白板
                    mBoard = BoardManager.getInstance().creteBoard(ctx, ((TICSDKDemoApp) getApplication()).getConfig().getSdkAppIdFromConfig(), mUserID, mUserSig, mRoomId,
                            new BoardManager.CreateBoardCallBack() {
                                @Override
                                public void onCreteBoard(int errCode, String errMsg, TEduBoardController boardController) {
                                    if (errCode == 0) {
                                        postToast("进入课堂成功:" + mRoomId);
                                    }
                                    else  {
                                        postToast("进入课堂失败:" + mRoomId + " err:" + errCode + " msg:" + errMsg);
                                    }

                                }
                            });
                    mBoard.addCallback(mBoardCallback);
                }
                else {
                    postToast("进入课堂失败:" + mRoomId + " err:" + errCode + " msg:" + errMsg);
                }
            }
        });

    }

    private void quitClass() {
        if (mBoard != null) {
            mBoard.removeCallback(mBoardCallback);
        }
        BoardManager.getInstance().destroyBoard();

        IMManager.getInstance().quitIMGroup(String.valueOf(mRoomId), new IMManager.IMCallBack(){
            @Override
            public void onComplete(int errCode, String errMsg) {
                if (errCode == 0) {
                    postToast("quitClassroom#onSuccess", true);
                    finish();
                }
                else {
                    postToast("quitClassroom#onError: errCode = " + errCode + "  description " + errMsg);
                    finish();
                }
            }
        });
    }

    /**
     * 退出课堂
     */
    public void onQuitClsssroomClick(View v) {
        quitClass();
    }

    //---------------------- TICEventListener-----------------
    @Override
    public void onTIMForceOffline() {
        super.onTIMForceOffline();
        quitClass();
    }

    // IM掉线
    @Override
    public void onConnectFailed(int code, String error) {
        super.onConnectFailed(code,error);
        quitClass();
    }

    //Board Callback
    static private class MyBoardCallback implements TEduBoardController.TEduBoardCallback {
        WeakReference<TICClassMainActivity> mActivityRef;

        MyBoardCallback(TICClassMainActivity activityEx) {
            mActivityRef = new WeakReference<>(activityEx);
        }

        @Override
        public void onTEBError(int code, String msg) {
        }

        @Override
        public void onTEBWarning(int code, String msg) {
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
                String currentBoard = activityEx.mBoard.getCurrentBoard();
                String currentFile = activityEx.mBoard.getCurrentFile();
                Log.w("DataSyncCompleted", "currentBoard: " + currentBoard + " currentFile: " + currentFile);
            }
        }

        @Override
        public void onTEBSyncData(String data) {

        }


        @Override
        public void onTEBScrollChanged(String boardId, int trigger, double scrollLeft, double scrollTop, double scale) {
            
        }

        @Override
        public void onTEBAddBoard(List<String> boardId, final String fileId) {
        }

        @Override
        public void onTEBDeleteBoard(List<String> boardId, final String fileId) {
        }

        @Override
        public void onTEBGotoBoard(String boardId, final String fileId) {
        }

        @Override
        public void onTEBGotoStep(int currentStep, int total) {
        }

        @Override
        public void onTEBRectSelected() {
        }

        @Override
        public void onTEBRefresh() {
        }

        @Override
        public void onTEBOfflineWarning(int count) {

        }

        @Override
        public void onTEBDeleteFile(String fileId) {
        }

        @Override
        public void onTEBSwitchFile(String fileId) {
        }

        @Override
        public void onTEBAddTranscodeFile(String s) {
        }

        @Override
        public void onTEBUndoStatusChanged(boolean canUndo) {
            TICClassMainActivity activityEx = mActivityRef.get();
            if (activityEx != null) {
                activityEx.mCanUndo = canUndo;
            }
        }

        @Override
        public void onTEBRedoStatusChanged(boolean canredo) {
            TICClassMainActivity activityEx = mActivityRef.get();
            if (activityEx != null) {
                activityEx.mCanRedo = canredo;
            }
        }

        @Override
        public void onTEBFileUploadProgress(final String path, int currentBytes, int totalBytes, int uploadSpeed, float percent) {
        }

        @Override
        public void onTEBFileUploadStatus(final String path, int status, int code, String statusMsg) {
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
        public void onTEBAudioStatusChanged(String elementId, int status, float progress, float duration) {
            Log.i(TAG, "onTEBAudioStatusChanged:" + elementId + " | " + status + "|" + progress);
        }

        @Override
        public void onTEBSnapshot(String path, int code, String msg) {
            Log.i(TAG, "onTEBSnapshot:" + path + " | " + code + "|" + msg);
            if (code == 0) {
                mActivityRef.get().postToast("截图成功，图片保存在：" + path, true);
            }
        }

        @Override
        public void onTEBH5PPTStatusChanged(int statusCode, String fid, String describeMsg) {

        }

        @Override
        public void onTEBTextElementStatusChange(String status, String id, String value, int left, int top) {
            Log.e(TAG, "onTEBTextComponentStatusChange textH5Status:" + status + " textH5Id:" + id);

            TICClassMainActivity activityEx = mActivityRef.get();
            if (activityEx != null) {
                activityEx.textH5Id = id;
                activityEx.textH5Status = status;
            }
        }

        @Override
        public void onTEBClassGroupStatusChanged(boolean enable, String classGroupId, int operationType, String message) {

        }

        @Override
        public void onTEBCursorPositionChanged(Point point) {

        }

        @Override
        public void onTEBImageStatusChanged(String boardId, String url, int status) {
        }

        @Override
        public void onTEBSetBackgroundImage(final String url) {
            Log.i(TAG, "onTEBSetBackgroundImage:" + url);
        }

        @Override
        public void onTEBAddImageElement(final String url) {
            Log.i(TAG, "onTEBAddImageElement:" + url);
        }

        @Override
        public void onTEBAddElement(String id, int type, String url) {

        }

        @Override
        public void onTEBDeleteElement(List<String> id) {

        }

        @Override
        public void onTEBSelectElement(List<TEduBoardController.ElementItem> elementItemList) {

        }

        @Override
        public void onTEBMathGraphEvent(int code, String boardId, String graphId, String message) {

        }

        @Override
        public void onTEBZoomDragStatus(String fid, int scale, int xOffset, int yOffset) {

        }

        @Override
        public void onTEBBackgroundH5StatusChanged(String boardId, String url, int status) {
            Log.i(TAG, "onTEBBackgroundH5StatusChanged:" + boardId + " url:" + boardId + " status:" + status);
        }

        @Override
        public void onTEBTextElementWarning(String code, String message) {

        }

        @Override
        public void onTEBImageElementStatusChanged(int status, String currentBoardId, String imgUrl, String currentImgUrl) {

        }


    }


}
