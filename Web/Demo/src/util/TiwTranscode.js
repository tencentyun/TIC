import Config from '../config';
export default {

  transcodeIntervalMap: {},
  taskIdUserDataMap: {},
  instance: null,

  getInstance() {
    if (!this.instance) {
      this.instance = window.axios.create({
        timeout: 5000,
      });
    }
    return this.instance;
  },

  createTranscodeTask({ Url, IsStaticPPT }, callback) {
    // Config.createTranscodeUrl 对应服务端接口的实现参考 https://cloud.tencent.com/document/product/1137/40060
    this.getInstance().post(Config.createTranscodeUrl, {
      SdkAppId: Config.sdkAppId,
      Url,
      IsStaticPPT,
      ThumbnailResolution: '200x200',
    })
      .then((res) => {
        if (res.data.Error) {
          callback({
            code: res.data.Error.Code,
            message: res.data.Error.Message,
            status: 'ERROR',
          });
        } else {
          const taskId = res.data.TaskId;
          this.transcodeIntervalMap[taskId] = setInterval(() => {
          // 查询进度
            this.describeTranscodeTask(taskId, callback);
          }, 5000);
          this.taskIdUserDataMap[taskId] = {};
        }
      })
      .catch((err) => {
        callback({
          status: 'ERROR',
          code: 'FailedOperation.SdkModule',
          message: `upload file failure, ${err.message}`,
        });
      });
  },

  describeTranscodeTask(taskId, callback) {
    // Config.describeTranscodeUrl 对应服务端接口的实现参考 https://cloud.tencent.com/document/product/1137/40059
    this.getInstance().post(Config.describeTranscodeUrl, {
      SdkAppId: Config.sdkAppId,
      TaskId: taskId,
    })
      .then((res) => {
        if (res.data.Error) {
          callback({
            status: 'ERROR',
            code: res.data.Error.Code,
            message: res.data.Error.Message,
            taskId,
            userData: this.taskIdUserDataMap[taskId],
            fileData: {}
          });
          clearInterval(this.transcodeIntervalMap[taskId]);
        } else {
          callback({
            status: 'SUCCESS',
            code: 0,
            message: '',
            taskId,
            userData: this.taskIdUserDataMap[taskId],
            fileData: res.data,
          });
          if (res.data.Status === 'FINISHED') {
            clearInterval(this.transcodeIntervalMap[taskId]);
          }
        }
      })
      .catch((err) => {
        callback({
          status: 'ERROR',
          code: 'FailedOperation.SdkModule',
          message: `transcode failure, ${err.message}`,
          taskId,
          userData: this.taskIdUserDataMap[taskId],
          fileData: {}
        });
        clearInterval(this.transcodeIntervalMap[taskId]);
      });
  },
};
