<template>
  <div class="courseware-dialog_container">
    <v-dialog v-if="showDialog" v-model="showDialog" max-width="1000">
      <v-card>
        <v-card-title class="headline lighten-2"> 课件转码 </v-card-title>
        <v-card-text>
          <v-alert text type="info">
            1. ppt默认转码为动态转码，即保留ppt中的动画效果。<br />
            2. word，pdf只能转换为静态图片，ppt也可以设置转换为静态图片。<br />
          </v-alert>

          <v-row>
            <v-col cols="12" md="8">
              <v-radio-group v-model="transcodeMode" row>
                <v-radio label="主转码" :value="0"></v-radio>
                <v-radio label="备份转码" :value="1"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <v-btn
                prepend-icon="mdi-cloud-upload"
                @click="showTranscodeDialog"
                >点我选择文件</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="showTranscodeFileDialog"
      v-model="showTranscodeFileDialog"
      max-width="800"
    >
      <v-stepper v-model="uploadSteps" vertical>
        <v-stepper-step :complete="uploadSteps > 1" step="1">
          上传文件到COS桶{{ transcodeMode === 1 ? "(需开通文档预览)" : "" }}
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-file-input
            v-model="transcodeFileObj"
            label="先点我选择上传课件"
            prepend-icon="mdi-file"
            accept=".doc,.docx,.ppt,.pptx,.pdf"
          ></v-file-input>
          <v-btn
            @click="uploadTranscodeFile"
            :loading="transcodeFileUploading"
            color="primary"
            >上传</v-btn
          >
        </v-stepper-content>

        <v-stepper-step :complete="uploadSteps > 2" step="2">
          {{
            transcodeMode === 1
              ? "获取文件COS地址并拼接白板参数"
              : "发起转码任务"
          }}
        </v-stepper-step>

        <v-stepper-content step="2" v-if="transcodeMode === 1">
          <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px"
            >备份转码课件url:</span
          >
          <p style="word-break: break-all">
            {{ this.courseware.url }}
          </p>
          <v-text-field
            v-model="courseware.title"
            label="课件名称"
          ></v-text-field>

          <v-btn color="primary" @click="addTranscodeFile"> 确认添加 </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2" v-else>
          <div v-if="!transcodeStart">
            <v-radio-group v-model="transcodeStaticMode" row>
              <v-radio
                label="动态转码(暂时只支持ppt,pptx)"
                :value="false"
              ></v-radio>
              <v-radio label="静态转码" :value="true"></v-radio>
            </v-radio-group>

            <v-btn color="primary" @click="createTranscodeTask()">
              开始转码
            </v-btn>
          </div>

          <div v-else>
            <div class="mb-4">
              <v-alert type="error" v-if="transcodeErrMsg.status === 'ERROR'">
                <h4>{{ transcodeErrMsg.code }}</h4>
                {{ transcodeErrMsg.message }}
              </v-alert>

              <v-progress-linear
                v-else
                class="mb-2"
                stream
                buffer-value="0"
                v-model="transcodePercent"
                height="25"
                :color="transcodePercent === 100 ? 'success' : 'primary'"
              >
                <strong>{{ transcodePercent }}%</strong>
              </v-progress-linear>

              <div v-if="transcodePercent === 100">
                <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px"
                  >转码文件名</span
                >
                <p style="word-break: break-all">
                  {{ courseware.title }}
                </p>
                <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px"
                  >转码文件地址</span
                >
                <p style="word-break: break-all">
                  {{ courseware.url }}
                </p>
                <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px"
                  >文件页数</span
                >
                <p style="word-break: break-all">
                  {{ courseware.pages }}
                </p>
                <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px"
                  >分辨率</span
                >
                <p style="word-break: break-all">
                  {{ courseware.resolution }}
                </p>
              </div>
            </div>

            <v-btn
              color="primary"
              :disabled="transcodePercent !== 100"
              @click="addTranscodeFile"
            >
              确认添加
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper>
    </v-dialog>
  </div>
</template>

<script>
import TiwTranscode from "../../util/TiwTranscode";
import Config from "../../config";

