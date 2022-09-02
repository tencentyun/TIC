<template>
  <v-sheet>
    <v-navigation-drawer
      v-model="$store.state.rightBarShow"
      width="400"
      absolute
      temporary
      right
    >

      <v-list flat>
        <v-subheader>文件列表</v-subheader>
        <v-list-item-group
          v-model="currentFileIdx"
          mandatory
          color="primary"
          @change="switchFile"
        >
          <v-list-item
            v-for="item in files"
            :key="item.title"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" :value="item.fid"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="deleteFile(item.fid)">
                <v-icon color="red lighten-1">mdi-delete-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'Rightbar',
  data() {
    return {
      window,
      drawer: false,
      files: [],
      fileList: [],
      currentFile: null,
      currentFileIdx: 0,
    };
  },
  watch: {
    '$store.state.rightBarShow'(value) {
      if (value) {
        this.fileList = window.teduBoard.getFileInfoList();
        this.currentFile = window.teduBoard.getCurrentFile();
        this.files = this.fileList.map(f => ({
          fid: f.fid,
          title: f.title,
          icon: 'mdi-file-outline',
        }));
        this.currentFileIdx = this.files.findIndex(value => value.fid === this.currentFile);
      }
    },
  },
  methods: {
    ...mapActions(['setRightBarShow']),
    switchFile() {
      window.teduBoard.switchFile(this.files[this.currentFileIdx].fid);
      this.setRightBarShow(false);
    },
    deleteFile(fid) {
      window.teduBoard.deleteFile(fid);
      this.setRightBarShow(false);
    },
  },
};
</script>
