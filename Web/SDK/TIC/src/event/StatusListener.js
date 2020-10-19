function StatusListener() {
  this.listenerList = [];
}

// 增加消息监听
StatusListener.prototype.addTICStatusListener = function (listener) {
  this.listenerList.push(listener);
};

StatusListener.prototype.removeTICStatusListener = function (listener) {
  if (listener) {
    let index = -1;
    for (let i = 0, len = this.listenerList.length; i < len; i++) {
      if (listener == this.listenerList[i]) {
        index = i;
      }
    }
    if (index > -1) {
      this.listenerList.splice(index, 1);
    }
  } else {
    this.listenerList = [];
  }
};

StatusListener.prototype.fireEvent = function (eventName, ...data) {
  this.listenerList.forEach((listener) => {
    const callback = listener[eventName];
    callback && callback(...data);
  });
};

export default StatusListener;