export default {
  data() {
    return {
      showDialog: false,
      courseware: {
        title: "课件",
        url: "",
        resolution: "",
        pages: 0,
      },
      transcodeMode: 0, // 0 主转码，1 备份转码
      uploadSteps: 1, // 转码步骤
      showTranscodeFileDialog: false,
      transcodeFileUploading: false,
      transcodeFileObj: {},
      transcodeStart: false,
      transcodePercent: 0,
      transcodeStaticMode: false,
      transcodeErrMsg: {
        staus: "SUCCESS",
        code: "",
        error: "",
      },
    };
  },

  mounted() {
    this.cosInstance = new window.COS({
      // 本地生成密钥（不推荐线上使用）
      SecretId: Config.tencentSecretId,
      SecretKey: Config.tencentSectetKey,
    });
  },

  methods: {
    show() {
      this.showDialog = true;
    },

    showTranscodeDialog() {
      this.showTranscodeFileDialog = true;
      this.uploadSteps = 1;
    },

    addTranscodeFile() {
      if (this.transcodeMode === 1) {
        // 备份转码
        window.teduBoard.addTranscodeFile({
          url: this.courseware.url,
          title: this.courseware.title || `测试文件-${Date.now()}`,
        });
      } else {
        // 主转码
        window.teduBoard.addTranscodeFile({
          url: this.courseware.url,
          title: this.courseware.title || `测试文件-${Date.now()}`,
          pages: this.courseware.pages,
          resolution: this.courseware.resolution,
        });
      }

      // 重置数据
      this.transcodeFileObj = null;

      this.courseware.url = null;
      this.courseware.title = null;
      this.courseware.pages = 0;
      this.courseware.resolution = "";

      this.showDialog = false;
      this.uploadSteps = 1;
      this.showTranscodeFileDialog = false;
    },

    viewDoc() {
      window.open(
        "https://cloud.tencent.com/document/product/1137/55888",
        "_blank"
      );
    },

    /**
     * 备份转码方案
     */
    uploadTranscodeFile() {
      if (!this.transcodeFileObj) return;

      if (
        !Config.tencentSecretId ||
        !Config.tencentSectetKey ||
        !Config.cosBucket ||
        !Config.cosRegion ||
        !Config.createTranscodeUrl ||
        !Config.describeTranscodeUrl
      ) {
        this.$toasted.error('请先填写文档转码相关的配置');
        return;
      }

      this.transcodeFileUploading = true;
      this.cosInstance.putObject(
        {
          Bucket: Config.cosBucket /* 必须 */,
          Region: Config.cosRegion /* 存储桶所在地域，必须字段 */,
          Key: this.transcodeFileObj.name /* 必须 */,
          StorageClass: "STANDARD",
          Body: this.transcodeFileObj, // 上传文件对象
          onProgress: (progressData) => {
            if (progressData.percent === 1) {
              this.transcodeFileUploading = false;
              this.uploadSteps = 2;
              this.transcodeStart = false;
              this.transcodeErrMsg.status = "SUCCESS";
              this.transcodePercent = 0;
            }
          },
        },
        async (err, data) => {
          if (!err) {
            const cosUrl = `https://${data.Location}`;
            if (this.transcodeMode === 1) {
              // 备份转码
              this.courseware.url = `${cosUrl}?for_tiw=1`;
              this.courseware.title = this.transcodeFileObj.name;
              this.showTranscodeDialog = false; // 如果是备份转码
            } else {
              // 主转码
              this.courseware.url = cosUrl;
            }
          }
        }
      );
    },

    createTranscodeTask() {
      this.transcodeStart = true;
      TiwTranscode.createTranscodeTask(
        {
          Url: this.courseware.url,
          IsStaticPPT: this.transcodeStaticMode,
        },
        (data) => {
          if (data.status === "SUCCESS") {
            this.transcodePercent = data.fileData.Progress;
            this.transcodeErrMsg.status = "SUCCESS";
            if (this.transcodePercent === 100) {
              this.courseware.url = `${data.fileData.ResultUrl}`;
              this.courseware.urlName = `${data.fileData.Title}`;
              this.courseware.pages = `${data.fileData.Pages}`;
              this.courseware.resolution = `${data.fileData.Resolution}`;
            }
          } else {
            this.transcodeErrMsg = {
              status: "ERROR",
              code: data.code,
              message: data.message,
            };
          }
        }
      );
    },
  },
};
</script>