package com.tencent.tic.core.impl.utils;

import android.os.AsyncTask;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;

import com.tencent.liteav.basic.log.TXCLog;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

/**
 * Created by xkazer on 2018/10/8.
 */
public class TXHttpRequest {
    private static final String TAG = "TXHttpRequest";
    private static final int CON_TIMEOUT = 1000 * 5;
    private static final int READ_TIMEOUT = 1000 * 5;

    public interface TXHttpListenner {
        void OnRecvMessage(int errCode, final String msg, final byte[] data);
    }

    public int sendHttpsRequest(String url, byte[] data, TXHttpListenner callback){
        TXCLog.i(TAG, "sendHttpsRequest->enter action: "+url+", data size: "+data.length);
        asyncPostRequest(url.getBytes(), data, callback, null);
        return 0;
    }
    public int sendHttpsRequest(String url, byte[] data,  TXHttpListenner callback, String contentType){
        TXCLog.i(TAG, "sendHttpsRequest->enter action: "+url+", data size: "+data.length);
        asyncPostRequest(url.getBytes(), data, callback, contentType);
        return 0;
    }


    void asyncPostRequest(byte[] action, byte[] data, TXHttpListenner callback, String contentType) {
        TXPostRequest request = new TXPostRequest(callback, contentType);
        request.execute(action, data);
    }

    static class TXResult{
        public int errCode = -1;
        public String errMsg = "";
        public byte[] data = "".getBytes();
    }

    static class TXPostRequest extends AsyncTask<byte[], Void, TXResult>{
        private WeakReference<TXHttpListenner> mHttpRequest;
        private Handler mHandler = null;
        private String mContentType;
        public TXPostRequest(TXHttpListenner callback, String contentType) {
            mContentType = contentType;
            mHttpRequest = new WeakReference<>(callback);
            Looper looper = Looper.myLooper();
            if (looper != null) {
                mHandler = new Handler(looper);
            } else {
                mHandler = null;
            }
        }
        @Override
        protected TXResult doInBackground(byte[]... bytes) {
            TXResult result = new TXResult();
            try {
                if (new String(bytes[0]).startsWith("https")) {
                    result.data = getHttpsPostRsp(new String(bytes[0]), bytes[1], mContentType);
                }else{
                    result.data = getHttpPostRsp(new String(bytes[0]), bytes[1]);
                }
                result.errCode = 0;
            }catch (Exception e){
                result.errMsg = e.toString();
            }
            TXCLog.i(TAG, "TXPostRequest->result: "+result.errCode+"|"+result.errMsg);
            return result;
        }

        @Override
        protected void onPostExecute(final TXResult txResult) {
            super.onPostExecute(txResult);
            final TXHttpListenner request = mHttpRequest.get();
            if (request != null) {
                if (mHandler != null) {
                    mHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            request.OnRecvMessage(txResult.errCode, txResult.errMsg, txResult.data);
                        }
                    });
                } else {
                    request.OnRecvMessage(txResult.errCode, txResult.errMsg, txResult.data);
                }
            }
        }
    }

    //Http
    static byte[] getHttpPostRsp(String strAction, byte[] data) throws Exception {
        TXCLog.i(TAG, "getHttpPostRsp->request: " + strAction);
        TXCLog.i(TAG, "getHttpPostRsp->data size: " + data.length);
        URL url = new URL(strAction.replace(" ", "%20"));
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setConnectTimeout(CON_TIMEOUT);
        conn.setReadTimeout(READ_TIMEOUT);
        conn.setRequestMethod("POST");

        DataOutputStream out = new DataOutputStream(conn.getOutputStream());
        out.write(data);
        out.flush();
        out.close();

        int rspCode = conn.getResponseCode();
        if (rspCode == 200) {
            InputStream in = conn.getInputStream();
            ByteArrayOutputStream byBuffer = new ByteArrayOutputStream();
            byte[] byData = new byte[1024];
            int nRead;
            while ((nRead = in.read(data, 0, data.length)) != -1){
                byBuffer.write(data, 0, nRead);
            }
            byBuffer.flush();

            in.close();
            conn.disconnect();
            TXCLog.i(TAG, "getHttpsPostRsp->rsp size: " + byBuffer.size());
            return byBuffer.toByteArray();
        } else {
            TXCLog.i(TAG, "getHttpPostRsp->response code: " + rspCode);
            throw new Exception("response: " + rspCode);
        }
    }

    //HTTPS
    static byte[] getHttpsPostRsp(String strAction, byte[] data, String contentType) throws Exception {
        TXCLog.i(TAG, "getHttpsPostRsp->request: " + strAction);
        TXCLog.i(TAG, "getHttpsPostRsp->data: " + data.length);
        URL url = new URL(strAction.replace(" ", "%20"));
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setConnectTimeout(CON_TIMEOUT);
        conn.setReadTimeout(READ_TIMEOUT);
        conn.setRequestMethod("POST");
        if (!TextUtils.isEmpty(contentType)) {
            conn.setRequestProperty("Content-Type", contentType);
        }

        DataOutputStream out = new DataOutputStream(conn.getOutputStream());
        out.write(data);
        out.flush();
        out.close();

        int rspCode = conn.getResponseCode();
        if (rspCode == 200) {
            InputStream in = conn.getInputStream();
            ByteArrayOutputStream byBuffer = new ByteArrayOutputStream();
            byte[] byData = new byte[1024];
            int nRead;
            while ((nRead = in.read(data, 0, data.length)) != -1){
                byBuffer.write(data, 0, nRead);
            }
            byBuffer.flush();

            in.close();
            conn.disconnect();
            TXCLog.i(TAG, "getHttpsPostRsp->rsp size: " + byBuffer.size());
            return byBuffer.toByteArray();
        } else {
            TXCLog.i(TAG, "getHttpsPostRsp->response code: " + rspCode);
            throw new Exception("response: " + rspCode);
        }
    }

}
