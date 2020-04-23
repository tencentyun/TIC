var MessageListener = {
  listenerList: [],

  // 增加消息监听
  addTICMessageListener(listener) {
    this.listenerList.push(listener);
  },

  removeTICMessageListener(listener) {
    if (listener) {
      var index = -1;
      for (var i = 0, len = this.listenerList.length; i < len; i++) {
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
  },

  fireEvent(eventName, ...data) {
    this.listenerList.forEach(listener => {
      var callback = listener[eventName];
      callback && callback(...data)
    });
  }
}

module.exports = MessageListener;