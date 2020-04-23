const MessageListener = require('../event/MessageListener');
const EventListener = require('../event/EventListener');
const StatusListener = require('../event/StatusListener');
const BoardListener = require('../event/BoardListener');
const webim = require('./webim_wx.min.js');
const ImHandler = require('./ImHandler');

var IMListeners = {
  // 用于监听用户连接状态变化的函数，选填
  onConnNotify(resp) {},

  // 监听新消息(直播聊天室)事件，直播场景下必填
  onBigGroupMsgNotify(msgs) {},

  // 监听新消息函数，必填
  onMsgNotify(msgs) {
    if (msgs.length) { // 如果有消息才处理
      msgs.forEach(msg => {
        var sess = msg.getSession();
        var msgType = sess.type();
        // 如果是群组消息
        if (msgType === webim.SESSION_TYPE.GROUP) {
          var groupid = sess.id();
          // 如果是聊天群
          if (groupid == ImHandler.classId) {
            var elems = msg.elems;
            if (elems.length) {
              // 白板消息
              if (elems[0].type === 'TIMCustomElem' && elems[0].content.ext === 'TXWhiteBoardExt') {
                if (msg.getFromAccount() != ImHandler.userId) {
                  BoardListener.fireEvent('RECEIVE_BOARD_DATA', msg);
                }
              } else if (elems[0].type === 'TIMFileElem' && elems[0].content.name === 'TXWhiteBoardExt') { // 白板消息
                if (msg.getFromAccount() != ImHandler.userId) {
                  BoardListener.fireEvent('RECEIVE_BOARD_FILE_DATA', msg);
                }
              } else {
                IMListeners.parseMsg(msg);
              }
            }
          }
        } else { // 如果是C2C消息
          IMListeners.parseMsg(msg);
        }
      });
    }
  },

  parseMsg(msg) {
    var elems = msg.elems;
    elems.forEach(elem => {
      var content = elem.getContent();
      if (msg.getFromAccount() === '@TIM#SYSTEM') { // 接收到系统消息
        var opType = content.getOpType(); // 通知类型
        if (opType === webim.GROUP_TIP_TYPE.JOIN) { // 加群通知
          EventListener.fireEvent('onTICMemberJoin', elem.getContent().userIdList);
        } else if (opType === webim.GROUP_TIP_TYPE.QUIT) { // 退群通知
          EventListener.fireEvent('onTICMemberQuit', [elem.getContent().opUserId]);
        } else if (opType === webim.GROUP_TIP_TYPE.KICK) { // 踢人通知

        } else if (opType === webim.GROUP_TIP_TYPE.SET_ADMIN) { // 设置管理员通知

        } else if (opType === webim.GROUP_TIP_TYPE.CANCEL_ADMIN) { // 取消管理员通知

        } else if (opType === webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO) { // 群资料变更

        } else if (opType === webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO) { //群成员资料变更

        }
      } else { // 接收到群聊天/C2C消息
        var type = elem.getType();
        if (type === 'TIMTextElem') {
          var text = '';
          if (msg.getSession().type() === webim.SESSION_TYPE.GROUP) {
            text = elem.getContent().getText() || '';
            MessageListener.fireEvent('onTICRecvGroupTextMessage', msg.getFromAccount(), text, text.length);
          } else {
            text = elem.getContent().getText() || '';
            MessageListener.fireEvent('onTICRecvTextMessage', msg.getFromAccount(), text, text.length);
          }
        } else if (type === 'TIMCustomElem') {
          var data = '';
          if (msg.getSession().type() === webim.SESSION_TYPE.GROUP) {
            data = elem.getContent().getData() || '';
            MessageListener.fireEvent('onTICRecvGroupCustomMessage', msg.getFromAccount(), data, data.length);
          } else {
            data = elem.getContent().getData() || '';
            MessageListener.fireEvent('onTICRecvCustomMessage', msg.getFromAccount(), data, data.length);
          }
        }
        MessageListener.fireEvent('onTICRecvMessage', msg);
      }
    });
  },

  // 监听（多终端同步）群系统消息事件，必填
  onGroupSystemNotifys: {
    // //申请加群请求（只有管理员会收到）
    // "1": (notify) => {
    // },

    // //申请加群被同意（只有申请人能够收到）
    // "2": (notify) => {
    // },

    // //申请加群被拒绝（只有申请人能够收到）
    // "3": (notify) => {
    // },

    // //被管理员踢出群(只有被踢者接收到)
    // "4": (notify) => {
    // },

    //群被解散(全员接收)
    "5": (notify) => {
      EventListener.fireEvent('onTICClassroomDestroy');
    },

    // //创建群(创建者接收)
    // "6": (notify) => {
    // },

    // //邀请加群(被邀请者接收)
    // "7": (notify) => {
    // },

    // //主动退群(主动退出者接收)
    // "8": (notify) => {

    // },

    // //设置管理员(被设置者接收)
    // "9": (notify) => {
    // },

    // //取消管理员(被取消者接收)
    // "10": (notify) => {
    // },

    // //群已被回收(全员接收)
    "11": (notify) => {
      EventListener.fireEvent('onTICClassroomDestroy');
    },

    // //用户自定义通知(默认全员接收)
    // "255": (notify) => {
    // }
  },

  // 监听群资料变化事件，选填
  onGroupInfoChangeNotify(groupInfo) {},

  // 被踢下线的回调
  onKickedEventCall() {
    StatusListener.fireEvent('onTICForceOffline');
  },

  // 监听 C2C 消息通道的处理
  onC2cEventNotifys: {
    // 多终端互踢
    "96": (notify) => {
      StatusListener.fireEvent('onTICForceOffline');
    }
  }
}

module.exports = IMListeners;