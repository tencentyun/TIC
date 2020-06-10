import LogReport from '../log/LogReport'

function WebBoard(accountModel, boardOptionModel) {
  this.board = null;
  this.accountModel = accountModel;
  this.boardOptionModel = boardOptionModel;
}

WebBoard.prototype.getInstance = function () {
  return this.board;
}

WebBoard.prototype.setLog = function (log) {
  this.log = log;
}

WebBoard.prototype.render = function () {
  this.board = null;
  this.board = new TEduBoard(Object.assign({}, this.boardOptionModel, {
    classId: this.accountModel.classId,
    sdkAppId: this.accountModel.sdkAppId,
    userId: this.accountModel.userId + '',
    userSig: this.accountModel.userSig
  }));

  // 错误
  this.board.on(TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
    this.log.report(LogReport.EVENT_NAME.ONTEBERROR, {
      errorCode: code,
      errorDesc: msg,
      timeCost: 0,
      data: '',
      ext: '',
    });
  });

  // 历史数据加载完成
  this.board.on(TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
    this.log.report(LogReport.EVENT_NAME.ONTEBWARNING, {
      errorCode: code,
      errorDesc: msg,
      timeCost: 0,
      data: '',
      ext: '',
    });
  });

  // 历史数据加载完成
  this.board.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
    this.log.report(LogReport.EVENT_NAME.SYNCBOARDHISTORY_END, {
      errorCode: 0,
      errorDesc: '',
      timeCost: 0,
      data: '',
      ext: '',
    });
  });
}

WebBoard.prototype.addSyncDataEventCallback = function (callback) {
  this.board.on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
    callback && callback(data);
  });
}

WebBoard.prototype.addAckData = function (data) {
  if (this.board) {
    this.board.addAckData && this.board.addAckData(data);
  }
}

WebBoard.prototype.quit = function () {
  if (this.board) {
    this.board.destroy && this.board.destroy();
    this.board.off && this.board.off();
    this.board = null;
  }
}

// 清空课堂数据
WebBoard.prototype.clearAll = function () {
  if (this.board) {
    this.board && this.board.reset();
  }
}

export default WebBoard;