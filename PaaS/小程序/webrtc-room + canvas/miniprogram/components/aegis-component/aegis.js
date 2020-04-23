import Aegis from '@tencent/aegis-mp-sdk';

/**
 * aegis 日志服务模块，支持离线拉取日志，小程序有请求的限频，比较适用于小程序场景
 */
class AegisComponent {
  constructor(sdkAppId, userId, offlineLog = true) {
    this.delayTime = 5;
    this.delayData = [];
    this.platform = 'miniprogram-native';
    this.aegis = new Aegis({
      id: 2090, // 项目ID
      uin: `${sdkAppId}_${userId}`
    })
    this.startDelayReportTask();
  }

  startDelayReportTask() {
    setInterval(() => {
      if (this.delayData.length) {
        this.report('delayReport', {
          data: this.delayData
        });
        this.delayData = [];
      }
    }, this.delayTime * 1000);
  }

  delayReport(action, message = '') {
    if (this.delayData.length && action.indexOf('touchmove') > -1) {
      let lastAction = this.delayData[this.delayData.length - 1];
      if (lastAction && lastAction['touchmove']) { // 如果最后一个节点不是touchmove, 则丢弃本次上报
        return
      }
    }
    this.delayData.push({
      [action]: message
    });
  }

  report(action, msg = {}) {
    msg = Object.assign(msg, {
      action,
      platform: this.platform,
      errorCode: 0,
      errorMessage: ''
    });
    this.aegis.report(msg);
  }

  reportError(errorCode, errorMessage, action, msg = {}) {
    msg = Object.assign(msg, {
      action,
      platform: this.platform,
      errorCode: errorCode,
      errorMessage: errorMessage
    });
    this.aegis.report(msg);
  }
}

module.exports = AegisComponent