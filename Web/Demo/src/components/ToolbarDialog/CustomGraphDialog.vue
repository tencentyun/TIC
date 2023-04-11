<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="650">
    <v-card>
      <v-card-title>添加自定义图形</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="customGraphUrl"
          label="自定义图形URL"
          prepend-icon="mdi-image"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="addToCustomGraphList()"
          >添加至列表</v-btn
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
      customGraphUrl: null,
    };
  },
  methods: {
    show() {
      this.showDialog = true;
    },

    addToCustomGraphList() {
      this.$emit("updateCustomGraph", this.customGraphUrl);
      this.customGraphUrl = "";
      this.showDialog = false;
    },
  },
};
</script>