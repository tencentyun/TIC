<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="1000">
    <v-card>
      <v-card-title class="headline lighten-2"> 水印元素 </v-card-title>
      <v-card-text>
        <v-tabs v-model="watermarkElementTab">
          <v-tab>图片水印</v-tab>
          <v-tab>静态文字水印</v-tab>
          <v-tab>动态文字水印</v-tab>
          <v-tab>水印元素管理</v-tab>
        </v-tabs>
        <v-row>
          <v-col cols="12" md="12">
            <v-tabs-items v-model="watermarkElementTab">
              <!-- 图片水印 -->
              <v-tab-item>
                <v-form ref="watermarkForm">
                  <v-row>
                    <v-col cols="4" md="6">
                      <v-text-field
                        v-model.number="elementParams['watermark'].content"
                        :rules="rules.urlRule"
                        label="图片水印url"
                        hint="请输入https协议的图片url"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="2">
                      <v-text-field
                        v-model.number="elementParams['watermark'].left"
                        :rules="[
                          loanMinRule(elementParams['watermark'].left, 0),
                          loanMaxRule(elementParams['watermark'].left, 1000),
                        ]"
                        label="左边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="2">
                      <v-text-field
                        v-model.number="elementParams['watermark'].top"
                        :rules="[
                          loanMinRule(elementParams['watermark'].top, 0),
                          loanMaxRule(elementParams['watermark'].top, 500),
                        ]"
                        label="上边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" md="2">
                      <v-text-field
                        v-model.number="elementParams['watermark'].width"
                        :rules="[
                          loanMinRule(elementParams['watermark'].width, 10),
                          loanMaxRule(elementParams['watermark'].width, 200),
                        ]"
                        label="宽度"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="2">
                      <v-text-field
                        v-model.number="elementParams['watermark'].height"
                        :rules="[
                          loanMinRule(elementParams['watermark'].height, 10),
                          loanMaxRule(elementParams['watermark'].height, 200),
                        ]"
                        label="高度"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" md="4">
                      <v-subheader class="pl-0">
                        透明度(范围[0.1, 1])
                      </v-subheader>
                      <v-slider
                        v-model.number="elementParams['watermark'].opacity"
                        step="0.1"
                        max="1"
                        min="0.1"
                        :thumb-size="32"
                        thumb-label="always"
                      ></v-slider>
                    </v-col>
                  </v-row>
                </v-form>
              </v-tab-item>
              <!-- 静态文字水印 -->
              <v-tab-item>
                <v-form ref="textWatermarkFixForm">
                  <v-row>
                    <v-col cols="4" md="6">
                      <v-text-field
                        counter="20"
                        v-model.number="
                          elementParams['textWatermarkFix'].content
                        "
                        label="文字水印"
                        hint="文字水印内容"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4" md="2">
                      <v-text-field
                        v-model.number="elementParams['textWatermarkFix'].deg"
                        :rules="[
                          loanMinRule(elementParams['textWatermarkFix'].deg, 0),
                          loanMaxRule(
                            elementParams['textWatermarkFix'].deg,
                            360
                          ),
                        ]"
                        label="旋转角度"
                        suffix="度"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4" md="4">
                      <v-subheader class="pl-0">
                        透明度(范围[0.1, 1])
                      </v-subheader>
                      <v-slider
                        v-model.number="
                          elementParams['textWatermarkFix'].opacity
                        "
                        step="0.1"
                        max="1"
                        min="0.1"
                        :thumb-size="32"
                        thumb-label="always"
                      ></v-slider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-text-field
                        v-model.number="
                          elementParams['textWatermarkFix'].textSize
                        "
                        label="字号"
                        suffix="px"
                        :rules="[
                          loanMinRule(
                            elementParams['textWatermarkFix'].textSize,
                            12
                          ),
                          loanMaxRule(
                            elementParams['textWatermarkFix'].textSize,
                            48
                          ),
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-color-picker
                        label="颜色"
                        v-model="elementParams['textWatermarkFix'].color"
                        canvas-height="60"
                        width="300"
                        hide-inputs
                        mode="hexa"
                        flat
                      ></v-color-picker>
                    </v-col>
                  </v-row>
                </v-form>
              </v-tab-item>
              <!-- 动态文字水印 -->
              <v-tab-item>
                <v-form ref="textWatermarkForm">
                  <v-row>
                    <v-col cols="4" md="6">
                      <v-text-field
                        counter="20"
                        v-model.number="elementParams['textWatermark'].content"
                        label="文字水印"
                        hint="文字水印内容"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4" md="2">
                      <v-text-field
                        v-model.number="elementParams['textWatermark'].deg"
                        :rules="[
                          loanMinRule(elementParams['textWatermark'].deg, 0),
                          loanMaxRule(elementParams['textWatermark'].deg, 360),
                        ]"
                        label="旋转角度"
                        suffix="度"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4" md="4">
                      <v-subheader class="pl-0">
                        透明度(范围[0.1, 1])
                      </v-subheader>
                      <v-slider
                        v-model.number="elementParams['textWatermark'].opacity"
                        step="0.1"
                        max="1"
                        min="0.1"
                        :thumb-size="32"
                        thumb-label="always"
                      ></v-slider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <v-text-field
                        v-model.number="elementParams['textWatermark'].interval"
                        label="位置变化间隔"
                        suffix="ms"
                        :rules="[
                          loanMinRule(
                            elementParams['textWatermark'].interval,
                            1000
                          ),
                          loanMaxRule(
                            elementParams['textWatermark'].interval,
                            10000
                          ),
                        ]"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="2">
                      <v-text-field
                        v-model.number="elementParams['textWatermark'].textSize"
                        label="字号"
                        suffix="px"
                        :rules="[
                          loanMinRule(
                            elementParams['textWatermark'].textSize,
                            12
                          ),
                          loanMaxRule(
                            elementParams['textWatermark'].textSize,
                            48
                          ),
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-color-picker
                        label="颜色"
                        v-model="elementParams['textWatermark'].color"
                        canvas-height="60"
                        width="300"
                        hide-inputs
                        mode="hexa"
                        flat
                      ></v-color-picker>
                    </v-col>
                  </v-row>
                </v-form>
              </v-tab-item>
              <v-tab-item>
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  @click="deleteWatermark(TEduBoard.TEduWatermarkType.Image)"
                >
                  删除图片水印
                </v-btn>
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  @click="deleteWatermark(TEduBoard.TEduWatermarkType.TextFix)"
                >
                  删除静态文本水印
                </v-btn>
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  @click="deleteWatermark(TEduBoard.TEduWatermarkType.Text)"
                >
                  删除动态文本水印
                </v-btn>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="addElement">添加</v-btn>
        <v-btn
          v-if="
            (watermarkElementTab === 1 && hasTextFixWatermark) ||
            (watermarkElementTab === 2 && hasTextWatermark)
          "
          color="primary"
          text
          @click="updateElement"
          >修改(暂不支持角度和时间间隔)</v-btn
        >
        <v-btn text @click="showDialog = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      watermarkElementTab: null,
      elementParams: {
        watermark: {
          title: "图片水印",
          content: "https://test-1259648581.file.myqcloud.com/image/logo.png",
          left: "10",
          top: "10",
          width: "100",
          height: "74",
          opacity: 0.8,
        },

        textWatermarkFix: {
          title: "静态文字水印",
          content: "",
          deg: 0,
          textSize: 16,
          opacity: 0.8,
          color: "#FF0000",
          interval: 5000,
        },

        textWatermark: {
          title: "动态文字水印",
          content: "",
          deg: 0,
          textSize: 16,
          opacity: 0.8,
          color: "#FF0000",
          interval: 5000,
        },
      },
      rules: {
        urlRule: [
          (v) => !!v || "url is required",
          (v) => /^https:\/\//.test(v) || "url必须是https协议",
        ],
      },
    };
  },

  computed: {
    hasTextWatermark() {
      return !!window.teduBoard.getElementById(
        TEduBoard.TEduWatermarkType.Text
      );
    },

    hasTextFixWatermark() {
      return !!window.teduBoard.getElementById(
        TEduBoard.TEduWatermarkType.TextFix
      );
    },
  },
  watch: {
    watermarkElementTab(tabIndex) {
      if (tabIndex === 0) {
        return;
      }
      if (tabIndex === 1) {
        const element = window.teduBoard.getElementById(
          TEduBoard.TEduWatermarkType.TextFix
        );
        if (element) {
          this.elementParams.textWatermarkFix = {
            title: "静态文字水印",
            content: element.content,
            deg: element.deg,
            textSize: element.textSize,
            opacity: element.opacity,
            color: element.style.fillColor,
            interval: element.interval,
          };
        }
      } else if (tabIndex === 2) {
        const element = window.teduBoard.getElementById(
          TEduBoard.TEduWatermarkType.Text
        );
        if (element) {
          this.elementParams.textWatermark = {
            title: "动态文字水印",
            content: element.content,
            deg: element.deg,
            textSize: element.textSize,
            opacity: element.opacity,
            color: element.style.fillColor,
            interval: element.interval,
          };
        }
      }
    },
  },

  methods: {
    loanMinRule(value, min) {
      return (value || "") >= min || `不能小于最小值 ${min}`;
    },
    loanMaxRule(value, max) {
      return (value || "") <= max || `不能大于最大值 ${max}`;
    },
    show() {
      this.showDialog = true;
    },
    addElement() {
      let type = "";
      if (this.watermarkElementTab === 0) {
        type = "watermark";
      } else if (this.watermarkElementTab === 1) {
        type = "textWatermarkFix";
      } else if (this.watermarkElementTab === 2) {
        type = "textWatermark";
      }

      switch (type) {
        case "watermark": {
          if (!this.$refs.watermarkForm.validate()) {
            return;
          }
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_WATERMARK,
            {
              content: `${this.elementParams.watermark.content}`,
              left: `${this.elementParams.watermark.left}px`,
              top: `${this.elementParams.watermark.top}px`,
              width: `${this.elementParams.watermark.width}px`,
              height: `${this.elementParams.watermark.height}px`,
              opacity: `${this.elementParams.watermark.opacity}`,
              fix: false,
            }
          );
          this.elementParams.watermark = {
            title: "学科公式",
            content: "https://test-1259648581.file.myqcloud.com/image/logo.png",
            left: "10",
            top: "10",
            width: "100",
            height: "74",
            opacity: 0.8,
          };
          break;
        }
        case "textWatermarkFix": {
          if (!this.$refs.textWatermarkFixForm.validate()) {
            return;
          }
          const params = {
            content: `${this.elementParams.textWatermarkFix.content}`,
            deg: this.elementParams.textWatermarkFix.deg,
            textSize: `${this.elementParams.textWatermarkFix.textSize}px`,
            color: `${this.elementParams.textWatermarkFix.color}`,
            fix: true,
            opacity: this.elementParams.textWatermarkFix.opacity,
          };
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_WATERMARK,
            params
          );
          this.elementParams.textWatermarkFix = {
            title: "文字水印",
            content: "",
            deg: 0,
            textSize: 16,
            opacity: 0.8,
            color: "#FF0000",
            interval: 5000,
          };
          break;
        }
        case "textWatermark": {
          if (!this.$refs.textWatermarkForm.validate()) {
            return;
          }
          const params = {
            content: `${this.elementParams.textWatermark.content}`,
            deg: this.elementParams.textWatermark.deg,
            textSize: `${this.elementParams.textWatermark.textSize}px`,
            color: `${this.elementParams.textWatermark.color}`,
            fix: false,
            opacity: this.elementParams.textWatermark.opacity,
            interval: this.elementParams.textWatermark.interval,
          };
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_WATERMARK,
            params
          );
          this.elementParams.textWatermark = {
            title: "文字水印",
            content: "",
            deg: 0,
            textSize: 16,
            opacity: 0.8,
            color: "#FF0000",
            interval: 5000,
          };
          break;
        }
      }
      this.showDialog = false;
    },

    deleteWatermark(watermarkType) {
      window.teduBoard.removeElement(watermarkType);
    },

    updateElement() {
      if (this.watermarkElementTab === 1) {
        // 修改内容
        window.teduBoard.updateElementById(
          TEduBoard.TEduWatermarkType.TextFix,
          {
            type: TEduBoard.TEduElementOperatorType.CONTENT,
            value: this.elementParams["textWatermarkFix"].content,
          }
        );
        // 修改透明度
        window.teduBoard.updateElementById(
          TEduBoard.TEduWatermarkType.TextFix,
          {
            type: TEduBoard.TEduElementOperatorType.OPACITY,
            value: this.elementParams["textWatermarkFix"].opacity,
          }
        );
        // 修改字号
        window.teduBoard.updateElementById(
          TEduBoard.TEduWatermarkType.TextFix,
          {
            type: TEduBoard.TEduElementOperatorType.CHANGE_TEXT_SIZE,
            value: this.elementParams["textWatermarkFix"].textSize + "px",
          }
        );
        // 修改颜色
        window.teduBoard.updateElementById(
          TEduBoard.TEduWatermarkType.TextFix,
          {
            type: TEduBoard.TEduElementOperatorType.BOARDER_COLOR,
            value: this.elementParams["textWatermarkFix"].color,
          }
        );
      } else if (this.watermarkElementTab === 2) {
        // 修改内容
        window.teduBoard.updateElementById(TEduBoard.TEduWatermarkType.Text, {
          type: TEduBoard.TEduElementOperatorType.CONTENT,
          value: this.elementParams["textWatermark"].content,
        });
        // 修改透明度
        window.teduBoard.updateElementById(TEduBoard.TEduWatermarkType.Text, {
          type: TEduBoard.TEduElementOperatorType.OPACITY,
          value: this.elementParams["textWatermark"].opacity,
        });
        // 修改字号
        window.teduBoard.updateElementById(TEduBoard.TEduWatermarkType.Text, {
          type: TEduBoard.TEduElementOperatorType.CHANGE_TEXT_SIZE,
          value: this.elementParams["textWatermark"].textSize + "px",
        });
        // 修改颜色
        window.teduBoard.updateElementById(TEduBoard.TEduWatermarkType.Text, {
          type: TEduBoard.TEduElementOperatorType.BOARDER_COLOR,
          value: this.elementParams["textWatermark"].color,
        });
      }
      this.showDialog = false;
    },
  },
};
</script>