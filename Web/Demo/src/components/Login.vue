<template>
  <v-container style="height: 100vh; background-color: #F4F5F8; max-width: 100%; overflow: hidden;" class="pa-0">
    <v-alert
      text
      type="info"
      style="position: fixed; width: 100%"
    >
      本Demo仅用于演示互动白板产品功能，源码对外开放，可供您接入时参考，但是Demo本身未经过严格测试，若您计划将Demo代码用于生产环境，请确保发布前自行进行充分测试，避免发生潜在问题可能给您造成损失
    </v-alert>
    <v-row style="height: 100%; overflow: hidden;" align="center">
      <v-col align-self="center">
        <v-card
          class="mx-auto pa-4"
          max-width="400"
          style="box-shadow: 3px 3px 30px rgb(0 0 0 / 8%);"
        >
          <v-card-text>
            <div class="mb-4">
              <p>欢迎使用</p>
              <h2 class="text--primary">
                互动白板-体验课堂
              </h2>
            </div>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="userId"
                :rules="[v => !!v || '用户ID必填']"
                label="用户ID"
                required
              ></v-text-field>

              <v-text-field
                v-model="classId"
                :rules="[v => !!v || '房间号必填', v => /^\d+$/.test(String(v)) || '房间号为整数']"
                label="房间号"
                required
              ></v-text-field>

              <div class="text-center mt-8">
                <v-btn
                  :disabled="!valid"
                  color="primary"
                  class="mx-auto"
                  style="width: 200px"
                  rounded
                  @click="joinHandler"
                >
                  加入课堂
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Util from '../util/Util';
import GenUserSig from '../util/lib-generate-usersig.min';
import Config from '../config/index';

export default {
  name: 'Login',

  data() {
    return {
      tim: null,
      valid: false,

      userId: '',
      classId: null,
    };
  },

  mounted() {
    this.userId = `tiw_web_${Math.ceil(Math.random() * 1000)}`;
  },

  methods: {
    async joinHandler() {
      if (this.valid) {
        // 1. 获取签名信息
        const [error, res] = await Util.awaitWrap(this.getUserSig());
        if (error) {
          this.$toasted.error('获取签名出错, 请重试');
          return;
        }
        if (!res.userSig) {
          return;
        }
        this.userSig = res.userSig;
        this.joinClassroom();
      } else {
        this.$toasted.error('请输入合法用户ID和房间号');
      }
    },

    async joinClassroom() {
      this.$store.commit('classInfo', {
        sdkAppId: Number(Config.sdkAppId),
        userId: String(this.userId),
        classId: Number(this.classId),
        userSig: String(this.userSig),
      });
      this.$router.push('/');
    },

    async getUserSig() {
      if (!Config.sdkAppId || !Config.secretKey) {
        this.$toasted.error('请输入合法用户ID和房间号');
        return {
          userSig: ''
        };
      }
      const gus = new GenUserSig(Config.sdkAppId, Config.secretKey, Config.expireTime);
      const userSig = gus.genTestUserSig(`${this.userId}`);
      return {
        userSig
      };
    },
  },
};
</script>
