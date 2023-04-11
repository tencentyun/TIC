<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="1000">
    <v-card>
      <v-card-title class="headline lighten-2"> 选框操作权限 </v-card-title>
      <v-card-text>
        <v-sheet
          v-for="(elementItem, key) in elementOperationAuthority"
          :key="key"
        >
          <span>{{ elementItem.text }}</span>
          <v-divider />
          <v-sheet>
            <v-row>
              <v-col
                cols="3"
                v-for="(text, authKey) in operationAuthorityList"
                :key="authKey"
              >
                <v-checkbox
                  v-model="elementItem[authKey]"
                  :label="text"
                  :value="elementItem[authKey]"
                  dense
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-sheet>
          <v-divider></v-divider>
        </v-sheet>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="setOperationAuthority">设置</v-btn>
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
      elementOperationAuthority: {
        line: {
          text: "画笔涂鸦元素(包括画笔，荧光笔)",
          disableRotate: false,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: false,
        },
        graph: {
          text: "图形涂鸦元素(包括直线，圆，椭圆，矩形，圆锥，三角形等几何图形)",
          disableRotate: false,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: false,
        },
        text: {
          text: "文本元素",
          disableRotate: true,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: true,
        },
        formula: {
          text: "学科公式",
          disableRotate: false,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: true,
        },
        customGraph: {
          text: "自定义图形元素",
          disableRotate: false,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: true,
        },
        image: {
          text: "图片元素",
          disableRotate: false,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: false,
        },
        h5: {
          text: "h5元素",
          disableRotate: false,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: false,
        },
        magicLine: {
          text: "魔法笔",
          disableRotate: false,
          disableMove: false,
          disableProportionScale: false,
          disableArbitraryScale: false,
        },
      },
      operationAuthorityList: {
        disableRotate: "禁止旋转",
        disableMove: "禁止移动",
        disableProportionScale: "禁止等比缩放",
        disableArbitraryScale: "禁止任意缩放大小",
      },
    };
  },
  mounted() {
    const elementOperationAuthority = localStorage.getItem('elementOperationAuthority');
    if (elementOperationAuthority) {
      this.elementOperationAuthority = JSON.parse(elementOperationAuthority);
    }
  },
  methods: {
    show() {
      this.showDialog = true;
    },

    setOperationAuthority() {
      localStorage.setItem('elementOperationAuthority', JSON.stringify(this.elementOperationAuthority));
      this.showDialog = false;
    },
  },
};
</script>