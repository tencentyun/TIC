const webim = require('./webim_wx.min.js');
const IMListeners = require('./imListener');
const ImHandler = require('./ImHandler');

module.exports = {
  sendMsgFailMap: {},
  initData(userData, groupData) {
    this.userData = userData || {};
    this.userData['identifier'] = this.userData.userId;
    this.userData['accountType'] = 1;
    this.userData['appIDAt3rd'] = this.userData.sdkAppID;
    this.groupData = groupData || {};
    this.groupData['sessionType'] = webim.SESSION_TYPE.GROUP;
  },

  /**
   * 登录IM
   * @param {Function} success 
   * @param {Function} fail 
   */
  login(success, fail) {
    if (!webim.checkLogin()) {
      webim.login(this.userData, IMListeners, {
        isLogOn: false
      }, () => {
        ImHandler.userId = this.userData.userId;
        success();
      }, fail);
    } else {
      ImHandler.userId = this.userData.userId;
      success();
    }
  },

  /**
   * 注销IM
   */
  logout(succ, fail) {
    if (webim.checkLogin()) {
      webim.logout(succ, fail);
    }
  },

  /**
   * 创建房间
   * @param {*} userId 
   * @param {*} groupId 
   */
  createRoom(userId, groupId) {
    var groupID = String(groupId);
    var groupType = 'Public';

    var options = {
      'GroupId': groupId,
      'Owner_Account': String(userId),
      'Type': groupType,
      'ApplyJoinOption': 'FreeAccess',
      'Name': groupID,
      'Notification': "",
      'Introduction': "",
      'MemberList': [],
    };

    return new Promise((resolve, reject) => {
      webim.createGroup(
        options,
        function (resp) {
          resolve(resp);
        },
        function (err) {
          if (err.ErrorCode == 10025) {
            resolve(err);
          } else if (err.ErrorCode == 10021) {
            reject(err);
          } else {
            reject(err);
          }
        }
      );
    });
  },

  /**
   * 加入群组
   * @param {*} groupId 群组ID
   * @param {*} succ 成功回调
   * @param {*} fail 失败回调
   */
  joinGroup(groupId, succ, fail) {
    var self = this;
    webim.applyJoinGroup({
        GroupId: String(groupId)
      },
      function (resp) {
        //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
        if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
          ImHandler.selSess = new webim.Session(webim.SESSION_TYPE.GROUP, groupId, groupId);
          self.groupData['groupId'] = groupId;
          ImHandler.classId = groupId;
          succ && succ(resp);
        } else {
          fail && fail(resp);
        }
      },
      function (err) {
        if (err.ErrorCode == 10013) { // 被邀请加入的用户已经是群成员,也表示成功
          ImHandler.selSess = new webim.Session(webim.SESSION_TYPE.GROUP, groupId, groupId);
          self.groupData['groupId'] = groupId;
          ImHandler.classId = groupId;
          succ && succ(err);
          return;
        }
        if (fail) {
          fail(err);
        }
      }
    );
  },

  /**
   * 退出课堂
   * @param {*} succ 
   * @param {*} fail 
   */
  quitGroup(groupId, succ, fail) {
    webim.quitGroup({
        GroupId: String(groupId)
      },
      function () {
        succ && succ();
      },
      function (error) {
        // 群不存在 或者 不在群里了 或者 群id不合法（一般这种情况是课堂销毁了groupId被重置后发生）
        if (error.ErrorCode === 10010 || error.ErrorCode === 10007 || error.ErrorCode === 10015) {
          succ && succ();
        } else if (error.ErrorCode == 10009) { // 群主自己想退课堂
          succ && succ();
        } else {
          fail && fail(error);
        }
      }
    );
  },

  /**
   * 销毁群组
   */
  destroyGroup(classId, succ, fail) {
    webim.destroyGroup({
        GroupId: classId + ''
      },
      function (resp) {
        succ && succ();
      },
      function (err) {
        fail && fail(err);
      }
    );
  },

  /**
   * 发送C2C文本消息
   */
  sendC2CTextMessage(toUserIdentifier, msg, succ, fail) {
    ImHandler.sendTextMessage(webim.SESSION_TYPE.C2C, msg, toUserIdentifier, succ, fail);
  },

  /**
   * 发送C2C自定义消息
   */
  sendC2CCustomMessage(toUserIdentifier, msg, succ, fail) {
    ImHandler.sendCustomMsg(webim.SESSION_TYPE.C2C, msg, toUserIdentifier, succ, fail);
  },

  /**
   * 发送群文本消息
   */
  sendGroupTextMessage(msg, succ, fail) {
    ImHandler.sendTextMessage(webim.SESSION_TYPE.GROUP, msg, null, succ, fail);
  },

  /**
   * 发送群组自定义消息
   */
  sendGroupCustomMessage(msg, succ, fail) {
    ImHandler.sendCustomMsg(webim.SESSION_TYPE.GROUP, msg, null, succ, fail);
  },

  // 发送白板数据
  sendBoardGroupCustomMessage(msg) {
    ImHandler.sendBoardGroupCustomMessage(JSON.stringify(msg));
  },
}