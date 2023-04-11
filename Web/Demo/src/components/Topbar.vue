<template>
  <v-toolbar dense floating>
    <v-btn icon tile class="mr-2" style="width: 12px" @click="show = !show">
      <v-icon>
        {{ show ? "mdi-chevron-right" : "mdi-chevron-left" }}
      </v-icon>
    </v-btn>
    <template v-if="show" transition="slide-x-transition">
      <span class="mr-3">房间号: {{ $store.state.classInfo.classId }}</span>
      <v-divider vertical inset></v-divider>
      <span class="mx-3">用户ID: {{ $store.state.classInfo.userId }}</span>
      <v-divider vertical inset></v-divider>
      <span class="mx-3">
        SDK版本号：{{ window.teduBoard && window.teduBoard.version }}
      </span>
      <v-divider vertical inset></v-divider>
      <span class="mx-3">
        当前文件：{{ $store.state.current.fileInfo.title }}
      </span>
    </template>
    <v-divider vertical inset></v-divider>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-on="on" v-bind="attrs" tile icon @click="quit()">
          <v-icon dense color="error">mdi-power</v-icon>
        </v-btn>
      </template>
      <span>退出</span>
    </v-tooltip>
  </v-toolbar>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Topbar",
  props: {
    quitClassroom: Function,
  },
  data() {
    return {
      window,
      show: true,
    };
  },
  mounted() {
    setTimeout(() => {
      // this.show = false;

      const hasShow = localStorage.getItem(`tiw_${TEduBoard.getVersion()}`);
      console.log('hasShow', hasShow);
      if (!hasShow) {
        this.documentShow = true;
      }
    }, 2500);
  },
  methods: {
    ...mapActions(['setSignalReady']),
    async quit() {
      this.quitClassroom(() => {
        this.setSignalReady(false);
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style scoped>
</style>
