function AccountModel() {
  this.sdkAppId = null;
  this.userId = null;
  this.userSig = null;
  this.userNick = null; // 昵称
  this.userAvatar = null; // 头像
  this.accountType = 1; // 帐号类型
  this.classId = null; // 信令群ID
  this.classChatId = null; // 聊天群ID
}

export default AccountModel;
