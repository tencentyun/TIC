const CONSTANT = require('../../../../constant/Constant');

Page({
  // TIC
  txTic: null,
  webrtcroomComponent: null,

  data: {
    identifier: null,
    userSig: null,
    sdkAppId: null,
    roomID: null,

    isTeacher: false,

    isJoinClassroom: false, // 是否已经在课堂中

    // 音视频模板
    template: '1v1bigsmall',

    smallViewLeft: 'calc(100vw - 20vw - 1vw)',
    smallViewTop: 'calc(1vw)',
    smallViewWidth: '20vw',
    smallViewHeight: '26vw',

    // 是否启用摄像头
    enableCamera: true,

    isShowBoardPanel: true, // 是否显示白板面板

    chatMsg: '', // 聊天输入框值
    msgList: [], // IM消息列表

    waitingImg: "https://main.qcloudimg.com/raw/d009e8c5c3455213e13b4b772e53f2a9.png",
    pusherBackgroundImg: "https://main.qcloudimg.com/raw/d009e8c5c3455213e13b4b772e53f2a9.png",
    playerBackgroundImg: "https://main.qcloudimg.com/raw/d009e8c5c3455213e13b4b772e53f2a9.png",

    scrollToView: null, // 聊天面板聊天记录最后滚动的位置
    isErrorModalShow: false, // 房间事件会重复触发，增加错误窗口是否显示的标志
    boardShowFullScreen: false, // 是否全屏显示白板
  },

  onReady(options) {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  onLoad(options) {
    this.data.identifier = options.identifier;
    this.data.userSig = options.userSig;
    this.data.sdkAppId = options.sdkAppId;
    this.data.roomID = options.roomID;
    this.data.isTeacher = !!(options.role * 1);

    // 获取tic组件
    this.txTic = this.selectComponent('#tx_board');
    wx.txTic = this.txTic;
    // 获取webrtc组件
    this.webrtcroomComponent = this.selectComponent('#webrtcroom');

    // 登录
    this.init();
  },

  onUnload() {
    // 如果在课堂中，则退出课堂
    if (this.data.isJoinClassroom) {
      this.quitClassroom();
    }
    this.txTic.logout(() => {
      // this.showToast('注销成功');
    }, error => {
      // this.showErrorToast('注销失败', error);
    });
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
      userId: this.data.identifier,
      userSig: this.data.userSig
    }, (res) => {
      if (res.code) {
        this.showErrorToast('登录失败', res.desc);
        wx.navigateBack({
          delta: 1
        });
      } else {
        this.showToast('登录成功');
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
      }
    });
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
    this.webrtcroomComponent.stop();
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
      onTICRecvMessage(msg) {

      }
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
        this.showErrorToast('被踢下线');
        wx.navigateBack({
          delta: 1
        });
      }
    });
  },

  // 初始化白板
  initBoardEvent() {
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_INIT, () => {
      console.log('======================:  ', 'TEB_INIT');
    });

    // 撤销状态改变
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable) => {
      console.log('======================:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销');
    });

    // 重做状态改变
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable) => {
      console.log('======================:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复');
    });

    // 新增白板
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_ADDBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_ADDBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 白板错误回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_ERROR, (code, msg) => {
      console.log('======================:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg);
    });

    // 白板警告回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_WARNING, (code, msg) => {
      console.log('======================:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg);
    });

    // 图片状态加载回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_IMAGE_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_IMAGE_STATUS_CHANGED', ' status:', status, ' data:', data);
    });

    // 删除白板页回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_DELETEBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_DELETEBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 跳转白板页回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_GOTOBOARD, (boardId, fid) => {
      console.log('======================:  ', 'TEB_GOTOBOARD', ' boardId:', boardId, ' fid:', fid);
    });

    // 删除文件回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_DELETEFILE, (fid) => {
      console.log('======================:  ', 'TEB_DELETEFILE', ' fid:', fid);
    });

    // 文件上传状态
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_FILEUPLOADSTATUS, (status, data) => {
      console.log('======================:  ', 'TEB_FILEUPLOADSTATUS', status, data);
    });

    // 切换文件回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_SWITCHFILE, (fid) => {
      console.log('======================:  ', 'TEB_SWITCHFILE', ' fid:', fid);
    });

    // 上传背景图片的回调
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_SETBACKGROUNDIMAGE, (fileName, fileUrl, userData) => {
      console.log('======================:  ', 'TEB_SETBACKGROUNDIMAGE', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
    });

    // 文件上传进度
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_FILEUPLOADPROGRESS, (data) => {
      console.log('======================:  ', 'TEB_FILEUPLOADPROGRESS:: ', data);
    });

    // H5背景加载状态
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
    });

    // H5背景加载状态
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
      console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
    });

    // 新增转码文件
    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_ADDTRANSCODEFILE, (fid) => {
      console.log('======================:  ', 'TEB_ADDTRANSCODEFILE', ' fid:', fid);
    });

    this.data.teduBoard.on(CONSTANT.EVENT.BOARD.TEB_TRANSCODEPROGRESS, (res) => {
      console.log('=======  TEB_TRANSCODEPROGRESS 转码进度：', res);
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


  },

  // 开始RTC
  startRTC() {
    this.setData({
      userID: this.data.identifier,
      userSig: this.data.userSig,
      sdkAppID: this.data.sdkAppId,
      roomID: this.data.roomID
    }, () => {
      this.webrtcroomComponent.start();
    });
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

  /**
   * 监听webrtc事件
   */
  onRoomEvent(e) {
    var self = this;
    switch (e.detail.tag) {
      case 'error':
        // 错误提示窗口是否已经显示
        if (this.data.isErrorModalShow) {
          return;
        }

        if (e.detail.code === -10) { // 进房失败，一般为网络切换的过程中
          this.data.isErrorModalShow = true;
          wx.showModal({
            title: '提示',
            content: e.detail.detail,
            confirmText: '重试',
            cancelText: '退出',
            success: function (res) {

            }
          });
        } else {
          var pages = getCurrentPages();
          console.log(pages, pages.length, pages[pages.length - 1].__route__);
          if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/index/index')) {
            this.data.isErrorModalShow = true;
            wx.showModal({
              title: '提示',
              content: e.detail.detail,
              showCancel: false,
              complete: function () {
                self.data.isErrorModalShow = false
                pages = getCurrentPages();
                if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/index/index')) {
                  wx.showToast({
                    title: `code:${e.detail.code} content:${e.detail.detail}`
                  });
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            });
          }
        }
        break;
    }
  },

  // IM输入框的信息
  bindChatMsg: function (e) {
    this.data.chatMsg = e.detail.value;
  },

  // 发送IM消息
  sendComment() {
    // var msg = this.data.chatMsg || '';
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

  // 切换白板全屏显示
  togglerBoardFullScreen() {
    var boardShowFullScreen = !this.data.boardShowFullScreen;
    this.setData({
      boardShowFullScreen: boardShowFullScreen,
    }, () => {
      if (boardShowFullScreen) { // 全屏显示，则切换到横屏方式
        this.txTic.setOrientation('horizontal', () => {

        });
      } else { // 垂直方向
        this.txTic.setOrientation('vertical', () => {

        });
      }
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
              userData: 'hello'
            });
          } else {
            // 一定要参考文档先配置合法域名
            _this.data.teduBoard.applyFileTranscode({
              path,
              type,
              name,
              userData: 'hello'
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