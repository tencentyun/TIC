const TIM = require('tim-wx-sdk');
const TEduBoard = require('../../../../components/board-component/libs/TEduBoard_miniprogram.min');

Page({
  // TIC
  txTic: null,
  tim: null,

  data: {
    userId: null,
    userSig: null,
    sdkAppId: null,
    roomID: null,

    isErrorModalShow: false, // 房间事件会重复触发，增加错误窗口是否显示的标志

    isTeacher: false,
    isJoinClassroom: false, // 是否已经在课堂中
    isShowBoardPanel: true, // 是否显示白板面板
    _isLogined: false, // im 是否登录了

    chatMsg: '', // 聊天输入框值
    msgList: [], // IM消息列表
    scrollToView: null, // 聊天面板聊天记录最后滚动的位置

    boardShowFullScreen: false, // 是否全屏显示白板

    // 音视频模板
    template: 'custom_canvas',
    trtcConfig: {}, // trtcroom的参数
  },

  onReady(options) {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  onLoad(options) {
    this.data.userId = options.userId;
    this.data.userSig = options.userSig;
    this.data.sdkAppId = options.sdkAppId;
    this.data.roomID = options.roomID;
    this.data.isTeacher = !!(options.role * 1);

    // 获取tic组件
    this.txTic = this.selectComponent('#tx_board');
    wx.txTic = this.txTic;

    // 登录
    this.init();
  },

  onUnload() {
    wx.offNetworkStatusChange();
    this.tim.off(TIM.EVENT.SDK_READY, this.imSDKReady);
    // 如果在课堂中 && 是登录态，则退出课堂
    if (this.data.isJoinClassroom && this.data._isLogined) {
      this.quitClassroom();
    }
    // 注销事件接口
    this.txTic.removeTICMessageListener();
    this.txTic.removeTICEventListener();
    this.txTic.removeTICStatusListener();
    // 如果已经登录，则调用注销接口
    if (this.data._isLogined) {
      this.txTic.logout(() => {}, error => {});
    }
  },

  init() {
    this.txTic.init(this.data.sdkAppId, res => {
      if (res.code) {
        this.showErrorToast('初始化失败，code:' + res.code + ' msg:' + res.desc);
      } else {
        this.login();
      }
    });
  },

  // 登录
  login() {
    this.txTic.login({
      userId: this.data.userId,
      userSig: this.data.userSig
    }, (res) => {
      if (res.code) {
        this.data._isLogined = false;
        this.showErrorToast('登录失败', res.desc);
        wx.navigateBack({
          delta: 1
        });
      } else {
        this.data._isLogined = true;
        this.showToast('登录成功');
      }
    });

    this.tim = this.txTic.getImInstance();

    // 监听im的ready事件，如果没有ready，则创建群，加群，发消息都会失败
    this.tim.on(TIM.EVENT.SDK_READY, this.imSDKReady);
  },

  imSDKReady() {
    // 增加事件监听
    this.addTICMessageListener();
    this.addTICEventListener();
    this.addTICStatusListener();
    if (this.data.isTeacher) {
      // 老师就创建课堂
      this.createClassroom();
    } else { // 如果是学生
      // 有了课堂后就直接加入
      this.joinClassroom();
    }
  },

  createClassroom() {
    this.txTic.createClassroom(this.data.roomID, (res) => {
      if (res.code) {
        this.showErrorToast('创建课堂失败,请换一个房间号试试', res.desc);
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 2000);
      } else {
        this.showToast('创建课堂成功');
        this.joinClassroom()
      }
    });
  },

  /**
   * 进入课堂
   */
  joinClassroom() {
    this.txTic.joinClassroom(this.data.roomID, {
      brushColor: '#ff00ff',
      ratio: '16:9'
    }, (res) => {
      // 加入课堂失败
      if (res.code) {
        this.showErrorToast('加入课堂失败,课堂还不存在', res.desc);
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 2000);
      } else {
        this.data.isJoinClassroom = true;
        this.data.teduBoard = this.txTic.getBoardInstance();
        this.initBoardEvent();
        this.startRTC();

        wx.onNetworkStatusChange((res)=>{
          // 网络连接后重新同步和刷新一次白板
          if(res.isConnected){
            this.data.teduBoard && this.data.teduBoard.syncAndReload();
          }
        })
      }
    });
  },

  // 退出课堂
  quitClassroom() {
    this.txTic.quitClassroom((res) => {
      // 加入课堂失败
      if (res.code) {
        this.showErrorToast('退出课堂失败', res.desc);
      } else {
        this.showToast('退出课堂成功');
      }
    });
    // 停止音视频
  },

  addTICMessageListener() {
    this.txTic.addTICMessageListener({
      /**
       * 收到C2C文本消息
       * @param fromUserId		发送此消息的用户id
       * @param text				收到消息的内容
       * @param textLen			收到消息的长度
       */
      onTICRecvTextMessage: (fromUserId, text, textLen) => {
        this.updateChatMsg({
          send: fromUserId + '：',
          content: text
        });
      },

      /**
       * 收到C2C自定义消息
       * @param fromUserId		发送此消息的用户id
       * @param data				收到消息的内容
       * @param dataLen			收到消息的长度
       */
      onTICRecvCustomMessage: (fromUserId, data, textLen) => {
        this.updateChatMsg({
          send: fromUserId + '：',
          content: data
        });
      },

      /**
       * 收到群文本消息
       * @param fromUserId		发送此消息的用户id
       * @param text				收到消息的内容
       * @param textLen			收到消息的长度
       */
      onTICRecvGroupTextMessage: (fromUserId, text, textLen) => {
        this.updateChatMsg({
          send: fromUserId + '：',
          content: text
        });
      },

      /**
       * 收到群自定义消息
       * @param fromUserId		发送此消息的用户id
       * @param data				收到消息的内容
       * @param dataLen			收到消息的长度
       */
      onTICRecvGroupCustomMessage: (fromUserId, data, textLen) => {
        this.updateChatMsg({
          send: fromUserId + '：',
          content: data
        });
      },

      /**
       * 所有消息
       * @param msg	IM消息体
       * @note 所有收到的消息都会在此回调进行通知，包括前面已经封装的文本和自定义消息（白板信令消息除外）
       */
      onTICRecvMessage(msg) {}
    });
  },

  addTICEventListener() {
    this.txTic.addTICEventListener({
      onTICMemberJoin: (members) => {
        this.updateChatMsg({
          send: '群消息提示：',
          content: members.join(',') + '进入课堂'
        });
      },

      onTICMemberQuit: (members) => {
        this.updateChatMsg({
          send: '群消息提示：',
          content: members.join(',') + '退出课堂'
        });
      },

      onTICClassroomDestroy: () => {
        if (!this.isTeacher) { // 学生处理
          this.quitClassroom();
          this.showToast(`老师解散了课堂`);
        }
      }
    });
  },

  addTICStatusListener() {
    this.txTic.addTICStatusListener({
      onTICForceOffline: () => {
        this.data._isLogined = false;
        this.showErrorToast('被踢下线');
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },

  // 初始化白板
  initBoardEvent() {

    // 白板错误回调，务必监听处理
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
      console.log('======================:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg);
      this.showErrorToast(`加载白板错误 code:${code} msg: ${msg}`);
      wx.navigateBack({
        delta: 1
      });
    });

    // 白板警告回调，务必监听，并参考错误码，修正业务逻辑
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
      console.log('======================:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg);
    });

    this.data.teduBoard.on(TEduBoard.EVENT.TEB_INIT, () => {
      console.log('======================:  ', 'TEB_INIT');
    });

    // 撤销状态改变
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable) => {
      console.log('======================:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销');
    });

    // 重做状态改变
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable) => {
      console.log('======================:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复');
    });

    // 新增白板
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_ADDBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_ADDBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 图片状态加载回调
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_IMAGE_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_IMAGE_STATUS_CHANGED', ' status:', status, ' data:', data);
    });

    // 删除白板页回调
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_DELETEBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_DELETEBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 跳转白板页回调
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_GOTOBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 删除文件回调
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_DELETEFILE, (fid) => {
      console.log('======================:  ', 'TEB_DELETEFILE', ' fid:', fid);
    });

    // 文件上传状态
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_FILEUPLOADSTATUS, (status, data) => {
      console.log('======================:  ', 'TEB_FILEUPLOADSTATUS', status, data);
    });

    // 切换文件回调
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_SWITCHFILE, (fid) => {
      console.log('======================:  ', 'TEB_SWITCHFILE', ' fid:', fid);
    });

    // 上传背景图片的回调
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_SETBACKGROUNDIMAGE, (fileName, fileUrl, userData) => {
      console.log('======================:  ', 'TEB_SETBACKGROUNDIMAGE', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
    });

    // 文件上传进度
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_FILEUPLOADPROGRESS, (data) => {
      console.log('======================:  ', 'TEB_FILEUPLOADPROGRESS:: ', data);
    });

    // H5背景加载状态
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
    });

    // H5背景加载状态
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
    });

    // 新增转码文件
    this.data.teduBoard.on(TEduBoard.EVENT.TEB_ADDTRANSCODEFILE, (fid) => {
      console.log('======================:  ', 'TEB_ADDTRANSCODEFILE', ' fid:', fid);
    });

    this.data.teduBoard.on(TEduBoard.EVENT.TEB_TRANSCODEPROGRESS, (res) => {
      console.log('======================:  TEB_TRANSCODEPROGRESS 转码进度：', res);
      if (res.code) {
        this.showErrorToast('转码失败code:' + res.code + ' message:' + res.message);
      } else {
        let status = res.Status;
        if (status === 'ERROR') {
          this.showErrorToast('转码失败');
        } else if (status === 'CREATE') {
          this.showToast('创建转码任务');
        } else if (status === 'QUEUED') {
          this.showToast('正在排队等待转码');
        } else if (status === 'PROCESSING') {
          this.showToast('转码中，当前进度:' + res.Progress + '%');
        } else if (status === 'FINISHED') {
          this.showToast('转码完成');
          this.data.teduBoard.addTranscodeFile({
            url: res.ResultUrl,
            title: res.Title,
            pages: res.Pages,
            resolution: res.Resolution
          });
        }
      }
    });

    this.data.teduBoard.on('TEB_ADDIMAGESFILE', (data) => {
      console.log('======================:  ', 'TEB_ADDIMAGESFILE:: data: ', data);
    });
  },

  // 开始RTC
  startRTC() {
    this.setData({
      trtcConfig: {
        sdkAppID: this.data.sdkAppId, // 开通实时音视频服务创建应用后分配的 SDKAppID
        userID: this.data.userId, // 用户 ID，可以由您的帐号系统指定
        userSig: this.data.userSig, // 身份签名，相当于登录密码的作用
        template: this.data.template, // 画面排版模式
      }
    }, () => {
      let trtcRoomContext = this.selectComponent('#trtcroom')
      let EVENT = trtcRoomContext.EVENT

      if (trtcRoomContext) {

        // 监听trtcroom错误，并处理，参考文档https://cloud.tencent.com/document/product/647/38313
        trtcRoomContext.on(EVENT.ERROR, (event) => {

        })

        // 更多事件请参考trtc-room文档 https://cloud.tencent.com/document/product/647/17018#Event
        trtcRoomContext.on(EVENT.LOCAL_JOIN, (event) => {
          // 进房成功后发布本地音频流和视频流 
          trtcRoomContext.publishLocalVideo()
          trtcRoomContext.publishLocalAudio()
        })
        // 监听远端用户的视频流的变更事件
        trtcRoomContext.on(EVENT.REMOTE_VIDEO_ADD, (event) => {
          // 订阅（即播放）远端用户的视频流
          let userID = event.data.userID
          let streamType = event.data.streamType // 'main' or 'aux'            
          trtcRoomContext.subscribeRemoteVideo({
            userID: userID,
            streamType: streamType
          })
        })

        // 监听远端用户的音频流的变更事件
        trtcRoomContext.on(EVENT.REMOTE_AUDIO_ADD, (event) => {
          // 订阅（即播放）远端用户的音频流
          let userID = event.data.userID
          trtcRoomContext.subscribeRemoteAudio({
            userID: userID
          })
        })

        // 进入房间
        trtcRoomContext.enterRoom({
          roomID: this.data.roomID
        }).catch((error) => {
          this.showErrorToast('room joinRoom 进房失败', error.message);
          // 进房失败后，退出当前页
          wx.navigateBack({
            delta: 1
          });
        })
      }
    })
  },

  updateChatMsg(msg) {
    this.setData({
      msgList: this.data.msgList.concat([msg])
    }, () => {
      this.setData({
        scrollToView: 'scroll-bottom' // 滚动条置底
      });
    });
  },

  bindChatMsg: function (e) {
    this.data.chatMsg = e.detail.value;
  },

  // 发送IM消息
  sendComment() {
    var msg = 'Hello，这是测试im消息';
    if (!msg || !msg.trim()) {
      this.showErrorToast('不能发送空消息');
      return;
    }
    this.txTic.sendGroupTextMessage(msg, () => {
      console.log('消息发送成功');
      // 发送成功
      this.setData({
        chatMsg: ''
      });
    }, (error) => {
      this.showErrorToast('消息发送失败', error);
    });
  },

  /**
   * 显示白板面板
   */
  showBoardPanel() {
    this.setData({
      isShowBoardPanel: true
    });
  },

  /**
   * 显示聊天面板
   */
  showChatPanel() {
    this.setData({
      isShowBoardPanel: false
    });
  },

  prevTap() {
    this.data.teduBoard.prevBoard();
  },

  nextTap() {
    this.data.teduBoard.nextBoard();
  },

  curveTap() {
    this.data.teduBoard.setToolType(1);
  },

  lineTap() {
    this.data.teduBoard.setToolType(4);

  },

  rectTap() {
    this.data.teduBoard.setToolType(6);

  },

  eraserTap() {
    this.data.teduBoard.setToolType(2);
  },

  clearTap() {
    this.data.teduBoard.clear();
  },

  uploadFileTap() {
    var _this = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success(res) {
        if (res && res.tempFiles.length) {
          var file = res.tempFiles[0];
          var path = file.path;
          var type = file.type;
          var name = file.name;

          console.log('type:', type);
          if (type === 'image') {
            _this.data.teduBoard.setBackgroundImage({
              path,
              type,
              name,
              userData: 'tiw'
            });
          } else {
            // 一定要参考文档先配置合法域名
            _this.data.teduBoard.applyFileTranscode({
              path,
              type,
              name,
              userData: 'tiw'
            });
          }
        }
      }
    })
  },

  /**
   * 显示信息弹窗
   * @param {*} msg 
   * @param {*} error 
   */
  showToast(msg) {
    wx.showToast({
      icon: 'none',
      title: msg
    });
  },

  /**
   * 显示错误信息弹窗
   * @param {*} msg 
   * @param {*} error 
   */
  showErrorToast(msg, error) {
    wx.showToast({
      icon: 'none',
      title: msg
    });
    console.error('Error msg:', error || msg);
  }
})