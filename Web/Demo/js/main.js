window.app = new Vue({
  el: '#app_box',
  data() {
    return {

      //可选用户账号列表
      users: TEST_ACCOUNT.users,

      //账号信息
      account: purl().param('userid') || localStorage.getItem('IIC_USERID') || TEST_ACCOUNT.users[0]['userId'],
      sdkAppId: TEST_ACCOUNT.sdkappid,
      userSig: '',

      //房间信息
      roomInfo: '',
      roomID: purl().param('roomid') * 1 || null,
      h5Url: purl().param('h5Url') * 1 || null,

      //音视频及设备
      enableCamera: true,
      enableMic: true,
      cameraIndex: 0,
      micIndex: 0,
      devices: {
        camera: [],
        mic: []
      },

      //board(涂鸦)
      drawEnable: true, //是否可以涂鸦
      synDrawEnable: true, //是否将你画的涂鸦同步给其他人
      toolType: 1,
      brushThin: 100,
      backgroundImage: "背景图",
      backgroundImageH5: "背景图H5",
      backgroundColor: "#ff0000",
      globalBackgroundColor: "#ff0000",
      brushColor: "#ff0000",
      textColor: "#ff0000",
      textStyle: "#ff0000",
      textFamily: "sans-serif,serif,monospace",
      textSize: 320,
      scaleSize: 100,
      fitMode: 1,
      ration: "16:9",
      canRedo: 0,
      canUndo: 0,

      //board(白板操作)
      boardData: {
        currentBoardId: null, //当前白板ID
        boardIdlist: [], //白板ID列表
        current: 0, //当前白板index
        total: 0 //总页数
      },

      //board(文件操作)
      currentFileId: null, // 当前文件Id
      fileInfoList: [], // 所有文件信息
      thumbUrls: [], // 缩略图

      //消息
      msgs: [],
      imMsg: {
        common: {},
        custom: {}
      },

      //当前用户状态
      STATUS_UNINIT: 0,
      STATUS_UNLOGIN: 1,
      STATUS_LOGINED: 2,
      STATUS_INCLASS: 3,
      status: 0,

      //
      isShow: false,

      isPushing: 0, // 是否正在推流
      isPushCamera: 0, // 是否推摄像头流
      remoteVideos: {},
      imReady: false
    }
  },

  mounted() {
    this.isShow = true;
  },

  methods: {
    // 创建或者进入课堂
    start() {
      this.init();
    },

    // 初始化业务数据
    initData() {
      this.msgs = [];

      this.devices = {
        camera: [],
        mic: []
      };

      this.cameraIndex = 0;
      this.micIndex = 0;

      this.imMsg = {
        common: {
          data: '',
          toUser: ''
        },
        custom: {
          data: '',
          toUser: ''
        }
      };

      this.drawEnable = true; //是否可以涂鸦
      this.synDrawEnable = true; //是否将你画的涂鸦同步给其他人
      this.toolType = 1;
      this.brushThin = 100;
      this.backgroundImage = "背景图";
      this.backgroundImageH5 = "背景图H5";
      this.backgroundColor = "#ff0000";
      this.globalBackgroundColor = "#ff0000";
      this.brushColor = "#ff0000";
      this.textColor = "#ff0000";
      this.textStyle = "#ff0000";
      this.textFamily = "sans-serif,serif,monospace";
      this.textSize = 320;
      this.scaleSize = 100;
      this.fitMode = 1;
      this.ration = "16:9";
      this.canRedo = 0;
      this.canUndo = 0;

      localStorage.setItem('IIC_USERID', this.account);
    },

    clearClassInfo() {
      //设备信息
      this.remoteVideos = {};
      this.enableCamera = true;
      this.enableMic = true;
      this.isPushing = 0;
      this.isPushCamera = 0;

      //白板信息
      this.boardData.currentBoardId = null;
      this.boardData.boardIdlist = [];
      this.boardData.current = 0;
      this.boardData.total = 0;

      document.getElementById("paint_box").innerHTML = "";

      var divvideo = document.querySelector("#video_wrap");
      while (divvideo.hasChildNodes())
        divvideo.removeChild(divvideo.firstChild);

      this.fileInfoList = [];
      this.currentFileId = null;
    },

    // 初始化SDK
    init() {
      if (this.status == this.STATUS_UNINIT) {
        this.initData();
        this.tic = null;
        this.tic = new TIC({});
        this.tic.init(this.sdkAppId, res => {

          if (res.code) {
            this.showErrorTip('初始化失败，code:' + res.code + ' msg:' + res.desc);
            this.showMessageInBox('TIC', "init failed. code=" + res.code);
          } else {
            this.showMessageInBox('TIC', "init Succ.");
            this.status = this.STATUS_UNLOGIN;

            this.tim = this.tic.getImInstance(); //获取im实例
            // 监听im的状态，如果不是ready状态，创建群，加群，发消息等操作都会失败
            // 监听的im的事件，一定要调用off注销，否则会出现重复监听的问题
            this.tim.on(window.TIM.EVENT.SDK_READY, this.imReadyHandler);
            this.login();
          }
        });
      } else {
        this.login();
      }
    },

    imReadyHandler() {
      // im 已经准备好了
      this.imReady = true;
    },

    // 登录
    login() {
      this.tic.login({
        userId: this.account,
        userSig: this.findUserSig(this.account)
      }, (res) => {
        if (res.code) {
          this.showErrorTip('登录失败');
          this.showMessageInBox('TIC', "login Failed, code=" + res.code);
          console.error(res.code);
        } else {
          this.status = this.STATUS_LOGINED;

          this.showTip('登录成功');
          this.showMessageInBox('TIC', "login Succ,userid=" + this.account);
          // 增加事件监听
          this.addTICMessageListener();
          this.addTICEventListener();
          this.addTICStatusListener();
        }
      });
    },

    // 登出
    logout() {
      if (this.status == this.STATUS_INCLASS) {
        this.quitClassroom(res => {
          this.logout_internal();
        });

        return;
      }
      this.logout_internal();
    },

    logout_internal() {
      this.tic.logout((res) => {
        if (res.code) {
          this.showErrorTip('登出失败');
          this.showMessageInBox('TIC', "logout Failed, code=" + res.code);
          console.error(res);
        } else {
          this.initData();
          this.status = this.STATUS_UNLOGIN;
          this.imReady = false; // im状态ready设置为false
          // 注销im事件
          this.tim.off(window.TIM.EVENT.SDK_READY, this.imReadyHandler);

          this.showTip('登出成功');
          this.showMessageInBox('TIC', "logout Succ");
          // 删除事件监听
          this.tic.removeTICMessageListener();
          this.tic.removeTICEventListener();
          this.tic.removeTICStatusListener();
        }
      });
    },

    // 创建房间
    // 需要监听im的状态，如果不是ready状态，创建群，加群，发消息等操作都会失败
    createClassroom() {
      if (!this.roomID) {
        this.showErrorTip('房间号不能为空');
        return;
      }

      this.tic.createClassroom({
        classId: this.roomID,
        classScene: TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL // 1：直播模式 0: 实时模式
      }, (res) => {

        if (res.code) {
          if (res.code == 10021) {
            this.showTip('该课堂已被他人创建，请直接加入');
          } else if (res.code == 10025) {
            this.showTip('您已经创建过这个课堂，请直接加入');
          } else {
            this.showErrorTip('创建课堂失败');
            console.error(res);
            this.showMessageInBox('TIC', "createClassroom error:" + res.code);
          }
        } else {
          this.showTip('创建课堂成功');
          this.showMessageInBox('TIC', "createClassroom Succ:");
        }
      });
    },


    // 销毁课堂
    destroyClassroom() {
      if (!this.roomID) {
        this.showErrorTip('房间号不能为空');
        return;
      }

      this.tic.destroyClassroom(this.roomID, res => {
        if (res.code) {
          this.showErrorTip('销毁课堂失败');
          this.showMessageInBox('TIC', "destroyClassroom Failed:" + res.code);
          console.error(res);
        } else {
          this.initData();

          this.status = this.STATUS_LOGINED;
          this.clearClassInfo();

          this.showTip('销毁课堂成功');
          this.showMessageInBox('TIC', "destroyClassroom Succ:");
        }
      });
    },

    // 进入房间
    joinClassroom() {
      if (!this.roomID) {
        this.showErrorTip('房间号不能为空');
        return;
      }

      if (this.status == this.STATUS_INCLASS) {
        this.showMessageInBox('TIC', "this user is in classs, roomID=" + this.roomID);
        return;
      }

      // 需要监听im的状态，如果不是ready状态，创建群，加群，发消息等操作都会失败
      this.tic.joinClassroom({
        // compatSaas: true,
        classId: this.roomID
      }, {
        // mode: TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE //直播模式，支持1000人以上场景
        mode: TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL, // //实时通话模式，支持1000人以下场景，低延时
        // role: TIC.CONSTANT.TICRoleType.TIC_ROLE_TYPE_ANCHOR // 主播，只在TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE模式下有效
        // role: TIC.CONSTANT.TICRoleType.TIC_ROLE_TYPE_AUDIENCE // 观众（观众角色没有发布本地流的权限，只有收看远端流的权限。如果观众想要连麦跟主播互动， 请先通过 switchRole() 切换角色到主播 anchor 后再发布本地流），只在TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE模式下有效
      }, {
        id: 'paint_box',
        ratio: '16:9',
        smoothLevel: 0,
        boardContentFitMode: 1,
        toolType: 1,
        progressEnable: true,
        progressBarUrl: 'https://resources-tiw.qcloudtrtc.com/board/icons/Gear-0.2s-48px.png'
      }, res => {
        if (res.code) {
          this.showErrorTip('加入课堂失败');
          this.showMessageInBox('TIC', "joinClassroom Failed,room=" + this.roomID + "code=" + res.code);

          console.error(res);
        } else {
          this.status = this.STATUS_INCLASS;

          this.showTip('加入课堂成功');
          this.showMessageInBox('TIC', "joinClassroom Succ, room=" + this.roomID);

          window.teduBoard = this.teduBoard = this.tic.getBoardInstance();

          this.initBoardEvent();
        }
      });
    },

    /**
     * 退出课堂
     */
    quitClassroom(callback) {
      if (!this.roomID) {
        this.showErrorTip('房间号不能为空');
        return;
      }

      this.tic.quitClassroom(res => {
        if (res.code) {
          this.showErrorTip('退出课堂失败');
          this.showMessageInBox('TIC', "quitClassroom Failed, code=" + res.code);
          console.log('quitClassroom error' + res.code);
        } else {
          this.initData();
          this.status = this.STATUS_LOGINED;
          this.showTip('退出课堂成功');
          this.showMessageInBox('TIC', "quitClassroom Succ");
        }

        callback && callback({
          code: 0
        });
      });

      this.clearClassInfo();
    },

    // 监听白板事件（按需监听）
    initBoardEvent() {
      var teduBoard = this.teduBoard;
      // 撤销状态改变
      teduBoard.on(TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable) => {
        this.canUndo = enable ? 1 : 0;
        console.log('======================:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销');
      });

      // 重做状态改变
      teduBoard.on(TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable) => {
        this.canRedo = enable ? 1 : 0;
        console.log('======================:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复');
      });

      // 新增白板
      teduBoard.on(TEduBoard.EVENT.TEB_ADDBOARD, (boardIds, fid) => {
        console.log('======================:  ', 'TEB_ADDBOARD', ' boardIds:', boardIds, ' fid:', fid);
        this.proBoardData();
      });

      // 白板同步数据回调(收到该回调时需要将回调数据通过信令通道发送给房间内其他人，接受者收到后调用AddSyncData接口将数据添加到白板以实现数据同步)
      // TIC已经处理好了，可忽略该事件
      teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, (data) => {
        console.log('======================:  ', 'TEB_SYNCDATA');
      });

      // 收到白板初始化完成事件后，表示白板已处于正常工作状态（此时白板为空白白板，历史数据尚未拉取完成）
      teduBoard.on(TEduBoard.EVENT.TEB_INIT, () => {
        console.log('======================:  ', 'TEB_INIT');
        this.showMessageInBox('TIC', "onTEBInit finished");
      });

      teduBoard.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
        console.log('======================:  ', 'TEB_HISTROYDATA_SYNCCOMPLETED');
        this.showMessageInBox('TIC', "onTEBHistory Sync Completed finished");
      });

      // 白板错误回调
      teduBoard.on(TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
        console.error('======================:  ', 'TEB_ERROR', ' code:', code, ' msg:', msg);
        this.showMessageInBox('TIC', "onTEBError code=" + code + " msg:" + msg);
      });

      // 白板警告回调
      teduBoard.on(TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
        console.error('======================:  ', 'TEB_WARNING', ' code:', code, ' msg:', msg);
        this.showMessageInBox('TIC', "onTEBWarning code=" + code + " msg:" + msg);
      });

      // 图片状态加载回调
      teduBoard.on(TEduBoard.EVENT.TEB_IMAGE_STATUS_CHANGED, (status, data) => {
        console.log('======================:  ', 'TEB_IMAGE_STATUS_CHANGED', ' status:', status, ' data:', data);
      });

      // 删除白板页回调
      teduBoard.on(TEduBoard.EVENT.TEB_DELETEBOARD, (boardIds, fid) => {
        console.log('======================:  ', 'TEB_DELETEBOARD', ' boardIds:', boardIds, ' fid:', fid);
        this.proBoardData();
      });

      // 跳转白板页回调
      teduBoard.on(TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
        console.log('======================:  ', 'TEB_GOTOBOARD', ' boardId:', boardId, ' fid:', fid);
        this.proBoardData();
      });

      // ppt动画步数改变回调
      teduBoard.on(TEduBoard.EVENT.TEB_GOTOSTEP, (step, count) => {
        console.log('======================:  ', 'TEB_GOTOSTEP', ' step:', step, ' count:', count);
      });

      // 增加H5动画PPT文件回调
      teduBoard.on(TEduBoard.EVENT.TEB_ADDH5PPTFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDH5PPTFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 增加文件回调
      teduBoard.on(TEduBoard.EVENT.TEB_ADDFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 增加转码文件回调
      teduBoard.on(TEduBoard.EVENT.TEB_ADDTRANSCODEFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDTRANSCODEFILE', ' fid:', fid);
        this.proBoardData();
      });
      // 增加Images文件回调
      teduBoard.on(TEduBoard.EVENT.TEB_ADDIMAGESFILE, (fid) => {
        console.log('======================:  ', 'TEB_ADDIMAGESFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 删除文件回调
      teduBoard.on(TEduBoard.EVENT.TEB_DELETEFILE, (fid) => {
        console.log('======================:  ', 'TEB_DELETEFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 文件上传状态
      teduBoard.on(TEduBoard.EVENT.TEB_FILEUPLOADSTATUS, (status, data) => {
        console.log('======================:  ', 'TEB_FILEUPLOADSTATUS', status, data);
        if (status === 1) {
          this.showTip('上传成功');
        } else {
          this.showTip('上传失败');
        }
        document.getElementById('file_input').value = '';
      });

      // 切换文件回调
      teduBoard.on(TEduBoard.EVENT.TEB_SWITCHFILE, (fid) => {
        console.log('======================:  ', 'TEB_SWITCHFILE', ' fid:', fid);
        this.proBoardData();
      });

      // 上传背景图片的回调
      teduBoard.on(TEduBoard.EVENT.TEB_SETBACKGROUNDIMAGE, (fileName, fileUrl, userData) => {
        console.log('======================:  ', 'TEB_SETBACKGROUNDIMAGE', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
      });

      // 增加图片元素
      teduBoard.on(TEduBoard.EVENT.TEB_ADDIMAGEELEMENT, (fileName, fileUrl, userData) => {
        console.log('======================:  ', 'TEB_ADDIMAGEELEMENT', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData);
      });

      // 文件上传进度
      teduBoard.on(TEduBoard.EVENT.TEB_FILEUPLOADPROGRESS, (data) => {
        console.log('======================:  ', 'TEB_FILEUPLOADPROGRESS:: ', data);
        this.showTip('上传进度:' + parseInt(data.percent * 100) + '%');
      });

      // H5背景加载状态
      teduBoard.on(TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
        console.log('======================:  ', 'TEB_H5BACKGROUND_STATUS_CHANGED:: status:', status, '  data:', data);
      });

      // 转码进度
      teduBoard.on(TEduBoard.EVENT.TEB_TRANSCODEPROGRESS, res => {
        console.log('=======  TEB_TRANSCODEPROGRESS 转码进度：', JSON.stringify(res));
        if (res.code) {
          this.showErrorTip('转码失败code:' + res.code + ' message:' + res.message);
        } else {
          let status = res.status;
          if (status === 'ERROR') {
            this.showErrorTip('转码失败');
          } else if (status === 'UPLOADING') {
            this.showTip('上传中，当前进度:' + parseInt(res.progress) + '%');
          } else if (status === 'CREATED') {
            this.showTip('创建转码任务');
          } else if (status === 'QUEUED') {
            this.showTip('正在排队等待转码');
          } else if (status === 'PROCESSING') {
            this.showTip('转码中，当前进度:' + res.progress + '%');
          } else if (status === 'FINISHED') {
            this.showTip('转码完成');
            let config = {
              url: res.resultUrl,
              title: res.title,
              pages: res.pages,
              resolution: res.resolution
            }
            console.log('transcodeFile:', config);
            this.teduBoard.addTranscodeFile(config);
          }
        }
      });

      // 框选如果有选中内容则会触发此事件
      // teduBoard.on(TEduBoard.EVENT.TEB_RECTSELECTED, () => {
      //   this.teduBoard.clear(false, true); // 清空选中的内容
      // });

      // 监听增加元素事件
      teduBoard.on(TEduBoard.EVENT.TEB_ADDELEMENT, ({
        id,
        userData
      }) => {
        console.log('id:', id, ' userData:', userData);
      });
    },

    // TRTC事件
    initTRTCEvent() {
      this.trtcClient.on('stream-added', event => {
        const remoteStream = event.stream;
        const remoteUserId = remoteStream.getUserId();
        console.log('received a remoteStream ID: ' + remoteStream.getId() + ' from user: ' + remoteUserId);
        // 若需要观看该远端流，则需要订阅它，默认会自动订阅
        this.trtcClient.subscribe(remoteStream);
      });

      // 监听‘stream-removed’事件
      this.trtcClient.on('stream-removed', event => {
        const remoteStream = event.stream;
        console.log('remoteStream ID: ' + remoteStream.getId() + ' has been removed');
        // 停止播放并删除相应<video>标签
        remoteStream.stop();
        document.getElementById(remoteStream.getId()).remove();
      });

      // 监听‘stream-updated’事件
      this.trtcClient.on('stream-updated', event => {
        const remoteStream = event.stream;
        console.log('remoteStream ID: ' + remoteStream.getId() + ' was updated hasAudio: ' +
          remoteStream.hasAudio() + ' hasVideo: ' + remoteStream.hasVideo());
      });

      // 监听‘stream-subscribed’事件
      this.trtcClient.on('stream-subscribed', event => {
        const remoteStream = window.remoteStream = event.stream;
        // 远端流订阅成功，在HTML页面中创建一个<video>标签，假设该标签ID为‘remote-video-view’
        // 播放该远端流
        let remoteVideoWrapEl = document.createElement('div');
        remoteVideoWrapEl.id = remoteStream.getId();
        document.querySelector("#video_wrap").insertBefore(remoteVideoWrapEl, null);
        remoteStream.play(remoteVideoWrapEl).catch((e) => {
          const errorCode = e.getCode();
          if (errorCode === 0x4043) { // safari浏览器限制播放必须手动触发，引导用户手势操作恢复音视频播放
            this.$confirm('请您对音视频播放进行授权', '提示', {
              confirmButtonText: '授权',
              type: 'warning'
            }).then(() => {
              remoteStream.resume()
            })
          }
        });
      });

      this.trtcClient.on('connection-state-changed', event => {
        console.log('connection-state-changed:', event.state);
      });

      this.trtcClient.on('peer-join', event => {
        console.log('peer-join', event)
        const userId = event.userId;
      });

      this.trtcClient.on('peer-leave', event => {
        console.log('peer-leave', event)
        const userId = event.userId;
      });

      this.trtcClient.on('mute-audio', event => {
        console.log('mute-audio', event)
        const userId = event.userId;
        this.showTip(`${userId}关闭了麦克风`);
      });

      this.trtcClient.on('mute-video', event => {
        console.log('mute-video', event)
        const userId = event.userId;
        this.showTip(`${userId}关闭了摄像头`);
      });

      this.trtcClient.on('unmute-audio', event => {
        console.log('unmute-audio', event)
        const userId = event.userId;
        this.showTip(`${userId}打开了麦克风`);
      });

      this.trtcClient.on('unmute-video', event => {
        console.log('unmute-video', event)
        const userId = event.userId;
        this.showTip(`${userId}打开了摄像头`);
      });

      this.trtcClient.on('error', error => {
        console.error('client error observed: ' + error);
        const errorCode = error.getCode();
        // 根据ErrorCode列表查看详细错误原因。
      });
    },


    /**
     * 增加IM消息监听回调
     */
    addTICMessageListener() {
      this.tic.addTICMessageListener({

        /**
         * 收到C2C文本消息
         * @param fromUserId		发送此消息的用户id
         * @param text				收到消息的内容
         * @param textLen			收到消息的长度
         */
        onTICRecvTextMessage: (fromUserId, text, textLen) => {
          this.showMessageInBox(fromUserId, text);
        },

        /**
         * 收到C2C自定义消息
         * @param fromUserId		发送此消息的用户id
         * @param data				收到消息的内容
         * @param dataLen			收到消息的长度
         */
        onTICRecvCustomMessage: (fromUserId, data, textLen) => {
          this.showMessageInBox(fromUserId, data);
        },

        /**
         * 收到群文本消息
         * @param fromUserId		发送此消息的用户id
         * @param text				收到消息的内容
         * @param textLen			收到消息的长度
         */
        onTICRecvGroupTextMessage: (fromUserId, text, textLen) => {
          this.showMessageInBox(fromUserId, text);
        },

        /**
         * 收到群自定义消息
         * @param fromUserId		发送此消息的用户id
         * @param data				收到消息的内容
         * @param dataLen			收到消息的长度
         */
        onTICRecvGroupCustomMessage: (fromUserId, data, textLen) => {
          this.showMessageInBox(fromUserId, data);
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

    // 事件监听回调
    addTICEventListener() {
      this.tic.addTICEventListener({
        onTICMemberJoin: (members) => {
          this.showMessageInBox('群消息', members.join(',') + '进入课堂');
        },

        onTICMemberQuit: (members) => {
          this.showMessageInBox('群消息', members.join(',') + '退出课堂');
        },

        onTICClassroomDestroy: () => {
          this.quitClassroom();
          this.showTip(`老师解散了课堂`);
        },

        onTICTrtcClientCreated: () => {
          this.showTip(`trtcclient创建成功`);
          window.trtcClient = this.trtcClient = this.tic.getTrtcClient();
          this.initTRTCEvent();
        }
      });
    },

    // IM状态监听回调
    addTICStatusListener() {
      this.tic.addTICStatusListener({
        onTICForceOffline: () => {
          this.showErrorTip(`帐号其他地方登录，被T了`);
          this.status = this.STATUS_UNLOGIN;
          this.clearClassInfo();
          this.showMessageInBox('TIC', "onTICForceOffline " + this.roomID);
        }
      });
    },

    /**
     * 结束推流
     */
    stopPush(callback) {
      if (this.localStream && this.isPushing) {
        this.trtcClient.unpublish(this.localStream).then(() => {
          this.isPushing = 0;
          document.getElementById('local_video').remove();
          this.localStream.stop();
          this.localStream = null;
          if (Object.prototype.toString.call(callback) === '[object Function]') {
            callback();
          }
        });
      }
    },


    // 启动推流(推摄像头)
    startRTC() {
      // 从麦克风和摄像头采集本地音视频流
      let cameraStream = TRTC.createStream({
        audio: true,
        video: true
      });
      // 设置视频分辨率等参数
      cameraStream.setVideoProfile('720p');
      if (this.localStream && this.isPushing) { // 如果正在推流, 先停止发布流
        this.stopPush(() => {
          this.publishLocalStream(cameraStream);
        });
      } else {
        this.publishLocalStream(cameraStream);
      }
    },

    /**
     * 推屏幕分享
     */
    pushScreen() {
      // 从麦克风和摄像头采集本地音视频流
      let screenStream = TRTC.createStream({
        audio: true,
        screen: true
      });

      // 设置视频分辨率等参数
      screenStream.setScreenProfile({
        width: 1920,
        height: 1080,
        frameRate: 15,
        bitrate: 1600 /* kbps */
      });
      if (this.localStream && this.isPushing) { // 如果正在推流, 先停止发布流
        this.stopPush(() => {
          this.publishLocalStream(screenStream);
        });
      } else {
        this.publishLocalStream(screenStream);
      }
    },

    publishLocalStream(localStream) {
      window.localStream = localStream;
      localStream.initialize().catch(error => {
        console.error('failed initialize localStream ' + error);
      }).then(() => {
        var localVideoWrapEl = document.getElementById('local_video');
        if (!localVideoWrapEl) {
          localVideoWrapEl = document.createElement('div');
          localVideoWrapEl.id = 'local_video';
          document.querySelector("#video_wrap").insertBefore(localVideoWrapEl, null);
        }
        // 本地流播放
        localStream.play(localVideoWrapEl, {
          muted: true
        });

        // 发布本地流（远端可收到）
        this.trtcClient && this.trtcClient.publish(localStream).then(() => {
          // 本地流发布成功
          this.isPushing = 1; // 正在推流
          this.isPushCamera = true; // 正在推摄像头
          this.localStream = localStream;
          this.showTip('推流成功');
        }).catch(error => {
          console.log(error);
        });
      }).catch(error => {
        this.showErrorTip(`获取本地流失败, ${JSON.stringify(error)}`);
      });
    },

    /**
     * 摄像头开关
     */
    toggleCamera() {
      this.enableCamera = !this.enableCamera;
      if (this.localStream) {
        this.enableCamera ? this.localStream.unmuteVideo() : this.localStream.muteVideo();
      }
    },

    /**
     * 麦克风开关
     */
    toggleMic() {
      this.enableMic = !this.enableMic
      if (this.localStream) {
        this.enableMic ? this.localStream.unmuteAudio() : this.localStream.muteAudio();
      }
    },

    /**
     * 枚举摄像头
     */
    getCameraDevices() {
      var WebRTC = this.tic.getWebRTCInstance();
      WebRTC.getVideoDevices(devices => {
        this.devices.camera = devices;
      });
    },

    /**
     * 枚举麦克风
     */
    getMicDevices() {
      var WebRTC = this.tic.getWebRTCInstance();
      WebRTC.getAudioDevices(devices => {
        this.devices.mic = devices;
      });
    },

    /**
     * 发送普通文本消息
     */
    sendMsg() {
      if (!this.imMsg.common.data) {
        this.showErrorTip(`不能发送空消息`);
        return;
      }

      // C2C 文本
      var text = this.imMsg.common.data;

      if (this.imMsg.common.toUser) {

        this.tic.sendTextMessage(this.imMsg.common.toUser, text, (res) => {
          if (res.code !== 0) {
            this.showMessageInBox('TIC', 'sendTextMessage failed, code=' + res.code + " content:" + text);
          } else {
            this.showMessageInBox(this.account, text);
          }
          console.log('===sendTextMessage:', res);
        });
      } else { // 群组 文本
        if (!this.roomID) {
          this.showErrorTip('发送群消息时，房间号为空');
          return;
        }

        this.tic.sendGroupTextMessage(text, (res) => {
          if (res.code !== 0) {
            this.showMessageInBox('TIC', 'sendGroupTextMessage failed, code=' + res.code + " content:" + text);
          } else {
            this.showMessageInBox(this.account, text);
          }
          console.log('===sendTextMessage:', res);
        });
      }

      this.imMsg.common.data = '';
    },

    /**
     * 发送自定义消息
     */
    sendCustomGroupMsg() {
      // 
      if (this.imMsg.common.toUser) { // C2C 自定义
        this.tic.sendCustomMessage(this.imMsg.common.toUser, this.imMsg.custom.data, function (res) {
          console.log('===sendCustomGroupMsg:', res);
        });
      } else { //群组 自定义
        this.tic.sendGroupCustomMessage(this.imMsg.custom.data, function (res) {
          console.log('===sendCustomGroupMsg:', res);
        });
      }
    },

    /**
     * 设置当前页背景色
     * @param {*} color Hex 色值，如 #ff00ff
     */
    onSetBackgroudColor(color) {
      this.backgroundColor = this.rgbToHex(color);
      this.teduBoard.setBackgroundColor(this.backgroundColor);
    },

    /**
     * 设置涂鸦颜色
     * @param {*} color Hex 色值，如 #ff00ff
     */
    onSetBrushColor(color) {
      this.brushColor = this.rgbToHex(color);
      this.teduBoard.setBrushColor(this.brushColor);
    },

    rgbToHex(color) {
      var arr = [],
        strHex;
      if (/^(rgb|RGB)/.test(color)) {
        arr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        strHex = '#' + ((1 << 24) + (arr[0] << 16) + (arr[1] << 8) + parseInt(arr[2])).toString(16).substr(1);
      } else {
        strHex = color;
      }
      return strHex;
    },

    /**
     * 设置涂鸦粗细
     * @param {*} num 
     */
    onSetThin(num) {
      this.teduBoard.setBrushThin(num);
    },

    /**
     * 清空当前页涂鸦(保留背景色/图片)
     */
    onclearDraws() {
      this.teduBoard.clear();
    },

    /**
     * 清空当前页涂鸦 + 背景色/图片
     */
    onClear() {
      this.teduBoard.clear(true);
    },

    // 回退
    onUndo() {
      this.teduBoard.undo();
    },

    // 重做
    onRedo() {
      this.teduBoard.redo();
    },

    /**
     * 上传文件
     */
    uploadFile() {
      var file = document.getElementById('file_input').files[0];
      if (/\.(bmp|jpg|jpeg|png|gif)/i.test(file.name)) {
        // this.teduBoard.setBackgroundImage({
        //   data: file,
        //   userData: 'image'
        // });
        this.teduBoard.addImageElement({
          data: file,
          userData: 'image'
        });
      } else {
        this.teduBoard.applyFileTranscode({
          data: file,
          userData: 'tiw'
        }, {
          minResolution: '960x540',
          isStaticPPT: false,
          thumbnailResolution: '200x200'
        });
      }
      document.getElementById('file_input').value = null;
    },

    onAddH5File(url) {
      this.teduBoard.addH5File(url);
    },

    onAddVideoFile(url) {
      this.teduBoard.addVideoFile(url);
    },


    onAddImageElement(url) {
      this.teduBoard.addImageElement(url);
    },

    onAddH5Element() {
      if (this.h5Url) {
        this.teduBoard.addH5Element(this.h5Url);
      }
    },

    // 动画上一步
    prevStep() {
      this.teduBoard.prevStep();
    },

    // 动画下一步
    nextStep() {
      this.teduBoard.nextStep();
    },

    /**
     * 上一页
     */
    prevBoard() {
      this.teduBoard.prevBoard();
    },

    /**
     * 下一页
     */
    nextBoard() {
      this.teduBoard.nextBoard();
    },

    /**
     * 新增一页
     */
    addBoard() {
      this.teduBoard.addBoard();
    },

    /**
     * 删除当前页
     */
    onDeleteBoard(boardId) {
      this.teduBoard.deleteBoard(boardId);
    },

    /**
     * 白板事件回调处理
     * @param {*} data 
     */
    proBoardData(data) {
      this.fileInfoList = this.teduBoard.getFileInfoList();
      this.currentFileId = this.teduBoard.getCurrentFile();
      this.thumbUrls = this.teduBoard.getThumbnailImages(this.currentFileId);
      var fileInfo = this.teduBoard.getFileInfo(this.currentFileId);
      if (fileInfo) {
        this.boardData = {
          currentBoardId: this.currentFileId,
          boardIdlist: this.teduBoard.getFileBoardList(this.currentFileId),
          current: fileInfo.currentPageIndex + 1,
          total: fileInfo.pageCount
        }
      }
    },

    onSwitchFile(file) {
      this.teduBoard.switchFile(file.fid);
    },

    onDeleteFile(file) {
      this.onDeleteFileById(file.fid);
    },

    onDeleteFileById(fid) {
      if (fid == "#DEFAULT") {
        this.showErrorTip('缺省文件 不能删除!');
        this.showMessageInBox('TIC ：', '#DEFAULT can not be deleted');
        return;
      }
      this.teduBoard.deleteFile(fid);
    },

    onClickBoardTab(targetTab) {
      var fid = targetTab.name;
      this.teduBoard.switchFile(fid);
    },

    onThumbClick(index) {
      var fileId = this.teduBoard.getCurrentFile();
      var boardList = this.teduBoard.getFileBoardList(fileId);
      var boardId = boardList[index];
      this.teduBoard.gotoBoard(boardId);
    },


    onSetToolType(toolType) {
      if(toolType > 3){
        this.teduBoard.setCursorIcon(toolType, {cursor: 'default', url: ''});
      }
      this.teduBoard.setToolType(toolType);
    },

    //Board(涂鸦操作)
    onSetDrawEnable() {
      this.teduBoard.setDrawEnable(this.drawEnable);
    },

    onSetTextSize(size) {
      this.teduBoard.setTextSize(size);
    },

    onSetTextColor(color) {
      this.textColor = this.rgbToHex(color);
      this.teduBoard.setTextColor(this.textColor);
    },

    onSetBackgroundImage(backgroundImage) {
      var path = backgroundImage;
      this.teduBoard.setBackgroundImage(path);
    },

    onSetBackgroundH5(backgroundImageH5) {
      var path = backgroundImageH5;
      this.teduBoard.setBackgroundH5(path);
    },

    onGotoBoard(boardId) {
      this.teduBoard.gotoBoard(boardId, false);
    },

    onSetScale(scale) {
      this.teduBoard.setBoardScale(scale);
    },


    //--------------util-----------------
    showErrorTip(title, time) {
      this.$message({
        showClose: true,
        message: title,
        type: 'error'
      });
    },

    showTip(title, time) {
      this.$message({
        showClose: true,
        message: title,
        type: 'success'
      });
    },

    findUserSig() {
      var userSig = null;
      for (var i = 0, len = this.users.length; i < len; i++) {
        if (this.account === this.users[i].userId) {
          userSig = this.users[i].userToken;
          break;
        }
      }
      return userSig;
    },

    showMessageInBox(fromUserId, text) {
      var d = new Date();
      var time = `${('0' + d.getHours()).substr(-2)}:${('0' + d.getMinutes()).substr(-2)}:${('0' + d.getSeconds()).substr(-2)}.${('00' + d.getMilliseconds()).substr(-3)}`
      this.msgs.push({
        time: time,
        send: fromUserId + '：',
        content: text
      });
      this.$nextTick(() => {
        var msgbox = document.querySelector("#msg_box");
        msgbox.scrollTop = msgbox.scrollHeight;
      });
    },

    testFontColor(e) {
      // e.preventDefault();
    }
  },

  beforeDestroy() {
    this.quitClassroom();
  },
});