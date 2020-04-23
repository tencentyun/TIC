package com.tencent.tic.core.impl;


public class UserInfo {

    private String userId = "";
    private String userSig = "";

    public UserInfo() {
    }

    public UserInfo(String userId, String userSig) {
        this.userId = userId;
        this.userSig = userSig;
    }

    public void setUserInfo(final String userId, final String userSig) {
        this.userId = userId;
        this.userSig = userSig;
    }

    public String getUserId() {
        return userId;
    }

    public String getUserSig() {
        return userSig;
    }
}
