package com.tencent.tic.core.impl;

import android.text.TextUtils;

import com.instacart.library.truetime.TrueTime;
import com.tencent.liteav.basic.log.TXCLog;
import com.tencent.liteav.basic.util.TXCTimeUtil;
import com.tencent.teduboard.TEduBoardController;
import com.tencent.tic.core.impl.utils.TXHttpRequest;

import org.json.JSONObject;

import java.lang.ref.WeakReference;

public class TICRecorder implements TXHttpRequest.TXHttpListenner {
    //
    private final static String TAG = "TICManager";
    public final static String TICSDK_CONFERENCE_CMD = "TXConferenceExt";
    private final static String URL_TEMPLATE_TEST = "https://test.tim.qq.com/v4/ilvb_test/record?sdkappid=%d&identifier=%s&usersig=%s&contenttype=json";
    private final static String URL_TEMPLATE_RELEASE = "https://yun.tim.qq.com/v4/ilvb_edu/record?sdkappid=%d&identifier=%s&usersig=%s&contenttype=json";
    private int mGroupId  = 0;
    private WeakReference<TICManagerImpl> mTicRef;
    TXHttpRequest httpRequest;

    //NTP
    NTPController mNtp;
    NTPController.TrueTimeListener mNtpListener;

    public TICRecorder(TICManagerImpl tic) {
        mTicRef = new WeakReference<>(tic);
        httpRequest = new TXHttpRequest();

        mNtpListener = new MyTrueTimeListener();
        mNtp = new NTPController(mNtpListener);
    }

    void start(TEduBoardController.TEduBoardAuthParam authParam, int roomId, final String ntpServer) {
        //1.ntp
        TICReporter.report(TICReporter.EventId.sendOfflineRecordInfo_start);

        mGroupId = roomId;
        mNtp.start(ntpServer);

        //2.
        reportGroupId(authParam, roomId);
    }

    protected void sendTIMOffLineRecordInfo(long ntp_time, long avsdk_time, long board_time) {

        TXCLog.i(TAG, "setTimeBaseLine base:" + ntp_time + " av:" + avsdk_time + " board:" + board_time + " diff:" + (board_time - ntp_time));

        TICManagerImpl tic = mTicRef.get();
        if (tic != null) {
            String result = "";
            JSONObject json = new JSONObject();
            try {
                json.put("type", 1008);
                json.put("time_line", ntp_time);
                json.put("avsdk_time", avsdk_time);
                json.put("board_time", board_time);
                result = json.toString();
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (!TextUtils.isEmpty(result)) {
                tic.sendGroupCustomMessage(TICSDK_CONFERENCE_CMD, result.getBytes(), null);
            }
            else {
                TXCLog.i(TAG, "setTimeBaseLine error, result=null");
            }
        }
        else {
            TXCLog.i(TAG, "setTimeBaseLine error, tic=null");
        }
    }

    private void reportGroupId(TEduBoardController.TEduBoardAuthParam authParam, int roomId) {
        if (authParam != null) {
            final String URL = String.format(URL_TEMPLATE_RELEASE, authParam.sdkAppId, authParam.userId, authParam.userSig);
            String body = EncodeRequestTokenPacket(roomId);
            if (!TextUtils.isEmpty(body)) {
                httpRequest.sendHttpsRequest(URL, body.getBytes(), this);
            }
        }
    }

    @Override
    public void OnRecvMessage(int errCode, final String msg, final byte[] data) {
        TXCLog.i(TAG, "OnRecvMessage http code: " + errCode + " msg:" + msg);
    }

    String  EncodeRequestTokenPacket(int room) {
        String result = "";
        JSONObject json = new JSONObject();
        try {
            json.put("cmd", "open_record_svc");
            json.put("sub_cmd", "report_group");
            json.put("group_id", String.valueOf(room));
            result = json.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    class MyTrueTimeListener implements NTPController.TrueTimeListener {
        @Override
        public void onGotTrueTimeRusult(int code, String msg) {

            if (code == NTPController.SUCC) {
                TICReporter.report(TICReporter.EventId.sendOfflineRecordInfo_end);
                try {
                    long avsdk_time = TXCTimeUtil.getTimeTick();
                    long ntp_time = TrueTime.now().getTime();
                    long board_time = System.currentTimeMillis();

                    TXCLog.i(TAG, "TICManager: onGotTrueTimeRusult "  + code + "|" + msg + "|" + TrueTime.now().toString() + "|" + ntp_time + "|" + avsdk_time + "|" + board_time);
                    sendTIMOffLineRecordInfo(ntp_time, avsdk_time, board_time);
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
            else {
                TXCLog.i(TAG, "TICManager: onGotTrueTimeRusult failed: "  + NTPController.NTP_HOST + "|" + msg);
                TICReporter.report(TICReporter.EventId.sendOfflineRecordInfo_end, code, msg + ":" + mNtp);
                TICManagerImpl tic = mTicRef.get();
                if (tic != null) {
                    tic.trigleOffLineRecordCallback(code, msg);
                }
            }
        }
    }
}


