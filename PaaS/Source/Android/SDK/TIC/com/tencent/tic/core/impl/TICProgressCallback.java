package com.tencent.tic.core.impl;

/**
 * Created by eric on 2018/4/3.
 */

public interface TICProgressCallback<T> {

    /**
     * 进度
     *
     * @param percent 百分比
     */
    void onPrgress(int percent);

    /**
     * 操作成功
     *
     * @param data 成功返回值
     */
    void onSuccess(T data);

    /**
     * 操作失败
     *
     * @param module  出错模块
     * @param errCode 错误码
     * @param errMsg  错误描述
     */
    void onError(String module, int errCode, String errMsg);
}
