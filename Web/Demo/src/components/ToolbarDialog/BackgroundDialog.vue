<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="1000">
    <v-card>
      <v-card-title class="headline lighten-2"> 背景 </v-card-title>
      <v-card-text>
        <v-tabs v-model="backgroundTab">
          <v-tab>H5背景</v-tab>
          <v-tab>图片背景</v-tab>
          <v-tab>修改图片背景角度</v-tab>
        </v-tabs>
        <v-row>
          <v-col cols="12" md="12">
            <v-tabs-items v-model="backgroundTab">
              <v-tab-item>
                <v-text-field
                  v-model="elementParams['backgroundH5'].url"
                  label="H5背景URL"
                  prepend-icon="mdi-language-html5"
                ></v-text-field>
              </v-tab-item>
              <v-tab-item>
                <v-text-field
                  v-model="elementParams['backgroundImg'].url"
                  label="背景图片URL"
                  prepend-icon="mdi-image"
                ></v-text-field>
              </v-tab-item>
              <v-tab-item>
                <v-text-field
                  v-model.number="elementParams['backgroundImg'].angle"
                  label="背景图片角度"
                ></v-text-field>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="backgroundTab < 2"
          text
          @click="addBackground"
          >添加</v-btn
        >
        <v-btn
          v-if="backgroundTab === 2"
          class="ma-2"
          outlined
          color="indigo"
          @click="setBackgroundImageAngle"
        >
          设置背景图片角度
        </v-btn>
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
      backgroundTab: null,
      elementParams: {
        backgroundH5: {
          url: "",
        },

        backgroundImg: {
          url: "",
          angle: 0,
        },
      },
    };
  },

  methods: {
    show() {
      this.elementParams.backgroundImg.url = "";
      this.elementParams.backgroundImg.angle = 0;
      this.elementParams.backgroundH5.url = "";

      const backgroundImage = window.teduBoard.getBackgroundImage();
      if (backgroundImage.type === 0) {
        // 图片背景
        this.elementParams.backgroundImg.url = backgroundImage.url;
        this.elementParams.backgroundImg.angle = backgroundImage.angle;
      } else {
        // h5背景
        this.elementParams.backgroundH5.url = backgroundImage.url;
      }
      this.showDialog = true;
    },
    addBackground() {
      switch (this.backgroundTab) {
        case 1:
          if (!this.elementParams.backgroundImg.url.startsWith("https://")) {
            this.$toasted.error("请输入合法的https协议的url");
            return;
          }
          window.teduBoard.setBackgroundImage(
            this.elementParams.backgroundImg.url,
            TEduBoard.TEduBoardImageFitMode
              .TEDU_BOARD_IMAGE_FIT_MODE_CENTER
          );
          this.elementParams.backgroundImg.url = null;
          break;
        case 0:
          if (!this.elementParams.backgroundH5.url.startsWith("https://")) {
            this.$toasted.error("请输入合法的https协议的url");
            return;
          }
          window.teduBoard.setBackgroundH5(this.elementParams.backgroundH5.url);
          this.elementParams.backgroundH5.url = null;
          break;
      }
      this.showDialog = false;
    },

    setBackgroundImageAngle() {
      window.teduBoard.setBackgroundImageAngle(
        this.elementParams["backgroundImg"].angle
      );
      this.showDialog = false;
    },
  },
};
</script>