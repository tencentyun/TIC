<template>
  <div>
    <v-dialog v-if="showDialog" v-model="showDialog" max-width="1000">
      <v-card>
        <v-card-title class="headline lighten-2"> 白板元素 </v-card-title>
        <v-card-text>
          <v-tabs v-model="elementTab">
            <v-tab>图片元素</v-tab>
            <v-tab>H5元素</v-tab>
            <v-tab>数学画板元素</v-tab>
            <v-tab>数学函数图像元素</v-tab>
            <v-tab>几何图形</v-tab>
            <v-tab>学科公式</v-tab>
          </v-tabs>
          <v-row>
            <v-col cols="12" md="12">
              <v-tabs-items v-model="elementTab">
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="elementParams['imageElement'].file"
                        label="图片元素URL"
                        prepend-icon="mdi-image"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['imageElement'].left"
                        label="左边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['imageElement'].top"
                        label="上边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="elementParams['h5Element'].file"
                        label="H5元素URL"
                        prepend-icon="mdi-language-html5"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['h5Element'].left"
                        label="左边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['h5Element'].top"
                        label="上边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="elementParams['mathBoard'].opts.width"
                        label="宽度"
                        suffix="px"
                        prepend-icon="mdi-cog-outline"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['mathBoard'].opts.height"
                        label="高度"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['mathBoard'].opts.axisColor"
                        label="颜色"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['mathBoard'].left"
                        label="左边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['mathBoard'].top"
                        label="上边距"
                        suffix="px"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="elementParams['mathGraph'].opts.mathBoardId"
                        :items="mathBoardIds"
                        label="函数画板ID"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="elementParams['mathGraph'].opts.expression"
                        label="函数表达式"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['mathGraph'].opts.color"
                        label="函数图像颜色"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="elementParams['mathGraph'].opts.selectedColor"
                        label="选中高亮颜色"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="elementParams['mathGraphType'].type"
                        :items="mathGraphTypes"
                        item-text="label"
                        item-value="value"
                        label="几何图像类型"
                      ></v-select>
                    </v-col>
                    <v-col cols="6" md="4">
                      <v-btn
                        rounded
                        color="primary"
                        dark
                        small
                        @click="setMathGraphType"
                        >设置</v-btn
                      >
                    </v-col>
                    <v-col cols="18" md="4">
                      使用此功能，需要先在白板上添加数学画板，然后在数学画板上进行点击操作，则会绘制出对应的图形
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <!-- 数学公式 -->
                  <v-form ref="formulaForm">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="elementParams['formula'].expression"
                          :rules="[(value) => !!value || '必填']"
                          label="latex公式"
                          prepend-icon="mdi-function-variant"
                          readonly
                          @click="
                            (formulaEditorDialog = true), (loadingEditor = true)
                          "
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model.number="elementParams['formula'].left"
                          :rules="[
                            loanMinRule(elementParams['formula'].left, 0),
                            loanMaxRule(elementParams['formula'].left, 99),
                          ]"
                          label="左边距"
                          suffix="%"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model.number="elementParams['formula'].top"
                          :rules="[
                            loanMinRule(elementParams['formula'].top, 0),
                            loanMaxRule(elementParams['formula'].top, 99),
                          ]"
                          label="上边距"
                          suffix="%"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-switch
                          v-model="elementParams['formula'].erasable"
                          label="是否可以擦除"
                        ></v-switch>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2">
                        <v-text-field
                          v-model.number="elementParams['formula'].fontSize"
                          label="字号"
                          suffix="px"
                          :rules="[
                            loanMinRule(elementParams['formula'].fontSize, 12),
                            loanMaxRule(elementParams['formula'].fontSize, 48),
                          ]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-color-picker
                          v-model="elementParams['formula'].fontColor"
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
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="elementTab !== 4"
            color="primary"
            text
            @click="addElement"
            >添加</v-btn
          >
          <v-btn text @click="showDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="formulaEditorDialog"
      v-model="formulaEditorDialog"
      max-width="1050"
    >
      <v-card>
        <v-card-title>
          公式编辑器
          <a
            class="ml-4 primary--text text-subtitle-2"
            style="position: absolute; right: 32px"
            @click="
              window.open(
                'https://demo.qcloudtiw.com/web/latest/res/tiw-formula-editor.zip'
              )
            "
          >
            点击此处可下载源码
          </a>
        </v-card-title>
        <v-card-text>
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
            v-if="loadingEditor"
            style="
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              z-index: 1000;
            "
          ></v-progress-circular>
          <iframe
            src="https://demo.qcloudtiw.com/web/latest/formula-editor/examples/basic-usage.html"
            width="1000"
            height="500"
            style="border: none"
            allow="clipboard-read; clipboard-write"
            @load="formulaEditorOnload"
            v-if="formulaEditorDialog"
            ref="formual-editor-ref"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      elementParams: {
        imageElement: {
          title: "图片元素",
          file: "",
          left: "",
          right: "",
        },
        h5Element: {
          title: "H5元素",
          file: "",
          left: "",
          right: "",
        },
        mathBoard: {
          title: "数学画板元素",
          opts: {
            axisColor: "#AEAEAE",
            width: "600",
            height: "600",
          },
          left: "",
          right: "",
        },
        mathGraph: {
          title: "数学函数图像元素",
          opts: {
            mathBoardId: "",
            expression: "",
            color: "#ff0000",
            selectedColor: "#00ff00",
          },
          left: "",
          right: "",
        },
        mathGraphType: {
          title: "几何图形",
          type: null,
        },
        formula: {
          title: "学科公式",
          expression: "",
          erasable: true, // 是否可以擦除
          left: "10",
          top: "10",
          fontSize: 16,
          fontColor: "#000000FF",
        },
      },
      elementTab: null,
      mathBoardIds: [],
      mathGraphTypes: [
        {
          label: "选中",
          value: TEduBoard.TEduBoardMathGraphType.NONE,
        },
        {
          label: "点",
          value: TEduBoard.TEduBoardMathGraphType.POINT,
        },
        {
          label: "直线",
          value: TEduBoard.TEduBoardMathGraphType.LINE,
        },
        {
          label: "线段",
          value: TEduBoard.TEduBoardMathGraphType.LINE_SEGMENT,
        },
        {
          label: "射线",
          value: TEduBoard.TEduBoardMathGraphType.RAY,
        },
        {
          label: "圆",
          value: TEduBoard.TEduBoardMathGraphType.CIRCLE,
        },
        {
          label: "角",
          value: TEduBoard.TEduBoardMathGraphType.ANGLE,
        },
        {
          label: "多边形",
          value: TEduBoard.TEduBoardMathGraphType.POLYGON,
        },
        {
          label: "向量",
          value: TEduBoard.TEduBoardMathGraphType.VECTOR,
        },
        {
          label: "椭圆",
          value: TEduBoard.TEduBoardMathGraphType.ELLIPSE,
        },
        {
          label: "立方体",
          value: TEduBoard.TEduBoardMathGraphType.CUBE,
        },
        {
          label: "圆柱体",
          value: TEduBoard.TEduBoardMathGraphType.CYLINDER,
        },
        {
          label: "圆锥体",
          value: TEduBoard.TEduBoardMathGraphType.CIRCULAR_CONE,
        },
      ],
      formulaEditorDialog: false,
      loadingEditor: true,
    };
  },

  watch: {
    "$store.state.current.fileInfo": {
      handler() {
        this.mathBoardIds = window.teduBoard
          .getBoardElementList()
          .filter(
            (i) =>
              i.type ===
              TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_BOARD
          )
          .map((i) => i.elementId);
      },
      deep: true,
    },
    elementTab(val) {
      if (val === 3) {
        this.mathBoardIds = window.teduBoard
          .getBoardElementList()
          .filter(
            (i) =>
              i.type ===
              TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_BOARD
          )
          .map((i) => i.elementId);
      }
    },
  },

  mounted() {
    window.addEventListener("message", (event) => {
      try {
        const recvData = event.data;
        const isString =
          Object.prototype.toString.call(recvData) === "[object String]";
        const data = isString ? JSON.parse(recvData) : recvData;
        if (data.cmd === "tedu-formula-data") {
          this.elementParams.formula.expression = data.data;
          this.formulaEditorDialog = false;
          this.loadingEditor = true;
        }
      } catch (e) {
        // console.error(e);
      }
    });
  },

  methods: {
    show() {
      this.showDialog = true;
    },
    loanMinRule(value, min) {
      return (value || "") >= min || `不能小于最小值 ${min}`;
    },
    loanMaxRule(value, max) {
      return (value || "") <= max || `不能大于最大值 ${max}`;
    },
    addElement() {
      let type = "";
      if (this.elementTab === 0) {
        type = "imageElement";
      } else if (this.elementTab === 1) {
        type = "h5Element";
      } else if (this.elementTab === 2) {
        type = "mathBoard";
      } else if (this.elementTab === 3) {
        type = "mathGraph";
      } else if (this.elementTab === 5) {
        type = "formula";
      }

      switch (type) {
        case "h5Element": {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          const opt = {};
          if (this.elementParams.h5Element.left) {
            opt.left = this.elementParams.h5Element.left;
          }
          if (this.elementParams.h5Element.top) {
            opt.top = this.elementParams.h5Element.top;
          }
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_H5,
            this.elementParams.h5Element.file,
            opt
          );
          this.elementParams.h5Element.file = null;
          this.elementParams.h5Element.left = "";
          this.elementParams.h5Element.top = "";
          break;
        }
        case "imageElement": {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          const opt = {};
          if (this.elementParams.imageElement.left) {
            opt.left = this.elementParams.imageElement.left;
          }
          if (this.elementParams.imageElement.top) {
            opt.top = this.elementParams.imageElement.top;
          }
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_IMAGE,
            this.elementParams.imageElement.file,
            opt
          );
          this.elementParams.imageElement.file = null;
          this.elementParams.imageElement.left = "";
          this.elementParams.imageElement.top = "";
          break;
        }
        case "mathBoard": {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          const opt = {};
          if (this.elementParams.mathBoard.left) {
            opt.left = this.elementParams.mathBoard.left;
          }
          if (this.elementParams.mathBoard.top) {
            opt.top = this.elementParams.mathBoard.top;
          }
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_BOARD,
            this.elementParams.mathBoard.opts,
            opt
          );
          this.elementParams.mathBoard.opts = {
            axisColor: "#AEAEAE",
            width: "600",
            height: "400",
          };
          this.elementParams.mathBoard.left = "";
          this.elementParams.mathBoard.top = "";
          break;
        }
        case "mathGraph": {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_GRAPH,
            this.elementParams.mathGraph.opts
          );
          this.elementParams.mathGraph.opts = {
            mathBoardId: "",
            expression: "",
            color: "#ff0000",
            selectedColor: "#00ff00",
          };
          this.elementParams.mathGraph.left = "";
          this.elementParams.mathGraph.top = "";
          break;
        }

        case "formula": {
          if (!this.$refs.formulaForm.validate()) {
            return;
          }
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_FORMULA,
            {
              expression: this.elementParams.formula.expression,
            },
            {
              erasable: this.elementParams.formula.erasable,
              left: `${this.elementParams.formula.left}%`,
              top: `${this.elementParams.formula.top}%`,
              fontSize: `${this.elementParams.formula.fontSize}px`,
              fontColor: `${this.elementParams.formula.fontColor}`,
            }
          );
          this.elementParams.formula = {
            title: "学科公式",
            expression: "",
            erasable: true, // 是否可以擦除
            left: 10,
            top: 10,
            fontSize: 16,
            fontColor: "#000000FF",
          };
          break;
        }
      }
      this.showDialog = false;
    },
    // 设置数学工具
    setMathGraphType() {
      window.teduBoard.setMathGraphType(
        this.elementParams.mathGraphType.type,
        true
      );
    },

    formulaEditorOnload() {
      this.loadingEditor = false;
      const expression = this.elementParams.formula.expression;
      if (expression) {
        this.$refs["formual-editor-ref"].contentWindow.postMessage(
          {
            module: "tiw",
            expression: expression,
          },
          "https://demo.qcloudtiw.com/web/latest/formula-editor/examples/basic-usage.html"
        );
      }
    },
  },
};
</script>