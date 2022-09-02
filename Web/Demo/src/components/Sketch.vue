<template>
  <div class="sketch__wrap">
    <div id="sketch" ></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'Sketch',
  data() {
    return {
      teduBoard: null,
    };
  },
  watch: {
    '$store.state.receiveBoardRealtimeData'(value) {
      this.addSyncData(value);
    },

    '$store.state.isSignalReady'(value) {
      if (value) {
        // 信令通道准备好了后，则开始初始化白板
        this.initBoard();
        this.initEvent();
      }
    },
  },

  mounted() {
    this.$EventBus.$on('tiw-recv-sync-data', this.addSyncData);
  },

  methods: {
    ...mapActions(['setCurrentFile', 'updateBoardSetting']),
    initBoard() {
      this.destroyBoard();
      const { classInfo } = this.$store.state;
      this.teduBoard = new window.TEduBoard({
        id: 'sketch',
        sdkAppId: classInfo.sdkAppId,
        userId: classInfo.userId,
        userSig: classInfo.userSig,
        classId: classInfo.classId,
        config: {
          boardContentFitMode: TEduBoard.TEduBoardContentFitMode.TEDU_BOARD_FILE_FIT_MODE_CENTER_INSIDE,
        },

        styleConfig: {
          brushThin: 50,
          selectBoxColor: '#888',
          selectAnchorColor: '#888',
        },

        authConfig: {
          mathGraphEnable: true,
          formulaEnable: true,
        },
      });
      // 设置橡皮擦自定义图标
      this.teduBoard.setCursorIcon(TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER, {
        cursor: 'url',
        url: 'http://test-1259648581.cos.ap-shanghai.myqcloud.com/image/eraser_32.svg',
        offsetX: 16,
        offsetY: 16,
      });

      // 设置画笔自定义图标
      this.teduBoard.setCursorIcon(TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN, {
        cursor: 'url',
        url: 'https://demo.qcloudtiw.com/web/latest/lead-pencil.svg',
        offsetX: 2,
        offsetY: 10,
      });
      window.teduBoard = this.teduBoard;
    },

    initEvent() {
      // 监听错误事件
      this.teduBoard.on(
        TEduBoard.EVENT.TEB_ERROR,
        (errorCode, errorMessage) => {
          console.log(
            '======================:  ',
            'TEB_ERROR',
            ' errorCode:',
            errorCode,
            ' errorMessage:',
            errorMessage,
          );
          let message = '';
          switch (errorCode) {
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_INIT:
              message = '初始化失败，请重试';
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_AUTH:
              message = '服务鉴权失败，请先购买服务';
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_LOAD:
              message = '白板加载失败，请重试';
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_HISTORYDATA:
              message = '同步历史数据失败，请重试';
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_RUNTIME:
              message = '白板运行错误，请检查sdkAppId，userId, userSig是否正确';
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_AUTH_TIMEOUT:
              message = '服务鉴权超时，请重试';
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_MAX_BOARD_LIMITED:
              message = '单课堂内白板页数已经到达上限';
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_SIGNATURE_EXPIRED:
              message = 'userSig过期了，请重新生成新的userSig，再重新初始化白板';
              break;
          }
          this.$toasted.error(message, {
            duration: 5000
          });
          this.$store.commit('setSignalReady', false);
          this.$router.push('/login');
        },
      );

      // 监听警告事件
      this.teduBoard.on(
        TEduBoard.EVENT.TEB_WARNING,
        (warnCode, warnMessage) => {
          console.log(
            '======================:  ',
            'TEB_WARNING',
            ' warnCode:',
            warnCode,
            ' warnMessage:',
            warnMessage,
          );
        },
      );

      // 白板历史数据同步完成回调
      this.teduBoard.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
        console.log(
          '======================:  ',
          'TEB_HISTROYDATA_SYNCCOMPLETED',
        );
        this.setCurrentFile(this.teduBoard.getFileInfo(this.teduBoard.getCurrentFile()));
        // 设置开启笔锋
        this.teduBoard.setHandwritingEnable(true);
        // 设置开启点击擦除
        this.teduBoard.setPiecewiseErasureEnable(true);
        // 白板已经ready了
        this.$store.commit('setTiwReady', true);
      });

      this.teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, (data) => {
        this.$EventBus.$emit('tiw-send-sync-data', data);
      });

      // 切换文件回调
      this.teduBoard.on(TEduBoard.EVENT.TEB_SWITCHFILE, (fid) => {
        this.setCurrentFile(this.teduBoard.getFileInfo(fid));
      });

      // 跳转白板页回调
      this.teduBoard.on(TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
        this.setCurrentFile(this.teduBoard.getFileInfo(fid));
      });

      // 缩放白板页回调
      this.teduBoard.on('TEB_ZOOM_DRAG_STATUS', ({ boardId, scale }) => {
        console.log({ boardId, scale });
        this.setCurrentFile(this.teduBoard.getFileInfo());
      });

      // 转码进度
      this.teduBoard.on(TEduBoard.EVENT.TEB_TRANSCODEPROGRESS, (res) => {
        if (res.code) {
          this.showErrorTip(`转码失败code:${res.code} message:${res.message}`);
        } else {
          const { status } = res;
          if (status === TEduBoard.TEduBoardTranscodeFileStatus.TEDU_BOARD_TRANSCODEFILE_STATUS_ERROR) {
            this.showErrorTip('转码失败');
          } else if (status === TEduBoard.TEduBoardTranscodeFileStatus.TEDU_BOARD_TRANSCODEFILE_STATUS_UPLOADING) {
            this.showTip(`上传中，当前进度:${parseInt(res.progress)}%`);
          } else if (status === TEduBoard.TEduBoardTranscodeFileStatus.TEDU_BOARD_TRANSCODEFILE_STATUS_CREATED) {
            this.showTip('创建转码任务');
          } else if (status === TEduBoard.TEduBoardTranscodeFileStatus.TEDU_BOARD_TRANSCODEFILE_STATUS_QUEUED) {
            this.showTip('正在排队等待转码');
          } else if (status === TEduBoard.TEduBoardTranscodeFileStatus.TEDU_BOARD_TRANSCODEFILE_STATUS_PROCESSING) {
            this.showTip(`转码中，当前进度:${res.progress}%`);
          } else if (status === TEduBoard.TEduBoardTranscodeFileStatus.TEDU_BOARD_TRANSCODEFILE_STATUS_FINISHED) {
            this.showTip('转码完成');
            const config = {
              url: res.resultUrl,
              title: res.title,
              pages: res.pages,
              resolution: res.resolution,
            };
            this.teduBoard.addTranscodeFile(config);
          }
        }
      });
    },

    destroyBoard() {
      if (this.teduBoard) {
        // 如果白板存在，则先销毁掉，避免页面多个白板对象
        this.teduBoard.destroy();
        this.$store.commit('setTiwReady', false);
      }
    },

    addSyncData(realtimeData) {
      if (this.teduBoard) {
        this.teduBoard.addSyncData(realtimeData);
      }
    },

    showTip(tip) {
      this.$toasted.show(tip);
    },

    showErrorTip(tip) {
      this.$toasted.error(tip);
    },
  },
  beforeDestroy() {
    this.destroyBoard();
  },
};
</script>

<style lang="less" scoped>
.sketch__wrap {
  width: 100vw;
  height: 100vh;
}

#sketch {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f4f5f8;
  overflow: hidden;
}
</style>
