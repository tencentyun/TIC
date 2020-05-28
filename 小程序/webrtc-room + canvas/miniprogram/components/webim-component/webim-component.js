const TIM = require('tim-wx-sdk');
const MessageListener = require('../event/MessageListener');
const EventListener = require('../event/EventListener');
const StatusListener = require('../event/StatusListener');
const BoardListener = require('../event/BoardListener');

module.exports = {
  tim: null,
  sdkAppId: null,
  userId: null,
  userSig: null,
  groupId: null,

  getImInstance() {
    return this.tim;
  },

  init(sdkAppId) {
    this.sdkAppId = sdkAppId;
    this.tim = TIM.create({
      SDKAppID: sdkAppId
    }); // SDK 实例通常用 tim 表示
    this.tim.setLogLevel(6);
  },

  initEvent() {
    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived, this) // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息
    this.tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived, this) // SDK 收到新的群系统通知时触发
    this.tim.on(TIM.EVENT.KICKED_OUT, this.onKickedOut, this) // 用户被踢下线时触发
  },

  uninitEvent() {
    this.tim.off(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived) // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息
    this.tim.off(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived) // SDK 收到新的群系统通知时触发
    this.tim.off(TIM.EVENT.KICKED_OUT, this.onKickedOut) // 用户被踢下线时触发

    MessageListener.removeTICMessageListener(); // 清空所有监听
    EventListener.removeTICEventListener(); // 清空所有监听
    StatusListener.removeTICStatusListener(); // 清空所有监听
    BoardListener.removeBoardEventListener(); // 清空所有监听
  },

  onKickedOut(event) {
    StatusListener.fireEvent('onTICForceOffline');
  },

  onGroupSystemNoticeReceived(event) {
    const message = event.data.message; // 群系统通知的消息实例，详见 Message
    const payload = message.payload;
    switch (payload.operationType) {
      case 4: // 被踢出群组
        if (event.data.message.to == this.groupId) {
          EventListener.fireEvent('onTICClassroomDestroy');
        }
        break;
      case 5: // 群组被解散
        if (event.data.message.to == this.groupId) {
          EventListener.fireEvent('onTICClassroomDestroy');
        }
        break;
      case 11: //群已被回收(全员接收)
        if (event.data.message.to == this.groupId) {
          EventListener.fireEvent('onTICClassroomDestroy');
        }
        break;
      case 255:
        MessageListener.fireEvent('onTICRecvGroupSystemNotify', 255, event.data.message);
        break;
    }
  },

  onMessageReceived(event) {
    let messages = event.data;
    messages.forEach((message) => {
      // 群组消息
      if (message.conversationType === TIM.TYPES.CONV_GROUP) {
        if (message.to === this.groupId) { // 如果是当前群组
          let elements = message.getElements();
          let isBoardMessage = false; // 如果是白板消息
          if (elements.length) {
            elements.forEach((element) => {
              if (element.type === 'TIMGroupTipElem') {
                switch (element.content.operationType) {
                  case TIM.TYPES.GRP_TIP_MBR_JOIN:
                    EventListener.fireEvent('onTICMemberJoin', element.content.userIDList);
                    break;
                  case TIM.TYPES.GRP_TIP_MBR_QUIT:
                    EventListener.fireEvent('onTICMemberQuit', element.content.userIDList);
                    break;
                }
              } else if (element.type === 'TIMTextElem') {
                MessageListener.fireEvent('onTICRecvGroupTextMessage', message.from, element.content.text, element.content.text.length);
              } else if (element.type === 'TIMFileElem') {
                if (element.content.fileName === 'TXWhiteBoardExt') {
                  if (message.from != this.userId) {
                    isBoardMessage = true; // 是白板消息
                    wx.request({
                      url: element.content.fileUrl,
                      method: 'GET',
                      success: (res) => {
                        BoardListener.fireEvent('RECEIVE_BOARD_DATA', res.data);
                      },
                      fail: () => {
                        setTimeout(() => {
                          // 重试一次
                          wx.request({
                            url: element.content.fileUrl,
                            method: 'GET',
                            success: (res) => {
                              BoardListener.fireEvent('RECEIVE_BOARD_DATA', res.data);
                            },
                            fail: () => {

                            }
                          })
                        }, 1000);
                      }
                    })
                  }
                }
              } else if (element.type === 'TIMCustomElem') {
                if (element.content.extension === 'TXWhiteBoardExt') {
                  isBoardMessage = true; // 是白板消息
                  if (message.from != this.userId) {
                    BoardListener.fireEvent('RECEIVE_BOARD_DATA', element.content.data);
                  }
                } else if (element.content.extension === 'TXConferenceExt') {
                  isBoardMessage = true; // 是白板消息
                  // 对时消息过滤掉
                } else {
                  MessageListener.fireEvent('onTICRecvGroupCustomMessage', message.from, element.content.data, element.content.data.length);
                }
              }
            });
          }

          if (!isBoardMessage) { // 如果不是白板消息，则需要将消息抛出来
            try {
              MessageListener.fireEvent('onTICRecvMessage', message);
            } catch (error) {}
          }
        } else {
          // 其他群组消息忽略
        }
      } else if (message.conversationType === TIM.TYPES.CONV_C2C) { // C2C消息
        let elements = message.getElements();
        if (elements.length) {
          elements.forEach((element) => {
            if (element.type === 'TIMTextElem') {
              MessageListener.fireEvent('onTICRecvTextMessage', message.from, element.content.text, element.content.text.length);
            } else if (element.type === 'TIMCustomElem') {
              MessageListener.fireEvent('onTICRecvCustomMessage', message.from, element.content, element.content.length);
            }
          });
        }

        try {
          MessageListener.fireEvent('onTICRecvMessage', message);
        } catch (error) {

        }
      }
    });
  },

  /**
   * 登录IM
   */
  login(userId, userSig) {
    this.userId = userId;
    this.userSig = userSig;
    this.uninitEvent();
    this.initEvent();
    return this.tim.login({
      userID: String(userId),
      userSig: String(userSig)
    });
  },

  /**
   * 注销IM
   */
  logout() {
    this.uninitEvent();
    return this.tim.logout();
  },

  /**
   * 创建房间
   * @param {*} userId 
   * @param {*} groupId 
   */
  createGroup(groupId, groupType) {
    groupId = String(groupId);
    var options = {
      name: groupId,
      groupID: groupId,
      type: groupType || TIM.TYPES.GRP_PUBLIC,
      joinOption: TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS //自由加入
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
  },

  /**
   * 加入群组
   * @param {*} groupId 群组ID
   * @param {*} succ 成功回调
   * @param {*} fail 失败回调
   */
  joinGroup(groupId, groupType) {
    groupId = String(groupId);
    this.groupId = groupId;
    return this.tim.joinGroup({
      groupID: groupId,
      type: groupType || TIM.TYPES.GRP_PUBLIC,
    }).then(res => {
      switch (res.data.status) {
        case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
        case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
          return Promise.resolve();
        case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意,业务上认为失败
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
  },

  /**
   * 退出课堂
   * @param {*} succ 
   * @param {*} fail 
   */
  quitGroup(groupId) {
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
  },

  /**
   * 销毁群组
   */
  destroyGroup(groupId) {
    groupId = String(groupId);
    return this.tim.dismissGroup(groupId);
  },

  /**
   * 发送C2C文本消息
   */
  sendC2CTextMessage(toUserIdentifier, msg) {
    let message = this.tim.createTextMessage({
      to: toUserIdentifier,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        text: msg
      }
    })
    return this.tim.sendMessage(message);
  },

  /**
   * 发送C2C自定义消息
   */
  sendC2CCustomMessage(toUserIdentifier, msg) {
    let message = this.tim.createCustomMessage({
      to: toUserIdentifier,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        data: msg.data,
        description: msg.description,
        extension: msg.extension
      }
    })
    return this.tim.sendMessage(message);
  },

  /**
   * 发送群文本消息
   */
  sendGroupTextMessage(msg) {
    let message = this.tim.createTextMessage({
      to: this.groupId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        text: msg
      }
    })
    return this.tim.sendMessage(message);
  },

  /**
   * 发送群组自定义消息
   */
  sendGroupCustomMessage(msg) {
    let message = this.tim.createCustomMessage({
      to: this.groupId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: msg.data,
        description: msg.description,
        extension: msg.extension
      }
    })
    return this.tim.sendMessage(message);
  },

  // 发送白板数据
  sendBoardGroupCustomMessage(content) {
    let msg = {
      data: JSON.stringify(content),
      description: '',
      extension: 'TXWhiteBoardExt'
    };
    return this.sendGroupCustomMessage(msg).then(() => {
      return Promise.resolve(content);
    }, (error) => {
      if (error && error.data && error.data.message) {
        // 失败重试一次
        return this.tim.resendMessage(error.data.message).then(() => {
          return Promise.resolve(content);
        }, error => {
          return Promise.reject(error);
        });
      } else {
        return Promise.reject(error);
      }
    });
  }
}