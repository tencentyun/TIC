import Constant from '../constant/Constant';

function TICWebRTC(accountModel, webRTCOptionModel) {
  this.accountModel = accountModel;
  this.webRTCOptionModel = webRTCOptionModel;
  this.trtcClient = null;
}

TICWebRTC.prototype.getInstance = function () {
  return this.trtcClient;
}

TICWebRTC.prototype.setLog = function (log) {
  return this.log = log;
}

TICWebRTC.prototype.quit = function (succ, fail) {
  if (this.trtcClient) {
    this.trtcClient.leave().then(succ).catch(fail);
    this.trtcClient = null;
  }
}

TICWebRTC.prototype.joinAvRoom = function (succ = function () {}, fail = function () {}) {
  const client = this.trtcClient = TRTC.createClient({
    sdkAppId: this.accountModel.sdkAppId,
    userId: this.accountModel.userId,
    userSig: this.accountModel.userSig,
    mode: this.webRTCOptionModel.mode === Constant.TICClassScene.TIC_CLASS_SCENE_LIVE ? 'live' : 'videoCall',
    recordId: this.webRTCOptionModel.recordId,
    pureAudioPushMod: this.webRTCOptionModel.pureAudioPushMod
  });

  this.eventListener.fireEvent('onTICTrtcClientCreated');

  this.initEvent();

  let joinOption = {
    roomId: Number(this.accountModel.classId),
    privateMapKey: this.webRTCOptionModel.privateMapKey,
  }
  if (this.webRTCOptionModel.mode === 1) { // 大房间
    // 如果是主播，则用主播角色，否则都是观众角色
    if (this.webRTCOptionModel.role === Constant.TICRoleType.TIC_ROLE_TYPE_ANCHOR) {
      joinOption['role'] = 'anchor';
    } else {
      joinOption['role'] = 'audience';
    }
  }
  this.trtcClient.join(joinOption).then(succ).catch(fail);
}

TICWebRTC.prototype.initEvent = function () {
  // 通过监听‘stream-added’事件获得远端流对象
  this.trtcClient.on('stream-added', event => {
    const remoteStream = event.stream;
    this._reportTRTCEvent('stream-added', remoteStream);
  });

  // 监听‘stream-removed’事件
  this.trtcClient.on('stream-removed', event => {
    const remoteStream = event.stream;
    this._reportTRTCEvent('stream-removed', remoteStream);
  });

  // 监听‘stream-updated’事件
  this.trtcClient.on('stream-updated', event => {
    const remoteStream = event.stream;
    this._reportTRTCEvent('stream-updated', remoteStream);
  });

  // 监听‘stream-subscribed’事件
  this.trtcClient.on('stream-subscribed', event => {
    const remoteStream = event.stream;
    this._reportTRTCEvent('stream-subscribed', remoteStream);
  });

  this.trtcClient.on('connection-state-changed', event => {
    this._reportTRTCEvent('connection-state-changed', event);
  });

  this.trtcClient.on('peer-join', event => {
    this._reportTRTCEvent('peer-join', event);
  });

  this.trtcClient.on('peer-leave', event => {
    this._reportTRTCEvent('peer-leave', event);
  });

  this.trtcClient.on('mute-audio', event => {
    this._reportTRTCEvent('mute-audio', event);
  });

  this.trtcClient.on('mute-video', event => {
    this._reportTRTCEvent('mute-video', event);
  });

  this.trtcClient.on('unmute-audio', event => {
    this._reportTRTCEvent('unmute-audio', event);
  });

  this.trtcClient.on('unmute-video', event => {
    this._reportTRTCEvent('unmute-video', event);
  });

  this.trtcClient.on('client-banned', error => {
    this.statusListener.fireEvent('onTICForceOffline', error);
    this._reportTRTCEvent('client-banned', error);
  });

  this.trtcClient.on('error', error => {
    this._reportTRTCEvent('error', error);
  });
}

TICWebRTC.prototype.setStatusListener = function (listener) {
  this.statusListener = listener;
}

TICWebRTC.prototype.setEventListener = function (eventListener) {
  this.eventListener = eventListener;
}

TICWebRTC.prototype._reportTRTCEvent = function (eventName, object) {
  let extObj = {};
  for (const key in object) {
    let value = object[key];
    if (typeof value != 'object') {
      extObj[key] = value;
    }
  }
  this.log.report(eventName, {
    errorCode: 0,
    errorDesc: '',
    timeCost: 0,
    data: '',
    ext: JSON.stringify(extObj),
  });
}

export default TICWebRTC;