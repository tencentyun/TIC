import Constant from './constant/Constant';
import WebIM from './webim/WebIM';
import WebBoard from './webboard/webBoard';
import WebRTC from './webrtc/WebRTC';
import MessageListener from './event/MessageListener';
import EventListener from './event/EventListener';
import StatusListener from './event/StatusListener';
import AccountModel from './model/AccountModel';
import BoardOptionModel from './model/BoardOptionModel';
import WebRTCOptionModel from './model/WebRTCOptionModel';
import Config from './config/Config'
import LogReport from './log/LogReport'
import ClassModel from './model/ClassModel';

function TIC() {
  this.accountModel = new AccountModel();
  this.boardOptionModel = new BoardOptionModel();
  this.webRTCOptionModel = new WebRTCOptionModel();
  this.classModel = new ClassModel();

  this.messageListener = new MessageListener();
  this.eventListener = new EventListener();
  this.statusListener = new StatusListener();

  this.ticVersion = Config.version;
  this.log = new LogReport();
  this.log.setSdkVersion(Config.version);

  this._disableAllModule = false; // 禁用所有模块
  this._disableTRTCModule = false; // 禁用TRTC模块
}

/** @constant {string} */
TIC.CONSTANT = Constant;

TIC.prototype = {

  /**
   * 初始化;
   * @param sdkAppId			在腾讯云申请的sdkAppId
   * @param callback			回调
   * @return 错误码, 0表示成功
   */
  init(sdkAppId, disableModule, callback) {
    let cb = null;
    if (arguments.length == 2) {
      cb = disableModule;
    } else if (arguments.length == 3) {
      cb = callback;
      // 不禁用所有模块
      if (disableModule === Constant.TICDisableModule.TIC_DISABLE_MODULE_NONE) {
        this._disableAllModule = false;
      } else if (disableModule >> 1 & 1 === 1) { // 禁用TRTC模块
        this._disableAllModule = false;
        this._disableTRTCModule = true; // 禁用TRTC模块
      }
    }

    this.log.setSdkAppId(sdkAppId);
    let startTime = Date.now();

    // 初始化开始
    this.log.report(LogReport.EVENT_NAME.INITSDK_START, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: '',
      ext: '',
    });

    if (sdkAppId) {
      this.ticWebIm = new WebIM();
      this.ticWebIm.setLog(this.log);
      this.accountModel.sdkAppId = sdkAppId;
      this.ticWebIm.init(sdkAppId);
      cb && cb({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: 0
      });

      // 初始化完成
      this.log.report(LogReport.EVENT_NAME.INITSDK_END, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

    } else {
      cb && cb({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: -7,
        desc: 'sdkAppId is illegal'
      });
      // 初始化
      this.log.report(LogReport.EVENT_NAME.INITSDK_END, {
        errorCode: -7,
        errorDesc: 'sdkAppId is illegal',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });
    }
  },

  // 保留接口
  uninit() {
    // this.tim.uninitEvent();
  },

  /**
   * 登录
   * @param loginConfig		userid, usersig鉴权信息
   * @param callback			回调
   */
  login(loginConfig, callback) {
    let startTime = Date.now();

    this.accountModel.userId = loginConfig.userId;
    this.accountModel.userSig = loginConfig.userSig;

    this.log.setUserId(loginConfig.userId);

    // 登录-start
    this.log.report(LogReport.EVENT_NAME.LOGIN_START, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: '',
      ext: '',
    });

    this.ticWebIm.login(this.accountModel, this.classModel).then(() => {
      this.ticWebIm.setMessageListener(this.messageListener);
      this.ticWebIm.setEventListener(this.eventListener);
      this.ticWebIm.setStatusListener(this.statusListener);

      this.addTICStatusListener({
        // 监听被踢下线
        onTICForceOffline: () => {
          this.ticWebRTC && this.ticWebRTC.quit();
          this.ticBoard && this.ticBoard.quit();
          // this.removeTICEventListener();
          // this.removeTICMessageListener();
          // this.removeTICStatusListener();
        }
      });

      // 登录- end
      this.log.report(LogReport.EVENT_NAME.LOGIN_END, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: 0
      })
    }, error => {

      // 登录- end
      this.log.report(LogReport.EVENT_NAME.LOGIN_END, {
        errorCode: error.code,
        errorDesc: error.message,
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: error.code,
        desc: error.message
      });
    });
  },

  /**
   * 登出
   * @param callback			回调
   */
  logout(callback) {
    let startTime = Date.now();

    // 登出-start
    this.log.report(LogReport.EVENT_NAME.LOGOUT_START, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: '',
      ext: '',
    });

    this.ticWebIm.logout().then(() => {
      // 登出-end
      this.log.report(LogReport.EVENT_NAME.LOGOUT_END, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: 0
      })
    }).catch((error) => {

      // 登出-end
      this.log.report(LogReport.EVENT_NAME.LOGOUT_END, {
        errorCode: error.code,
        errorDesc: error.message,
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: error.code,
        desc: error.message
      });
    });
  },

  /**
   * 创建课堂
   * @param classObj			课堂ID，由业务生成和维护
   * @param callback			回调
   */
  createClassroom(classObj, callback) {
    // 默认是实时通话场景
    let scene = Constant.TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL; // 0 实时通话场景  1 直播场景
    let classId = classObj;

    // 如果是对象，则要拆一下classId
    if (Object.prototype.toString.call(classObj) === '[object Object]') {
      classId = classObj.classId;
      scene = classObj.classScene || Constant.TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL; // 场景
    }

    let startTime = Date.now();

    // 创建课堂-start
    this.log.report(LogReport.EVENT_NAME.CREATEGROUP_START, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: classId + '',
      ext: 'scene:' + scene, // 将场景上报
    });

    // WebIM加入聊天房间
    this.ticWebIm.createRoom(classId, scene).then(() => {
      // 创建课堂-end
      this.log.report(LogReport.EVENT_NAME.CREATEGROUP_END, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: classId + '',
        ext: '',
      });

      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: 0
      });
    }, error => {
      // 创建课堂-end
      this.log.report(LogReport.EVENT_NAME.CREATEGROUP_END, {
        errorCode: error.code,
        errorDesc: error.message,
        timeCost: Date.now() - startTime,
        data: classId + '',
        ext: '',
      });

      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: error.code,
        desc: error.message
      });
    });
  },

  /**
   * 加入课堂
   * @param classId		课堂ID
   * @param webRTCOption		WebRTC相关参数
   * @param boardOption	白板相关参数
   * @param callback			回调
   */
  joinClassroom(classOption, webRTCOption, boardOption, callback) {
    let classId = null;
    if (Object.prototype.toString.call(classOption) === '[object Object]') {
      this.classModel.compatSaas = !!classOption.compatSaas;
      classId = classOption.classId;
    } else {
      classId = classOption;
    }

    this.log.setRoomId(classId);

    let startTime = Date.now();

    // 加入课堂-start
    this.log.report(LogReport.EVENT_NAME.JOINGROUP_START, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: '',
      ext: JSON.stringify({
        webRTCOption: webRTCOption,
        boardOption: boardOption
      }),
    });

    this.accountModel.classId = classId;
    // 是否需要与saas同步
    if (this.classModel.compatSaas) {
      this.accountModel.classChatId = classId + '_chat'
    } else {
      this.classModel.classChatId = classId;
    }

    this.ticWebIm.joinRoom().then(res => {
      // 加入课堂-end
      this.log.report(LogReport.EVENT_NAME.JOINGROUP_END, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      this.ticWebIm.setReceiveBoardNotifyCallback(boardData => {
        if (this.ticBoard && this.ticBoard.getInstance()) {
          this.ticBoard.getInstance().addSyncData(JSON.parse(boardData));
        }
      });

      // 如果禁用了所有模块 || 禁用了TRTC模块 || 进房参数传了false
      if (this._disableAllModule || this._disableTRTCModule || !webRTCOption) {
        // 白板初始化
        this.log.report(LogReport.EVENT_NAME.INITBOARD_START, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: '',
        });

        this.boardOptionModel.setData(boardOption);
        this.ticBoard = new WebBoard(this.accountModel, this.boardOptionModel);
        this.ticBoard.setLog(this.log);
        this.ticBoard.render();

        // 白板初始化
        this.log.report(LogReport.EVENT_NAME.INITBOARD_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: '',
        });

        // 设置白板的监听回调
        this.ticBoard.addSyncDataEventCallback((data) => {
          this.ticWebIm.sendBoardGroupCustomMessage(data).then(data => {
            this.ticBoard.addAckData(data); // 发送成功后则调用ackData，告诉sdk，发送成功了
          })
        });

        callback && callback({
          module: Constant.TICModule.TICMODULE_IMSDK,
          code: 0
        });
      } else {
        this.log.report(LogReport.EVENT_NAME.ENTERROOM_START, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: '',
        });

        this.webRTCOptionModel.setData(webRTCOption);
        this.ticWebRTC = new WebRTC(this.accountModel, this.webRTCOptionModel);
        this.ticWebRTC.setLog(this.log);
        this.ticWebRTC.setEventListener(this.eventListener);

        this.ticWebRTC.joinAvRoom(() => {
          // 加入AV房间-end
          this.log.report(LogReport.EVENT_NAME.ENTERROOM_END, {
            errorCode: 0,
            errorDesc: '',
            timeCost: Date.now() - startTime,
            data: '',
            ext: '',
          });

          this.ticWebRTC.setStatusListener(this.statusListener);

          // 白板初始化
          this.log.report(LogReport.EVENT_NAME.INITBOARD_START, {
            errorCode: 0,
            errorDesc: '',
            timeCost: Date.now() - startTime,
            data: '',
            ext: '',
          });

          this.boardOptionModel.setData(boardOption);
          this.ticBoard = new WebBoard(this.accountModel, this.boardOptionModel);
          this.ticBoard.setLog(this.log);
          try {
            this.ticBoard.render();
            // 白板初始化
            this.log.report(LogReport.EVENT_NAME.INITBOARD_END, {
              errorCode: 0,
              errorDesc: '',
              timeCost: Date.now() - startTime,
              data: '',
              ext: '',
            });

            // 设置白板的监听回调
            this.ticBoard.addSyncDataEventCallback((data) => {
              this.ticWebIm.sendBoardGroupCustomMessage(data).then(data => {
                this.ticBoard.addAckData(data); // 发送成功后则调用ackData，告诉sdk，发送成功了
              })
            });

            callback && callback({
              module: Constant.TICModule.TICMODULE_IMSDK,
              code: 0
            });
          } catch (error) {
            this.log.report(LogReport.EVENT_NAME.ENTERROOM_END, {
              errorCode: -9999,
              errorDesc: error.message,
              timeCost: Date.now() - startTime,
              data: '',
              ext: JSON.stringify({
                stack: error.stack,
                message: error.message
              }),
            });

            callback && callback({
              module: Constant.TICModule.TICMODULE_BOARD,
              code: -9999,
              desc: error.message
            });
          }
        }, (error) => {
          // 加入AV房间-end
          this.log.report(LogReport.EVENT_NAME.ENTERROOM_END, {
            errorCode: error.getCode(),
            errorDesc: error.message,
            timeCost: Date.now() - startTime,
            data: '',
            ext: JSON.stringify({
              stack: error.stack,
              message: error.message
            }),
          });

          callback && callback({
            module: Constant.TICModule.TICMODULE_TRTC,
            code: error.getCode(),
            desc: error.message
          });
        });
      }

    }, error => {

      // 加入课堂-end
      this.log.report(LogReport.EVENT_NAME.JOINGROUP_END, {
        errorCode: error.code,
        errorDesc: error.message,
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: error.code,
        desc: error.message
      });
    });


    // 如果需要与saas同步
    if (this.classModel.compatSaas) {
      // 加入聊天群-start
      this.log.report(LogReport.EVENT_NAME.JOINCHATGROUP_START, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: ''
      });
      this.ticWebIm.joinSaasChatRoom().then((res) => {
        // 加入聊天群-end
        this.log.report(LogReport.EVENT_NAME.JOINCHATGROUP_END, {
          errorCode: 0,
          errorDesc: '',
          timeCost: Date.now() - startTime,
          data: '',
          ext: '',
        });
      }, () => {
        // 重试一次
        this.ticWebIm.joinSaasChatRoom().then(() => {
          // 加入聊天群-end
          this.log.report(LogReport.EVENT_NAME.JOINCHATGROUP_END, {
            errorCode: 0,
            errorDesc: '',
            timeCost: Date.now() - startTime,
            data: '',
            ext: '',
          });
        }, error => {
          // 加入聊天群-end
          this.log.report(LogReport.EVENT_NAME.JOINCHATGROUP_END, {
            errorCode: error.code,
            errorDesc: error.message,
            timeCost: Date.now() - startTime,
            data: '',
            ext: '',
          });
        });
      });
    }
  },

  /**
   * 退出课堂
   * @param callback			回调
   */
  quitClassroom(callback) {
    let startTime = Date.now();

    // 退出课堂-start
    this.log.report(LogReport.EVENT_NAME.QUITGROUP_START, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: '',
      ext: '',
    });

    this.ticWebIm.quitGroup().then(() => {
      this.ticWebRTC && this.ticWebRTC.quit();
      this.ticBoard && this.ticBoard.quit();

      // 退出课堂-end
      this.log.report(LogReport.EVENT_NAME.QUITGROUP_END, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      // 退出成功
      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: 0
      });
    }).catch((error) => {
      // 退出课堂-end
      this.log.report(LogReport.EVENT_NAME.QUITGROUP_END, {
        errorCode: error.code,
        errorDesc: error.message,
        timeCost: Date.now() - startTime,
        data: '',
        ext: '',
      });

      // 退出失败
      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: error.code,
        desc: error.message
      });
    });

    // 如果与互动课堂互通
    if (this.classModel.compatSaas) {
      this.ticWebIm.quitChatGroup();
    }
  },

  /**
   * 销毁课堂
   * @param classId			课堂ID，由业务生成和维护
   * @param callback			回调
   */
  destroyClassroom(classId, callback) {
    let startTime = Date.now();

    // 销毁课堂-start
    this.log.report(LogReport.EVENT_NAME.DELETEGROUP_START, {
      errorCode: 0,
      errorDesc: '',
      timeCost: Date.now() - startTime,
      data: classId + '',
      ext: '',
    });

    this.ticWebIm.destroyGroup(classId).then(data => {
      this.ticWebRTC && this.ticWebRTC.quit();
      this.ticBoard && this.ticBoard.clearAll();
      this.ticBoard && this.ticBoard.quit();

      // 销毁课堂-start
      this.log.report(LogReport.EVENT_NAME.DELETEGROUP_END, {
        errorCode: 0,
        errorDesc: '',
        timeCost: Date.now() - startTime,
        data: classId + '',
        ext: '',
      });

      // 销毁成功
      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: 0
      });
    }).catch(error => {
      // 销毁课堂-end
      this.log.report(LogReport.EVENT_NAME.DELETEGROUP_END, {
        errorCode: error.code,
        errorDesc: error.message,
        timeCost: Date.now() - startTime,
        data: classId + '',
        ext: '',
      });

      // 销毁失败
      callback && callback({
        module: Constant.TICModule.TICMODULE_IMSDK,
        code: error.code,
        desc: error.message
      });
    });
  },

  /**
   * 发送C2C文本消息
   * @param userId			消息接收者
   * @param text				文本消息内容
   * @param callback			回调
   */
  sendTextMessage(userId, text, callback) {
    this.ticWebIm.sendC2CTextMessage(userId, text).then(() => {
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
    this.ticWebIm.sendC2CCustomMessage(userId, data).then(() => {
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
   * 发送群文本消息
   * @param text				文本消息内容
   * @param callback			回调
   */
  sendGroupTextMessage(text, callback) {
    this.ticWebIm.sendGroupTextMessage(text).then(() => {
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
  sendGroupCustomMessage(text, callback) {
    this.ticWebIm.sendGroupCustomMessage(text).then(() => {
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
   * @desc 获取白板实例
   * @return {Board} board 返回白板实例
   */
  getBoardInstance() {
    return this.ticBoard.getInstance();
  },

  /**
   * @desc 获取IM实例, 初始化TICKSDK后即可获得IM实例
   * @return {webim} im 返回IM实例
   */
  getImInstance() {
    return this.ticWebIm.getInstance();
  },

  /**
   * @desc  获取trtc client 实例
   * @return {WebRTC} cos 返回WebRTC实例
   */
  getTrtcClient() {
    return this.ticWebRTC && this.ticWebRTC.getInstance();
  },

  /**
   * 添加IM消息监听回调
   * @param listener			回调
   */
  addTICMessageListener(listener) {
    this.messageListener.addTICMessageListener(listener);
  },

  /**
   * 移除IM消息监听回调
   * @param listener			回调
   */
  removeTICMessageListener(listener) {
    this.messageListener.removeTICMessageListener(listener);
  },

  /**
   * 添加事件监听回调
   * @param listener			回调
   */
  addTICEventListener(listener) {
    this.eventListener.addTICEventListener(listener);
  },

  /**
   * 移除事件监听回调
   * @param listener			回调
   */
  removeTICEventListener(listener) {
    this.eventListener.removeTICEventListener(listener);
  },

  /**
   * 添加IM状态监听回调
   * @param listener			回调
   */
  addTICStatusListener(listener) {
    this.statusListener.addTICStatusListener(listener);
  },

  /**
   * 移除IM状态监听回调
   * @param listener			回调
   */
  removeTICStatusListener(listener) {
    this.statusListener.removeTICStatusListener(listener);
  }
};

export default TIC