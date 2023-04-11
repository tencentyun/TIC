<template>
  <v-list
    dense
    nav
    elevation="4"
    width="50"
    class="pa-0 pt-2 pb-2 toolbar-container"
    :class="toolbarClassName"
  >
    <v-list-item>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            icon
            tile
            @click="
              setToolType(
                TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_MOUSE
              )
            "
          >
            <v-icon>mdi-cursor-default-outline</v-icon>
          </v-btn>
        </template>
        <span>鼠标</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item style="position: relative">
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="{ ...menuAttrs, ...attrs }"
                v-on="{ ...menuOn, ...on }"
                @click="
                  setPenToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN
                  )
                "
              >
                <v-icon>mdi-draw</v-icon>
              </v-btn>
            </template>
            <span>涂鸦工具</span>
          </v-tooltip>
        </template>

        <v-card>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setPenToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN
                  )
                "
              >
                <v-icon>mdi-draw</v-icon>
              </v-btn>
            </template>
            <span>画笔</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_HIGHLIGHTER
                  )
                "
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </template>
            <span>荧光笔</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setPenToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN,
                    1
                  )
                "
              >
                <v-icon>mdi-auto-fix</v-icon>
              </v-btn>
            </template>
            <span>魔法笔(松手拟合几何图形)</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setPenToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN,
                    2
                  )
                "
              >
                <v-icon>mdi-fountain-pen</v-icon>
              </v-btn>
            </template>
            <span>魔法笔(长按2s不动拟合几何图形)</span>
          </v-tooltip>
        </v-card>
      </v-menu>
    </v-list-item>

    <v-list-item style="position: relative">
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="{ ...menuAttrs, ...attrs }"
                v-on="{ ...menuOn, ...on }"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT
                  )
                "
              >
                <v-icon>mdi-rectangle-outline</v-icon>
              </v-btn>
            </template>
            <span>几何图形</span>
          </v-tooltip>
        </template>

        <v-card>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                style="transform: rotate(-45deg)"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    true,
                    false,
                    1,
                    1
                  )
                "
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </template>
            <span>直线</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    true,
                    false,
                    1,
                    3
                  )
                "
              >
                <v-icon>mdi-arrow-top-right</v-icon>
              </v-btn>
            </template>
            <span>带箭头直线</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    true,
                    false,
                    3,
                    3
                  )
                "
              >
                <v-icon>mdi-arrow-top-right-bottom-left</v-icon>
              </v-btn>
            </template>
            <span>带箭头直线</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    false,
                    false,
                    3,
                    3
                  )
                "
              >
                <v-icon>mdi-arrow-expand</v-icon>
              </v-btn>
            </template>
            <span>带箭头直线</span>
          </v-tooltip>
          <br />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT
                  )
                "
              >
                <v-icon>mdi-rectangle-outline</v-icon>
              </v-btn>
            </template>
            <span>矩形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_SQUARE
                  )
                "
              >
                <v-icon>mdi-square-outline</v-icon>
              </v-btn>
            </template>
            <span>正方形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_OVAL
                  )
                "
              >
                <v-icon>mdi-ellipse-outline</v-icon>
              </v-btn>
            </template>
            <span>椭圆</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_CIRCLE
                  )
                "
              >
                <v-icon>mdi-circle-outline</v-icon>
              </v-btn>
            </template>
            <span>圆</span>
          </v-tooltip>
          <br />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT,
                    true,
                    true
                  )
                "
              >
                <v-icon>mdi-rectangle</v-icon>
              </v-btn>
            </template>
            <span>实心矩形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_SQUARE_SOLID,
                    true,
                    true
                  )
                "
              >
                <v-icon>mdi-square</v-icon>
              </v-btn>
            </template>
            <span>实心正方形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_OVAL_SOLID,
                    true,
                    true
                  )
                "
              >
                <v-icon>mdi-ellipse</v-icon>
              </v-btn>
            </template>
            <span>实心椭圆</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_CIRCLE_SOLID,
                    true,
                    true
                  )
                "
              >
                <v-icon>mdi-circle</v-icon>
              </v-btn>
            </template>
            <span>实心圆</span>
          </v-tooltip>
          <br />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                style="transform: scaleX(-1)"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_RIGHT_TRIANGLE
                  )
                "
              >
                <v-icon>mdi-network-strength-outline</v-icon>
              </v-btn>
            </template>
            <span>直角三角形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_ISOSCELES_TRIANGLE
                  )
                "
              >
                <v-icon>mdi-triangle-outline</v-icon>
              </v-btn>
            </template>
            <span>等腰三角形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                style="transform: skewX(-15deg)"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_PARALLELOGRAM
                  )
                "
              >
                <v-icon>mdi-rectangle-outline</v-icon>
              </v-btn>
            </template>
            <span>平行四边形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_COORDINATE
                  )
                "
              >
                <v-icon>mdi-chart-scatter-plot</v-icon>
              </v-btn>
            </template>
            <span>坐标系</span>
          </v-tooltip>
          <br />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                style="transform: scaleX(-1)"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_RIGHT_TRIANGLE,
                    true,
                    true
                  )
                "
              >
                <v-icon>mdi-network-strength-4</v-icon>
              </v-btn>
            </template>
            <span>实心直角三角形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_ISOSCELES_TRIANGLE,
                    true,
                    true
                  )
                "
              >
                <v-icon>mdi-triangle</v-icon>
              </v-btn>
            </template>
            <span>实心等腰三角形</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                style="transform: skewX(-15deg)"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_PARALLELOGRAM,
                    true,
                    true
                  )
                "
              >
                <v-icon>mdi-rectangle</v-icon>
              </v-btn>
            </template>
            <span>实心平行四边形</span>
          </v-tooltip>
          <br />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_CUBE
                  )
                "
              >
                <v-icon>mdi-cube-outline</v-icon>
              </v-btn>
            </template>
            <span>立方体</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_CYLINDER
                  )
                "
              >
                <v-icon>mdi-cylinder</v-icon>
              </v-btn>
            </template>
            <span>圆柱</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_CONE
                  )
                "
              >
                <v-icon>mdi-cone</v-icon>
              </v-btn>
            </template>
            <span>圆锥</span>
          </v-tooltip>
        </v-card>
      </v-menu>
    </v-list-item>

    <v-list-item>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            icon
            tile
            @click="
              setToolType(
                TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT_SELECT
              )
            "
          >
            <v-icon>mdi-selection-drag</v-icon>
          </v-btn>
        </template>
        <span>选框</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item style="position: relative">
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="{ ...menuAttrs, ...attrs }"
                v-on="{ ...menuOn, ...on }"
                icon
                tile
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER
                  )
                "
              >
                <v-icon>mdi-eraser</v-icon>
              </v-btn>
            </template>
            <span>橡皮擦</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="setPiecewiseErasureEnable(false)"
              >
                <v-icon>mdi-eraser</v-icon>
              </v-btn>
            </template>
            <span>整段擦除</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="setPiecewiseErasureEnable(true)"
              >
                <v-icon>mdi-eraser-variant</v-icon>
              </v-btn>
            </template>
            <span>分段擦除</span>
          </v-tooltip>
        </v-card>
      </v-menu>
    </v-list-item>
    <v-list-item>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            icon
            tile
            @click="
              setToolType(TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_TEXT)
            "
          >
            <v-icon>mdi-format-text</v-icon>
          </v-btn>
        </template>
        <span>文本</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item>
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="{ ...menuOn, ...on }"
                v-bind="{ ...menuAttrs, ...attrs }"
                icon
                tile
                @click="
                  setToolType(
                    TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_BOARD_CUSTOM_GRAPH
                  )
                "
              >
                <v-icon>mdi-puzzle-outline</v-icon>
              </v-btn>
            </template>
            <span>自定义图形</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(item, index) in customGraphImages"
                :key="item"
                @click="setCustomGraph(item)"
              >
                <v-list-item-avatar>
                  <v-img :src="item"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  自定义图形 {{ index + 1 }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="showCustomGraph">
                <v-list-item-avatar>
                  <v-icon>mdi-plus</v-icon>
                </v-list-item-avatar>
                <v-list-item-content> 添加自定义图形 </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-list-item>
    <v-list-item style="position: relative">
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="{ ...menuAttrs, ...attrs }"
                v-on="{ ...menuOn, ...on }"
              >
                <v-icon>mdi-ruler</v-icon>
              </v-btn>
            </template>
            <span>教学工具</span>
          </v-tooltip>
        </template>

        <v-card>
          <v-btn
            icon
            tile
            @click="useMathTool(TEduBoard.TEduMathToolType.RULER)"
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/ruler_active.svg"
                width="24"
                height="24"
              >
              </v-img>
              <v-img
                v-else
                width="24"
                height="24"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/ruler.svg"
              ></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="useMathTool(TEduBoard.TEduMathToolType.ISOSCELES_TRIANGLE)"
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/isosceles_triangle_active.svg"
                width="24"
                height="24"
              >
              </v-img>
              <v-img
                v-else
                width="24"
                height="24"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/isosceles_triangle.svg"
              ></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="useMathTool(TEduBoard.TEduMathToolType.TRIANGLE)"
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/triangle_active.svg"
                width="24"
                height="24"
              >
              </v-img>
              <v-img
                v-else
                width="24"
                height="24"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/triangle.svg"
              ></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="useMathTool(TEduBoard.TEduMathToolType.PROTRACTOR)"
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/protractor_active.svg"
                width="24"
                height="24"
              >
              </v-img>
              <v-img
                v-else
                width="24"
                height="24"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/protractor.svg"
              ></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="useMathTool(TEduBoard.TEduMathToolType.COMPASSES)"
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/compasses_active.svg"
                width="36"
                height="36"
              >
              </v-img>
              <v-img
                v-else
                width="36"
                height="36"
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/compasses.svg"
              ></v-img>
            </v-hover>
          </v-btn>
        </v-card>
      </v-menu>
    </v-list-item>
    <v-list-item>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            icon
            tile
            @click="
              setToolType(
                TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LASER
              )
            "
          >
            <v-icon>mdi-flare</v-icon>
          </v-btn>
        </template>
        <span>激光笔</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            icon
            tile
            @click="
              setToolType(
                TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ZOOM_DRAG
              )
            "
          >
            <v-icon>mdi-cursor-move</v-icon>
          </v-btn>
        </template>
        <span>缩放移动</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item>
      <v-menu
        transition="slide-x-transition"
        right
        absolute
        :position-x="50"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="{ ...menuAttrs, ...attrs }"
                v-on="{ ...menuOn, ...on }"
              >
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
            <span>工具样式</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-text>
            <div>
              <span>画笔粗细</span>
              <v-slider
                v-model="thin"
                dense
                hide-details
                :thumb-size="24"
                :label="String(thin)"
                step="10"
                max="500"
                min="10"
                @change="setBrushThin"
              ></v-slider>
            </div>
            <div>
              <span>文本大小</span>
              <v-slider
                v-model="fontSize"
                dense
                hide-details
                :thumb-size="24"
                :label="String(fontSize)"
                step="10"
                max="500"
                min="100"
                @change="setTextSize"
              ></v-slider>
            </div>
            <span>画笔颜色</span>
            <v-color-picker
              width="300"
              canvas-height="100"
              flat
              hide-sliders
              hide-inputs
              class="ma-2"
              show-swatches
              :swatches="[
                ['#FF0000'],
                ['#FFFF00'],
                ['#00FF00'],
                ['#00FFFF'],
                ['#0000FF'],
              ]"
              @update:color="setBrushColor"
            ></v-color-picker>
            <span>文本工具颜色</span>
            <v-color-picker
              width="300"
              canvas-height="100"
              flat
              hide-sliders
              hide-inputs
              class="ma-2"
              show-swatches
              :swatches="[
                ['#FF0000'],
                ['#FFFF00'],
                ['#00FF00'],
                ['#00FFFF'],
                ['#0000FF'],
              ]"
              @update:color="setTextColor"
            ></v-color-picker>
            <span>荧光笔颜色</span>
            <!-- 此处初始值是为了防止首次打开面板时背景色被更改 -->
            <v-color-picker
              value="#ddfd8e80"
              width="300"
              hide-canvas
              hide-inputs
              flat
              @update:color="setHighlighterColor"
            ></v-color-picker>
            <span>背景颜色</span>
            <!-- 此处初始值是为了防止首次打开面板时背景色被更改 -->
            <v-color-picker
              value="#FF0000FF"
              width="300"
              hide-canvas
              hide-inputs
              flat
              @update:color="setBackgroundColor"
            ></v-color-picker>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-list-item>
    <v-list-item>
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="{ ...menuOn, ...on }"
                v-bind="{ ...menuAttrs, ...attrs }"
                icon
                tile
              >
                <v-icon>mdi-broom</v-icon>
              </v-btn>
            </template>
            <span>一键清空</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item @click="clearBackground">清空背景图/h5</v-list-item>
          <v-list-item @click="cleanAll()">清空白板</v-list-item>
          <v-list-item @click="cleanAll(true)">清空白板+背景</v-list-item>
        </v-list>
      </v-menu>
    </v-list-item>
    <v-list-item>
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="{ ...menuOn, ...on }"
                v-bind="{ ...menuAttrs, ...attrs }"
                icon
                tile
              >
                <v-icon>mdi-gift</v-icon>
              </v-btn>
            </template>
            <span>资源</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-for="type in Object.keys(uploadTypeList)"
            :key="type"
            @click="showCoursewareAndElementDialog(type)"
            >{{ uploadTypeList[type].title }}</v-list-item
          >
        </v-list>
      </v-menu>
    </v-list-item>

    <v-list-item>
      <v-menu transition="slide-x-transition" right absolute :position-x="50">
        <template v-slot:activator="{ on: menuOn, attrs: menuAttrs }">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="{ ...menuOn, ...on }"
                v-bind="{ ...menuAttrs, ...attrs }"
                icon
                tile
              >
                <v-icon>mdi-camera</v-icon>
              </v-btn>
            </template>
            <span>截图</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item @click="onSnapshot({full: false})">所见即所得模式</v-list-item>
          <v-list-item @click="onSnapshot({full: true})">全尺寸模式(请放大白板后体验)</v-list-item>
        </v-list>
      </v-menu>
    </v-list-item>

    <v-list-item>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            icon
            tile
            @click="showSettingPanelDialog()"
          >
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </template>
        <span>其他设置</span>
      </v-tooltip>
    </v-list-item>
    <courseware-dialog ref="coursewareDialog"></courseware-dialog>
    <element-dialog ref="elementDialogRef"></element-dialog>
    <setting-dialog
      ref="settingDialogRef"
      @updateSetting="onUpdateSetting"
    ></setting-dialog>
    <custom-graph-dialog
      ref="customGraphDialogRef"
      @updateCustomGraph="onUpdateCustomGraph"
    ></custom-graph-dialog>
    <media-dialog ref="mediaDialogRef"></media-dialog>
    <background-dialog ref="backgroundDialogRef"></background-dialog>
    <watermark-dialog ref="watermarkDialogRef"></watermark-dialog>
  </v-list>
