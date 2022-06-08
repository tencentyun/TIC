package com.tencent.tic.core;

import android.content.Context;
import android.util.Log;

import com.tencent.imsdk.v2.V2TIMCallback;
import com.tencent.imsdk.v2.V2TIMGroupInfo;
import com.tencent.imsdk.v2.V2TIMManager;
import com.tencent.imsdk.v2.V2TIMSDKConfig;
import com.tencent.imsdk.v2.V2TIMSDKListener;
import com.tencent.imsdk.v2.V2TIMUserFullInfo;
import com.tencent.imsdk.v2.V2TIMValueCallback;

public class IMManager {
    private int mSdkAppID;
    private String mUserId;
    private String mUserSig;
    private int mClassId;
    private TIMCallBack mCallBack;
    private boolean mIsLogin;

    private static volatile IMManager instance;
    private static final byte[] SYNC = new byte[1];

    public static IMManager getInstance() {
        if (instance == null) {
            synchronized (SYNC) {
                if (instance == null) {
                    instance = new IMManager();
                }
            }
        }
        return instance;
    }
    // IM初始化
    public boolean initSDK(Context context, final int sdkAppID) {
        V2TIMSDKConfig timSdkConfig = new V2TIMSDKConfig();
        boolean result = V2TIMManager.getInstance().initSDK(context, sdkAppID, timSdkConfig);
        V2TIMManager.getInstance().addIMSDKListener(new IMSDKListener());
        return result;
    }

    public void setmCallBack(TIMCallBack mCallBack) {
        this.mCallBack = mCallBack;
    }

    // 销毁IM资源
    public void unInitSDK() {
        V2TIMManager.getInstance().unInitSDK();
    }

    // IM登录
    public void login(final String userId, final String userSig, final IMCallBack callBack) {
        if (mIsLogin) {
            if (callBack != null) {
                callBack.onComplete(-1, String.format("用户%s已登录， 请先退出登录", mUserId));
            }
            return;
        }
        V2TIMManager.getInstance().login(userId, userSig, new V2TIMCallback() {
            @Override
            public void onSuccess() {
                mUserId = userId;
                mUserSig = userSig;
                mIsLogin = true;
                if (callBack != null) {
                    callBack.onComplete(0, "");
                }
            }

            @Override
            public void onError(int errCode, String errMsg) {
                if (callBack != null) {
                    callBack.onComplete(errCode, errMsg);
                }
            }
        });
    }

    // IM登出
    public void logout(final IMCallBack callBack) {
        V2TIMManager.getInstance().logout(new V2TIMCallback(){
            @Override
            public void onSuccess() {
                mClassId = -1;
                mIsLogin = false;
                if (callBack != null) {
                    callBack.onComplete(0, "");
                }
            }

            @Override
            public void onError(int errCode, String errMsg) {
                if (callBack != null) {
                    callBack.onComplete(errCode, errMsg);
                }
            }
        });
    }

    // 创建IM群组
    public void createIMGroup(final String classId, final IMCallBack callBack) {
        V2TIMGroupInfo groupInfo = new V2TIMGroupInfo();
        groupInfo.setGroupID(classId);
        groupInfo.setGroupName(classId);
        groupInfo.setGroupType("Public");
        groupInfo.setIntroduction("this is a test Work group");
        groupInfo.setGroupAddOpt(2);
        V2TIMManager.getGroupManager().createGroup(groupInfo, null, new V2TIMValueCallback<String>() {
            @Override
            public void onError(int errCode, String errMsg) {
                if (null != callBack) {
                    callBack.onComplete(errCode,errMsg);
                }
            }

            @Override
            public void onSuccess(String s) {
                if (null != callBack) {
                    callBack.onComplete(0,"");
                }
            }
        });
    }

