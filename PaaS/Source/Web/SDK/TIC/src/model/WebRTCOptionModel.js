function WebRTCOptionModel() {
  this.role = null;
  this.privateMapKey = null;
  this.pureAudioPushMod = null;
  this.recordId = null;
  this.peerAddNotify = null;
  this.classScene = null;
}

WebRTCOptionModel.prototype.setData = function (data) {
  Object.assign(this, data);
}

export default WebRTCOptionModel;