</template>

<script>
import ElementDialog from "./ToolbarDialog/ElementDialog.vue";
import SettingDialog from "./ToolbarDialog/SettingDialog.vue";
import CustomGraphDialog from "./ToolbarDialog/CustomGraphDialog.vue";
import CoursewareDialog from "./ToolbarDialog/CoursewareDialog.vue";
import MediaDialog from "./ToolbarDialog/MediaDialog.vue";
import BackgroundDialog from "./ToolbarDialog/BackgroundDialog.vue";
import WatermarkDialog from "./ToolbarDialog/WatermarkDialog.vue";

export default {
  name: "Toolbar",
  components: {
    BackgroundDialog,
    MediaDialog,
    WatermarkDialog,
    ElementDialog: ElementDialog,
    SettingDialog: SettingDialog,
    CustomGraphDialog: CustomGraphDialog,
    CoursewareDialog: CoursewareDialog,
  },
  data() {
    return {
      currentToolType: TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN,
      toolbarClassName: '',
      dialog: false,
      thin: 50,
      fontSize: 320,
      uploadTypeList: {
        courseware: {
          title: "课件资源",
        },
        media: {
          title: "多媒体资源",
        },
        background: {
          title: "背景资源",
        },
        element: {
          title: "白板元素",
        },
        watermark: {
          title: "水印元素",
        },
      },

      customGraphImages: [
        "https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E4%B8%89%E8%A7%92%E5%BD%A2.svg",
        "https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E6%8A%9B%E7%89%A9%E7%BA%BF_parabolic9.svg",
        "https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E8%8F%B1%E5%BD%A2.svg",
        "https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E6%B1%BD%E8%BD%A6.svg",
        "https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E7%83%A7%E6%9D%AF.svg",
        "https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E7%A3%81%E9%93%81.svg",
      ],
      colorTask: null, // 设置背景颜色的任务
    };
  },

  mounted() {
    
  },

  watch: {
    "$store.state.isTiwReady"(value) {
      if (value) {
        const teduBoard = window.teduBoard;
        // 监听元素位置更新事件
        teduBoard.on(
          TEduBoard.EVENT.TEB_BOARD_ELEMENT_POSITION_CHANGE,
          (data, status) => {
            if (
              status ===
              TEduBoard.TEduBoardPositionChangeStatus
                .TEDU_BOARD_POSITION_CHANGE_START
            ) {
              // 开始变化
              this.toolbarClassName = 'disabled-event';
            } else if (
              status ===
              TEduBoard.TEduBoardPositionChangeStatus
                .TEDU_BOARD_POSITION_CHANGE_END
            ) {
              // 结束变化
              this.toolbarClassName = '';
            }
          }
        );
      }
    },
  },

  methods: {
    showTip(tip) {
      this.$toasted.show(tip);
    },

    showErrorTip(tip) {
      this.$toasted.error(tip);
    },

    formatColor(color) {
      const [r, g, b, a] = color.match(/[\d.]+/).map((i) => +i);
      return { r, g, b, a };
    },

    setToolType(
      toolType,
      isSolidLine = true,
      isFill = false,
      startArrowType = 1,
      endArrowType = 1
    ) {
      console.log(
        "setToolType:",
        isSolidLine,
        isFill,
        startArrowType,
        endArrowType
      );
      this.currentToolType = toolType;
      window.teduBoard.setToolType(toolType);
      let lineType = null;
      if (isSolidLine) {
        lineType = TEduBoard.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID;
      } else {
        lineType = TEduBoard.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_DOTTED;
      }
      window.teduBoard.setGraphStyle({
        lineType: lineType,
        fillType: isFill
          ? TEduBoard.TEduBoardFillType.SOLID
          : TEduBoard.TEduBoardFillType.NONE,
        startArrowType: startArrowType,
        endArrowType: endArrowType,
      });
    },

    /**
     * 工具类型
     * @param {*} toolType 画笔工具
     * @param {*} autoFitMode 自动拟合模式 0 不开启拟合 1 松手拟合 2 按住2s不动拟合
     */
    setPenToolType(toolType, autoFitMode = 0) {
      this.currentToolType = toolType;
      window.teduBoard.setToolType(toolType);

      if (autoFitMode === 0) {
        // 如果是不拟合
        window.teduBoard.enablePenAutoFit(false); // 关闭按住2s拟合
        window.teduBoard.setPenAutoFittingMode(
          TEduBoard.TEduBoardPenFittingMode.NONE
        ); // 关闭松手自动拟合
        window.teduBoard.setHandwritingEnable(
          this.settingItems[0].handwritingEnable
        ); // 笔锋以设置面板的值为准
      } else if (autoFitMode === 1) {
        // 如果是松手拟合
        window.teduBoard.enablePenAutoFit(false); // 关闭按住2s拟合
        window.teduBoard.setHandwritingEnable(false); // 关闭笔锋
        window.teduBoard.setPenAutoFittingMode(
          TEduBoard.TEduBoardPenFittingMode.AUTO
        ); // 开启松手自动拟合
      } else if (autoFitMode === 2) {
        // 如果是按住2s不动拟合
        window.teduBoard.setHandwritingEnable(false); // 关闭笔锋
        window.teduBoard.setPenAutoFittingMode(
          TEduBoard.TEduBoardPenFittingMode.NONE
        ); // 关闭松手自动拟合
        window.teduBoard.enablePenAutoFit(true, 2000); // 开启按住2s拟合
      }
    },

    setBrushThin(thin) {
      window.teduBoard.setBrushThin(thin);
    },

    setTextSize(size) {
      window.teduBoard.setTextSize(size);
    },

    setBrushColor(color) {
      window.teduBoard.setBrushColor(color.hex);
    },

    setTextColor(color) {
      window.teduBoard.setTextColor(color.hex);
    },

    setBackgroundColor(color) {
      clearTimeout(this.colorTask);
      this.colorTask = setTimeout(() => {
        const r = color.rgba.r;
        const g = color.rgba.g;
        const b = color.rgba.b;
        const a = color.rgba.a;
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        window.teduBoard.setBackgroundColor(rgbaColor);
      }, 200);
    },

    setHighlighterColor(color) {
      const r = color.rgba.r;
      const g = color.rgba.g;
      const b = color.rgba.b;
      let a = Number(color.rgba.a.toFixed(1)).valueOf();
      a = Math.min(0.9, Math.max(a, 0.1));
      const highlighterColor = `rgba(${r}, ${g}, ${b}, ${a})`;
      window.teduBoard.setHighlighterColor(highlighterColor);
    },

    cleanAll(removeBackground = false) {
      window.teduBoard.clear(removeBackground);
    },

    useMathTool(tool = 1) {
      window.teduBoard.useMathTool(tool);
    },

    /**
     * 显示课件和元素的弹窗
     * @param {*} type
     */
    showCoursewareAndElementDialog(type) {
      if (type === "courseware") {
        this.$refs["coursewareDialog"].show();
      } else if (type === "media") {
        this.$refs["mediaDialogRef"].show();
      } else if (type === "background") {
        this.$refs["backgroundDialogRef"].show();
      } else if (type === "watermark") {
        this.$refs["watermarkDialogRef"].show();
      } else {
        this.$refs["elementDialogRef"].show(type);
      }
    },

    showSettingPanelDialog() {
      this.$refs["settingDialogRef"].show();
    },

    setCustomGraph(url) {
      window.teduBoard.addElement(
        TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_CUSTOM_GRAPH,
        url
      );
      this.showTip(
        "已经设置了自定义图形的url，请在页面上进行拖动绘制出自定义图形"
      );
    },

    // 设置数学工具
    setMathGraphType() {
      window.teduBoard.setMathGraphType(
        this.uploadParams.mathGraphType.type,
        true
      );
    },

    // 设置鼠标操作行为
    setMouseToolBehavior() {
      window.teduBoard.setMouseToolBehavior({
        turnPage: this.settingItems[1].turnPage,
      });
    },

    setPiecewiseErasureEnable(enable) {
      window.teduBoard.setPiecewiseErasureEnable(enable);
    },

    showCustomGraph() {
      this.$refs["customGraphDialogRef"].show();
    },

    onUpdateCustomGraph(url) {
      this.customGraphImages.push(url);
      this.setCustomGraph(url);
    },

    clearBackground() {
      const backgroundImage = window.teduBoard.getBackgroundImage();
      if (backgroundImage.type === 0) {
        // 图片背景
        window.teduBoard.setBackgroundImage("");
      } else {
        window.teduBoard.setBackgroundH5("");
      }
    },

    onUpdateSetting(settingItems) {
      this.settingItems = settingItems;
    },

    onSnapshot(option) {
      // 在截图回调事件TEduBoard.EVENT.TEB_SNAPSHOT处理截图的结果
      window.teduBoard.snapshot(option);
    }
  },
};
</script>

<style scoped>
.toolbar-container.disabled-event {
  pointer-events: none;
}
</style>
