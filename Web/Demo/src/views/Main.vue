<template>
  <div class="main__wrap">
    <sketch></sketch>
    <toolbar class="toolbar-style"></toolbar>
    <topbar class="topbar-style" :quitClassroom="quitClassroom"></topbar>
    <bottombar class="bottombar-style"></bottombar>
    <rightbar class="rightbar-style"></rightbar>
    <element-toolbar></element-toolbar>
  </div>
</template>

<script>
import Sketch from '../components/Sketch';
import Toolbar from '../components/Toolbar';
import Bottombar from '../components/Bottombar';
import Topbar from '../components/Topbar';
import Rightbar from '../components/Rightbar';
import ElementToolbar from '../components/ElementToolbar';
import Signal from '../signal/Signal';
import Util from '../util/Util';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Main',
  mixins: [Signal],
  components: {
    Sketch,
    Toolbar,
    Bottombar,
    Rightbar,
    Topbar,
    ElementToolbar,
  },

  data() {
    return {};
  },

  computed: {
    ...mapState(['classInfo']),
  },

  mounted() {
    this.joinClassroom();
  },

  methods: {
    ...mapActions(['setSignalReady']),

    async joinClassroom() {
      // 1. 准备好信令通道
      let error;
      // 2. 登录
      [error] = await Util.awaitWrap(this.joinSignal());
      if (error) {
        this.$toasted.error(error.message);
        console.error(
          error.code,
          error.message,
          'TIM的错误码文档: https://cloud.tencent.com/document/product/269/1671',
        );
        this.setSignalReady(false);
        this.$router.push('/login');
      } else {
        // 3. 加入课堂
        [error] = await Util.awaitWrap(this.createAndJoinSignal());
        if (error) {
          this.$toasted.error(error.message);
          console.error(
            error.code,
            error.message,
            'TIM的错误码文档: https://cloud.tencent.com/document/product/269/1671',
          );
          this.setSignalReady(false);
          this.$router.push('/login');
        } else {
          this.setSignalReady(true);
        }
      }
    },

    async quitClassroom(cb = null) {
      // 1. 准备好信令通道
      const [error] = await Util.awaitWrap(this.quitSignal());
      if (error) {
        this.$toasted.error(error.message);
        console.error(
          error.code,
          error.message,
          'TIM的错误码文档: https://cloud.tencent.com/document/product/269/1671',
        );
      }
      cb && cb();
    },
  },
};
</script>

<style lang="less" scoped>
.main__wrap {
  width: 100%;
  height: 100%;
}
.bottombar-style {
  transform-origin: left;
  transform: scale(0.8);
  position: fixed;
  left: 8px;
  bottom: 4px;
}

.toolbar-style {
  transform: translateY(-50%) scale(0.8);
  position: fixed;
  left: 0;
  top: 50%;
}

.topbar-style {
  transform-origin: right;
  transform: scale(0.8);
  position: fixed;
  right: 8px;
  top: 4px;
}
</style>
