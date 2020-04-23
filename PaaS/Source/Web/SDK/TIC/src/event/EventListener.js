function EventListener() {
  this.listenerList = [];
}

EventListener.prototype.addTICEventListener = function (listener) {
  this.listenerList.push(listener);
}


EventListener.prototype.removeTICEventListener = function (listener) {
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
}

EventListener.prototype.fireEvent = function (eventName, ...data) {
  this.listenerList.forEach(listener => {
    var callback = listener[eventName];
    callback && callback(...data)
  });
}

export default EventListener;