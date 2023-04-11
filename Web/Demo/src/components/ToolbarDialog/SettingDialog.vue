<template>
  <div class="setting-dialog__container">
    <v-dialog v-if="showDialog" v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title class="headline lighten-2">
          <v-tabs v-model="settingType">
            <v-tab v-for="item in settingTabs" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </v-card-title>
        <v-card-text>
          <v-tabs-items v-model="settingType">
            <v-tab-item>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].drawEnable"
                    label="允许涂鸦"
                    hide-details
                    @change="setDrawEnable"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].dataSyncEnable"
                    label="开启数据同步"
                    hide-details
                    @change="setDataSyncEnable"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].handwritingEnable"
                    label="开启笔锋"
                    hide-details
                    @change="setHandwritingEnable"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].showRemoteCursor"
                    label="显示远端画笔"
                    hide-details
                    @click="setRemoteCursorVisible"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].enableMultiTouch"
                    label="开启多点触控(只有触摸屏才有效)"
                    hide-details
                    @click="setEnableMultiTouch"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.whiteBoard"
                    label="允许鼠标点击普通白板翻页"
                    hide-details
                    @change="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.h5PPT"
                    label="允许鼠标点击H5PPT翻页"
                    hide-details
                    @change="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.imgPPT"
                    label="允许鼠标点击静态PPT翻页"
                    hide-details
                    @change="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.imgFile"
                    label="允许鼠标点击图片组文件翻页"
                    hide-details
                    @click="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-sheet
                v-for="(stat, index) in authorityStatus"
                :key="stat.text"
              >
                <v-switch
                  v-model="stat.value"
                  :label="stat.text"
                  @change="(e) => onAuthorityChange(index, e)"
                ></v-switch>
                <v-sheet>
                  <v-row>
                    <v-col
                      cols="3"
                      v-for="cmd in authorityCmd[index]"
                      :key="cmd.value"
                    >
                      <v-checkbox
                        v-model="allowCmdList[index]"
                        :label="cmd.text"
                        :value="cmd.value"
                        :disabled="!stat.value"
                        dense
                        @change="(e) => onAuthorityCmdChange(index, e)"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-sheet>
                <v-divider />
              </v-sheet>
            </v-tab-item>
          </v-tabs-items>
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
      settingType: null,
      settingTabs: ["基础设置", "鼠标行为设置", "权限校验设置"],
      settingItems: [
        {
          drawEnable: true,
          handwritingEnable: true,
          showRemoteCursor: true,
          dataSyncEnable: true,
          enableMultiTouch: false,
        },
        {
          turnPage: {
            whiteBoard: true,
            h5PPT: true,
            imgPPT: true,
            imgFile: true,
          },
        },
      ],
      authorityCmd: [
        [
          {
            text: "设置背景颜色",
            value: "Background::Update::Color",
          },
          {
            text: "设置背景Frame",
            value: "Background::Update::Frame",
          },
          {
            text: "设置背景图片",
            value: "Background::Update::Image",
          },
        ],
        [
          {
            text: "添加文件",
            value: "File::Add::*",
          },
          {
            text: "删除文件",
            value: "File::Delete::*",
          },
          {
            text: "清空文件",
            value: "File::Clear::*",
          },
          {
            text: "切换文件",
            value: "File::Switch::*",
          },
          {
            text: "更新文件",
            value: "File::Update::*",
          },
        ],
        [
          {
            text: "添加白板",
            value: "Board::Add::*",
          },
          {
            text: "清空白板",
            value: "Board::Clear::*",
          },
          {
            text: "删除白板",
            value: "Board::Delete::*",
          },
          {
            text: "缩放白板",
            value: "Board::Scale::*",
          },
          {
            text: "切换白板",
            value: "Board::Switch::Page",
          },
          {
            text: "切换动画步数",
            value: "Board::Switch::Step",
          },
          {
            text: "更新白板内容填充模式",
            value: "Board::Update::ContentFitMode",
          },
          {
            text: "更新白板比例",
            value: "Board::Update::Ratio",
          },
          {
            text: "撤销",
            value: "Board::Undo::*",
          },
          {
            text: "重做",
            value: "Board::Redo::*",
          },
        ],
        [
          {
            text: "添加元素",
            value: "Element::Add::*",
          },
          {
            text: "删除元素",
            value: "Element::Delete::*",
          },
          {
            text: "更新元素",
            value: "Element::Update::*",
          },
          {
            text: "选择元素",
            value: "Element::Select::*",
          },
          {
            text: "移动元素",
            value: "Element::Move::*",
          },
          {
            text: "旋转元素",
            value: "Element::Rotate::*",
          },
          {
            text: "缩放元素",
            value: "Element::Scale::*",
          },
        ],
        [
          {
            text: "重置白板",
            value: "Instance::Reset::*",
          },
        ],
      ],

      allowCmdList: [
        [
          "Background::Update::Color",
          "Background::Update::Frame",
          "Background::Update::Image",
        ],
        [
          "File::Add::*",
          "File::Delete::*",
          "File::Clear::*",
          "File::Switch::*",
          "File::Update::*",
        ],
        [
          "Board::Add::*",
          "Board::Clear::*",
          "Board::Delete::*",
          "Board::Scale::*",
          "Board::Switch::Page",
          "Board::Switch::Step",
          "Board::Update::ContentFitMode",
          "Board::Update::Ratio",
          "Board::Undo::*",
          "Board::Redo::*",
        ],
        [
          "Element::Add::*",
          "Element::Delete::*",
          "Element::Update::*",
          "Element::Select::*",
          "Element::Move::*",
          "Element::Rotate::*",
          "Element::Scale::*",
        ],
        ["Instance::Reset::*"],
      ],

      authorityStatus: [
        {
          text: "启用背景类权限校验",
          value: false,
        },
        {
          text: "启用文件类权限校验",
          value: false,
        },
        {
          text: "启用白板类权限校验",
          value: false,
        },
        {
          text: "启用元素类权限校验",
          value: false,
        },
        {
          text: "启用实例权限校验",
          value: false,
        },
      ],
    };
  },
  watch: {
    settingItems: {
      handler() {
        this.updateSetting();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    show() {
      this.showDialog = true;
    },
    setDrawEnable() {
      window.teduBoard.setDrawEnable(this.settingItems[0].drawEnable);
    },
    setHandwritingEnable() {
      window.teduBoard.setHandwritingEnable(
        this.settingItems[0].handwritingEnable
      );
    },

    setDataSyncEnable() {
      window.teduBoard.setDataSyncEnable(this.settingItems[0].dataSyncEnable);
    },

    setRemoteCursorVisible() {
      window.teduBoard.setRemoteCursorVisible(
        this.settingItems[0].showRemoteCursor
      );
    },

    setEnableMultiTouch() {
      const enable = this.settingItems[0].enableMultiTouch;
      window.teduBoard.enableMultiTouch(enable);
      window.teduBoard.setSyncFps(enable ? 10 : 5);
    },

    // 设置鼠标操作行为
    setMouseToolBehavior() {
      window.teduBoard.setMouseToolBehavior({
        turnPage: this.settingItems[1].turnPage,
      });
    },

    onAuthorityChange(index, enable) {
      if (enable) {
        const allowCmds = this.allowCmdList[index];
        const denyCmds = [];
        const totalCmds = this.authorityCmd[index];
        totalCmds.forEach((c) => {
          if (!allowCmds.includes(c.value)) {
            denyCmds.push(c.value);
          }
        });
        window.teduBoard.enablePermissionChecker(allowCmds, [
          "operator/" + window.teduBoard.identifier,
        ]);
        window.teduBoard.enablePermissionChecker(denyCmds, ["operator/"]);
      } else {
        const totalCmds = this.authorityCmd[index].map((c) => c.value);
        window.teduBoard.disablePermissionChecker(totalCmds);
      }
    },

    onAuthorityCmdChange(index, cmdList) {
      const enable = this.authorityStatus[index].value;
      if (enable) {
        const allowCmds = cmdList;
        const denyCmds = [];
        const totalCmds = this.authorityCmd[index];
        totalCmds.forEach((c) => {
          if (!allowCmds.includes(c.value)) {
            denyCmds.push(c.value);
          }
        });
        window.teduBoard.enablePermissionChecker(allowCmds, [
          "operator/" + window.teduBoard.identifier,
        ]);
        window.teduBoard.enablePermissionChecker(denyCmds, ["operator/"]);
      }
    },

    updateSetting() {
      this.$emit("updateSetting", this.settingItems);
    },
  },
};
</script>