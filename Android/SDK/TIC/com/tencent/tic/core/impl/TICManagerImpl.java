package com.tencent.tic.core.impl;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;

import com.tencent.imsdk.TIMCallBack;
import com.tencent.imsdk.TIMConversation;
import com.tencent.imsdk.TIMConversationType;
import com.tencent.imsdk.TIMCustomElem;
import com.tencent.imsdk.TIMElem;
import com.tencent.imsdk.TIMElemType;
import com.tencent.imsdk.TIMGroupAddOpt;
import com.tencent.imsdk.TIMGroupEventListener;
import com.tencent.imsdk.TIMGroupManager;
import com.tencent.imsdk.TIMGroupSystemElem;
import com.tencent.imsdk.TIMGroupSystemElemType;
import com.tencent.imsdk.TIMGroupTipsElem;
import com.tencent.imsdk.TIMGroupTipsType;
import com.tencent.imsdk.TIMLogLevel;
import com.tencent.imsdk.TIMManager;
import com.tencent.imsdk.TIMMessage;
import com.tencent.imsdk.TIMMessageListener;
import com.tencent.imsdk.TIMSdkConfig;
import com.tencent.imsdk.TIMTextElem;
import com.tencent.imsdk.TIMValueCallBack;
import com.tencent.liteav.basic.log.TXCLog;
import com.tencent.teduboard.TEduBoardController;
import com.tencent.tic.core.TICClassroomOption;
import com.tencent.tic.core.TICManager;
import com.tencent.tic.core.impl.observer.TICEventObservable;
import com.tencent.tic.core.impl.observer.TICIMStatusObservable;
import com.tencent.tic.core.impl.observer.TICMessageObservable;
import com.tencent.tic.core.impl.utils.CallbackUtil;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;
import com.tencent.trtc.TRTCCloudListener;
import com.tencent.trtc.TRTCStatistics;

