const webim = require('./webim_wx.min.js');
var ImHandler = {
  classId: null,
  userId: null,

  // 聊天房间的session
  selSess: null,

  sendMsgFailMap: {

  },

  /**
   * 传输白板数据
   * @param {*} content 
   */
  sendBoardGroupCustomMessage(content) {
    var msg = new webim.Msg(this.selSess, true, -1, Math.round(Math.random() * 4294967296),
      new Date().getTime(), ImHandler.userId, webim.GROUP_MSG_SUB_TYPE.COMMON, ImHandler.userId);
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
  },

  /**
   * 重试逻辑
   * @param {*} msg 
   */
  retrySendBoardGroupCustomMessage(msg) {
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
  },

  /**
   * 发送普通文本消息
   * @param {*} selType 接收方类型（个人/群组）
   * @param {*} msgText 消息内容
   * @param {*} toUser 接收方ID
   */
  sendTextMessage(selType, msgText, toUser, succ, fail) {
    var selSess = null;
    var subType; //消息子类型

    // 如果是发给群组
    if (selType == webim.SESSION_TYPE.GROUP) {
      selSess = this.selSess;
      subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    } else {
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
      selSess = new webim.Session(selType, toUser, toUser, '', this.getUnixTimestamp());
    }

    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = this.getUnixTimestamp(); //消息时间戳
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, ImHandler.userId, subType, ImHandler.userId);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;

    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgText.match(expr);
    if (!emotions || emotions.length < 1) {
      text_obj = new webim.Msg.Elem.Text(msgText);
      msg.addText(text_obj);
    } else {
      for (var i = 0; i < emotions.length; i++) {
        tmsg = msgText.substring(0, msgText.indexOf(emotions[i]));
        if (tmsg) {
          text_obj = new webim.Msg.Elem.Text(tmsg);
          msg.addText(text_obj);
        }
        emotionIndex = webim.EmotionDataIndexs[emotions[i]];
        emotion = webim.Emotions[emotionIndex];
        if (emotion) {
          face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
          msg.addFace(face_obj);
        } else {
          text_obj = new webim.Msg.Elem.Text(emotions[i]);
          msg.addText(text_obj);
        }
        restMsgIndex = msgText.indexOf(emotions[i]) + emotions[i].length;
        msgText = msgText.substring(restMsgIndex);
      }
      if (msgText) {
        text_obj = new webim.Msg.Elem.Text(msgText);
        msg.addText(text_obj);
      }
    }

    webim.sendMsg(msg, function (resp) {
      succ && succ();
    }, function (err) {
      fail && fail(err);
    });
  },


  /**
   * 发送自定义消息
   * @param {*} selType 接收方类型（个人/群组）
   * @param {*} msgObj 消息内容
   * @param {*} toUser 接收方ID
   */
  sendCustomMsg(selType, msgText, toUser, succ, fail) {
    var selSess = null;
    var subType; //消息子类型

    // 如果是发给群组
    if (selType == webim.SESSION_TYPE.GROUP) {
      selSess = this.selSess;
      subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    } else {
      selSess = new webim.Session(selType, toUser, toUser, '', this.getUnixTimestamp());
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    }

    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = this.getUnixTimestamp(); //消息时间戳

    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, ImHandler.userId, subType, ImHandler.userId);

    var custom_obj = new webim.Msg.Elem.Custom(msgText);
    msg.addCustom(custom_obj);
    //调用发送消息接口
    webim.sendMsg(msg, function (resp) {
      succ && succ();
    }, function (err) {
      fail && fail(err);
    });
  },

  /**
   * 获取unixTimestamp时间戳
   */
  getUnixTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  },

  sendBoardMsg(data) {
    var msg = new webim.Msg(this.selSess, true, -1, Math.round(Math.random() * 4294967296),
      new Date().getTime(), this.userId, webim.GROUP_MSG_SUB_TYPE.COMMON, this.userId);
    var custom = new webim.Msg.Elem.Custom(JSON.stringify(data), '', 'TXWhiteBoardExt');
    msg.addCustom(custom);
    msg.PushInfoBoolean = true;
    msg.PushInfo = {
      Ext: 'TXWhiteBoardExt',
      PushFlag: 0
    };
    webim.sendMsg(msg, (resp) => {}, (error) => {
      this.retrySendBoardGroupCustomMessage(msg);
    });
  },

  retrySendBoardGroupCustomMessage(msg) {
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
};
module.exports = ImHandler;