package com.tencent.tic.core.impl;

import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import com.tencent.tic.core.impl.utils.TXHttpRequest;

import org.json.JSONObject;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class TICReporter {
    public static class EventId {
        public static final String initSdk_start = "initSdk_start";
        public static final String initSdk_end = "initSdk_end";
        public static final String login_start = "login_start";
        public static final String login_end = "login_end";
        public static final String logout_start = "logout_start";
        public static final String logout_end = "logout_end";
        public static final String createGroup_start = "createGroup_start";
        public static final String createGroup_end = "createGroup_end";
        public static final String deleteGroup_start = "deleteGroup_start";
        public static final String deleteGroup_end = "deleteGroup_end";
        public static final String joinGroup_start = "joinGroup_start";
        public static final String joinGroup_end = "joinGroup_end";
        public static final String initBoard_start = "initBoard_start";
        public static final String initBoard_end = "initBoard_end";
        public static final String unInitBoard = "unInitBoard";
        public static final String syncBoardHistory_end = "syncBoardHistory_end";
        public static final String enterRoom_start = "enterRoom_start";
        public static final String enterRoom_end = "enterRoom_end";
        public static final String quitGroup_start = "quitGroup_start";
        public static final String quitGroup_end = "quitGroup_end";
        public static final String sendOfflineRecordInfo_start = "sendOfflineRecordInfo_start";
        public static final String sendOfflineRecordInfo_end = "sendOfflineRecordInfo_end";
        public static final String onUserAudioAvailable = "onUserAudioAvailable";
        public static final String onUserVideoAvailable = "onUserVideoAvailable";
        public static final String onUserSubStreamAvailable = "onUserSubStreamAvailable";
        public static final String onForceOffline = "onForceOffline";
        public static final String onUserSigExpired = "onUserSigExpired";
        public static final String onTEBError = "onTEBError";
        public static final String onTEBWarning = "onTEBWarning";
    };

    static final String TAG = "TICReporter";
    static final String URL = "https://ilivelog.qcloud.com/log/report?sign=";
    static final String Connection = "&";
    static BusinessHeader businessHeader = new BusinessHeader();

    public static void updateAppId(int sdkAppid) {
        businessHeader.setAppId(sdkAppid);
    }
    public static void updateUserId(String userId) {
        businessHeader.setUserId(userId);
    }
    public static void updateRoomId(int roomid) {
        businessHeader.setRoomId(roomid);
    }

    static class JsonBody {
        public String business = "tic2.0"; //固定“tic”
        public String dcid = "dc0000";     //固定“dc0000”
        public int version = 0;  //固定“0”
        public String kv_str;  //key-value格式的业务字段字符串，格式为“key1=value1&key2=value2“

        public JsonBody(String kvalue) {
            this.kv_str = kvalue;
        }

        public String toString() {
            String result = "";
            JSONObject json = new JSONObject();
            try {
                json.put("business", business);
                json.put("dcid", dcid);
                json.put("version", version);
                json.put("kv_str", kv_str);
                result = json.toString();
            } catch (Exception e) {
                e.printStackTrace();
            }

            return result;
        }
    };

    static class BusinessHeader {
        int sdkAppId; //应用标识
        String userId; //用户Id
        String sdkVersion; //sdk版本号
        String devId = null;  //设备Id
        String devType = Build.MANUFACTURER + " " + Build.MODEL; //设备型号
        String netType; //网络类型，"Wifi","4G","3G","2G"
        String platform = "Android"; //平台，"iOS","Android","macOS","Windows","Web","小程序"
        String sysVersion = Build.VERSION.RELEASE; //系统版本
        String roomId; //房间号

        String result = null;

        public void setAppId(int sdkAppid) {
            this.sdkAppId = sdkAppid;

            result = null;
        }
        public void setUserId(String userId) {
            this.userId = userId;

            result = null;
        }

        public void setRoomId(int roomid) {
            this.roomId = String.valueOf(roomid);

            //
            result = null;
        }

        public String toString() {
            if (TextUtils.isEmpty(result)) {
                result = "sdkAppId=" + sdkAppId + Connection;

                if (!TextUtils.isEmpty(userId)) {
                    result += ("userId=" + userId + Connection);
                }

                if (!TextUtils.isEmpty(sdkVersion)) {
                    result += ("sdkVersion=" + sdkVersion + Connection);
                }
                if (!TextUtils.isEmpty(devId)) {
                    result += ("devId=" + devId + Connection);
                }

                result += ("devType=" + devType + Connection);
                if (!TextUtils.isEmpty(netType)) {
                    result += ("netType=" + netType + Connection);
                }
                result += ("platform=" + platform + Connection);
                result += ("sysVersion=" + sysVersion + Connection);
                if (!TextUtils.isEmpty(roomId)) {
                    result += ("roomId=" + roomId + Connection);
                }
            }

            return result;
        }
    };


    static class EventBody {
        public String event;
        public int errorCode;
        public String errorDesc;
        public long timestamp;
        public String data;
        public String ext;
        public int timeCost;

        public String toString() {
            String result = ("timestamp=" + timestamp + Connection);
            result += "event=" + event + Connection;
            result += ("errorCode=" + errorCode + Connection);

            if (!TextUtils.isEmpty(errorDesc)) {
                result += ("errorDesc=" + errorDesc + Connection);
            }
            if (!TextUtils.isEmpty(data)) {
                result += ("data=" + data + Connection);
            }
            if (!TextUtils.isEmpty(ext)) {
                result += ("ext=" + ext  + Connection);
            }

            return result;
        }

        public EventBody(final String event, int errorCode, String errorDesc, String data, String ext) {
            this.event = event;
            this.errorCode = errorCode;
            this.errorDesc = errorDesc;
            this.data = data;
            this.ext = ext;

            this.timestamp = System.currentTimeMillis();
        }
    };

    public static void report(final String event) {
        report(event, 0, null, null);
    }

    public static void report(final String event, final String data) {
        report(event, 0, null, data);
    }

    public static void report(final String event, int code, final String msg) {
        report(event, code, msg,  null);
    }

    public static void report(final String event, int code, final String msg, final String data) {

        EventBody eventBody = new EventBody(event, code, msg, data, null);
        final String eventStr = eventBody.toString();

        final String value = businessHeader.toString();
        String kvalue = eventStr + value;

        //2. 删除最后的连接符&
        String lastString = kvalue.substring(kvalue.length() -1);
        if (lastString.equals(Connection)) {
            kvalue = kvalue.substring(0, kvalue.length() -1);
        }

        JsonBody jsonBody = new JsonBody(kvalue);
        final String result = jsonBody.toString();

        //发送
        if (!TextUtils.isEmpty(result)) {

            String sign = md5(result);
            Log.i(TAG, "md5:" + sign + " report:" + result);
            TXHttpRequest httpRequest = new TXHttpRequest();
            httpRequest.sendHttpsRequest(URL + sign, result.getBytes(), null, "application/json");
        }
    }

    public static String md5(String string) {
        if (TextUtils.isEmpty(string)) {
            return "";
        }

        MessageDigest md5 = null;
        try {
            md5 = MessageDigest.getInstance("MD5");
            byte[] bytes = md5.digest(string.getBytes());
            String result = "";
            for (byte b : bytes) {
                String temp = Integer.toHexString(b & 0xff);
                if (temp.length() == 1) {
                    temp = "0" + temp;
                }
                result += temp;
            }
            return result;
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return "";
    }
}
