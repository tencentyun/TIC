// webim组件
const webimComponent = require('../webim-component/webim-component');
const MessageListener = require('../event/MessageListener');
const EventListener = require('../event/EventListener');
const BoardListener = require('../event/BoardListener');
const StatusListener = require('../event/StatusListener');
const logReport = require('../elk-component/ELKReport');
const TEduBoard = require('../board-component/libs/TEduBoard_miniprogram.min.js');

const Constant = {
  TICModule: {
    TICMODULE_IMSDK: 1
  }
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    txBoard: null,
    orientation: 'vertical',
    sdkAppId: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(sdkAppId, callback) {
      let startTime = Date.now();
      logReport.setSdkAppId(sdkAppId);
      logReport.report(logReport.EVENT_NAME.INITSDK_START);
      if (sdkAppId) {
        this.data.sdkAppId = sdkAppId;
        webimComponent.init(sdkAppId);
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
        logReport.report(logReport.EVENT_NAME.INITSDK_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      } else {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: -7,
          desc: 'sdkAppId is illegal'
        });
        logReport.report(logReport.EVENT_NAME.INITSDK_END, {
          errorCode: -7,
          errorDesc: 'sdkAppId is illegal',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      }
    },

    // 保留接口
    uninit() {

    },

    /**
     * 登录im
     * @param {*} params tic所需参数
     * @param {*} succ  成功回调
     * @param {*} fail  失败回调
     */
    login(loginConfig, callback) {
      this.data.userId = String(loginConfig.userId);
      this.data.userSig = String(loginConfig.userSig);

      let startTime = Date.now();
      logReport.setUserId(this.data.userId);
      logReport.report(logReport.EVENT_NAME.LOGIN_START);

      webimComponent.login(this.data.userId, this.data.userSig).then(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
        logReport.report(logReport.EVENT_NAME.LOGIN_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      }).catch(error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        });
        logReport.report(logReport.EVENT_NAME.LOGIN_END, {
          errorCode: error.code,
          errorDesc: error.message,
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      });
    },

    /**
     * 登出
     * @param callback			回调
     */
    logout(callback) {
      let startTime = Date.now();
      logReport.report(logReport.EVENT_NAME.LOGOUT_START);

      webimComponent.logout().then(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
        logReport.report(logReport.EVENT_NAME.LOGOUT_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        });
        logReport.report(logReport.EVENT_NAME.LOGOUT_END, {
          errorCode: error.code,
          errorDesc: error.message,
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      });
    },

    /**
     * 创建课堂
     * @param classId			课堂ID，由业务生成和维护
     * @param callback			回调
     */
    createClassroom(classId, callback) {
      let startTime = Date.now();
      logReport.setRoomId(classId);
      logReport.report(logReport.EVENT_NAME.CREATEGROUP_START);

      // WebIM加入聊天房间
      webimComponent.createGroup(classId).then(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
        logReport.report(logReport.EVENT_NAME.CREATEGROUP_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        });
        logReport.report(logReport.EVENT_NAME.CREATEGROUP_END, {
          errorCode: error.code,
          errorDesc: error.message,
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      });
    },

    /**
     * 进入课堂
     * @param {*} roomID 课堂ID
     * @param {*} succ 进入成功的回调
     * @param {*} fail 进入失败的回调
     */
    joinClassroom(classId, boardOption, callback) {
      let startTime = Date.now();
      logReport.report(logReport.EVENT_NAME.JOINGROUP_START);

      this.data.classId = classId * 1;
      // 加入群组
      webimComponent.joinGroup(classId).then(() => {
        BoardListener.addBoardEventListener({
          RECEIVE_BOARD_DATA: (data) => {
            if (this.data.txBoard) {
              try {
                this.data.txBoard.addSyncData(data);
              } catch (error) {
                logReport.report(logReport.EVENT_NAME.ONTEBADDSYNCERROR);
              }
            } else {

            }
          },
          // 接收到文件数据
          RECEIVE_BOARD_FILE_DATA: element => {

          }
        });

        this.renderBoard(boardOption, function () {
          callback && callback({
            module: Constant.TICModule.TICMODULE_IMSDK,
            code: 0
          });
        })

        logReport.report(logReport.EVENT_NAME.JOINGROUP_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      }, (error) => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        });
        logReport.report(logReport.EVENT_NAME.JOINGROUP_END, {
          errorCode: error.code,
          errorDesc: error.message,
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      });
    },

    /**
     * 退出课堂
     * @param {*} succ 退出成功
     * @param {*} fail 退出失败
     */
    quitClassroom(callback) {
      let startTime = Date.now();
      logReport.report(logReport.EVENT_NAME.QUITGROUP_START);
      webimComponent.quitGroup(this.data.classId).then(() => {
        // 销毁白板
        this.data.txBoard && this.data.txBoard.destroy();


        // 退出成功
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
        logReport.report(logReport.EVENT_NAME.QUITGROUP_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      }, (error) => {
        // 退出失败
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        });
        logReport.report(logReport.EVENT_NAME.QUITGROUP_END, {
          errorCode: error.code,
          errorDesc: error.message,
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      });
    },

    /**
     * 销毁课堂
     * @param classId			课堂ID，由业务生成和维护
     * @param callback			回调
     */
    destroyClassroom(classId, callback) {
      let startTime = Date.now();
      logReport.report(logReport.EVENT_NAME.DELETEGROUP_START);
      webimComponent.destroyGroup(classId, () => {
        // 销毁白板
        this.data.txBoard && this.data.txBoard.destroy();

        // 销毁成功
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
        logReport.report(logReport.EVENT_NAME.DELETEGROUP_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      }, (error) => {
        // 销毁失败
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        });
        logReport.report(logReport.EVENT_NAME.DELETEGROUP_END, {
          errorCode: error.code,
          errorDesc: error.message,
          timeCost: Date.now() - startTime,
          data: '',
          ext: ''
        });
      });
    },

    /**
     * 初始化白板
     */
    renderBoard(boardOption = {}, callback) {
      var txBoard = this.data.txBoard = this.selectComponent('#tx_board_component');
      boardOption = Object.assign({}, {
        userId: this.data.userId,
        userSig: this.data.userSig,
        sdkAppId: this.data.sdkAppId,
        classId: this.data.classId,
        orientation: this.data.orientation
      }, boardOption);
      // 开始白板
      txBoard.render(boardOption, () => {
        /**
         * 监听到实时涂鸦数据后，通过im将数据同步到各端
         */
        txBoard.getBoardInstance().on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
          webimComponent.sendBoardGroupCustomMessage(data).then((content) => {
            let teduBoard = this.getBoardInstance();
            if(teduBoard){
              teduBoard.addAckData(content);
            }
          }, (error) => {
            // 同步到远端增加失败日志
            try {
              logReport.report(logReport.EVENT_NAME.ONTEBADDSYNCTOREMOTEERROR, {
                errorCode: error.code,
                errorDesc: error.message,
                ext: JSON.stringify(error)
              });
            } catch (error) {}

          });
        });
        callback && callback();
      });
    },

    /**
     * 发送C2C文本消息
     * @param userId			消息接收者
     * @param text				文本消息内容
     * @param callback			回调
     */
    sendTextMessage(userId, text, callback) {
      webimComponent.sendC2CTextMessage(userId, text).then(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        })
      });
    },

    /**
     * 发送C2C自定义消息
     * @param userId			消息接收者
     * @param data				自定义消息内容
     * @param callback			回调
     */
    sendCustomMessage(userId, data, callback) {
      webimComponent.sendC2CCustomMessage(userId, data).then(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        })
      });
    },

    /**
     * 发送群组文本消息
     * @param {string} msg 
     * @param {function} succ 
     * @param {function} fail
     */
    sendGroupTextMessage(text, callback) {
      webimComponent.sendGroupTextMessage(text).then(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        })
      });
    },

    /**
     * 发送群自定义消息
     * @param data				自定义消息内容
     * @param callback			回调
     */
    sendGroupCustomMessage(data, callback) {
      webimComponent.sendGroupCustomMessage(data).then(() => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        })
      }, error => {
        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: error.code,
          desc: error.message
        })
      });
    },

    /**
     * 设置白板显示方向
     * @param {*} orientation 
     */
    setOrientation(orientation, callback) {
      this.data.txBoard && this.data.txBoard.setOrientation(orientation, callback);
    },

    /**
     * @desc 获取白板实例
     * @return {Board} board 返回白板实例
     */
    getBoardInstance() {
      return this.data.txBoard && this.data.txBoard.getBoardInstance();
    },

    /**
     * @desc 获取IM实例, 初始化TICKSDK后即可获得IM实例
     * @return {webim} im 返回IM实例
     */
    getImInstance() {
      return webimComponent.getImInstance();
    },

    /**
     * 添加IM消息监听回调
     * @param listener			回调
     */
    addTICMessageListener(listener) {
      MessageListener.addTICMessageListener(listener);
    },

    /**
     * 移除IM消息监听回调
     * @param listener			回调
     */
    removeTICMessageListener(listener) {
      MessageListener.removeTICMessageListener(listener);
    },

    /**
     * 添加事件监听回调
     * @param listener			回调
     */
    addTICEventListener(listener) {
      EventListener.addTICEventListener(listener);
    },

    /**
     * 移除事件监听回调
     * @param listener			回调
     */
    removeTICEventListener(listener) {
      EventListener.removeTICEventListener(listener);
    },

    /**
     * 添加IM状态监听回调
     * @param listener			回调
     */
    addTICStatusListener(listener) {
      StatusListener.addTICStatusListener(listener);
    },

    /**
     * 移除IM状态监听回调
     * @param listener			回调
     */
    removeTICStatusListener(listener) {
      StatusListener.removeTICStatusListener(listener);
    }
  }
})