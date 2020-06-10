import LogReport from '../log/LogReport'
import Constant from '../constant/Constant';

class TICWebIM {
  constructor() {
    this.accountModel = null;
    this.classModel = null;
    this.imListener = null;
    this.boardNotifyCallback = null;
    this.compatSaas = null;
    this.groupChatId = null;
    this.groupBoardId = null;
    this.xmlHttp = null;
  }

  init(sdkAppId) {
    var options = {
      SDKAppID: sdkAppId // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    };
    this.tim = window.TIM.create(options);
    this.tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
    this.tim.registerPlugin({
      'cos-js-sdk': window.COS
    }); // 注册 COS SDK 插件
  }

  getInstance() {
    return this.tim;
  }

  setLog(log) {
    this.log = log;
  }

  login(accountModel, classModel) {
    this.accountModel = accountModel;
    this.classModel = classModel;
    this.uninitEvent();
    this.initEvent();
    return this.tim.login({
      userID: String(accountModel.userId),
      userSig: String(accountModel.userSig)
    });
  }

  initEvent() {
    this.tim.on(window.TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived, this) // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息
    this.tim.on(window.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived, this) // SDK 收到新的群系统通知时触发
    this.tim.on(window.TIM.EVENT.KICKED_OUT, this.onKickedOut, this) // 用户被踢下线时触发
  }

  uninitEvent() {
    this.tim.off(window.TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived) // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息
    this.tim.off(window.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived) // SDK 收到新的群系统通知时触发
    this.tim.off(window.TIM.EVENT.KICKED_OUT, this.onKickedOut) // 用户被踢下线时触发
  }

  logout() {
    this.uninitEvent();
    return this.tim.logout();
  }

  /**
   * @classId 群组id
   * @scene 场景
   */
  createRoom(groupId, scene) {
    scene = Number(scene);
    groupId = String(groupId);

    let groupType = null;
    if (scene === Constant.TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL) {
      groupType = window.TIM.TYPES.GRP_PUBLIC;
    } else {
      groupType = window.TIM.TYPES.GRP_AVCHATROOM;

    }
    var options = {
      name: groupId,
      groupID: groupId,
      type: groupType,
      joinOption: window.TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS //自由加入
    };

    return this.tim.createGroup(options).then(res => {
      return Promise.resolve();
    }, error => {
      if (error.code == 10025) { // 群组 ID 已被使用，并且操作者为群主，可以直接使用。
        return Promise.resolve();
      } else {
        return Promise.reject(error);
      }
    })
  }

  /**
   * 加入白板信令群
   */
  joinRoom() {
    var groupId = String(this.accountModel.classId);
    this.groupBoardId = groupId;
    let compatSaas = this.classModel.compatSaas; // 是否要与saas互通
    this.compatSaas = compatSaas;
    if (!compatSaas) { // 如果不与saas互通
      this.groupChatId = null; // 将saas的聊天群置空
    }
    return this.tim.joinGroup({
      groupID: groupId,
      type: window.TIM.TYPES.GRP_AVCHATROOM,
    }).then(res => {
      switch (res.data.status) {
        case window.TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
        case window.TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
          return Promise.resolve();
        case window.TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意,业务上认为失败
        default:
          return Promise.reject(res);
      }
    }, error => {
      if (error.code == 10013) { // 被邀请加入的用户已经是群成员,也表示成功
        return Promise.resolve();
      } else if (error.code == -12) { // Join Group succeed; But the type of group is not AVChatRoom
        return Promise.resolve();
      }
      return Promise.reject(error);
    });
  }

  /**
   * 加入Saas聊天群
   */
  joinSaasChatRoom() {
    var groupChatId = String(this.accountModel.classChatId);
    this.groupChatId = groupChatId;
    return this.tim.joinGroup({
      groupID: groupChatId,
      type: window.TIM.TYPES.GRP_AVCHATROOM,
    }).then(res => {
      switch (res.data.status) {
        case window.TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
        case window.TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
          return Promise.resolve();
        case window.TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意,业务上认为失败
        default:
          return Promise.reject(res);
      }
    }, error => {
      if (error.code == 10013) { // 被邀请加入的用户已经是群成员,也表示成功
        return Promise.resolve();
      } else if (error.code == -12) { // Join Group succeed; But the type of group is not AVChatRoom
        return Promise.resolve();
      }
      return Promise.reject(error);
    });
  }

  /**
   * 销毁群组
   */
  destroyGroup(groupId) {
    groupId = String(groupId);
    return this.tim.dismissGroup(groupId);
  }

  /**
   * 退出群组
   */
  quitGroup() {
    var groupId = String(this.accountModel.classId);
    groupId = String(groupId);
    return this.tim.quitGroup(groupId).then(res => {
      return Promise.resolve();
    }, error => {
      // 群不存在 或者 不在群里了 或者 群id不合法（一般这种情况是课堂销毁了groupId被重置后发生）
      if (error.code === 10010 || error.code === 10007 || error.code === 10015) {
        return Promise.resolve();
      } else if (error.code == 10009) { // 群主自己想退课堂
        return Promise.resolve();
      } else {
        return Promise.reject(error);
      }
    });
  }

  /**
   * 退出chat群组
   */
  quitChatGroup() {
    var groupId = String(this.accountModel.classChatId);
    return this.tim.quitGroup(groupId).then(res => {
      return Promise.resolve();
    }, error => {
      // 群不存在 或者 不在群里了 或者 群id不合法（一般这种情况是课堂销毁了groupId被重置后发生）
      if (error.code === 10010 || error.code === 10007 || error.code === 10015) {
        return Promise.resolve();
      } else if (error.code == 10009) { // 群主自己想退课堂
        return Promise.resolve();
      } else {
        return Promise.reject(error);
      }
    });
  }

  onKickedOut(event) {
    this.statusListener.fireEvent('onTICForceOffline');
  }

  onGroupSystemNoticeReceived(event) {
    const message = event.data.message; // 群系统通知的消息实例，详见 Message
    const payload = message.payload;
    switch (payload.operationType) {
      case 4: // 被踢出群组
        if (event.data.message.to == this.groupBoardId || event.data.message.to == this.groupChatId) {
          this.eventListener.fireEvent('onTICClassroomDestroy');
        }
        break;
      case 5: // 群组被解散
        if (event.data.message.to == this.groupBoardId || event.data.message.to == this.groupChatId) {
          this.eventListener.fireEvent('onTICClassroomDestroy');
        }
        break;
      case 11: //群已被回收(全员接收)
        if (event.data.message.to == this.groupBoardId || event.data.message.to == this.groupChatId) {
          this.eventListener.fireEvent('onTICClassroomDestroy');
        }
        break;
      case 255:
        this.messageListener.fireEvent('onTICRecvGroupSystemNotify', 255, event.data.message);
        break;
    }
  }

  onMessageReceived(event) {
    let messages = event.data;
    messages.forEach((message) => {
      // 群组消息
      if (message.conversationType === window.TIM.TYPES.CONV_GROUP) {
        if (message.to === this.groupBoardId || (message.to === this.groupChatId && this.compatSaas)) { // 如果是当前群组
          let elements = message.getElements();
          let isBoardMessage = false; // 如果是白板消息
          if (elements.length) {
            elements.forEach((element) => {
              if (element.type === 'TIMGroupTipElem') {
                switch (element.content.operationType) {
                  case window.TIM.TYPES.GRP_TIP_MBR_JOIN:
                    this.eventListener.fireEvent('onTICMemberJoin', element.content.userIDList);
                    break;
                  case window.TIM.TYPES.GRP_TIP_MBR_QUIT:
                    this.eventListener.fireEvent('onTICMemberQuit', element.content.userIDList);
                    break;
                }
              } else if (element.type === 'TIMTextElem') {
                this.messageListener.fireEvent('onTICRecvGroupTextMessage', message.from, element.content.text, element.content.text.length);
              } else if (element.type === 'TIMFileElem') {
                if (element.content.fileName === 'TXWhiteBoardExt') {
                  if (message.from != this.userId) {
                    isBoardMessage = true; // 是白板消息
                    var xhr = this._getXhr();
                    xhr.onreadystatechange = () => {
                      if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                          this.boardNotifyCallback && this.boardNotifyCallback(xhr.responseText);
                        }
                      }
                    };
                    xhr.open('get', element.content.fileUrl, true);
                    xhr.send();
                  }
                }
              } else if (element.type === 'TIMCustomElem') {
                if (element.content.extension === 'TXWhiteBoardExt') {
                  isBoardMessage = true; // 是白板消息
                  if (message.from != this.userId) {
                    this.boardNotifyCallback && this.boardNotifyCallback(element.content.data);
                  }
                } else if (element.content.extension === 'TXConferenceExt') {
                  isBoardMessage = true; // 是白板消息
                  // 对时消息过滤掉
                } else {
                  this.messageListener.fireEvent('onTICRecvGroupCustomMessage', message.from, element.content.data, element.content.data.length);
                }
              }
            });
          }
          if (!isBoardMessage) { // 如果不是白板消息，则需要将消息抛出来
            try {
              this.messageListener.fireEvent('onTICRecvMessage', message);
            } catch (error) {}
          }
        } else if (message.to == this.groupChatId) { // 如果是saas聊天群
          try {
            this.messageListener.fireEvent('onTICRecvMessage', message);
          } catch (error) {}
        } else {
          // 其他群组消息忽略
        }
      } else if (message.conversationType === window.TIM.TYPES.CONV_C2C) { // C2C消息

        let elements = message.getElements();
        if (elements.length) {
          elements.forEach((element) => {
            if (element.type === 'TIMTextElem') {
              this.messageListener.fireEvent('onTICRecvTextMessage', message.from, element.content.text, element.content.text.length);
            } else if (element.type === 'TIMCustomElem') {
              this.messageListener.fireEvent('onTICRecvCustomMessage', message.from, element.content, element.content.length);
            }
          });
        }
        try {
          this.messageListener.fireEvent('onTICRecvMessage', message);
        } catch (error) {

        }
      }
    });
  }

  /**
   * 收到白板消息的回调
   * @param {Function} callback 
   */
  setReceiveBoardNotifyCallback(callback) {
    this.boardNotifyCallback = callback;
  }

  /**
   * 发送C2C文本消息
   */
  sendC2CTextMessage(userId, msg) {
    let message = this.tim.createTextMessage({
      to: userId,
      conversationType: window.TIM.TYPES.CONV_C2C,
      payload: {
        text: msg
      }
    })
    return this.tim.sendMessage(message).then(() => {
      return Promise.resolve();
    }, (error) => {
      return Promise.reject(error);
    });
  }

  /**
   * 发送C2C自定义消息
   */
  sendC2CCustomMessage(userId, msg) {
    // 如果不是对象
    if (Object.prototype.toString.call(msg) !== '[object Object]') {
      msg = {
        data: msg,
        description: '',
        extension: ''
      }
    }
    let message = this.tim.createCustomMessage({
      to: userId,
      conversationType: window.TIM.TYPES.CONV_C2C,
      payload: {
        data: msg.data,
        description: msg.description,
        extension: msg.extension
      }
    })
    return this.tim.sendMessage(message).then(() => {
      return Promise.resolve();
    }, (error) => {
      return Promise.reject(error);
    });
  }

  /**
   * 发送群文本消息
   */
  sendGroupTextMessage(msg) {
    let toGroupId = this.compatSaas ? this.groupChatId : this.groupBoardId;
    let message = this.tim.createTextMessage({
      to: toGroupId,
      conversationType: window.TIM.TYPES.CONV_GROUP,
      payload: {
        text: msg
      }
    })
    return this.tim.sendMessage(message).then(() => {
      return Promise.resolve();
    }, (error) => {
      return Promise.reject(error);
    });
  }

  /**
   * 发送群组自定义消息
   */
  sendGroupCustomMessage(msg) {
    // 如果不是对象
    if (Object.prototype.toString.call(msg) !== '[object Object]') {
      msg = {
        data: msg,
        description: '',
        extension: ''
      }
    }
    let toGroupId = this.compatSaas ? this.groupChatId : this.groupBoardId;
    let message = this.tim.createCustomMessage({
      to: toGroupId,
      conversationType: window.TIM.TYPES.CONV_GROUP,
      payload: {
        data: msg.data,
        description: msg.description,
        extension: msg.extension
      }
    })
    return this.tim.sendMessage(message).then(() => {
      return Promise.resolve();
    }, (error) => {
      return Promise.reject(error);
    });
  }

  // 发送白板数据
  sendBoardGroupCustomMessage(content) {
    let contentStr = null;
    try {
      contentStr = JSON.stringify(content);
    } catch (error) {
      contentStr = content;
    }
    let toGroupId = this.groupBoardId;
    let message = this.tim.createCustomMessage({
      to: toGroupId,
      conversationType: window.TIM.TYPES.CONV_GROUP,
      payload: {
        data: JSON.stringify(content),
        description: '',
        extension: 'TXWhiteBoardExt'
      }
    })
    return this.tim.sendMessage(message).then(() => {
      return Promise.resolve(content);
    }, () => {
      // 失败重试一次
      return this.tim.resendMessage(message).then(() => {
        return Promise.resolve(content);
      }, error => {
        return Promise.reject(error);
      });
    });
  }

  setMessageListener(messageListener) {
    this.messageListener = messageListener;
  }

  setEventListener(eventListener) {
    this.eventListener = eventListener;
  }

  setStatusListener(statusListener) {
    this.statusListener = statusListener;
  }

  _getXhr() {
    if (this.xmlHttp) {
      return this.xmlHttp;
    }
    let xmlHttp = null;
    if (window.XMLHttpRequest) {
      xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
      }
    }
    this.xmlHttp = xmlHttp;
    return xmlHttp;
  }
}

export default TICWebIM;