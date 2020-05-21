function ImHandler(accountModel, classModel) {
  this.imBoardSession = null;
  this.imChatSession = null;
  this.accountModel = accountModel;
  this.classModel = classModel;
  this.sendMsgFailMap = {};
}

/**
 * 白板信令
 */
ImHandler.prototype.setIMBoardSession = function (imSession) {
  this.imBoardSession = imSession;
}

ImHandler.prototype.setIMChatSession = function (imChatSession) {
  this.imChatSession = imChatSession;
}

/**
 * 传输白板数据
 * @param {*} content 
 */
ImHandler.prototype.sendBoardGroupCustomMessage = function (content) {
  var msg = new webim.Msg(this.imBoardSession, true, -1, Math.round(Math.random() * 4294967296),
    new Date().getTime(), this.accountModel.userId, webim.GROUP_MSG_SUB_TYPE.REDPACKET, this.accountModel.userNick);
  var custom = new webim.Msg.Elem.Custom(content, '', 'TXWhiteBoardExt');
  msg.addCustom(custom);
  msg.PushInfoBoolean = true;
  msg.PushInfo = {
    Ext: 'TXWhiteBoardExt',
    PushFlag: 0
  };
  webim.sendMsg(msg, (resp) => {
    console.log(resp);
  }, (error) => {
    this.retrySendBoardGroupCustomMessage(msg);
  });
}

/**
 * 重试逻辑
 * @param {*} msg 
 */
ImHandler.prototype.retrySendBoardGroupCustomMessage = function (msg) {
  // 重试3次
  if ((this.sendMsgFailMap[msg.seq + ''] || 0) > 1) {
    return;
  }
  this.sendMsgFailMap[msg.seq + ''] = (this.sendMsgFailMap[msg.seq + ''] || 0) + 1;
  webim.sendMsg(msg, function (resp) {
    console.log(resp);
  }, (error) => {
    this.retrySendBoardGroupCustomMessage(msg);
  })
}

/**
 * 发送普通文本消息
 * @param {*} selType 接收方类型（个人/群组）
 * @param {*} msgText 消息内容
 * @param {*} toUser 接收方ID
 */
ImHandler.prototype.sendTextMessage = function (selType, msgText, toUser, succ, fail) {
  var selSess = null;
  var subType; //消息子类型

  // 如果是发给群组
  if (selType == webim.SESSION_TYPE.GROUP) {
    selSess = this.imChatSession;
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
  } else {
    subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    selSess = new webim.Session(selType, toUser, toUser, '', this.getUnixTimestamp());
  }

  var isSend = true; //是否为自己发送
  var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
  var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
  var msgTime = this.getUnixTimestamp(); //消息时间戳
  var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, this.accountModel.userId, subType, this.accountModel.userNick);
  var text_obj;

  text_obj = new webim.Msg.Elem.Text(msgText);
  msg.addText(text_obj);

  webim.sendMsg(msg, function (resp) {
    succ && succ();
  }, function (err) {
    fail && fail(err);
  });
}

/**
 * 发送自定义消息
 * @param {*} selType 接收方类型（个人/群组）
 * @param {*} msgObj 消息内容
 * @param {*} toUser 接收方ID
 */
ImHandler.prototype.sendCustomMsg = function (selType, msgText, toUser, succ, fail) {
  var selSess = null;
  var subType; //消息子类型

  // 如果是发给群组
  if (selType == webim.SESSION_TYPE.GROUP) {
    selSess = this.imChatSession;
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
  } else {
    selSess = new webim.Session(selType, toUser, toUser, '', this.getUnixTimestamp());
    subType = webim.C2C_MSG_SUB_TYPE.COMMON;
  }

  var isSend = true; //是否为自己发送
  var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
  var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
  var msgTime = this.getUnixTimestamp(); //消息时间戳

  var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, this.accountModel.userId, subType, this.accountModel.userNick);

  var custom_obj = new webim.Msg.Elem.Custom(msgText);
  msg.addCustom(custom_obj);
  //调用发送消息接口
  webim.sendMsg(msg, function (resp) {
    succ && succ();
  }, function (err) {
    fail && fail(err);
  });
}

/**
 * 获取unixTimestamp时间戳
 */
ImHandler.prototype.getUnixTimestamp = function () {
  return Math.round(new Date().getTime() / 1000);
}

export default ImHandler;