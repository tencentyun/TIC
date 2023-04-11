<template>
  <div class="sketch__wrap">
    <div id="sketch"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Sketch",
  data() {
    return {
      teduBoard: null,
      elementOperationAuthority: {},
    };
  },
  watch: {
    "$store.state.isSignalReady"(value) {
      if (value) {
        // 信令通道准备好了后，则开始初始化白板
        this.initBoard();
        this.initEvent();
      }
    },
  },

  mounted() {
    this.$EventBus.$on("tiw-recv-sync-data", this.addSyncData);
    this.elementOperationAuthority = JSON.parse(
      localStorage.getItem("elementOperationAuthority")
    );
  },

  methods: {
    ...mapActions(["setCurrentFile", "updateBoardSetting"]),
    initBoard() {
      this.destroyBoard();
      const { classInfo } = this.$store.state;
      this.teduBoard = new TEduBoard({
        id: "sketch",
        sdkAppId: classInfo.sdkAppId,
        userId: classInfo.userId,
        userSig: classInfo.userSig,
        classId: classInfo.classId,
        config: {
          boardContentFitMode:
            TEduBoard.TEduBoardContentFitMode
              .TEDU_BOARD_FILE_FIT_MODE_CENTER_INSIDE,
        },

        userConfig: {
          nickname: classInfo.nickname,
        },

        styleConfig: {
          brushThin: 50,
          selectBoxColor: "#888",
          selectAnchorColor: "#888",
        },

        authConfig: {
          mathGraphEnable: true,
          formulaEnable: true,
          elementOperationAuthority: this.elementOperationAuthority,
        },
      });
      // 设置橡皮擦自定义图标
      this.teduBoard.setCursorIcon(
        TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER,
        {
          cursor: "url",
          url: "http://test-1259648581.cos.ap-shanghai.myqcloud.com/image/eraser_32.svg",
          offsetX: 16,
          offsetY: 16,
        }
      );

      // 设置画笔自定义图标
      this.teduBoard.setCursorIcon(
        TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN,
        {
          cursor: "url",
          url: "https://demo.qcloudtiw.com/web/latest/lead-pencil.svg",
          offsetX: 2,
          offsetY: 10,
        }
      );
      window.teduBoard = this.teduBoard;
    },

    initEvent() {
      // 监听错误事件
      this.teduBoard.on(
        TEduBoard.EVENT.TEB_ERROR,
        (errorCode, errorMessage) => {
          console.log(
            "======================:  ",
            "TEB_ERROR",
            " errorCode:",
            errorCode,
            " errorMessage:",
            errorMessage
          );
          let message = "";
          switch (errorCode) {
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_INIT:
              message = "初始化失败，请重试";
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_AUTH:
              message = "服务鉴权失败，请先购买服务";
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_LOAD:
              message = "白板加载失败，请重试";
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_HISTORYDATA:
              message = "同步历史数据失败，请重试";
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_RUNTIME:
              message = "白板运行错误，请检查sdkAppId，userId, userSig是否正确";
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_ERROR_AUTH_TIMEOUT:
              message = "服务鉴权超时，请重试";
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_MAX_BOARD_LIMITED:
              message = "单课堂内白板页数已经到达上限";
              break;
            case TEduBoard.TEduBoardErrorCode.TEDU_BOARD_SIGNATURE_EXPIRED:
              message =
                "userSig过期了，请重新生成新的userSig，再重新初始化白板";
              break;
          }
          this.$toasted.error(message, {
            duration: 5000,
          });
          this.$store.commit("setSignalReady", false);
          this.$router.push("/login");
        }
      );

      // 监听警告事件
      this.teduBoard.on(
        TEduBoard.EVENT.TEB_WARNING,
        (warnCode, warnMessage) => {
          console.warn(
            "======================:  ",
            "TEB_WARNING",
            " warnCode:",
            warnCode,
            " warnMessage:",
            warnMessage
          );

          let message = "";
          switch (warnCode) {
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_SYNC_DATA_PARSE_FAILED:
              message = "实时数据格式错误，请检查白板信令是否有进行二次包装";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_H5PPT_ALREADY_EXISTS:
              message = "重复添加文件";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WANNING_ILLEGAL_OPERATION:
              message = "非法操作，请在历史数据完成回调后再调用sdk相关接口";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_H5FILE_ALREADY_EXISTS:
              message = "重复添加文件";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_VIDEO_ALREADY_EXISTS:
              message = "重复添加文件";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_IMAGESFILE_ALREADY_EXISTS:
              message = "重复添加文件";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_GRAFFITI_LOST:
              message = "涂鸦丢失";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_CUSTOM_GRAPH_URL_NON_EXISTS:
              message = "自定义图形url为空";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_IMAGESFILE_TOO_LARGE:
              message = "图片组超大";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_IMAGE_COURSEWARE_ALREADY_EXISTS:
              message = "重复添加文件";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_IMAGE_MEDIA_BITRATE_TOO_LARGE:
              message =
                "多媒体资源码率大于2048kb/s，网络不好情况下容易造成卡顿，建议对视频码率进行压缩";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_IMAGE_WATERMARK_ALREADY_EXISTS:
              message = "已经存在图片水印，不能重复添加";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_FORMULA_LIB_NOT_LOADED:
              message = "数学公式库没有重新加载";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_ILLEGAL_FORMULA_EXPRESSION:
              message = "非法的数学公式";
              break;
            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_TEXT_WATERMARK_ALREADY_EXISTS:
              message = "已经存在文本水印，不能重复添加";
              break;

            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_EXPORTIMPORT_FILTERRULE_ILLEGAL:
              message = "已经存在文本水印，不能重复添加";
              break;

            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_ELEMENTTYPE_NOT_EXISTS:
              message = "元素类型不存在";
              break;

            case TEduBoard.TEduBoardWarningCode
              .TEDU_BOARD_WARNING_ELEMENTID_NOT_EXISTS:
              message = "元素ID不存在";
              break;
          }
          this.showErrorTip(message);
          console.warn(message);
        }
      );

      // 白板历史数据同步完成回调
      this.teduBoard.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
        console.log(
          "======================:  ",
          "TEB_HISTROYDATA_SYNCCOMPLETED"
        );
        this.setCurrentFile(
          this.teduBoard.getFileInfo(this.teduBoard.getCurrentFile())
        );
        // 设置开启笔锋
        this.teduBoard.setHandwritingEnable(true);
        // 设置开启点击擦除
        this.teduBoard.setPiecewiseErasureEnable(true);
        // 白板已经ready了
        this.$store.commit("setTiwReady", true);
      });

      this.teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, (data) => {
        this.$EventBus.$emit("tiw-send-sync-data", data);
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
      this.teduBoard.on(
        TEduBoard.EVENT.TEB_ZOOM_DRAG_STATUS,
        ({ boardId, scale }) => {
          console.log({ boardId, scale });
          this.setCurrentFile(this.teduBoard.getFileInfo());
        }
      );

      // 监听视频播放状态
      this.teduBoard.on(TEduBoard.EVENT.TEB_VIDEO_STATUS_CHANGED, (data) => {
        if (
          data.status ===
          TEduBoard.TEduBoardVideoStatus.TEDU_BOARD_VIDEO_STATUS_ERROR
        ) {
          this.showErrorTip("视频播放/加载失败");
          console.error("视频播放/加载失败");
        }
      });

      // 转码进度
      this.teduBoard.on(TEduBoard.EVENT.TEB_TRANSCODEPROGRESS, (res) => {
        if (res.code) {
          this.showErrorTip(`转码失败code:${res.code} message:${res.message}`);
        } else {
          const { status } = res;
          if (
            status ===
            TEduBoard.TEduBoardTranscodeFileStatus
              .TEDU_BOARD_TRANSCODEFILE_STATUS_ERROR
          ) {
            this.showErrorTip("转码失败");
          } else if (
            status ===
            TEduBoard.TEduBoardTranscodeFileStatus
              .TEDU_BOARD_TRANSCODEFILE_STATUS_UPLOADING
          ) {
            this.showTip(`上传中，当前进度:${parseInt(res.progress)}%`);
          } else if (
            status ===
            TEduBoard.TEduBoardTranscodeFileStatus
              .TEDU_BOARD_TRANSCODEFILE_STATUS_CREATED
          ) {
            this.showTip("创建转码任务");
          } else if (
            status ===
            TEduBoard.TEduBoardTranscodeFileStatus
              .TEDU_BOARD_TRANSCODEFILE_STATUS_QUEUED
          ) {
            this.showTip("正在排队等待转码");
          } else if (
            status ===
            TEduBoard.TEduBoardTranscodeFileStatus
              .TEDU_BOARD_TRANSCODEFILE_STATUS_PROCESSING
          ) {
            this.showTip(`转码中，当前进度:${res.progress}%`);
          } else if (
            status ===
            TEduBoard.TEduBoardTranscodeFileStatus
              .TEDU_BOARD_TRANSCODEFILE_STATUS_FINISHED
          ) {
            this.showTip("转码完成");
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

      // 操作权限
      this.teduBoard.on(TEduBoard.EVENT.TEB_BOARD_PERMISSION_DENIED, () => {
        this.showErrorTip("无操作权限");
      });

      // 调用importInLocalMode接口导入数据完成后的回调
      this.teduBoard.on(
        TEduBoard.EVENT.TEB_BOARD_IMPORTINLOCALMODE_COMPLETED,
        (code) => {
          if (code === 0) {
            this.showTip("导入数据成功");
          } else {
            this.showErrorTip("导入数据失败");
          }
        }
      );

      // 监听截图事件，image为截图内容的base64数据
      this.teduBoard.on(TEduBoard.EVENT.TEB_SNAPSHOT, ({ image }) => {
        const downloadEl = document.createElement("a");
        const event = new MouseEvent("click");
        downloadEl.download = Date.now() + ".png";
        downloadEl.href = image;
        downloadEl.dispatchEvent(event);
      });
    },

    destroyBoard() {
      if (this.teduBoard) {
        // 如果白板存在，则先销毁掉，避免页面多个白板对象
        this.teduBoard.destroy();
        this.teduBoard = null;
        this.$store.commit("setTiwReady", false);
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
