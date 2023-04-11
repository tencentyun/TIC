<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="1000">
    <v-card>
      <v-card-title class="headline lighten-2"> 多媒体资源 </v-card-title>
      <v-card-text>
        <v-tabs v-model="mediaTab">
          <v-tab value="video">MP4视频</v-tab>
          <v-tab value="audio">MP3音频</v-tab>
          <v-tab value="h5File">H5网页</v-tab>
        </v-tabs>
        <v-row>
          <v-col cols="12" md="12">
            <v-tabs-items v-model="mediaTab">
              <v-tab-item>
                <v-text-field
                  v-model="media['video'].url"
                  label="mp4视频URL"
                  prepend-icon="mdi-video"
                ></v-text-field>
                <v-text-field
                  v-model="media['video'].title"
                  label="mp4标题"
                  prepend-icon="mdi-format-title"
                ></v-text-field>
              </v-tab-item>
              <v-tab-item>
                <v-text-field
                  v-model="media['audio'].url"
                  label="MP3音频URL"
                  prepend-icon="mdi-music"
                ></v-text-field>
                <v-text-field
                  v-model="media['audio'].title"
                  label="mp3标题"
                  prepend-icon="mdi-format-title"
                ></v-text-field>
              </v-tab-item>
              <v-tab-item>
                <v-text-field
                  v-model="media['h5File'].url"
                  label="H5网页URL"
                  prepend-icon="mdi-language-html5"
                ></v-text-field>
                <v-text-field
                  v-model="media['audio'].title"
                  label="H5网页标题"
                  prepend-icon="mdi-format-title"
                ></v-text-field>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="addMedia">添加</v-btn>

        <v-btn text @click="showDialog = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        urlRule: [
          (v) => !!v || "url is required",
          (v) => /^https:\/\//.test(v) || "url必须是https协议",
        ],
      },
      showDialog: false,
      mediaTab: "video",
      media: {
        video: {
          url: "",
          title: "",
        },
        audio: {
          url: "",
          title: "",
        },
        h5File: {
          url: "",
          title: "",
        },
      },
    };
  },
  methods: {
    show() {
      this.showDialog = true;
    },
    addMedia() {
      switch (this.mediaTab) {
        case 0:
          if (!this.media.video.url.startsWith("https://")) {
            this.$toasted.error("请输入合法的https协议的url");
            return;
          }
          window.teduBoard.addVideoFile(
            this.media.video.url,
            this.media.video.title
          );
          this.media['video'].url = "";
          this.media['video'].title = "";
          break;
        case 1:
          if (!this.media.audio.url.startsWith("https://")) {
            this.$toasted.error("请输入合法的https协议的url");
            return;
          }
          window.teduBoard.addElement(
            TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_AUDIO,
            this.media.audio.url,
            {
              title: this.media.audio.title,
            }
          );
          this.media['audio'].url = "";
          this.media['audio'].title = "";
          break;
        case 2:
          if (!this.media.h5File.url.startsWith("https://")) {
            this.$toasted.error("请输入合法的https协议的url");
            return;
          }
          window.teduBoard.addH5File(
            this.media.h5File.url,
            this.media.h5File.title
          );
          this.media['h5File'].url = "";
          this.media['h5File'].title = "";
          break;
      }

      this.showDialog = false;
    },
  },
};
</script>