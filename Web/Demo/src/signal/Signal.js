import { mapActions, mapState } from 'vuex';
import Util from '../util/Util';
import TIM from 'tim-js-sdk';

export default {
  computed: {
    ...mapState(['classInfo']),
  },

  data() {
    return {
      tim: null,
      sendMessageStatus: {},
    };
  },

  mounted() {
    this.$EventBus.$on('tiw-send-sync-data', this.sendBoardRealtimeDataMessage);
  },

  async beforeDestroy() {
    await Util.awaitWrap(this.quitSignal());
  },

  methods: {
    ...mapActions(['setSignalReady']),

    onSdkReady(callback) {
      return () => {
        callback();
      };
    },

    async joinSignal() {
      return new Promise(async (resolve, reject) => {
        // 1. 创建互动白板实时同步的数据通道对象
        this._createTIMClient();
        // 监听事件，例如：
        this.tim.on(TIM.EVENT.SDK_READY, this.onSdkReady(resolve));

        // 2. 登录
        const [error] = await Util.awaitWrap(this._timClientLogin());
        if (error) {
          reject(error);
          return;
        }
      });
    },

    async createAndJoinSignal() {
      return new Promise(async (resolve, reject) => {
        // 3. 加入课堂（需要先加入课堂所在的IM群组）
        let error;
        [error] = await Util.awaitWrap(this._joinTimGroup());
        if (error) {
          if (error.code === 10015 || error.code === 10010) {
            [error] = await Util.awaitWrap(this._createTimGroup()); // feature: 群组不存在, 则创建群组
            if (error) {
              reject(error);
              return;
            }
            [error] = await Util.awaitWrap(this._joinTimGroup());
            if (error) {
              reject(error);
              return;
            }
          } else {
            reject(error);
            return;
          }
        }
        resolve();
      });
    },

    async quitSignal() {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.tim) {
            console.log('Signal _uninitTimEvent');
            this.tim.off(TIM.EVENT.MESSAGE_RECEIVED, this._onMessageReceived);
            this.tim.off(TIM.EVENT.ERROR, this._onTIMError);
            this.tim.off(TIM.EVENT.KICKED_OUT, this._onTIMKickout);
            this.tim.off(TIM.EVENT.NET_STATE_CHANGE, this._onTIMNetChange);
            this.tim.off(TIM.EVENT.SDK_READY, this.onSdkReady);
            this.tim.logout();
            await this.tim.destroy();
            this.tim = null;
          }
          resolve('logout success');
        } catch (error) {
          reject(error);
        }
      });
    },

    _createTIMClient() {
      this.setSignalReady(false);
      this.tim = TIM.create({
        SDKAppID: this.classInfo.sdkAppId,
      }); // SDK 实例通常用 tim 表示
      this.tim.setLogLevel(1); // 设置日志级别
      this._initTimEvent();
    },

    _timClientLogin() {
      return this.tim.login({ userID: this.classInfo.userId, userSig: this.classInfo.userSig });
    },

    _createTimGroup() {
      const groupId = String(this.classInfo.classId);
      const options = {
        name: groupId,
        groupID: groupId,
        type: TIM.TYPES.GRP_PUBLIC,
        joinOption: TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS,  // 自由加入,不需要审批
      };
      return this.tim.createGroup(options).then(() => Promise.resolve(), (error) => {
        if (error.code === 10025) { // 群组 ID 已被使用，并且操作者为群主，可以直接使用。
          return Promise.resolve();
        }
        return Promise.reject(error);
      });
    },

    _joinTimGroup() {
      const groupId = String(this.classInfo.classId);
      return this.tim.joinGroup({
        groupID: groupId,
        type: TIM.TYPES.GRP_PUBLIC,
      }).then((res) => {
        switch (res.data.status) {
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            return Promise.resolve();
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意,业务上认为失败
          default:
            return Promise.reject(res);
        }
      }, (error) => {
        if (error.code === 10013) { // 被邀请加入的用户已经是群成员,也表示成功
          return Promise.resolve();
        }
        if (error.code === -12) { // Join Group succeed; But the type of group is not AVChatRoom
          return Promise.resolve();
        }
        return Promise.reject(error);
      });
    },

    _onTIMError(event) {
      this.$toasted.error(`TIM SDK出现错误，code:${event.data.code}, message:${event.data.message}`);
    },

    async _onTIMKickout(event) {
      const { type } = event.data;
      let tipText = '';
      console.warn('_onTIMKickout:', event);
      switch (type) {
        case TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
          tipText = '多实例登录被踢';
          break;
        case TIM.TYPES.KICKED_OUT_MULT_DEVICE:
          tipText = '多终端登录被踢';
          break;
        case TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          tipText = '签名过期被踢';
          break;
        default:
          tipText = '被踢下线了';
          break;
      }
      this.$toasted.error(tipText, {
        duration: 5000
      });
      this.$store.commit('classInfo', {
        userId: null,
        classId: null,
        userSig: null,
      });
      this.$store.commit('setSignalReady', false);
      try {
        await Util.awaitWrap(this.quitSignal());
      } catch (e) {
        console.error(e);
      }
      this.tim = null;
      this.$router.push('/login');
    },

    _onTIMNetChange() {

    },

    _initTimEvent() {
      console.log('Signal _initTimEvent');
      this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this._onMessageReceived);

      this.tim.on(TIM.EVENT.KICKED_OUT, this._onTIMKickout);

      this.tim.on(TIM.EVENT.NET_STATE_CHANGE, this._onTIMNetChange);
    },

    _onMessageReceived(event) {
      const messages = event.data;
      const groupId = String(this.classInfo.classId);
      messages.forEach((message) => {
        // 群组消息
        if (message.conversationType === TIM.TYPES.CONV_GROUP) {
          if (message.to === groupId) { // 如果是当前群组
            const elements = message.getElements();
            if (elements.length) {
              elements.forEach(async (element) => {
                if (element.type === 'TIMCustomElem') { // 自定义消息
                  if (element.content.extension === 'TXWhiteBoardExt') { // 是白板的自定义消息
                    if (message.from != this.userId) { // 并且发消息的人不是自己
                      // 设置为同步，保证实时数据在Sketch能够watch到
                      this.$EventBus.$emit('tiw-recv-sync-data', element.content.data);
                    }
                  }
                }
              });
            }
          } else {
            // 其他群组消息自行处理，在互动白板的场景中可以忽略其他群组的消息
          }
        } else if (message.conversationType === TIM.TYPES.CONV_C2C) { // C2C消息
          // c2c消息在互动白板的场景中可以直接忽略
        }
      });
    },

    async sendBoardRealtimeDataMessage(data) {
      if (!this.tim) return;
      const groupId = String(this.classInfo.classId);
      const message = this.tim.createCustomMessage({
        to: groupId,
        conversationType: TIM.TYPES.CONV_GROUP,
        priority: TIM.TYPES.MSG_PRIORITY_HIGH,  // 因为im消息有限频，白板消息的优先级调整为最高
        payload: {
          data: JSON.stringify(data),
          description: '',
          extension: 'TXWhiteBoardExt',
        },
      });

      const [error] = await Util.awaitWrap(this.tim.sendMessage(message));
      if (error) {
        this.sendMessageStatus[message.ID] = {
          resendCount: 0,
        }; // 重试次数
        this.resendBoardRealtimeDataMessage(message);
      }
    },

    async resendBoardRealtimeDataMessage(message) {
      console.log('>>>> resendBoardRealtimeDataMessage:', this.sendMessageStatus[message.ID].resendCount);
      const [error] = await Util.awaitWrap(this.tim.resendMessage(message));
      if (error && this.sendMessageStatus[message.ID]) {
        this.sendMessageStatus[message.ID].resendCount += 1; // 重试次数+1
        if (this.sendMessageStatus[message.ID].resendCount > 2) { // 重试3次后
          this.$toasted.error('白板实时信令同步失败');
        }
      } else {
        // 成功后，删除状态
        delete this.sendMessageStatus[message.ID];
      }
    },
  },
};