import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TICManagerImpl extends TICManager {

    private static final String TAG = "TICManager";
    private static final String SYNCTIME = "syncTime";
    private static final String COMPAT_SAAS_CHAT = "_chat";
    TICCallback mEnterRoomCallback; // 进房callback
    private Handler mMainHandler;
    boolean mIsSendSyncTime = false;  //
    int mDisableModule = TICDisableModule.TIC_DISABLE_MODULE_NONE;

    //TRTC
    private TRTCCloud mTrtcCloud;              /// TRTC SDK 实例对象
    private TRTCCloudListener mTrtcListener;    /// TRTC SDK 回调监听

    //IM
    private TIMMessageListener mTIMListener;
    private TIMGroupEventListener mGroupEventListener;
    //Board
    private TEduBoardController mBoard;
    private BoardCallback mBoardCallback;

    //Recorder
    private TICRecorder mRecorder;

    private static final byte[] SYNC = new byte[1];

    private Context mAppContext;
    private int sdkAppId = 0;
    private UserInfo userInfo;
    private TICClassroomOption classroomOption;

    private TICEventObservable mEventListner;
    private TICIMStatusObservable mStatusListner;
    private TICMessageObservable mMessageListner;

    /////////////////////////////////////////////////////////////////////////////////
//
//                      （一）初始和终止接口函数
//
/////////////////////////////////////////////////////////////////////////////////
    private static volatile TICManager instance;

    public static TICManager sharedInstance() {
        if (instance == null) {
            synchronized (SYNC) {
                if (instance == null) {
                    instance = new TICManagerImpl();
                }
            }
        }
        return instance;
    }

    private TICManagerImpl() {
        mMainHandler = new Handler(Looper.getMainLooper());

        userInfo = new UserInfo();

        mEventListner = new TICEventObservable();
        mStatusListner = new TICIMStatusObservable();
        mMessageListner = new TICMessageObservable();

        TXCLog.i(TAG, "TICManager: constructor ");
    }

    @Override
    public int init(Context context, int appId) {
        int result = init(context, appId, mDisableModule);
        return result;
    }


    public int init(Context context, int appId, int disableModule) {

        TXCLog.i(TAG, "TICManager: init, context:" + context + " appid:" + appId);
        TICReporter.updateAppId(appId);
        TICReporter.report(TICReporter.EventId.INIT_SDK_START);

        //0、给值
        sdkAppId = appId;
        mAppContext = context.getApplicationContext();

        //1、 TIM SDK初始化
        TIMSdkConfig timSdkConfig = new TIMSdkConfig(appId)
                .enableLogPrint(true)
                .setLogLevel(TIMLogLevel.DEBUG); //TODO::在正式发布时，设置TIMLogLevel.OFF
        TIMManager.getInstance().init(context, timSdkConfig);


        mGroupEventListener = new TIMGroupEventListener() {
            @Override
            public void onGroupTipsEvent(TIMGroupTipsElem timGroupTipsElem) {
                handleGroupTipsMessage(timGroupTipsElem);
            }
        };

        mTIMListener = new TIMMessageListener() {
            @Override
            public boolean onNewMessages(List<TIMMessage> list) {
                return handleNewMessages(list);
            }
        };

        //2. TRTC SDK初始化
        if ((disableModule & TICDisableModule.TIC_DISABLE_MODULE_TRTC) == 0) {
            if (mTrtcCloud == null) {
                mTrtcListener = new TRTCCloudListenerImpl();
                mTrtcCloud = TRTCCloud.sharedInstance(mAppContext);
                mTrtcCloud.setListener(mTrtcListener);
            }
        }

        //3. TEdu Board
        if (mBoard == null) {
            mBoard = new TEduBoardController(mAppContext);
            mBoardCallback = new BoardCallback();
            mBoard.addCallback(mBoardCallback);
        }

        //4. Recorder
        if (mRecorder == null) {
            mRecorder = new TICRecorder(this);
        }
        TICReporter.report(TICReporter.EventId.INIT_SDK_END);
        return 0;
    }

    @Override
    public int unInit() {
        TXCLog.i(TAG, "TICManager: unInit");

        //1、销毁trtc
        if (mTrtcCloud != null) {
            //TRTCCloud.destroySharedInstance();
            mTrtcCloud = null;
        }

        return 0;
    }


    public TRTCCloud getTRTCClound() {
        if (mTrtcCloud == null) {
            TXCLog.e(TAG, "TICManager: getTRTCClound null, Do you call init?");
        }

        return mTrtcCloud;
    }

    public TEduBoardController getBoardController() {
        if (mBoard == null) {
            TXCLog.e(TAG, "TICManager: getBoardController null, Do you call init?");
        }
        return mBoard;
    }

    public void switchRole(int role) {

        if (mTrtcCloud != null) {
            mTrtcCloud.switchRole(role);
        }

        if (classroomOption.classScene == TICClassScene.TIC_CLASS_SCENE_LIVE
                && role == TICRoleType.TIC_ROLE_TYPE_ANCHOR) {
            startSyncTimer();
        } else {
            stopSyncTimer();
        }
    }

    void startSyncTimer() {
        TXCLog.i(TAG, "TICManager: startSyncTimer synctime: " + mIsSendSyncTime);
        if (!mIsSendSyncTime) {
            mMainHandler.postDelayed(new MySyncTimeRunnable(this), 5000);
            mIsSendSyncTime = true;
        }
    }

    void stopSyncTimer() {
        mIsSendSyncTime = false;
        TXCLog.i(TAG, "TICManager: stopSyncTimer synctime: " + mIsSendSyncTime);
    }

    void sendSyncTimeBySEI() {
        if (mTrtcCloud != null && mBoard != null) {

            if (mIsSendSyncTime) {

                long time = mBoard.getSyncTime();
                TXCLog.i(TAG, "TICManager: sendSyncTimeBySEI synctime: " + time);
                if (time != 0) {
                    String result = "";
                    JSONObject json = new JSONObject();
                    try {
                        json.put(SYNCTIME, time);
                        result = json.toString();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if (!TextUtils.isEmpty(result)) {
                        mTrtcCloud.sendSEIMsg(result.getBytes(), 1);
                    }
                }

                mMainHandler.postDelayed(new MySyncTimeRunnable(this), 5000);
            }
        }
    }

    static class MySyncTimeRunnable implements Runnable {
        WeakReference<TICManagerImpl> mTICManagerRef;

        MySyncTimeRunnable(TICManagerImpl ticManager) {
            mTICManagerRef = new WeakReference<TICManagerImpl>(ticManager);
        }

        @Override
        public void run() {
            TICManagerImpl ticManager = mTICManagerRef.get();
            if (ticManager != null) {
                ticManager.sendSyncTimeBySEI();
            }
        }
    }


    @Override
    public void addEventListener(TICEventListener callback) {
        TXCLog.i(TAG, "TICManager: addEventListener:" + callback);
        mEventListner.addObserver(callback);
    }

    @Override
    public void removeEventListener(TICEventListener callback) {
        TXCLog.i(TAG, "TICManager: removeEventListener:" + callback);
        mEventListner.removeObserver(callback);
    }

    @Override
    public void addIMStatusListener(TICIMStatusListener callback) {
        TXCLog.i(TAG, "TICManager: addIMStatusListener:" + callback);
        mStatusListner.addObserver(callback);
    }

    @Override
    public void removeIMStatusListener(TICIMStatusListener callback) {
        TXCLog.i(TAG, "TICManager: removeIMStatusListener:" + callback);
        mStatusListner.removeObserver(callback);
    }

    @Override
    public void addIMMessageListener(TICMessageListener callback) {
        TXCLog.i(TAG, "TICManager: addIMMessageListener:" + callback);
        mMessageListner.addObserver(callback);
    }

    @Override
    public void removeIMMessageListener(TICMessageListener callback) {
        TXCLog.i(TAG, "TICManager: removeIMMessageListener:" + callback);
        mMessageListner.removeObserver(callback);
    }

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （二）TIC登录/登出/创建销毁课堂/进入退出课堂接口函数
    //
    /////////////////////////////////////////////////////////////////////////////////
    @Override
    public void login(final String userId, final String userSig, final TICCallback callBack) {

        TXCLog.i(TAG, "TICManager: login userid:" + userId + " sig:" + userSig);
        TICReporter.updateRoomId(0);
        TICReporter.updateUserId(userId);
        TICReporter.report(TICReporter.EventId.LOGIN_START);
        // IM 登陆
        setUserInfo(userId, userSig);

        TIMManager.getInstance().login(userId, userSig, new TIMCallBack() {
            @Override
            public void onSuccess() {
                TXCLog.i(TAG, "TICManager: login onSuccess:" + userId);
                TICReporter.report(TICReporter.EventId.LOGIN_END);
                //成功登录后，加入消息和状态监听
                TIMManager.getInstance().getUserConfig().setUserStatusListener(mStatusListner);
                TIMManager.getInstance().addMessageListener(mTIMListener);
                TIMManager.getInstance().getUserConfig().setGroupEventListener(mGroupEventListener);

                if (null != callBack) {
                    callBack.onSuccess("");
                }
            }

            @Override
            public void onError(int errCode, String errMsg) {
                TXCLog.i(TAG, "TICManager: login onError:" + errCode + " msg:" + errMsg);
                TICReporter.report(TICReporter.EventId.LOGIN_END, errCode, errMsg);
                if (null != callBack) {
                    callBack.onError(MODULE_IMSDK, errCode, "login failed: " + errMsg);
                }
            }
        });
    }

    @Override
    public void logout(final TICCallback callback) {
        TXCLog.i(TAG, "TICManager: logout callback:" + callback);
        TICReporter.report(TICReporter.EventId.LOGOUT_START);
        TIMManager.getInstance().logout(new TIMCallBack() {
            @Override
            public void onSuccess() {
                TXCLog.i(TAG, "TICManager: logout onSuccess");
                TICReporter.report(TICReporter.EventId.LOGOUT_END);
                if (null != callback) {
                    callback.onSuccess("");
                }
            }

            @Override
            public void onError(int errCode, String errMsg) {
                TXCLog.i(TAG, "TICManager: logout onError:" + errCode + " msg:" + errMsg);
                TICReporter.report(TICReporter.EventId.LOGOUT_END, errCode, errMsg);
                if (null != callback) {
                    callback.onError(MODULE_IMSDK, errCode, "logout failed: " + errMsg);
                }
            }
        });

        //退出登录后，去掉消息的监听
        TIMManager.getInstance().removeMessageListener(mTIMListener);
        TIMManager.getInstance().getUserConfig().setUserStatusListener(null);
        TIMManager.getInstance().getUserConfig().setGroupEventListener(null);
    }

    @Override
    public void createClassroom(final int classId, final int scene, final TICCallback callback) {
        TXCLog.i(TAG, "TICManager: createClassroom classId:" + classId + " scene:" + scene + " callback:" + callback);
        TICReporter.report(TICReporter.EventId.CREATE_GROUP_START);
        // 为了减少用户操作成本（收到群进出等通知需要配置工单才生效）群组类型由ChatRoom改为Public
        final String groupId = String.valueOf(classId);
        final String groupName = "interact group";
        final String groupType = ((scene == TICManager.TICClassScene.TIC_CLASS_SCENE_LIVE) ? "AVChatRoom" : "Public");

        TIMGroupManager.CreateGroupParam param = new TIMGroupManager.CreateGroupParam(groupType, groupName);
        param.setGroupId(groupId);
        param.setAddOption(TIMGroupAddOpt.TIM_GROUP_ADD_ANY); //
        TIMGroupManager.getInstance().createGroup(param, new TIMValueCallBack<String>() {

            @Override
            public void onSuccess(String s) {
                TXCLog.i(TAG, "TICManager: createClassroom onSuccess:" + classId + " msg:" + s);
                TICReporter.report(TICReporter.EventId.CREATE_GROUP_END);
                if (null != callback) {
                    callback.onSuccess(classId);
                }
            }

            @Override
            public void onError(int errCode, String errMsg) {
                if (null != callback) {
                    if (errCode == 10025) { // 群组ID已被使用，并且操作者为群主，可以直接使用。
                        TXCLog.i(TAG, "TICManager: createClassroom 10025 onSuccess:" + classId);
                        callback.onSuccess(classId);
                    } else {
                        TXCLog.i(TAG, "TICManager: createClassroom onError:" + errCode + " msg:" + errMsg);
                        TICReporter.report(TICReporter.EventId.CREATE_GROUP_END, errCode, errMsg);
                        callback.onError(MODULE_IMSDK, errCode, errMsg);
                    }
                }
            }
        });
    }

    @Override
    public void destroyClassroom(final int classId, final TICCallback callback) {

        TXCLog.i(TAG, "TICManager: destroyClassroom classId:" + classId + " callback:" + callback);
        TICReporter.report(TICReporter.EventId.DELETE_GROUP_START);
        final String groupId = String.valueOf(classId);

        TIMGroupManager.getInstance().deleteGroup(groupId, new TIMCallBack() {
            @Override
            public void onError(int errorCode, String errInfo) {
                TXCLog.i(TAG, "TICManager: destroyClassroom onError:" + errorCode + " msg:" + errInfo);
                TICReporter.report(TICReporter.EventId.DELETE_GROUP_END, errorCode, errInfo);
                CallbackUtil.notifyError(callback, MODULE_IMSDK, errorCode, errInfo);
            }

            @Override
            public void onSuccess() {
                TICReporter.report(TICReporter.EventId.DELETE_GROUP_END);
                TXCLog.i(TAG, "TICManager: destroyClassroom onSuccess");

            }
        });

    }

    @Override
    public void joinClassroom(final TICClassroomOption option, final TICCallback callback) {

        if (option == null || option.getClassId() < 0) {
            TXCLog.i(TAG, "TICManager: joinClassroom Para Error");
            CallbackUtil.notifyError(callback, MODULE_TIC_SDK, Error.ERR_INVALID_PARAMS, Error.ERR_MSG_INVALID_PARAMS);
            return;
        }

        TXCLog.i(TAG, "TICManager: joinClassroom classId:" + option.toString() + " callback:" + callback);

        classroomOption = option;

        final int classId = classroomOption.getClassId();
        String groupId = String.valueOf(classId);
        final String desc = "board group";

        TICReporter.updateRoomId(classId);
        TICReporter.report(TICReporter.EventId.JOIN_GROUP_START);
        TIMGroupManager.getInstance().applyJoinGroup(groupId, desc + groupId, new TIMCallBack() {
            @Override
            public void onSuccess() {

                TXCLog.i(TAG, "TICManager: joinClassroom onSuccess ");
                TICReporter.report(TICReporter.EventId.JOIN_GROUP_END);
                onJoinClassroomSuccessfully(callback);
            }

            @Override
            public void onError(int errCode, String errMsg) {
                if (callback != null) {
                    if (errCode == 10013) { //you are already group member.
                        TXCLog.i(TAG, "TICManager: joinClassroom 10013 onSuccess");
                        TICReporter.report(TICReporter.EventId.JOIN_GROUP_END);
                        onJoinClassroomSuccessfully(callback);
                    } else {
                        TXCLog.i(TAG, "TICManager: joinClassroom onError:" + errCode + "|" + errMsg);
                        TICReporter.report(TICReporter.EventId.JOIN_GROUP_END, errCode, errMsg);
                        callback.onError(MODULE_IMSDK, errCode, errMsg);
                    }
                }
            }
        });

        if (classroomOption.compatSaas) {
            groupId += COMPAT_SAAS_CHAT;
            TIMGroupManager.getInstance().applyJoinGroup(groupId, desc + groupId, new TIMCallBack() {
                @Override
                public void onSuccess() {
                    TXCLog.i(TAG, "TICManager: joinClassroom compatSaas onSuccess ");
                }

                @Override
                public void onError(int errCode, String errMsg) {
                    if (callback != null) {
                        if (errCode == 10013) { //you are already group member.
                            TXCLog.i(TAG, "TICManager: joinClassroom compatSaas 10013 onSuccess");
                        } else {
                            TXCLog.i(TAG, "TICManager: joinClassroom compatSaas onError:" + errCode + "|" + errMsg);
                        }
                    }
                }
            });
        }

    }

    @Override
    public void quitClassroom(boolean clearBoard, final TICCallback callback) {
        TXCLog.i(TAG, "TICManager: quitClassroom " + clearBoard + "|" + callback);

        if (classroomOption == null) {
            TXCLog.e(TAG, "TICManager: quitClassroom para Error.");
            CallbackUtil.notifyError(callback, MODULE_TIC_SDK, Error.ERR_NOT_IN_CLASS, Error.ERR_MSG_NOT_IN_CLASS);
            return;
        }

        TICReporter.report(TICReporter.EventId.QUIT_GROUP_START);
        //1.trtc退房间
        if (mTrtcCloud != null) {
            mTrtcCloud.exitRoom();
        }

        //2、如果clearBoard= true, 清除board中所有的历史数据，下次进来时看到的都是全新白板
        unitTEduBoard(clearBoard);

        //3、im退房间
        int classId = classroomOption.getClassId();
        String groupId = String.valueOf(classId);
        TIMGroupManager.getInstance().quitGroup(groupId, new TIMCallBack() {//NOTE:在被挤下线时，不会回调
            @Override
            public void onError(int errorCode, String errInfo) {
                TXCLog.e(TAG, "TICManager: quitClassroom onError, err:" + errorCode + " msg:" + errInfo);
                TICReporter.report(TICReporter.EventId.QUIT_GROUP_END, errorCode, errInfo);
                if (callback != null) {
                    if (errorCode == 10009) {
                        callback.onSuccess(0);
                    } else {
                        callback.onError(MODULE_IMSDK, errorCode, errInfo);
                    }
                }
            }

            @Override
            public void onSuccess() {
                TXCLog.e(TAG, "TICManager: quitClassroom onSuccess");
                TICReporter.report(TICReporter.EventId.QUIT_GROUP_END);
                CallbackUtil.notifySuccess(callback, 0);
            }
        });

        if (classroomOption.compatSaas) {
            groupId += COMPAT_SAAS_CHAT;

            TIMGroupManager.getInstance().quitGroup(groupId, new TIMCallBack() {//NOTE:在被挤下线时，不会回调
                @Override
                public void onError(int errorCode, String errInfo) {
                    TXCLog.e(TAG, "TICManager: quitClassroom compatSaas, err:" + errorCode + " msg:" + errInfo);
                }

                @Override
                public void onSuccess() {
                    TXCLog.e(TAG, "TICManager: quitClassroom onSuccess compatSaas");
                }
            });
        }

        //停止同步时间
        stopSyncTimer();

        //
        releaseClass();
    }

    private void onJoinClassroomSuccessfully(final TICCallback callback) {
        if (classroomOption == null || classroomOption.getClassId() < 0) {
            CallbackUtil.notifyError(callback, MODULE_TIC_SDK, Error.ERR_INVALID_PARAMS, Error.ERR_MSG_INVALID_PARAMS);
            return;
        }

        //TRTC进房
        mEnterRoomCallback = callback;

        if (mTrtcCloud != null) {
            TICReporter.report(TICReporter.EventId.ENTER_ROOM_START);
            TRTCCloudDef.TRTCParams trtcParams = new TRTCCloudDef.TRTCParams(sdkAppId, userInfo.getUserId()
                    , userInfo.getUserSig(), classroomOption.getClassId(), "", "");     /// TRTC SDK 视频通话房间进入所必须的参数
            if (classroomOption.classScene == TICClassScene.TIC_CLASS_SCENE_LIVE) {
                trtcParams.role = classroomOption.roleType;
            }
            mTrtcCloud.enterRoom(trtcParams, classroomOption.classScene);
        } else if ((mDisableModule & TICDisableModule.TIC_DISABLE_MODULE_TRTC) == 0) { //TRTC不需要进入房间.
            if (mEnterRoomCallback != null) {
                mEnterRoomCallback.onSuccess("succ");
            }
        }

        //Board进行初始化
        initTEduBoard();
    }

    private void initTEduBoard() {
        //生成一个继承于TEduBoardController.TEduBoardCallback事件监听，交给白板对象，用于处理白板事件响应。
        if (classroomOption != null) {
            if (classroomOption.boardCallback != null) {
                mBoard.addCallback(classroomOption.boardCallback);
            }
        }
        TICReporter.report(TICReporter.EventId.INIT_BOARD_START);
        //调用初始化函数
        TEduBoardController.TEduBoardAuthParam authParam = new TEduBoardController.TEduBoardAuthParam(sdkAppId
                , userInfo.getUserId(), userInfo.getUserSig());
        mBoard.init(authParam, classroomOption.getClassId(), classroomOption.boardInitPara);
    }

    private void unitTEduBoard(boolean clearBoard) {
        if (mBoard != null) {
            if (classroomOption != null && classroomOption.boardCallback != null) {
                mBoard.removeCallback(classroomOption.boardCallback);
            }

            if (clearBoard) {
                mBoard.reset();
            }

            TICReporter.report(TICReporter.EventId.UN_INIT_BOARD);
            mBoard.uninit();
        }
    }

    private void releaseClass() {
        classroomOption = null;
    }

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （五) IM消息
    //
    /////////////////////////////////////////////////////////////////////////////////
    @Override
    public void sendTextMessage(String userId, final String text, TICCallback<TIMMessage> callBack) {
        TXCLog.i(TAG, "TICManager: sendTextMessage user:" + userId + " text:" + text);

        TIMMessage message = new TIMMessage();
        TIMTextElem elem = new TIMTextElem();
        elem.setText(text);
        message.addElement(elem);

        sendMessage(userId, message, callBack);
    }

    @Override
    public void sendCustomMessage(String userId, final byte[] data, TICCallback<TIMMessage> callBack) {
        TXCLog.i(TAG, "TICManager: sendCustomMessage user:" + userId + " data:" + data.length);

        TIMMessage message = new TIMMessage();
        TIMCustomElem customElem = new TIMCustomElem();
        customElem.setData(data);
        message.addElement(customElem);
        sendMessage(userId, message, callBack);
    }

    @Override
    public void sendMessage(String userId, TIMMessage message, final TICCallback<TIMMessage> callBack) {
        TXCLog.i(TAG, "TICManager: sendMessage user:" + userId + " message:" + message.toString());
        if (classroomOption == null || classroomOption.getClassId() == -1) {
            TXCLog.e(TAG, "TICManager: sendMessage: " + Error.ERR_MSG_NOT_IN_CLASS);
            CallbackUtil.notifyError(callBack, MODULE_IMSDK, Error.ERR_NOT_IN_CLASS, Error.ERR_MSG_NOT_IN_CLASS);
            return;
        }

        TIMConversation conversation;
        if (TextUtils.isEmpty(userId)) {
            conversation = TIMManager.getInstance().getConversation(TIMConversationType.Group
                    , String.valueOf(classroomOption.getClassId()));
        } else {
            conversation = TIMManager.getInstance().getConversation(TIMConversationType.C2C, String.valueOf(userId));
        }

        conversation.sendMessage(message, new TIMValueCallBack<TIMMessage>() {
            @Override
            public void onError(int errCode, String errMsg) {
                TXCLog.e(TAG, "TICManager: sendMessage onError:" + errCode + " errMsg:" + errMsg);
                CallbackUtil.notifyError(callBack, MODULE_IMSDK, errCode, "send im message failed: " + errMsg);
            }

            @Override
            public void onSuccess(TIMMessage timMessage) {
                TXCLog.e(TAG, "TICManager: sendMessage onSuccess:");
                CallbackUtil.notifySuccess(callBack, timMessage);
            }
        });
    }

    @Override
    public void sendGroupTextMessage(final String text, TICCallback callBack) {

        TIMMessage message = new TIMMessage();
        TIMTextElem elem = new TIMTextElem();
        elem.setText(text);
        message.addElement(elem);

        sendGroupMessage(message, callBack);
    }

    @Override
    public void sendGroupCustomMessage(final byte[] data, TICCallback callBack) {
        sendGroupCustomMessage("", data, callBack);
    }

    void sendGroupCustomMessage(String ext, final byte[] data, TICCallback callBack) {

        TIMMessage message = new TIMMessage();
        TIMCustomElem customElem = new TIMCustomElem();
        customElem.setData(data);
        if (!TextUtils.isEmpty(ext)) {
            customElem.setExt(ext.getBytes());
        }
        message.addElement(customElem);
        sendGroupMessage(message, callBack);
    }

    @Override
    public void sendGroupMessage(TIMMessage message, final TICCallback callBack) {

        if (classroomOption == null || classroomOption.getClassId() == -1) {
            TXCLog.e(TAG, "TICManager: sendGroupMessage: " + Error.ERR_MSG_NOT_IN_CLASS);
            CallbackUtil.notifyError(callBack, MODULE_IMSDK, Error.ERR_NOT_IN_CLASS, Error.ERR_MSG_NOT_IN_CLASS);
            return;
        }

        String groupId = String.valueOf(classroomOption.getClassId());
        if (classroomOption.compatSaas) {
            groupId += COMPAT_SAAS_CHAT;
        }
        TXCLog.i(TAG, "TICManager: sendGroupMessage groupId:" + groupId);

        TIMConversation conversation = TIMManager.getInstance().getConversation(TIMConversationType.Group, groupId);

        conversation.sendMessage(message, new TIMValueCallBack<TIMMessage>() {
            @Override
            public void onError(int errCode, String errMsg) {
                TXCLog.e(TAG, "TICManager: sendGroupMessage onError:" + errCode + " errMsg:" + errMsg);
                CallbackUtil.notifyError(callBack, MODULE_IMSDK, errCode, "send im message failed: " + errMsg);
            }

            @Override
            public void onSuccess(TIMMessage timMessage) {
                TXCLog.e(TAG, "TICManager: sendGroupMessage onSuccess:");
                CallbackUtil.notifySuccess(callBack, timMessage);
            }
        });
    }

    private boolean handleNewMessages(List<TIMMessage> list) {
        if (classroomOption == null) {
            TXCLog.e(TAG, "TICManager: handleNewMessages: not in class now.");
            return false;
        }


        for (final TIMMessage message : list) {
            TXCLog.i(TAG, "TICManager: handleNewMessages -->:" + message.toString());
            String ext = "";
            if (message.getOfflinePushSettings() != null) {
                ext = new String(message.getOfflinePushSettings().getExt());
            }
            if (!TextUtils.isEmpty(ext) && ext.equals(TICSDK_WHITEBOARD_CMD)) {
                // 白板消息和录制对时消息过滤掉
            } else {
                TIMConversationType type = message.getConversation().getType();
                if (type == TIMConversationType.C2C || type == TIMConversationType.Group) {
                    // 私聊消息
                    if (type == TIMConversationType.Group) { //过滤其他群组的消息
                        String classId = String.valueOf(classroomOption.getClassId());
                        String groupId = message.getConversation().getPeer();
                        if (classroomOption.compatSaas) {
                            classId += COMPAT_SAAS_CHAT;
                        }
                        if (TextUtils.isEmpty(groupId) || !groupId.equals(classId)) {
                            continue;
                        }
                    }

                    handleChatMessage(message);

                } else if (type == TIMConversationType.System) {
                    handleGroupSystemMessage(message);
                }
                mMessageListner.onTICRecvMessage(message);
            }

        }
        return false;
    }

    private void handleGroupTipsMessage(TIMGroupTipsElem timGroupTipsElem) {
        onGroupTipMessageReceived(timGroupTipsElem);
    }

    private void handleGroupSystemMessage(TIMMessage message) {
        if (classroomOption == null) {
            TXCLog.e(TAG, "TICManager: handleGroupSystemMessage: not in class now.");
            return;
        }
        for (int i = 0; i < message.getElementCount(); i++) {
            TIMElem elem = message.getElement(i);
            switch (elem.getType()) {
                case GroupSystem:
                    TIMGroupSystemElem systemElem = (TIMGroupSystemElem) elem;

                    String groupId = systemElem.getGroupId();
                    if (!groupId.equals(String.valueOf(classroomOption.getClassId()))) {
                        TXCLog.e(TAG, "TICManager:handleGroupSystemMessage-> not in current group");
                        continue;
                    }

                    TIMGroupSystemElemType subtype = systemElem.getSubtype();
                    if (subtype == TIMGroupSystemElemType.TIM_GROUP_SYSTEM_DELETE_GROUP_TYPE
                            ||
                            subtype == TIMGroupSystemElemType.TIM_GROUP_SYSTEM_REVOKE_GROUP_TYPE) {
                        quitClassroom(false, null);
                        mEventListner.onTICClassroomDestroy();
                    } else if (subtype == TIMGroupSystemElemType.TIM_GROUP_SYSTEM_KICK_OFF_FROM_GROUP_TYPE) {
                        TXCLog.e(TAG, "TICManager: handleGroupSystemMessage TIM_GROUP_SYSTEM_KICK_OFF_FROM_GROUP_TYPE: "
                                + groupId + "| " + systemElem.getOpReason());
                        quitClassroom(false, null);
                        mEventListner.onTICMemberQuit(Collections.singletonList(TIMManager.getInstance().getLoginUser()));
                    }
                    break;
                default:
                    TXCLog.e(TAG, "TICManager: handleGroupSystemMessage: elemtype : " + elem.getType());
                    break;
            }
        }
    }

    private void handleChatMessage(TIMMessage message) {
        if (classroomOption == null) {
            TXCLog.e(TAG, "TICManager: onChatMessageReceived: not in class now.");
            return;
        }

        for (int i = 0; i < message.getElementCount(); i++) {
            TIMElem elem = message.getElement(i);
            switch (elem.getType()) {
                case Text:
                case Custom:
                    onChatMessageReceived(message, elem);
                    break;
                case GroupTips:
                    continue;
                default:
                    break;
            }
        }
    }

    private void onGroupTipMessageReceived(TIMGroupTipsElem tipsElem) {
        if (classroomOption == null) {
            TXCLog.e(TAG, "TICManager: onGroupTipMessageReceived: not in class now.");
            return;
        }

        TIMGroupTipsType tipsType = tipsElem.getTipsType();
        String groupId = tipsElem.getGroupId();

        if (!groupId.equals(String.valueOf(classroomOption.getClassId()))) {
            TXCLog.e(TAG, "TICManager: onGroupTipMessageReceived-> not in current group");
            return;
        }

        if (tipsType == TIMGroupTipsType.Join) {
            mEventListner.onTICMemberJoin(tipsElem.getUserList());
        } else if (tipsType == TIMGroupTipsType.Quit || tipsType == TIMGroupTipsType.Kick) {
            if (tipsElem.getUserList().size() <= 0) {
                mEventListner.onTICMemberQuit(Collections.singletonList(tipsElem.getOpUser()));
            } else {
                mEventListner.onTICMemberQuit(tipsElem.getUserList());
            }
        }
    }

    // TODO: 2018/11/30 parse chat  message
    private void onChatMessageReceived(TIMMessage message, TIMElem elem) {

        if (classroomOption == null) {
            TXCLog.e(TAG, "TICManager: onChatMessageReceived: not in class now.");
            return;
        }

        switch (message.getConversation().getType()) {
            case C2C:       // C2C消息
                if (elem.getType() == TIMElemType.Text) {
                    mMessageListner.onTICRecvTextMessage(message.getSender(), ((TIMTextElem) elem).getText());
                } else if (elem.getType() == TIMElemType.Custom) {
                    mMessageListner.onTICRecvCustomMessage(message.getSender(), ((TIMCustomElem) elem).getData());
                }
                break;
            case Group:
                // 群组义消息
                if (elem.getType() == TIMElemType.Text) {
                    mMessageListner.onTICRecvGroupTextMessage(message.getSender(), ((TIMTextElem) elem).getText());
                } else if (elem.getType() == TIMElemType.Custom) {

                    String ext = "";
                    TIMCustomElem customElem = (TIMCustomElem) elem;
                    if (customElem.getExt() != null) {
                        ext = new String(customElem.getExt());
                    }
                    if (!TextUtils.isEmpty(ext) && (ext.equals(TICSDK_WHITEBOARD_CMD)
                            || ext.equals(TICRecorder.TICSDK_CONFERENCE_CMD))) {
                        // 白板消息和对时消息过掉
//                        decodeBoardMsg(message.getSender(), customElem.getData());
                    } else {
                        mMessageListner.onTICRecvGroupCustomMessage(message.getSender(), customElem.getData());
                    }
                }
                break;
            default:
                TXCLog.e(TAG, "TICManager: onChatMessageReceived-> message type: "
                        + message.getConversation().getType());
                break;
        }
    }


/////////////////////////////////////////////////////////////////////////////////
//
//                      （五）TRTC SDK内部状态回调
//
/////////////////////////////////////////////////////////////////////////////////

    class TRTCCloudListenerImpl extends TRTCCloudListener {
        @Override
        public void onEnterRoom(long elapsed) {
            TXCLog.i(TAG, "TICManager: TRTC onEnterRoom elapsed: " + elapsed);
            TICReporter.report(TICReporter.EventId.ENTER_ROOM_END);
            if (mEnterRoomCallback != null) {
                //
                mEnterRoomCallback.onSuccess("succ");
            }
            sendOfflineRecordInfo();

            if (classroomOption.classScene == TICClassScene.TIC_CLASS_SCENE_LIVE
                    && classroomOption.roleType == TICRoleType.TIC_ROLE_TYPE_ANCHOR) {
                startSyncTimer();
            }
        }

        @Override
        public void onExitRoom(int reason) {
            TXCLog.i(TAG, "TICManager: TRTC onExitRoom :" + reason);
        }

        @Override
        public void onUserVideoAvailable(final String userId, boolean available) {
            TXCLog.i(TAG, "TICManager: onUserVideoAvailable->render userId: " + userId
                    + ", available:" + available);
            TICReporter.report(TICReporter.EventId.ON_USER_VIDEO_AVAILABLE, "userId:" + userId
                    + ",available:" + available);
            mEventListner.onTICUserVideoAvailable(userId, available);
        }

        @Override
        public void onUserSubStreamAvailable(String userId, boolean available) {
            TXCLog.i(TAG, "TICManager: onUserSubStreamAvailable :" + userId + "|" + available);
            TICReporter.report(TICReporter.EventId.ON_USER_SUB_STREAM_AVAILABLE, "userId:"
                    + userId + ",available:" + available);
            mEventListner.onTICUserSubStreamAvailable(userId, available);
        }

        @Override
        public void onUserAudioAvailable(String userId, boolean available) {
            TXCLog.i(TAG, "TICManager: onUserAudioAvailable :" + userId + "|" + available);
            TICReporter.report(TICReporter.EventId.ON_USER_AUDIO_AVAILABLE, "userId:"
                    + userId + ",available:" + available);
            mEventListner.onTICUserAudioAvailable(userId, available);
        }

        @Override
        public void onUserEnter(String userId) {
            TXCLog.i(TAG, "onUserEnter: " + userId);
        }

        @Override
        public void onUserExit(String userId, int reason) {
            TXCLog.i(TAG, "TICManager: onUserExit: " + userId);
            mEventListner.onTICUserVideoAvailable(userId, false);
            mEventListner.onTICUserAudioAvailable(userId, false);
            mEventListner.onTICUserSubStreamAvailable(userId, false);
        }

        /**
         * 1.1 错误回调: SDK不可恢复的错误，一定要监听，并分情况给用户适当的界面提示
         *
         * @param errCode   错误码 TRTCErrorCode
         * @param errMsg    错误信息
         * @param extraInfo 额外信息，如错误发生的用户，一般不需要关注，默认是本地错误
         */
        @Override
        public void onError(int errCode, String errMsg, Bundle extraInfo) {
            TXCLog.i(TAG, "TICManager: sdk callback onError:" + errCode + "|" + errMsg);

//            if(errCode == ERR_ROOM_ENTER_FAIL
//                    || errCode == ERR_ENTER_ROOM_PARAM_NULL
//                    || errCode == ERR_SDK_APPID_INVALID
//                    || errCode == ERR_ROOM_ID_INVALID
//                    || errCode == ERR_USER_ID_INVALID
//                    || errCode == ERR_USER_SIG_INVALID){
//            [[TRTCCloud sharedInstance] exitRoom];
//                TICBLOCK_SAFE_RUN(self->_enterCallback, kTICMODULE_TRTC, errCode, errMsg);
//            }
        }

        /**
         * 1.2 警告回调
         *
         * @param warningCode 错误码 TRTCWarningCode
         * @param warningMsg  警告信息
         * @param extraInfo   额外信息，如警告发生的用户，一般不需要关注，默认是本地错误
         */
        @Override
        public void onWarning(int warningCode, String warningMsg, Bundle extraInfo) {
            TXCLog.i(TAG, "TICManager: sdk callback onWarning:" + warningCode + "|" + warningMsg);
        }

        @Override
        public void onUserVoiceVolume(ArrayList<TRTCCloudDef.TRTCVolumeInfo> var1, int var2) {
        }

        @Override
        public void onNetworkQuality(TRTCCloudDef.TRTCQuality var1, ArrayList<TRTCCloudDef.TRTCQuality> var2) {

        }

        @Override
        public void onStatistics(TRTCStatistics var1) {
        }

        @Override
        public void onFirstAudioFrame(String var1) {
        }

        @Override
        public void onConnectionLost() {
        }

        @Override
        public void onTryToReconnect() {
        }

        @Override
        public void onConnectionRecovery() {
        }

        @Override
        public void onSpeedTest(TRTCCloudDef.TRTCSpeedTestResult var1, int var2, int var3) {
        }

        @Override
        public void onCameraDidReady() {
        }

        @Override
        public void onAudioRouteChanged(int var1, int var2) {
        }

        @Override
        public void onRecvSEIMsg(String userid, byte[] bytes) {
            super.onRecvSEIMsg(userid, bytes);
            try {
                String str = new String(bytes);
                JSONObject jsonObject = new JSONObject(str);
                boolean isSyncTime = jsonObject.has(SYNCTIME);
                //TXCLog.i(TAG, "TICManager: onRecvSEIMsg  synctime 1: " + isSyncTime);
                if (isSyncTime) {
                    long time = jsonObject.getLong(SYNCTIME);
                    //TXCLog.i(TAG, "TICManager: onRecvSEIMsg  synctime 2: " + userid +  "|" + time);
                    if (mBoard != null) {
                        mBoard.syncRemoteTime(userid, time);
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    }

    /////////////////
    @Override
    public void sendOfflineRecordInfo() {
        if (mRecorder != null && classroomOption != null) {
            TEduBoardController.TEduBoardAuthParam authParam = new TEduBoardController.TEduBoardAuthParam(sdkAppId
                    , userInfo.getUserId(), userInfo.getUserSig());
            mRecorder.start(authParam, classroomOption.getClassId(), classroomOption.ntpServer);
        } else {
            TXCLog.i(TAG, "TICManager: TRTC onEnterRoom: " + mRecorder + "|" + classroomOption);
        }
    }

    public void setUserInfo(final String userId, final String userSig) {
        userInfo.setUserInfo(userId, userSig);
    }

    public void trigleOffLineRecordCallback(int code, final String msg) {
        mEventListner.onTICSendOfflineRecordInfo(code, msg);
    }

    //白板回调，用于监控事件
    static class BoardCallback implements TEduBoardController.TEduBoardCallback {

        @Override
        public void onTEBError(int code, String msg) {
            TICReporter.report(TICReporter.EventId.ON_TEBERROR, code, msg);
        }

        @Override
        public void onTEBWarning(int code, String msg) {
            TICReporter.report(TICReporter.EventId.ON_TEBWARNING, code, msg);
        }

        @Override
        public void onTEBInit() {
            TICReporter.report(TICReporter.EventId.INIT_BOARD_END);
        }

        @Override
        public void onTEBHistroyDataSyncCompleted() {
            TICReporter.report(TICReporter.EventId.SYNC_BOARD_HISTORY_END);
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
        public void onTEBSetBackgroundImage(String s) {

        }

        @Override
        public void onTEBBackgroundH5StatusChanged(String s, String s1, int i) {

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
        public void onTEBSnapshot(String path, int code, String msg) {

        }

        @Override
        public void onTEBH5PPTStatusChanged(int statusCode, String fid, String describeMsg) {

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
        public void onTEBAddImageElement(String url) {

        }
    }
}
