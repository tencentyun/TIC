const imHandler = require('./im_handler.js');
const CONSTANT = require('../../constant/Constant');
var CircularJSON = require('../libs/circular-json');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    roomID: {
      type: Number,
      value: 0
    },
    userID: {
      type: String,
      value: ''
    },
    userName: {
      type: String,
      value: ''
    },
    userSig: {
      type: String,
      value: ''
    },

    useCloud: {
      type: Boolean, //是否启用云上环境 false 自研环境， 云上环境
      value: true
    },

    sdkAppID: {
      type: Number,
      value: 0
    },

    accountType: {
      type: Number,
      value: 0
    },
    privateMapKey: {
      type: String,
      value: ''
    },
    template: {
      type: String,
      value: '',
      observer: function (newVal) {
        this.initLayout(newVal)
      }
    }, //使用的界面模版
    whiteness: {
      type: Number,
      value: 5
    },
    beauty: {
      type: Number,
      value: 5
    }, //美颜程度，取值为0~9
    aspect: {
      type: String,
      value: '3:4'
    }, //设置画面比例，取值为'3:4'或者'9:16'
    minBitrate: {
      type: Number,
      value: 400
    }, //设置码率范围为[minBitrate,maxBitrate]，四人建议设置为200~400
    maxBitrate: {
      type: Number,
      value: 800
    },
    muted: {
      type: Boolean,
      value: false
    }, //设置推流是否静音
    debug: {
      type: Boolean,
      value: false
    }, //是否显示log
    enableIM: {
      type: Boolean, //是否启用IM
      value: true
    },

    enableCamera: {
      type: Boolean,
      value: true
    },

    smallViewLeft: {
      type: String,
      value: '1vw'
    },

    smallViewTop: {
      type: String,
      value: '1vw'
    },

    smallViewWidth: {
      type: String,
      value: '30vw'
    },

    smallViewHeight: {
      type: String,
      value: '40vw'
    },

    waitingImg: {
      type: String,
      value: ''
    },

    // live-player的背景图
    playerBackgroundImg: {
      type: String,
      value: ''
    },

    pusherBackgroundImg: {
      type: String,
      value: ''
    },

    loadingImg: {
      type: String,
      value: ''
    },

    // 纯音频推流
    pureAudioPushMod: {
      type: Number,
      value: 0
    },

    // 录制文件的ID
    recordId: {
      type: Number,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    self: {},
    requestSigFailCount: 0,
    hasExitRoom: true,
    creator: '',
    pusherContext: '',
    hasPushStarted: false,
    pushURL: '',
    members: [{}, {}, {}],
    memberIds: [], // 成员的userid， 用来判断是谁后进来导致的超员
    maxMembers: 3,
    roomTag: 'ok',
    CONSTANT,
    startPlay: false,
    winWidth: 0,
    winHeight: 0,
    originPushURL: '',
    '1v1Templates': ['1v1bigsmall', '1v1horizontal'], // 历史原因： 只保留自己小画面，对方大画面， 并取名为 1v1bigsmall, 实际为 1v1playmain
    fixPlayId: 'txc_1v1_play_id', // 1v1的用来定位live-player的id
  },

  ready() {
    self = this;
    if (!this.data.pusherContext) {
      this.data.pusherContext = wx.createLivePusherContext('rtcpusher', self);
    }
    if (this.data.template === '1v1horizontal') {
      var query = wx.createSelectorQuery().in(this);
      var el = query.select('#txc_video_box');
      el.boundingClientRect(function (rect) {
        wx.getSystemInfo({
          success: function (res) {
            var fullWidth = res.windowWidth;
            var halfWidth = (rect.width - fullWidth / 100) / 2;
            var pw = 3,
              ph = 4;
            try {
              var p = self.data.aspect.split(':');
              pw = p[0];
              ph = p[1];
            } catch (e) {

            }
            self.setData({
              winWidth: halfWidth,
              winHeight: halfWidth * ph / pw
            });
          }
        })
      }).exec()
    }
  },

  detached() {
    this.exitRoom();
    imHandler.logout();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化布局，当template改变时
     * @param {*} templateName 
     */
    initLayout(templateName) {
      self = this;
      switch (templateName) {
        case '1v1horizontal':
        case '1v1bigsmall':
        case '1v1':
          this.setData({
            maxMembers: 1,
            members: [{}],
            template: templateName
          });
          break;
        default:
          break
      }
    },

    /**
     * 初始化IM
     */
    initIm() {
      imHandler.initData({
        'sdkAppID': this.data.sdkAppID, //用户所属应用id,必填
        'appIDAt3rd': this.data.sdkAppID, //用户所属应用id，必填
        'accountType': this.data.accountType, //用户所属应用帐号类型，必填
        'identifier': this.data.userID, //当前用户ID,必须是否字符串类型，选填
        'identifierNick': this.data.userName || this.data.userID, //当前用户昵称，选填
        'userSig': this.data.userSig
      }, {});

      // 初始化Im登录回调
      imHandler.initLoginListeners(this.imLoginListener());

      // 登录IM
      imHandler.loginIm((res) => {
        // 登录成功
        this.fireIMEvent(CONSTANT.IM.LOGIN_EVENT, res.ErrorCode, res);
        // 创建或者加入群
        imHandler.joinGroup(this.data.roomID, (res) => {
          // 创建或者加入群成功
          this.fireIMEvent(CONSTANT.IM.JOIN_GROUP_EVENT, res.ErrorCode, res);
        }, (error) => {
          // 创建或者加入群失败
          this.fireIMEvent(CONSTANT.IM.JOIN_GROUP_EVENT, error.ErrorCode, error);
        });
      }, (error) => {
        // 登录失败
        this.fireIMEvent(CONSTANT.IM.LOGIN_EVENT, error.ErrorCode, error);
      });
    },

    /**
     * webrtc-room程序的入口
     */
    start: function (isNetWorkChange) {
      self = this;
      this.data.hasExitRoom = false;

      // 如果有推流地址了,且只是网络变化，则不再获取推流
      if (this.data.originPushURL && isNetWorkChange) {
        this.setData({
          pushURL: this.data.originPushURL + '&tx_time=' + new Date().getTime()
        })
      } else {
        this.requestSigServer(this.data.userSig, this.data.privateMapKey);
        if (this.data.enableIM) {
          this.initIm(); // 初始化IM
        }
      }
    },

    /**
     * 停止
     */
    stop: function () {
      self.data.hasExitRoom = true;
      self.exitRoom();
    },

    /**
     * 暂停
     */
    pause: function () {
      if (!self.data.pusherContext) {
        self.data.pusherContext = wx.createLivePusherContext('rtcpusher', self);
      }
      self.data.pusherContext && self.data.pusherContext.pause();

      self.data.members.forEach(function (val) {
        val.playerContext && val.playerContext.pause();
      });
    },

    resume: function () {
      if (!self.data.pusherContext) {
        self.data.pusherContext = wx.createLivePusherContext('rtcpusher', self);
      }
      self.data.pusherContext && self.data.pusherContext.resume();

      self.data.members.forEach(function (val) {
        val.playerContext && val.playerContext.resume();
      });
    },

    /**
     * 切换摄像头
     */
    switchCamera: function () {
      if (!self.data.pusherContext) {
        self.data.pusherContext = wx.createLivePusherContext('rtcpusher', self);
      }
      self.data.pusherContext && self.data.pusherContext.switchCamera({});
    },

    /**
     * 退出房间
     */
    exitRoom: function () {
      if (!self.data.pusherContext) {
        self.data.pusherContext = wx.createLivePusherContext('rtcpusher', self);
      }
      self.data.pusherContext && self.data.pusherContext.stop && self.data.pusherContext.stop();

      self.data.members.forEach(function (val) {
        val.playerContext && val.playerContext.stop();
      });

      for (var i = 0; i < self.data.maxMembers; i++) {
        self.data.members[i] = {};
      }

      self.setData({
        members: self.data.members
      });
    },

    postErrorEvent: function (errCode, errMsg) {
      self.postEvent('error', errCode, errMsg);
    },

    postEvent: function (tag, code, detail) {
      self.triggerEvent('RoomEvent', {
        tag: tag,
        code: code,
        detail: detail
      }, {});
    },

    /**
     * 请求SIG服务
     */
    requestSigServer: function (userSig, privMapEncrypt) {
      console.log('获取sig:', this.data);

      var self = this;
      var roomID = this.data.roomID * 1;
      var userID = this.data.userID;
      var sdkAppID = this.data.sdkAppID;

      // 使用云上还是自研
      var host = this.data.useCloud ? "https://official.opensso.tencent-cloud.com" : "https://yun.tim.qq.com";
      var url = host + "/v4/openim/jsonvideoapp?sdkappid=" + sdkAppID + "&identifier=" + userID + "&usersig=" + userSig + "&random=9999&contenttype=json";

      var reqHead = {
        "Cmd": 1,
        "SeqNo": Math.round(Math.random() * 100000),
        "BusType": 7,
        "GroupId": roomID
      };

      var reqBody = {
        "PrivMapEncrypt": privMapEncrypt,
        "TerminalType": 1,
        "FromType": 3,
        "SdkVersion": 26280566
      };

      console.log("requestSigServer params:", url, reqHead, reqBody);

      wx.request({
        url: url,
        data: {
          "ReqHead": reqHead,
          "ReqBody": reqBody
        },
        method: "POST",
        success: function (res) {
          console.log("requestSigServer success:", res);
          if (res.data["ErrorCode"] || res.data["RspHead"]["ErrorCode"] != 0) {
            self.postErrorEvent(CONSTANT.ROOM.ERROR_REQUEST_ROOM_SIG, '获取推流地址错误');
            return;
          }


          var roomSig = JSON.stringify(res.data["RspBody"]);
          var pushUrl = `room://cloud.tencent.com?sdkappid=${sdkAppID}&roomid=${roomID}&userid=${userID}&roomsig=${encodeURIComponent(roomSig)}`;
          console.log("roomSigInfo", roomID, userID, roomSig, pushUrl);

          // 如果有配置纯音频推流或者recordId参数
          if (self.data.pureAudioPushMod || self.data.recordId) {
            var bizbuf = {
              Str_uc_params: {
                pure_audio_push_mod: 0,
                record_id: 0
              }
            }
            // 纯音频推流
            if (self.data.pureAudioPushMod) {
              bizbuf.Str_uc_params.pure_audio_push_mod = self.data.pureAudioPushMod
            } else {
              delete bizbuf.Str_uc_params.pure_audio_push_mod;
            }

            // 自动录制时业务自定义id
            if (self.data.recordId) {
              bizbuf.Str_uc_params.record_id = self.data.recordId
            } else {
              delete bizbuf.Str_uc_params.record_id;
            }
            pushUrl += '&bizbuf=' + encodeURIComponent(JSON.stringify(bizbuf));
          }

          self.setData({
            originPushURL: pushUrl,
            pushURL: pushUrl + '&tx_time=' + new Date().getTime()
          }, () => {

          });
        },
        fail: function (res) {
          self.postErrorEvent(CONSTANT.ROOM.ERROR_REQUEST_ROOM_SIG, '获取推流地址错误');
        }
      })
    },

    onWebRTCUserListPush: function (msg) {
      if (!msg) {
        return;
      }
      var jsonDic = JSON.parse(msg);
      if (!jsonDic) {
        return;
      }
      var newUserList = jsonDic.userlist || [];
      if (!newUserList) {
        return;
      }

      var currentMemberIds = [];
      self.data.members.forEach((member) => {
        member.userID && currentMemberIds.push(member.userID);
      });

      if (currentMemberIds.length === 0) { // 第一次进入
        if (newUserList.length >= self.data.maxMembers + 1) { // 当前返回的player成员列表,超过了房间的最大人数，则说明该用户超员了
          self.postErrorEvent(CONSTANT.ROOM.ERROR_EXCEEDS_THE_MAX_MEMBER,
            `当前房间超过最大人数${self.data.maxMembers + 1}，请重新进入其他房间体验~`);
          self.stop();
          return;
        }
      }

      var pushers = [];
      newUserList && newUserList.forEach(function (val) {
        var pusher = {
          userID: val.userid,
          accelerateURL: val.playurl
        };
        pushers.push(pusher);
      });

      self.onPusherJoin({
        pushers: pushers
      });

      self.onPusherQuit({
        pushers: pushers
      });
    },

    //将在res.pushers中，但不在self.data.members中的流，加入到self.data.members中
    onPusherJoin: function (res) {
      res.pushers.forEach(function (val) {
        var emptyIndex = -1;
        var hasPlay = false;
        for (var i = 0; self.data.members && i < self.data.members.length; i++) {
          if (self.data.members[i].userID && self.data.members[i].userID == val.userID) {
            hasPlay = true;
          } else if (!self.data.members[i].userID && emptyIndex == -1) {
            emptyIndex = i;
          }
        }
        if (!hasPlay && emptyIndex != -1) {
          val.loading = false;
          // 如果是1V1 则使用固定的id
          if (self.data['1v1Templates'].indexOf(self.data.template) > -1) {
            val.playerContext = wx.createLivePlayerContext(self.data.fixPlayId, self);
          } else {
            val.playerContext = wx.createLivePlayerContext(val.userID, self);
          }
          self.data.members[emptyIndex] = val;
        }
      });

      self.setData({
        members: self.data.members
      });
    },

    //将在self.data.members中，但不在res.pushers中的流删除
    onPusherQuit: function (res) {
      for (var i = 0; i < self.data.members.length; i++) {
        var needDelete = true;
        for (var j = 0; j < res.pushers.length; j++) {
          if (self.data.members[i].userID == res.pushers[j].userID) {
            needDelete = false;
          }
        }
        if (needDelete) {
          self.data.members[i] = {};
        }
      }

      self.setData({
        members: self.data.members
      });
    },

    //删除res.pushers
    delPusher: function (pusher) {
      for (var i = 0; i < self.data.members.length; i++) {
        if (self.data.members[i].userID == pusher.userID) {
          var player = wx.createLivePlayerContext(pusher.userID, self);
          player && player.stop();
          self.data.members[i] = {};
        }
      }
      self.setData({
        members: self.data.members
      });
    },

    // 推流事件
    onPush: function (e) {
      if (!self.data.pusherContext) {
        self.data.pusherContext = wx.createLivePusherContext('rtcpusher', self);
      }
      var code;
      if (e.detail) {
        code = e.detail.code;
      } else {
        code = e;
      }
      switch (code) {
        case 1002: {
          console.log('推流成功');
          self.postEvent(self.data.roomTag, CONSTANT.ROOM.SUCC_PUSH, '推流成功');
          break;
        }
        case -1301: {
          console.error('打开摄像头失败: ', code);
          self.postErrorEvent(CONSTANT.ROOM.ERROR_OPEN_CAMERA, '打开摄像头失败');
          self.exitRoom();
          break;
        }
        case -1302: {
          console.error('打开麦克风失败: ', code);
          self.postErrorEvent(CONSTANT.ROOM.ERROR_OPEN_MIC, '打开麦克风失败');
          self.exitRoom();
          break;
        }
        case -1307: {
          console.error('推流连接断开: ', code);
          self.postErrorEvent(CONSTANT.ROOM.ERROR_PUSH_DISCONNECT, '推流连接断开');
          self.exitRoom();
          break;
        }
        case 5000: {
          console.log('收到5000: ', code, new Date().getTime());
          // 收到5000就退房
          self.exitRoom();
          self.postErrorEvent(CONSTANT.ROOM.EXIT_ROOM, '退出房间');
          break;
        }
        case 1018: {
          console.log('进房成功', code);
          self.postEvent(self.data.roomTag, CONSTANT.ROOM.SUCC_JOIN_ROOM, '进房成功');
          break;
        }
        case 1019: {
          console.log('退出房间', code, new Date().getTime());
          self.postErrorEvent(CONSTANT.ROOM.ERROR_JOIN_ROOM, '退出房间');
          self.exitRoom();
          break;
        }
        case 1020: {
          console.log('成员列表', code, e.detail.message);
          self.onWebRTCUserListPush(e.detail.message);
          self.postEvent(self.data.roomTag, CONSTANT.ROOM.SUCC_MEMBERS_LIST, JSON.stringify(e.detail.message));
          break;
        }
        case 1021: {
          console.log('网络类型发生变化，需要重新进房', code);
          //先退出房间
          self.exitRoom();
          self.start(true);
          self.postEvent(self.data.roomTag, CONSTANT.ROOM.NETWORK_CHANGE, '网络类型发生变化，需要重新进房');
          break;
        }
        case 2007: {
          console.log('视频播放loading: ', e.detail.code);
          self.postEvent(self.data.roomTag, CONSTANT.ROOM.PUSHER_LOADING, '视频播放loading');
          break;
        }
        case 2004: {
          console.log('视频播放开始: ', e.detail.code);
          self.postEvent(self.data.roomTag, CONSTANT.ROOM.PUSHER_PLAY, '视频播放开始');
          break;
        }
        default: {
          // console.log('推流情况：', code);
        }
      }
    },

    // 标签错误处理
    onError: function (e) {
      console.log('推流错误：', e);
      var errorCode = (e.detail && e.detail.errCode) || (e.details && e.details.errCode);
      var errorMsg = '';
      switch (errorCode) {
        case 10001:
          errorMsg = '未获取到摄像头功能权限，请删除小程序后重新打开';
          break;
        case 10002:
          errorMsg = '未获取到录音功能权限，请删除小程序后重新打开';
          break;
      }
      self.postErrorEvent(CONSTANT.ROOM.ERROR_CAMERA_MIC_PERMISSION, errorMsg || '未获取到摄像头、录音功能权限，请删除小程序后重新打开');
    },

    //播放器live-player回调
    onPlay: function (e) {
      console.error(e.currentTarget.id, self.data.members);
      self.data.members.forEach(function (val) {

        // 如果是1v1 则使用固定的playid
        if ((self.data['1v1Templates'].indexOf(self.data.template) > -1 && e.currentTarget.id === self.data.fixPlayId) ||
          (e.currentTarget.id == val.userID)) {
          // if (e.currentTarget.id == val.userID) {
          switch (e.detail.code) {
            case 2007: {
              console.log('视频播放loading: ', e);
              self.postEvent(self.data.roomTag, CONSTANT.ROOM.PLAYER_LOADING, val.userID);
              val.loading = true;
              break;
            }
            case 2004: {
              console.log('视频播放开始: ', e);
              self.postEvent(self.data.roomTag, CONSTANT.ROOM.PLAYER_PLAY, val.userID);
              val.loading = false;
              setTimeout(() => {
                self.setData({
                  startPlay: true
                });
              }, 500);
              break;
            }
            case -2301: {
              console.error('网络连接断开，且重新连接亦不能恢复，播放器已停止播放', val);
              // 记录失败信息
              self.postEvent(self.data.roomTag, CONSTANT.ROOM.PLAYER_DISCONNECT, val.userID);
              self.delPusher(val);
              break;
            }
            default: {
              // console.log('拉流情况：', e);
            }
          }
        }
      });

      self.setData({
        members: self.data.members
      });
    },

    // IM登录监听
    imLoginListener() {
      var self = this;
      return {
        // 用于监听用户连接状态变化的函数，选填
        onConnNotify(resp) {
          self.fireIMEvent(CONSTANT.IM.CONNECTION_EVENT, resp.ErrorCode, resp);
        },

        // 监听新消息(直播聊天室)事件，直播场景下必填
        onBigGroupMsgNotify(msgs) {
          if (msgs.length) { // 如果有消息才处理
            self.fireIMEvent(CONSTANT.IM.BIG_GROUP_MSG_NOTIFY, 0, CircularJSON.stringify(msgs));
          }
        },

        // 监听新消息函数，必填
        onMsgNotify(msgs) {
          if (msgs.length) { // 如果有消息才处理
            self.fireIMEvent(CONSTANT.IM.MSG_NOTIFY, 0, CircularJSON.stringify(msgs));
          }
        },

        // 系统消息
        onGroupSystemNotifys: {
          "1": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 1, notify);
          }, //申请加群请求（只有管理员会收到）
          "2": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 2, notify);
          }, //申请加群被同意（只有申请人能够收到）
          "3": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 3, notify);
          }, //申请加群被拒绝（只有申请人能够收到）
          "4": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 4, notify);
          }, //被管理员踢出群(只有被踢者接收到)
          "5": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 5, notify);
          }, //群被解散(全员接收)
          "6": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 6, notify);
          }, //创建群(创建者接收)
          "7": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 7, notify);
          }, //邀请加群(被邀请者接收)
          "8": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 8, notify);
          }, //主动退群(主动退出者接收)
          "9": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 9, notify);
          }, //设置管理员(被设置者接收)
          "10": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 10, notify);
          }, //取消管理员(被取消者接收)
          "11": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 11, notify);
          }, //群已被回收(全员接收)
          "255": (notify) => {
            self.fireIMErrorEvent(CONSTANT.IM.GROUP_SYSTEM_NOTIFYS, 255, notify);
          } //用户自定义通知(默认全员接收)
        },

        // 监听群资料变化事件，选填
        onGroupInfoChangeNotify(groupInfo) {
          self.fireIMErrorEvent(CONSTANT.IM.GROUP_INFO_CHANGE_NOTIFY, 0, groupInfo);
        },

        // 被踢下线
        onKickedEventCall() {
          self.fireIMErrorEvent(CONSTANT.IM.KICKED);
        }
      }
    },

    /**
     * 发送C2C文本消息
     * @param {string} msg 
     * @param {function} succ 
     * @param {function} fail
     */
    sendC2CTextMsg(receiveUser, msg, succ, fail) {
      imHandler.sendC2CTextMsg(receiveUser, msg, succ, fail);
    },

    /**
     * 发送C2C自定义消息
     * @param {object} msgObj {data: 'xxx', cmd: 'xxxx'}
     * @param {function} succ
     * @param {function} fail
     */
    sendC2CCustomMsg(receiveUser, msgObj, succ, fail) {
      imHandler.sendC2CCustomMsg(receiveUser, msgObj, succ, fail);
    },

    /**
     * 发送群组文本消息
     * @param {string} msg 
     * @param {function} succ 
     * @param {function} fail
     */
    sendGroupTextMsg(msg, succ, fail) {
      imHandler.sendGroupTextMsg(msg, succ, fail);
    },

    /**
     * 发送群组自定义消息
     * @param {object} msgObj {data: 'xxx', cmd: 'xxxx'}
     * @param {function} succ
     * @param {function} fail
     */
    sendGroupCustomMsg(msgObj, succ, fail) {
      imHandler.sendGroupCustomMsg(msgObj, succ, fail);
    },

    /**
     * IM错误信息
     */
    fireIMErrorEvent: function (errCode, errMsg) {
      self.fireIMEvent('error', errCode, errMsg);
    },

    /**
     * 触发IM信息
     */
    fireIMEvent: function (tag, code, detail) {
      self.triggerEvent('IMEvent', {
        tag: tag,
        code: code,
        detail: detail
      });
    }
  }
})