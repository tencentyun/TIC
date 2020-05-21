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
    boardShowFullScreen: false,

    // 音视频模板
    template: '1v1',

    // 是否启用摄像头
    enableCamera: true,

    isShowBoardPanel: false, // 是否显示白板面板

    chatMsg: '', // 聊天输入框值
    msgList: [], // IM消息列表

    waitingImg: "https://main.qcloudimg.com/raw/d009e8c5c3455213e13b4b772e53f2a9.png",
    pusherBackgroundImg: "https://main.qcloudimg.com/raw/d009e8c5c3455213e13b4b772e53f2a9.png",
    playerBackgroundImg: "https://main.qcloudimg.com/raw/d009e8c5c3455213e13b4b772e53f2a9.png",

    isErrorModalShow: false, // 房间事件会重复触发，增加错误窗口是否显示的标志
    classUrl: '', // 课堂链接
    loadClass: true,
    videoSize: 150, // 视频的
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
    this.callWebview();
  },

  onUnload() {

  },

  callWebview() {
    let url = `https://tic-demo-1259648581.cos.ap-shanghai.myqcloud.com/miniprogram/miniprogram.html?isTeacher=${this.data.isTeacher}&sdkAppId=${this.data.sdkAppId}&classId=${this.data.roomID}&userId=${this.data.identifier}&userSig=${this.data.userSig}&videoSize=${this.data.videoSize}`;
    console.log('classUrl:', url);
    this.setData({
      classUrl: encodeURI(url),
      loadClass: true
    }, () => {});
  },

  // 开始RTC
  startRTC() {
    // 获取webrtc组件
    this.webrtcroomComponent = this.selectComponent('#webrtcroom');

    this.setData({
      userID: this.data.identifier,
      userSig: this.data.userSig,
      sdkAppId: this.data.sdkAppId,
      roomID: this.data.roomID
    }, () => {
      this.webrtcroomComponent.start();
    });
  },

  webviewLoad() {
    setTimeout(() => {
      this.startRTC();
    }, 1000);
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