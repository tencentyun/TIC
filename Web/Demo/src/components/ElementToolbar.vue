<template>
  <!-- 不加v-show，在元素缩放的时候，showToolbar虽然为false，但还是显示状态  -->
  <v-menu
      dense
      max-height="48"
      :position-x="toolbarPosition.left"
      :position-y="toolbarPosition.top"
      :value="showToolbar"
      v-show="showToolbar"
      content-class="element-toolbar-menu"
      :close-on-click="false"
      :open-on-click="false"
      :internal-activator="true"
      :close-on-content-click="false"
      @click.capture.stop.prevent
      @mousedown.capture.stop.prevent
      @mouseover.capture.stop.prevent
      :offset-overflow="true"
      :return-value="true"
      :transition="false"
  >
    <!-- v-show="showToolbar" -->
    <v-list class="d-flex element-toolbar-container pa-0 ma-0" max-height="48" max-width="280">
      <v-list-item class="pa-0 ml-2"  style="flex:none;" v-if="selectElements.length === 1">
        <v-menu
          absolute
          :offset-overflow="true"
          :transition="false"
          :position-x="0"
          :position-y="toolbarPosition.top + 60"
           :close-on-content-click="false"
           content-class="element-toolbar-color-picker">
          <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    :color="selectedElement.style.borderColor"
                    icon
                    tile
                    :plain="true"
                    v-bind="{ ...menuAttrs, ...attrs }"
                    v-on="{ ...menuOn, ...on }"
                >
                  <v-icon>mdi-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>颜色</span>
            </v-tooltip>
          </template>
          <v-card>
            <v-card-text>
              <!-- 此处初始值是为了防止首次打开面板时背景色被更改 -->
              <v-color-picker
                  :value="highlighterColor"
                  width="300"
                  hide-canvas
                  hide-inputs
                  flat
                  @update:color="colorChange"
              ></v-color-picker>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-list-item>
      <v-list-item class="pa-0 mx-2" v-if="selectElements.length === 1">
        <v-select
            :items="lineTypeItems"
            label="虚实线"
            dense
            hide-details
            @change="lineTypeChange"
            single-line
            :value="selectedElement.style.borderType"
        ></v-select>
      </v-list-item>
      <v-list-item class="pa-0 ma-0" v-if="selectElements.length === 1">
        <v-select
            :items="boardWidthItems"
            label="线宽"
            dense
            hide-details
            @change="boardWidthChange"
            single-line
            :value="selectedElement.style.borderWidth"
        ></v-select>
      </v-list-item>
      <v-list-item class="pa-0 mx-2" style="flex:none;">
        <v-tooltip top nudge-bottom="5px" open-delay="300">
          <template v-slot:activator="{ on, attrs }">
            <div v-on="on" v-bind="attrs">
              <v-btn
                  icon
                  dense
                  color="pink"
                  @click="removeElement"
              >
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>
            </div>
          </template>
          <span>删除</span>
        </v-tooltip>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

import Util from '../util/Util';

