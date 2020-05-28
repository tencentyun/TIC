Page({
  // TIC
  txTic: null,
  trtcroomComponent: null,

  data: {
    userId: null,
    userSig: null,
    sdkAppId: null,
    roomID: null,
    isTeacher: false,
    // 音视频模板
    template: 'custom',

    isErrorModalShow: false, // 房间事件会重复触发，增加错误窗口是否显示的标志
    classUrl: '', // 课堂链接
    loadClass: true,
    videoSize: 150, // 视频的
    trtcConfig: {}
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
    this.callWebview();
  },

  onUnload() {},

  callWebview() {
    let url = `https://tic-demo-1259648581.cos.ap-shanghai.myqcloud.com/miniprogram/miniprogram.html?isTeacher=${this.data.isTeacher}&sdkAppId=${this.data.sdkAppId}&classId=${this.data.roomID}&userId=${this.data.userId}&userSig=${this.data.userSig}&videoSize=${this.data.videoSize}`;
    console.log('classUrl:', url);
    this.setData({
      classUrl: encodeURI(url),
      loadClass: true
    }, () => {});
  },

  // 开始RTC
  startRTC() {
    // 获取webrtc组件
    this.trtcroomComponent = this.selectComponent('#trtcroom');

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

  webviewLoad() {
    setTimeout(() => {
      this.startRTC();
    }, 1000);
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