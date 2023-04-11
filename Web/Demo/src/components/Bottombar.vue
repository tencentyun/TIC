<template>
  <v-toolbar dense floating>
    <template v-if="show">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="undo()">
            <v-icon dense>mdi-undo-variant</v-icon>
          </v-btn>
        </template>
        <span>撤销</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="redo()">
            <v-icon dense>mdi-redo-variant</v-icon>
          </v-btn>
        </template>
        <span>重做</span>
      </v-tooltip>

      <v-divider inset vertical></v-divider>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="setBoardScale(100)">
            <v-icon dense>mdi-target</v-icon>
          </v-btn>
        </template>
        <span>重置比例</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            tile
            icon
            :disabled="boardScale <= 100"
            @click="setBoardScale(boardScale - 10)"
          >
            <v-icon dense>mdi-minus</v-icon>
          </v-btn>
        </template>
        <span>缩小</span>
      </v-tooltip>

      <span>{{ boardScale }}%</span>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            tile
            icon
            @click="setBoardScale(boardScale + 10)"
          >
            <v-icon dense>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>放大</span>
      </v-tooltip>

      <v-divider inset vertical></v-divider>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="prevPage()">
            <v-icon dense>mdi-page-first</v-icon>
          </v-btn>
        </template>
        <span>上一页</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="prevStep()">
            <v-icon dense>mdi-chevron-left</v-icon>
          </v-btn>
        </template>
        <span>上一步(PPT)</span>
      </v-tooltip>

      <span>
        {{ currentFile.currentPageIndex + 1 }} / {{ currentFile.pageCount }}
      </span>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="nextStep()">
            <v-icon dense>mdi-chevron-right</v-icon>
          </v-btn>
        </template>
        <span>下一步(PPT)</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="nextPage()">
            <v-icon dense>mdi-page-last</v-icon>
          </v-btn>
        </template>
        <span>下一页</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="addBoard()">
            <v-icon dense>mdi-text-box-plus-outline</v-icon>
          </v-btn>
        </template>
        <span>添加白板</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="deleteBoard()">
            <v-icon dense>mdi-text-box-minus-outline</v-icon>
          </v-btn>
        </template>
        <span>删除白板</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" tile icon @click="openRightBar()">
            <v-icon dense>mdi-file-multiple-outline</v-icon>
          </v-btn>
        </template>
        <span>文件列表</span>
      </v-tooltip>
    </template>
    <v-btn icon tile :style="{ width: `${show? '16px' : '36px'}` }" @click="show = !show">
      <v-icon>
        {{ show ? "mdi-chevron-left" : "mdi-chevron-right" }}
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'Bottombar',
  data() {
    return {
      boardScale: 100,
      window,
      currentFile: {
        currentPageIndex: 0,
        pageCount: 0,
      },
      show: true,
    };
  },
  watch: {
    '$store.state.current.fileInfo'(value) {
      this.currentFile = value;
      this.boardScale = window.teduBoard.getBoardScale();
    },
  },
  methods: {
    ...mapActions(['setRightBarShow']),
    setBoardScale(boardScale) {
      this.boardScale = boardScale;
      window.teduBoard.setBoardScale(this.boardScale);
      this.boardScale = window.teduBoard.getBoardScale();
    },
    undo() {
      window.teduBoard.undo();
    },
    redo() {
      window.teduBoard.redo();
    },
    prevPage() {
      window.teduBoard.prevBoard();
    },
    nextPage() {
      window.teduBoard.nextBoard();
    },
    prevStep() {
      window.teduBoard.prevStep();
    },
    nextStep() {
      window.teduBoard.nextStep();
    },
    openRightBar() {
      this.setRightBarShow(true);
    },
    addBoard() {
      window.teduBoard.addBoard();
    },
    deleteBoard() {
      window.teduBoard.deleteBoard();
    },
  },
};
</script>

<style scoped>
</style>
