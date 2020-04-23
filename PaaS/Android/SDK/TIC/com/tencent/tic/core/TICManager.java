package com.tencent.tic.core;

import android.content.Context;
import com.tencent.imsdk.TIMMessage;
import com.tencent.teduboard.TEduBoardController;
import com.tencent.tic.core.impl.TICManagerImpl;
import com.tencent.trtc.TRTCCloud;

import java.util.List;

/**
 * TICSDK业务管理类，主要负责课堂资源管理，互动管理
 */
public abstract class TICManager  {

    /**
     * 白板数据消息命令字
     */
    public final static String TICSDK_WHITEBOARD_CMD = "TXWhiteBoardExt";

    public final static String MODULE_TIC_SDK = "ticsdk";
    public final static String MODULE_IMSDK = "imsdk";

    /**
     * 课堂场景
     **/
    public interface TICClassScene {
        int TIC_CLASS_SCENE_VIDEO_CALL     = 0;     //实时通话模式，支持1000人以下场景，低延时
        int TIC_CLASS_SCENE_LIVE           = 1;     //直播模式，支持1000人以上场景，会增加600ms左右延时
    };

    /**
     * 房间角色
     * @brief 仅适用于直播模式（TIC_CLASS_SCENE_LIVE），角色TIC_ROLE_TYPE_ANCHOR具有上行权限
     **/
    public interface TICRoleType {
        int TIC_ROLE_TYPE_ANCHOR     = 20;     //主播
        int TIC_ROLE_TYPE_AUDIENCE   = 21;     //观众
    };

    /**
     * 禁用模块
     * @brief 如果外部使用了TRTC，可以禁用TIC内部的TRTC模块。
     * @brief 如果禁用TRTC，TRTC相关初始化参数都无效
     **/
    public interface TICDisableModule {
        int TIC_DISABLE_MODULE_NONE     = 0;        //默认全部启用
        int TIC_DISABLE_MODULE_TRTC   =  (1 << 1); //禁用TRTC
    };


    //IM消息回调
    public interface TICMessageListener {
        //点到点消息
        void onTICRecvTextMessage(String fromUserId, String text);
        void onTICRecvCustomMessage(String fromUserId, byte[] data);

        //群消息
        void onTICRecvGroupTextMessage(String fromUserId, String text);
        void onTICRecvGroupCustomMessage(String fromUserId, byte[] data);

        //所有消息
        void onTICRecvMessage(TIMMessage message);
    }

    //IM状态回调
    public interface TICIMStatusListener {
        void onTICForceOffline();
        void onTICUserSigExpired();
    }

    //TIC 事件回调
    public interface TICEventListener {
        void onTICUserVideoAvailable(final String userId, boolean available);
        void onTICUserSubStreamAvailable(final String userId, boolean available);
        void onTICUserAudioAvailable(final String userId, boolean available);

        void onTICMemberJoin(List<String> userList);
        void onTICMemberQuit(List<String> userList);

        void onTICVideoDisconnect(int errCode, String errMsg);
        void onTICClassroomDestroy();

        /**
         * 发送离线录制对时信息通知
         * @param code				错误码;0表示成功，其他值为失败;
         * @param desc				错误信息;
         * @note 进房成功后,TIC会自动发送离线录制需要的对时信息;只有成功发送对时信息的课堂才能进行课后离线录制; 注: 可能在子线程中执行此回调;
         */
        void onTICSendOfflineRecordInfo(int code, final String desc);
    }

    /**
     * ILive通用返回回调
     */
    public interface TICCallback<T> {

        /**
         * 操作成功
         * @param data 成功返回值
         */
        void onSuccess(T data);

        /**
         * 操作失败
         * @param module    出错模块
         * @param errCode   错误码
         * @param errMsg    错误描述
         */
        void onError(String module, int errCode, String errMsg);
    }

    public abstract void addEventListener(TICEventListener callback);
    public abstract void removeEventListener(TICEventListener callback);

    public abstract void addIMStatusListener(TICIMStatusListener callback);
    public abstract void removeIMStatusListener(TICIMStatusListener callback);

    public abstract void addIMMessageListener(TICMessageListener callback);
    public abstract void removeIMMessageListener(TICMessageListener callback);

/////////////////////////////////////////////////////////////////////////////////
//
//                      （一）初始和终止接口函数
//
/////////////////////////////////////////////////////////////////////////////////

    /**
     * 1.1 获取TicManager的实例
     *
     */
    public static TICManager getInstance(){
        TICManager instance = null;
        synchronized (TICManager.class){
            instance = TICManagerImpl.sharedInstance();
        }
        return instance;
    }

