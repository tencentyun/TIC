package com.tencent.tic.core;

import android.content.Context;
import android.graphics.Point;

import com.tencent.teduboard.TEduBoardController;

import java.util.List;


public class BoardManager {
    private TEduBoardController mBoard;
    private int mSdkAppID;
    private String mUserId;
    private String mUserSig;
    private int mClassId;
    private boolean mIsEnterRoom = false;  // 是否已进入白板房间
    private CreateBoardCallBack mCreateCallBack; // creteBoard回调
    private BoardManager.BoardCallback mBoardCallback; // 白板状态回调

    private static volatile BoardManager instance;
    private static final byte[] SYNC = new byte[1];

    public static BoardManager getInstance() {
        if (instance == null) {
            synchronized (SYNC) {
                if (instance == null) {
                    instance = new BoardManager();
                }
            }
        }
        return instance;
    }

    public TEduBoardController getBoardController() {
        return mBoard;
    }

    /**
     * 创建白板
     *
     * @param context
     * @param sdkAppID
     * @param userId
     * @param userSig
     * @param classId 教室号
     * @param callback 创建白板结果回调
     */
    public TEduBoardController creteBoard(Context context,
                                          final int sdkAppID,
                                          final String userId,
                                          final String userSig,
                                          final int classId,
                                          final CreateBoardCallBack callback) {
        if (this.mIsEnterRoom) {
            if (callback != null) {
                callback.onCreteBoard(-1, "请先退出当前白板", mBoard);
            }
            return mBoard;
        }
        this.mSdkAppID = sdkAppID;
        this.mUserId = userId;
        this.mUserSig = userSig;
        this.mClassId = classId;
        this.mCreateCallBack = callback;
        mBoard = new TEduBoardController(context.getApplicationContext());
        mBoardCallback = new BoardManager.BoardCallback();
        mBoard.addCallback(mBoardCallback);
        TEduBoardController.TEduBoardAuthParam authParam = new TEduBoardController.TEduBoardAuthParam(sdkAppID, userId, userSig);
        TEduBoardController.TEduBoardInitParam initParam = new TEduBoardController.TEduBoardInitParam();
        initParam.brushColor = new TEduBoardController.TEduBoardColor(255, 0, 0, 255);
        initParam.smoothLevel = 0; //用于指定笔迹平滑级别，默认值0.1，取值[0, 1]
        initParam.formulaEnable = true;
        initParam.pinchToZoomEnable = true;
        mBoard.init(authParam, classId, initParam);
        return mBoard;
    }
    /**
     * 销毁白板
     * */
    public void destroyBoard() {
        mIsEnterRoom = false;
        if (mBoard != null) {
            if (mBoardCallback != null) {
                mBoard.removeCallback(mBoardCallback);
            }
            mBoard.uninit();
        }
        mBoard = null;
        mBoardCallback = null;
        mCreateCallBack = null;
    }

    public interface CreateBoardCallBack {
        /**
         * 创建白板结果回调
         *
         * @param errCode 错误码
         * @param errMsg  错误描述
         * @param boardController  白板控制器
         */
        void onCreteBoard(int errCode, String errMsg, TEduBoardController boardController);
    }

    //白板回调，用于监控事件
    private static class BoardCallback implements TEduBoardController.TEduBoardCallback {
        @Override
        public void onTEBError(int code, String msg) {
            BoardManager manager = BoardManager.getInstance();
            if (manager.mCreateCallBack != null) {
                manager.mCreateCallBack.onCreteBoard(code, msg, null);
                manager.mCreateCallBack = null;
            }
            manager.mBoard.removeCallback(this);
            manager.mIsEnterRoom = false;
            manager.mBoard.uninit();
            manager.mBoard = null;
        }

        @Override
        public void onTEBInit() {
            BoardManager manager = BoardManager.getInstance();
            if (manager.mCreateCallBack != null) {
                manager.mCreateCallBack.onCreteBoard(0, "", manager.mBoard);
                manager.mCreateCallBack = null;
            }
            manager.mIsEnterRoom = true;
            TEduBoardController.TEduBoardToolTypeTitleStyle style = new TEduBoardController.TEduBoardToolTypeTitleStyle();
            style.position = TEduBoardController.TEduBoardPosition.TEDU_BOARD_POSITION_RIGHT_TOP;
            style.color = "#f00";
            style.size = 200;
            style.style = TEduBoardController.TEduBoardTextStyle.TEDU_BOARD_TEXT_STYLE_NORMAL;
            manager.mBoard.setToolTypeTitle(manager.mUserId, style, TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN);
        }

        @Override
        public void onTEBWarning(int code, String msg) {
        }

        @Override
        public void onTEBHistroyDataSyncCompleted() {
        }

        @Override
        public void onTEBSyncData(String s) {

        }

        @Override
        public void onTEBUndoStatusChanged(boolean b) {

        }

        @Override
        public void onTEBRedoStatusChanged(boolean b) {

        }

        @Override
        public void onTEBImageStatusChanged(String s, String s1, int i) {

        }

        @Override
        public void onTEBScrollChanged(String boardId, int trigger, double scrollLeft, double scrollTop, double scale) {

        }

        @Override
        public void onTEBSetBackgroundImage(String s) {

        }

        @Override
        public void onTEBBackgroundH5StatusChanged(String s, String s1, int i) {

        }

        @Override
        public void onTEBTextElementWarning(String code, String message) {

        }

        @Override
        public void onTEBImageElementStatusChanged(int status, String currentBoardId, String imgUrl, String currentImgUrl) {

        }

        @Override
        public void onTEBAddBoard(List<String> list, String s) {

        }

        @Override
        public void onTEBDeleteBoard(List<String> list, String s) {

        }

        @Override
        public void onTEBGotoBoard(String s, String s1) {

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
        public void onTEBSnapshot(String path, int code, String msg) {

        }

        @Override
        public void onTEBH5PPTStatusChanged(int statusCode, String fid, String describeMsg) {

        }

        @Override
        public void onTEBTextElementStatusChange(String status, String id, String value, int left, int top) {

        }


        @Override
        public void onTEBClassGroupStatusChanged(boolean enable, String classGroupId, int operationType, String message) {

        }

        @Override
        public void onTEBCursorPositionChanged(Point point) {

        }

        @Override
        public void onTEBAddTranscodeFile(String s) {
        }

        @Override
        public void onTEBDeleteFile(String s) {

        }

        @Override
        public void onTEBSwitchFile(String s) {

        }

        @Override
        public void onTEBFileUploadProgress(String s, int i, int i1, int i2, float v) {

        }

        @Override
        public void onTEBFileUploadStatus(String s, int i, int i1, String s1) {

        }

        @Override
        public void onTEBFileTranscodeProgress(String s, String s1, String s2, TEduBoardController.TEduBoardTranscodeFileResult tEduBoardTranscodeFileResult) {

        }

        @Override
        public void onTEBH5FileStatusChanged(String fileId, int status) {

        }

        @Override
        public void onTEBAddImagesFile(String fileId) {

        }

        @Override
        public void onTEBVideoStatusChanged(String fileId, int status, float progress, float duration) {

        }

        @Override
        public void onTEBAudioStatusChanged(String elementId, int status, float progress, float duration) {

        }

        @Override
        public void onTEBAddImageElement(String url) {

        }

        @Override
        public void onTEBAddElement(String id,int type, String url) {

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

    }
}