    // 加入IM群组（含创建IM群组逻辑）
    public void joinIMGroup(final String classId, final IMCallBack callBack) {
        if (mClassId > 0) {
            if (Integer.parseInt(classId) == mClassId) {
                if (null != callBack) {
                    callBack.onComplete(0,"");
                }
            }
            else {
                // 先退出群组，再加入新群组
                this.quitIMGroup(String.valueOf(mClassId), new IMCallBack() {
                    @Override
                    public void onComplete(int errCode, String errMsg) {
                        joinIMGroup(classId, callBack);
                    }
                });
            }
            return;
        }
        this.createIMGroup(classId, new IMCallBack() {
            @Override
            public void onComplete(int errCode, String errMsg) {
                // 0表示IM群组创建成功，10021和10025表示群组已存在
                if (errCode == 0 || errCode == 10021 || errCode == 10025) {
                    V2TIMManager.getInstance().joinGroup(classId, "board group" + classId, new V2TIMCallback() {
                        @Override
                        public void onSuccess() {
                            mClassId = Integer.parseInt(classId);
                            if (null != callBack) {
                                callBack.onComplete(0,"");
                            }
                        }

                        @Override
                        public void onError(int i, String s) {
                            if (i == 10013) {
                                // 已经在群中
                                mClassId = Integer.parseInt(classId);
                                if (null != callBack) {
                                    callBack.onComplete(0,"");
                                }
                            }
                            else {
                                if (null != callBack) {
                                    callBack.onComplete(i, s);
                                }
                            }
                        }
                    });
                }
                else {
                    if (null != callBack) {
                        callBack.onComplete(errCode, errMsg);
                    }
                }
            }
        });
    }

    // 销毁群组
    public void destroyIMGroup(final String classId, final IMCallBack callBack) {
        V2TIMManager.getInstance().dismissGroup(classId, new V2TIMCallback() {

            @Override
            public void onSuccess() {
                mClassId = -1;
                if (callBack != null) {
                    callBack.onComplete(0, "");
                }
            }

            @Override
            public void onError(int i, String s) {
                if (null != callBack) {
                    callBack.onComplete(i, s);
                }
            }
        });
    }
    // 退出IM群组
    public void quitIMGroup(final String classId, final IMCallBack callBack) {
        V2TIMManager.getInstance().quitGroup(classId, new V2TIMCallback() {
            @Override
            public void onSuccess() {
                mClassId = -1;
                if (callBack != null) {
                    callBack.onComplete(0, "");
                }
            }

            @Override
            public void onError(int i, String s) {
                if (i == 10009) {
                    //群主退群失败
                    mClassId = -1;
                    if (callBack != null) {
                        callBack.onComplete(0, "");
                    }
                }
                else{
                    if (null != callBack) {
                        callBack.onComplete(i, s);
                    }
                }
            }
        });
    }


//- (void)destroyIMGroup
    public interface IMCallBack {
        /**
         * 函数调用结果回调
         *
         * @param errCode 错误码, 0表示成功
         * @param errMsg  错误描述
         */
        void onComplete(int errCode, String errMsg);
    }

    public interface TIMCallBack {
        // 当前用户被踢下线，此时可以重新登录。
        void onTIMForceOffline();

        // 在线时票据过期：此时您需要生成新的 userSig 并重新登录
        void onTIMUserSigExpired();

        // IM掉线
        void onConnectFailed(int code, String error);
    }

    private  class IMSDKListener extends V2TIMSDKListener {
        public void onKickedOffline() {
            IMManager manager = IMManager.getInstance();
            if (manager.mCallBack != null) {
                manager.mCallBack.onTIMForceOffline();
            }
            manager.mClassId = -1;
            manager.mIsLogin = false;
        }

        public void onUserSigExpired() {
            IMManager manager = IMManager.getInstance();
            if (manager.mCallBack != null) {
                manager.mCallBack.onTIMUserSigExpired();
            }
        }
        public void onConnectFailed(int code, String error) {
            IMManager manager = IMManager.getInstance();
            if (manager.mCallBack != null) {
                manager.mCallBack.onConnectFailed(code, error);
            }
            manager.mClassId = -1;
            manager.mIsLogin = false;

            Log.i("TIIMSDK", "onConnectFailed, code: " + code + ", error:" + error);
        }

        public void onConnecting() {
            Log.i("TIIMSDK", "onConnecting......");
        }

        public void onConnectSuccess() {
            Log.i("TIIMSDK", "onConnectSuccess......");
        }
    }
}