    /**
     * 1.2 初始化
     *
     * @param context
     * @param appId   iLiveSDK appId
     */
    public abstract int init(Context context, int appId);

    /**
     * 1.2 初始化
     *
     * @param context
     * @param appId   iLiveSDK appId
     * @param disableModule   禁用内部TIC相关模块
     */
    public abstract int init(Context context, int appId, int disableModule);

    /**
     * 1.3 释放资源
     */
    public abstract int unInit();

    /**
     * 1.4 获取trtc的接口
     */
    public abstract TRTCCloud getTRTCClound();

    /**
     * 1.5 获取board的接口
     */
    public abstract TEduBoardController getBoardController();


    /**
     * 1.6 切换角色
     * @param role 角色
     * @brief 只在classScene为TIC_CLASS_SCENE_LIVE时有效
     **/
    public abstract void switchRole(int role);


/////////////////////////////////////////////////////////////////////////////////
//
//                      （二）TIC登录/登出/创建销毁课堂/进入退出课堂接口函数
//
/////////////////////////////////////////////////////////////////////////////////
    /**
     * 2.1 IM登录
     *
     * @param userId   IM用户id
     * @param userSig  IM用户鉴权票据
     * @param callBack 回调
     */
    public abstract void login(final String userId, final String userSig, final TICCallback callBack) ;

    /**
     * 2.2 注销登录
     *
     * @param callBack 注销登录结果回调
     */
    public abstract void logout(final TICCallback callBack);

    /**
     * 2.3 根据参数创建课堂
     *
     * @param classId   房间ID，由业务生成和维护。
     * @param callback 回调，见@TICCallback， onSuccess，创建成功；若出错，则通过onError返回。
     */
    public abstract void createClassroom(final int classId, final int scene,  final TICCallback callback);

    /**
     * 2.4 销毁课堂，由课堂创建者（调用CreateClassroom者）调用
     *
     * @param classId   课堂id
     * @param callback 回调
     */
    public abstract void destroyClassroom(final int classId, final TICCallback callback);

    /**
     * 2.5 根据参数配置和课堂id加入互动课堂中
     *
     * @param option   加入课堂参数选项。见@{TICClassroomOption}
     * @param callback 回调
     */
    public abstract void joinClassroom(final TICClassroomOption option, final TICCallback callback);

    /**
     * 2.6 退出课堂，退出iLiveSDK的AV房间，学生角色退出群聊和白板通道群组；老师角色则解散IM群组
     *
     * @param callback 回调
     * @param clearBoard 是否把白板数据全部清除
     *
     */
    public abstract void quitClassroom(boolean clearBoard, final TICCallback callback);

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （三) IM消息
    //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * 5.1 发送文本消息
     *
     * @param userId   为C2C消息接收者；
     * @param text     文本消息内容
     * @param callBack 回调
     */
    public abstract void sendTextMessage(String userId, final String text, TICCallback<TIMMessage> callBack) ;

    /**
     * 5.2 发送自定义消息
     *
     * @param userId   为C2C消息接收者；
     * @param data     自定义消息内容
     * @param callBack 回调
     */
    public abstract void sendCustomMessage(String userId, final byte[] data, TICCallback<TIMMessage> callBack);

    /**
     * 5.3 发送通用互动消息，全接口
     *
     * @param userId  为C2C消息接收者；
     * @param message  互动消息
     * @param callBack 回调
     */
    public abstract void sendMessage(String userId, TIMMessage message, final TICCallback<TIMMessage> callBack);

    /**
     * 5.4 发送群组文本消息
     *
     * @param text     文本消息内容
     * @param callBack 回调
     */
    public abstract void sendGroupTextMessage(final String text, TICCallback callBack);

    /**
     * 5.5 发送群组文本消息
     *
     * @param data     文本消息内容
     * @param callBack 回调
     */
    public abstract void sendGroupCustomMessage(final byte[] data, TICCallback callBack);


    /**
     * 5.5 发送群组消息
     *
     * @param message  消息内容
     * @param callBack 回调
     */
    public abstract void sendGroupMessage(TIMMessage message, final TICCallback callBack);

    /////////////////////////////////////////////////////////////////////////////////
    //
    //                      （四) 录制消息
    //
    /////////////////////////////////////////////////////////////////////////////////
    /**
     * 发送离线录制对时信息
     * @brief TIC内部进房成功后会自动发送离线录制对时信息，如果发送失败回调onTICSendOfflineRecordInfo接口且code!=0，用户可调用些接口触发重试
     **/
    public abstract void sendOfflineRecordInfo();

}