export default {
  name: 'ElementToolbar',
  components: {

  },
  props: {},
  data() {
    return {
      // 只有该值才不会触发初次打开回调
      lineTypeItems: [{
        text: '实线',
        value: TEduBoard.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID
      }, {
        text: '虚线',
        value: TEduBoard.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_DOTTED
      }],
      boardWidthItems: [{
        text: '细',
        value: 20
      }, {
        text: '中',
        value: 100
      }, {
        text: '粗',
        value: 400
      }],
      toolbarPosition: {
        left: 400,
        top: 200,
      },
      selectElements: [],
      showToolbar: false,
      updateColorDebounceTask: null,
      selectedElement: null,
      highlighterColor: '#FF0000FF'
    };
  },
  watch: {
    '$store.state.isTiwReady'(value) {
      if (value) {
        const teduBoard = window.teduBoard;
        // 监听选择元素事件
        teduBoard.on(TEduBoard.EVENT.TEB_SELECTED_ELEMENTS, (data) => {
          this.selectElements = data;
          this.showToolbar = this.selectElements.length;
          if (this.showToolbar) {
            this.calcElementPosition(data);
            if (this.selectElements.length === 1) {
              this.selectedElement = window.teduBoard.getElementById(this.selectElements[0].elementId);
              console.log('EVENT.TEB_SELECTED_ELEMENTS', this.selectElements, 'info:', this.selectedElement);
              if (this.selectedElement) {
                  this.highlighterColor = Util.rgba2hexa(this.selectedElement.style.borderColor);
              } else {
                this.highlighterColor = '#FF0000FF';
              }
            } else {
              this.selectedElement = null;
              this.highlighterColor = '#FF0000FF';
            }
          }
        });

        // 监听元素位置更新事件
        teduBoard.on(TEduBoard.EVENT.TEB_BOARD_ELEMENT_POSITION_CHANGE, (data) => {
          if (this.showToolbar) {
            this.calcElementPosition(data);
          }
        });
      }
    },
  },

  methods: {
    calcElementPosition(data) {
      const boxArea = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
      };
      // 算最大选中元素区域
      data.forEach((element) => {
        boxArea.minX = Math.min(boxArea.minX, element.boundingbox.left);
        boxArea.maxX = Math.max(boxArea.maxX, element.boundingbox.left + element.boundingbox.width);
        boxArea.minY = Math.min(boxArea.minY, element.boundingbox.top);
        boxArea.maxY = Math.max(boxArea.maxY, element.boundingbox.top + element.boundingbox.height);
      });
      const whiteBoardRect = document.querySelector('.tx_board_canvas_wrap').getBoundingClientRect();
      this.toolbarPosition.left = ((boxArea.minX + boxArea.maxX) / 2 - whiteBoardRect.left)
          - (data.length === 1 ? 140 : 24);
      this.toolbarPosition.top = Math.max(
          boxArea.minY - (data.length === 1 ? 100 : 60), whiteBoardRect.top);
    },

    removeElement() {
      // 删除元素
      this.selectElements.forEach((item)=>{
        window.teduBoard.updateElementById(
        item.elementId,
        { type: TEduBoard.TEduElementOperatorType.EL_DELETE,
          value: '' });
      });
    },

    colorChange(color) {
      clearTimeout(this.updateColorDebounceTask);
      this.updateColorDebounceTask = setTimeout(()=>{
        const r = color.rgba.r;
        const g = color.rgba.g;
        const b = color.rgba.b;
        let a = Number(color.rgba.a.toFixed(1)).valueOf();
        const element = window.teduBoard.getElementById(this.selectedElement.elementId);
        let highlighterColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        if (element.type === TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_GRAFFITI_GRAPH_HIGHLIGHTER) {
          a = Math.min(0.9, Math.max(a, 0.1));
          highlighterColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        window.teduBoard.updateElementById(
          this.selectedElement.elementId,
          { type: TEduBoard.TEduElementOperatorType.BOARDER_COLOR,
            value: highlighterColor });
        this.selectedElement = window.teduBoard.getElementById(this.selectedElement.elementId);
      }, 200);
    },
    lineTypeChange(value) {
        window.teduBoard.updateElementById(
          this.selectedElement.elementId,
          { type: TEduBoard.TEduElementOperatorType.BOARDER_LINE_TYPE,
            value: value });
    },
    boardWidthChange(value) {
        window.teduBoard.updateElementById(
        this.selectedElement.elementId,
        { type: TEduBoard.TEduElementOperatorType.BOARDER_WIDTH,
          value: value });
    },
  },

  beforeDestroy() {
    const teduBoard = window.teduBoard;
    teduBoard && teduBoard.off(TEduBoard.EVENT.TEB_SELECTED_ELEMENTS);
  },
};
</script>

<style lang="scss" scoped>

.element-toolbar-color-picker {
  max-width: none;
  width: 300px;
  .v-card__text {
    padding: 0;
  }
}
</style>
