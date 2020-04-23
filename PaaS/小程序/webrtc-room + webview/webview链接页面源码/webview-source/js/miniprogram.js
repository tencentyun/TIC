window.app = new Vue({
  el: '#app',
  data() {
    return {
      userId: purl().param('userId'),
      sdkAppId: purl().param('sdkAppId'),
      userSig: purl().param('userSig'),
      classId: purl().param('classId'),
      roomID: purl().param('classId'),
      isTeacher: purl().param('isTeacher'),
      videoSize: purl().param('videoSize'),

      // board(涂鸭)
      drawEnable: true, //是否可以涂鸭
      synDrawEnable: true, //是否将你画的涂鸭同步给其他人
      toolType: 1,
      brushThin: 100,
      backgroundImage: "背景图",
      backgroundImageH5: "背景图H5",
      backgroundColor: "#ff0000",
      globalBackgroundColor: "#ff0000",
      brushColor: "#ff0000",
      textColor: "#ff0000",
      textStyle: "#ff0000",
      textSize: 100,
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

      isShow: false,
    }
  },

  mounted() {
    this.isShow = true;
    // this.setOrientation();
    this.start();
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

      this.drawEnable = true; //是否可以涂鸭
      this.synDrawEnable = true; //是否将你画的涂鸭同步给其他人
      this.toolType = 1;
      this.brushThin = 100;
      this.backgroundImage = "背景图";
      this.backgroundImageH5 = "背景图H5";
      this.backgroundColor = "#ff0000";
      this.globalBackgroundColor = "#ff0000";
      this.brushColor = "#ff0000";
      this.textColor = "#ff0000";
      this.textStyle = "#ff0000";
      this.textSize = 100;
      this.scaleSize = 100;
      this.fitMode = 1;
      this.ration = "16:9";
      this.canRedo = 0;
      this.canUndo = 0;
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
            this.login();
          }
        });
      } else {
        this.login();
      }
    },

    // 登录
    login() {
      this.tic.login({
        userId: this.userId,
        userSig: this.userSig
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
          if (this.isTeacher === 'true') {
            this.createClassroom();
          } else {
            this.joinClassroom();
          }
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
    createClassroom() {
      if (!this.roomID) {
        this.showErrorTip('房间号不能为空');
        return;
      }

      this.tic.createClassroom(this.roomID, (res) => {

        if (res.code) {
          if (res.code == 10021) {
            this.showTip('该课堂已被他人创建，请直接加入');
            this.joinClassroom();
          } else if (res.code == 10025) {
            this.showTip('您已经创建过这个课堂，请直接加入');
            this.joinClassroom();
          } else {
            this.showErrorTip('创建课堂失败');
            console.error(res);
            this.showMessageInBox('TIC', "createClassroom error:" + res.code);
          }
        } else {
          this.showTip('创建课堂成功');
          this.showMessageInBox('TIC', "createClassroom Succ:");
          // 创建成功后自动加入课堂
          this.joinClassroom();
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
      if (!this.classId) {
        this.showErrorTip('房间号不能为空');
        return;
      }

      if (this.status == this.STATUS_INCLASS) {
        this.showMessageInBox('TIC', "this user is in classs, classId=" + this.classId);
        return;
      }

      this.tic.joinClassroom(this.classId, false, {
        id: 'sketchpad',
        ratio: '16:9',
        smoothLevel: 0,
        boardContentFitMode: 1
      }, res => {
        if (res.code) {
          this.showErrorTip('加入课堂失败');
          this.showMessageInBox('TIC', "joinClassroom Failed,room=" + this.classId + "code=" + res.code);

          console.error(res);
        } else {
          this.status = this.STATUS_INCLASS;
          this.roomID = this.classId;
          this.showTip('加入课堂成功');
          this.showMessageInBox('TIC', "joinClassroom Succ, room=" + this.classId);

          window.teduBoard = this.teduBoard = this.tic.getBoardInstance();
          this.initBoardEvent();
        }
      });
    },

    /**
     * 退出课堂
     */
    quitClassroom(callback) {
      if (!this.classId) {
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
          // this.showTip('退出课堂成功');
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
            this.teduBoard.addTranscodeFile({
              url: res.resultUrl,
              title: res.title,
              pages: res.pages,
              resolution: res.resolution
            });
          }
        }
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
        }
      });
    },

    // IM状态监听回调
    addTICStatusListener() {
      this.tic.addTICStatusListener({
        onTICForceOffline: () => {
          alert(`其他地方登录，被T了`);
          this.status = this.STATUS_UNLOGIN;
          this.clearClassInfo();
          this.showMessageInBox('TIC', "onTICForceOffline " + this.roomID);
        }
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
          }
          console.log('===sendTextMessage:', res);
        });
      }

      this.imMsg.common.data = '';
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
      this.teduBoard.addFile({
        data: file,
        userData: 'hello'
      });
    },

    onAddH5File(url) {
      this.teduBoard.addH5PPTFile(url);
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
      if (this.boardData.boardIdlist[this.boardData.current - 1]) {
        this.teduBoard.deleteBoard(this.boardData.boardIdlist[this.boardData.current - 1]);
      }
    },

    /**
     * 白板事件回调处理
     * @param {*} data 
     */
    proBoardData(data) {
      this.fileInfoList = this.teduBoard.getFileInfoList();
      this.currentFileId = this.teduBoard.getCurrentFile();
      var fileInfo = this.teduBoard.getFileInfo(this.currentFileId);

      this.boardData = {
        currentBoardId: this.currentFileId,
        boardIdlist: this.teduBoard.getFileBoardList(this.currentFileId),
        current: fileInfo.currentPageIndex + 1,
        total: fileInfo.pageCount
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

    onSetToolType(toolType) {
      this.teduBoard.setToolType(toolType);
    },

    //Board(涂鸭操作)
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
      if (this.boardData.boardIdlist[boardId - 1]) {
        this.teduBoard.gotoBoard(this.boardData.boardIdlist[boardId - 1], false);
      }
    },

    onSetScale(scale) {
      this.teduBoard.setBoardScale(scale);
    },

    // 重置白板大小
    onBoardResize() {
      this.teduBoard.resize();
    },

    //--------------util-----------------
    showErrorTip(title, time) {
      this.$message({
        showClose: true,
        message: title,
        type: 'error',
        offset: 0.3 * document.body.clientHeight
      });
    },

    showTip(title, time) {
      this.$message({
        showClose: true,
        message: title,
        type: 'success',
        offset: 0.3 * document.body.clientHeight
      });
    },

    showMessageInBox(fromUserId, text) {
      this.msgs.push({
        send: fromUserId + '：',
        content: text
      });
      this.$nextTick(() => {
        var msgbox = document.getElementById("msg_box");
        msgbox.scrollTop = msgbox.scrollHeight;
      });
    },

    setOrientation() {
      var originHeight = document.body.clientHeight;
      var originWidth = document.body.clientWidth;
      var isPortrait = false;

      var setMsgBox = () => {
        var msgbox = document.getElementById("msg_box");
        msgbox.scrollTop = msgbox.scrollHeight;
      };

      var setPortrait = () => {
        if (document.getElementById("emptyBlock").classList.contains("emptyBlock-orientation-landscape")) {
          document.getElementById("emptyBlock").classList.remove("emptyBlock-orientation-landscape")
        }
        if (document.getElementById("app").classList.contains("app-orientation-landscape")) {
          document.getElementById("app").classList.remove("app-orientation-landscape")
        }
        isPortrait = true;
        document.getElementById("emptyBlock").classList.add("emptyBlock-orientation-portrait");
        document.getElementById("app").classList.add("app-orientation-portrait");
        setMsgBox();
      };

      var setLandscape = () => {
        if (document.getElementById("emptyBlock").classList.contains("emptyBlock-orientation-portrait")) {
          document.getElementById("emptyBlock").classList.remove("emptyBlock-orientation-portrait")
        }
        if (document.getElementById("app").classList.contains("app-orientation-portrait")) {
          document.getElementById("app").classList.remove("app-orientation-portrait")
        }
        isPortrait = false;
        document.getElementById("emptyBlock").classList.add("emptyBlock-orientation-landscape");
        document.getElementById("app").classList.add("app-orientation-landscape");
        setMsgBox();
      };

      if (originHeight > originWidth) {
        setPortrait();
      } else {
        setLandscape();
      }

      window.addEventListener("resize", () => {
        var resizeHeight = document.body.clientHeight;
        var resizeWidth = document.body.clientWidth;
        if (resizeHeight < originHeight && resizeWidth == originWidth) {
          if (isPortrait) {
            setPortrait();
          } else {
            setLandscape();
          }
        } else if (resizeHeight < originHeight && resizeWidth > originWidth) {
          setLandscape();
          originHeight = resizeHeight;
          originWidth = resizeWidth;
          // this.onBoardResize();
        } else if (resizeHeight > originHeight && resizeWidth < originWidth) {
          setPortrait();
          originHeight = resizeHeight;
          originWidth = resizeWidth;
          // this.onBoardResize();
        }
      })
    },
  },

  beforeDestroy() {
    this.quitClassroom();
  },
});