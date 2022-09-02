<template>
  <v-list dense nav elevation="4" width="50" class="pa-0 pt-2 pb-2">
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
                window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_MOUSE
              )
            "
          >
            <v-icon>mdi-cursor-default-outline</v-icon>
          </v-btn>
        </template>
        <span>鼠标</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item style="position: relative" >
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
                  window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN
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
                  window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN
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
                  window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_HIGHLIGHTER
                )
              "
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </template>
          <span>荧光笔</span>
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
              setPenToolType(
                window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN,
                true
              )
            "
          >
            <v-icon>mdi-auto-fix</v-icon>
          </v-btn>
        </template>
        <span>魔法笔</span>
      </v-tooltip>
    </v-list-item>

    <v-list-item style="position: relative" >
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT
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
                style="transform: rotate(-45deg);"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    true, false, 1, 1
                  );
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    true, false, 1, 3
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    true, false, 3, 3
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LINE,
                    false, false, 3, 3
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_RECT
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_SQUARE
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_OVAL
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_CIRCLE
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_RECT,
                      true, true
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_SQUARE_SOLID,
                      true, true
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_OVAL_SOLID,
                      true, true
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_CIRCLE_SOLID,
                      true, true
                  )
                "
              >
                <v-icon>mdi-circle</v-icon>
              </v-btn>
            </template>
            <span>实心圆</span>
          </v-tooltip>
          <br/>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                style="transform: scaleX(-1);"
                @click="
                  setToolType(
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_RIGHT_TRIANGLE
                  );
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_ISOSCELES_TRIANGLE
                  );
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
                style="transform: skewX(-15deg);"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_PARALLELOGRAM
                  );
                "
              >
                <v-icon>mdi-rectangle-outline</v-icon>
              </v-btn>
            </template>
            <span>平行四边形</span>
          </v-tooltip>
          <br/>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                style="transform: scaleX(-1);"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_RIGHT_TRIANGLE,
                      true, true
                  );
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_ISOSCELES_TRIANGLE,
                      true, true
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
                style="transform: skewX(-15deg);"
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_PARALLELOGRAM,
                      true, true
                  )
                "
              >
                <v-icon>mdi-rectangle</v-icon>
              </v-btn>
            </template>
            <span>实心平行四边形</span>
          </v-tooltip>
          <br/>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                tile
                v-bind="attrs"
                v-on="on"
                @click="
                  setToolType(
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_CUBE
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_CYLINDER
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
                    window.TEduBoard.TEduBoardToolType
                      .TEDU_BOARD_TOOL_TYPE_CONE
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
                window.TEduBoard.TEduBoardToolType
                  .TEDU_BOARD_TOOL_TYPE_RECT_SELECT
              )
            "
          >
            <v-icon>mdi-selection-drag</v-icon>
          </v-btn>
        </template>
        <span>选框</span>
      </v-tooltip>
    </v-list-item>
    <v-list-item  style="position: relative">
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
                    window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_ERASER
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
              setToolType(
                window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_TEXT
              )
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
                    window.TEduBoard.TEduBoardToolType
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
              <v-list-item @click="customGraphDialog = true">
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
    <v-list-item style="position: relative" >
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
            @click="
              useMathTool(window.TEduBoard.TEduMathToolType.RULER)
            "
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/ruler_active.svg"
                width="24" height="24"
              >
              </v-img>
              <v-img v-else width="24" height="24" contain src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/ruler.svg"></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="
              useMathTool(window.TEduBoard.TEduMathToolType.ISOSCELES_TRIANGLE)
            "
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/isosceles_triangle_active.svg"
                width="24" height="24"
              >
              </v-img>
              <v-img v-else width="24" height="24" contain src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/isosceles_triangle.svg"></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="
              useMathTool(window.TEduBoard.TEduMathToolType.TRIANGLE)
            "
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/triangle_active.svg"
                width="24" height="24"
              >
              </v-img>
              <v-img v-else width="24" height="24" contain src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/triangle.svg"></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="
              useMathTool(window.TEduBoard.TEduMathToolType.PROTRACTOR)
            "
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                contain
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/protractor_active.svg"
                width="24" height="24"
              >
              </v-img>
              <v-img v-else width="24" height="24" contain src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/protractor.svg"></v-img>
            </v-hover>
          </v-btn>
          <v-btn
            icon
            tile
            @click="
              useMathTool(window.TEduBoard.TEduMathToolType.COMPASSES)
            "
          >
            <v-hover>
              <v-img
                slot-scope="{ hover }"
                v-if="hover"
                src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/compasses_active.svg"
                width="36" height="36"
              >
              </v-img>
              <v-img v-else width="36" height="36" src="https://demo.qcloudtiw.com/web/latest/teach_tool_icon/compasses.svg"></v-img>
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
                window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_LASER
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
                window.TEduBoard.TEduBoardToolType
                  .TEDU_BOARD_TOOL_TYPE_ZOOM_DRAG
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
      <v-menu transition="slide-x-transition" right absolute :position-x="50" :close-on-content-click="false">
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
            <span>当前工具颜色</span>
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
              @update:color="setColor"
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
          <v-list-item @click="cleanAll()">清空涂鸦</v-list-item>
          <v-list-item @click="cleanAll(true)">清空白板</v-list-item>
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
            @click="showUploadDialog(type)"
            >{{ uploadTypeList[type].title }}</v-list-item
          >
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

    <v-dialog v-if="dialog" v-model="dialog" max-width="800">
      <v-card>
        <v-card-title class="headline lighten-2">
          {{ uploadTypeList[uploadType].title }}
        </v-card-title>
        <v-card-text>
          <template v-if="uploadType === 'courseware'">
            <v-alert text type="info">
              1. ppt默认转码为动态转码，即保留ppt中的动画效果。<br />
              2. word，pdf只能转换为静态图片，ppt也可以设置转换为静态图片。
            </v-alert>
            <v-row>
              <v-col cols="12" md="8">
                <v-switch v-model="useNewTranscodeMode" color="success">
                  <template v-slot:label>
                    使用新版转码方案
                    <v-icon class="ml-2" @click="viewDoc()"
                      >mdi-information-outline</v-icon
                    >
                  </template>
                </v-switch>
                <v-text-field
                  v-model="uploadParams['courseware'].file"
                  label="课件URL"
                  prepend-icon="mdi-file"
                  readonly
                  @click="uploadTranscodeFileDialog = true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" align-self="end">
                <v-text-field
                  v-model="uploadParams['courseware'].fileName"
                  label="课件名称"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-if="uploadType === 'media'">
            <v-tabs v-model="mediaTab">
              <v-tab>MP4视频</v-tab>
              <v-tab>MP3音频</v-tab>
              <v-tab>H5网页</v-tab>
            </v-tabs>
            <v-row>
              <v-col cols="12" md="12">
                <v-tabs-items v-model="mediaTab">
                  <v-tab-item>
                    <v-text-field
                      v-model="uploadParams['video'].file"
                      label="MP4视频URL"
                      prepend-icon="mdi-video"
                    ></v-text-field>
                  </v-tab-item>
                  <v-tab-item>
                    <v-text-field
                      v-model="uploadParams['audio'].file"
                      label="MP3音频URL"
                      prepend-icon="mdi-music"
                    ></v-text-field>
                  </v-tab-item>
                  <v-tab-item>
                    <v-text-field
                      v-model="uploadParams['h5File'].file"
                      label="H5网页URL"
                      prepend-icon="mdi-language-html5"
                    ></v-text-field>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </template>
          <template v-if="uploadType === 'background'">
            <v-tabs v-model="backgroundTab">
              <v-tab>H5背景</v-tab>
              <v-tab>图片背景</v-tab>
            </v-tabs>
            <v-row>
              <v-col cols="12" md="12">
                <v-tabs-items v-model="backgroundTab">
                  <v-tab-item>
                    <v-text-field
                      v-model="uploadParams['backgroundH5'].file"
                      label="H5背景URL"
                      prepend-icon="mdi-language-html5"
                    ></v-text-field>
                  </v-tab-item>
                  <v-tab-item>
                    <v-text-field
                      v-model="uploadParams['backgroundImg'].file"
                      label="背景图片URL"
                      prepend-icon="mdi-image"
                    ></v-text-field>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </template>
          <template v-if="uploadType === 'element'">
            <v-tabs v-model="elementTab">
              <v-tab>图片元素</v-tab>
              <v-tab>H5元素</v-tab>
              <v-tab>数学画板元素</v-tab>
              <v-tab>数学函数图像元素</v-tab>
              <v-tab>几何图形</v-tab>
              <v-tab>学科公式</v-tab>
            </v-tabs>
            <v-row>
              <v-col cols="12" md="12">
                <v-tabs-items v-model="elementTab">
                  <v-tab-item>
                    <v-row>
                      <v-col cols="12" md="8">
                        <v-text-field
                          v-model="uploadParams['imageElement'].file"
                          label="图片元素URL"
                          prepend-icon="mdi-image"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['imageElement'].left"
                          label="左边距"
                          suffix="px"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['imageElement'].top"
                          label="上边距"
                          suffix="px"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row>
                      <v-col cols="12" md="8">
                        <v-text-field
                          v-model="uploadParams['h5Element'].file"
                          label="H5元素URL"
                          prepend-icon="mdi-language-html5"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['h5Element'].left"
                          label="左边距"
                          suffix="px"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['h5Element'].top"
                          label="上边距"
                          suffix="px"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="uploadParams['mathBoard'].opts.width"
                          label="宽度"
                          suffix="px"
                          prepend-icon="mdi-cog-outline"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['mathBoard'].opts.height"
                          label="高度"
                          suffix="px"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['mathBoard'].opts.axisColor"
                          label="颜色"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['mathBoard'].left"
                          label="左边距"
                          suffix="px"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['mathBoard'].top"
                          label="上边距"
                          suffix="px"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="uploadParams['mathGraph'].opts.mathBoardId"
                          :items="mathBoardIds"
                          label="函数画板ID"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="uploadParams['mathGraph'].opts.expression"
                          label="函数表达式"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['mathGraph'].opts.color"
                          label="函数图像颜色"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="uploadParams['mathGraph'].opts.selectedColor"
                          label="选中高亮颜色"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="uploadParams['mathGraphType'].type"
                          :items="mathGraphTypes"
                          item-text="label"
                          item-value="value"
                          label="几何图像类型"
                        ></v-select>
                      </v-col>
                      <v-col cols="6" md="4">
                        <v-btn
                          rounded
                          color="primary"
                          dark
                          small
                          @click="setMathGraphType"
                          >设置</v-btn
                        >
                      </v-col>
                      <v-col cols="18" md="4">
                        使用此功能，需要先在白板上添加数学画板，然后在数学画板上进行点击操作，则会绘制出对应的图形
                      </v-col>
                    </v-row>
                  </v-tab-item>
                  <v-tab-item>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="uploadParams['formula'].expression"
                          label="latex公式"
                          prepend-icon="mdi-function-variant"
                          readonly
                          @click="(formulaEditorDialog = true), (loadingEditor = true)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model.number="uploadParams['formula'].left"
                          label="左边距"
                          suffix="%"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model.number="uploadParams['formula'].top"
                          label="上边距"
                          suffix="%"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-switch
                          v-model="uploadParams['formula'].erasable"
                          label="是否可以擦除"
                        ></v-switch>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </template>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="elementTab !== 4"
            color="primary"
            text
            @click="uploadFile"
            >添加</v-btn
          >
          <v-btn text @click="dialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="showSettingPanel"
      v-model="showSettingPanel"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline lighten-2">
          <v-tabs v-model="settingType">
            <v-tab v-for="item in settingTabs" :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </v-card-title>
        <v-card-text>
          <v-tabs-items v-model="settingType">
            <v-tab-item>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].drawEnable"
                    label="允许涂鸦"
                    hide-details
                    @change="setDrawEnable"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].dataSyncEnable"
                    label="开启数据同步"
                    hide-details
                    @change="setDataSyncEnable"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].handwritingEnable"
                    label="开启笔锋"
                    hide-details
                    @change="setHandwritingEnable"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[0].showRemoteCursor"
                    label="显示远端画笔"
                    hide-details
                    @click="setRemoteCursorVisible"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.whiteBoard"
                    label="允许鼠标点击普通白板翻页"
                    hide-details
                    @change="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.h5PPT"
                    label="允许鼠标点击H5PPT翻页"
                    hide-details
                    @change="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.imgPPT"
                    label="允许鼠标点击静态PPT翻页"
                    hide-details
                    @change="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
                <v-col align-self="center">
                  <v-switch
                    v-model="settingItems[1].turnPage.imgFile"
                    label="允许鼠标点击图片组文件翻页"
                    hide-details
                    @click="setMouseToolBehavior"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="customGraphDialog"
      v-model="customGraphDialog"
      max-width="650"
    >
      <v-card>
        <v-card-title>添加自定义图形</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="inputCustomGraph"
            label="自定义图形URL"
            prepend-icon="mdi-image"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="addToCustomGraphList()"
            >添加至列表</v-btn
          >
          <v-btn text @click="customGraphDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="formulaEditorDialog"
      v-model="formulaEditorDialog"
      max-width="1050"
    >
      <v-card>
        <v-card-title>
          公式编辑器
          <a
            class="ml-4 primary--text text-subtitle-2"
            style="position: absolute; right: 32px"
            @click="window.open('https://demo.qcloudtiw.com/web/latest/res/tiw-formula-editor.zip')"
          >
            点击此处可下载源码
          </a>
        </v-card-title>
        <v-card-text>
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
            v-if="loadingEditor"
            style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 1000"
          ></v-progress-circular>
          <iframe
            src="https://demo.qcloudtiw.com/web/latest/formula-editor/examples/basic-usage.html"
            width="1000"
            height="500"
            style="border: none"
            @load="loadingEditor = false"
            v-if="formulaEditorDialog"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="uploadTranscodeFileDialog"
      v-model="uploadTranscodeFileDialog"
      max-width="800"
    >
      <v-stepper v-model="uploadSteps" vertical>
          <v-stepper-step
            :complete="uploadSteps > 1"
            step="1"
          >
            上传文件到COS桶{{useNewTranscodeMode? '(需开通文档预览)' : ''}}
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-file-input
              v-model="transcodeFileObj"
              label="上传课件"
              prepend-icon="mdi-file"
              accept=".doc,.docx,.ppt,.pptx,.pdf"
            ></v-file-input>
            <v-btn
              @click="uploadNewTranscodeFile"
              :loading="newTranscodeFileUploading"
              color="primary"
            >上传</v-btn>
          </v-stepper-content>

          <v-stepper-step
            :complete="uploadSteps > 2"
            step="2"
          >
            {{useNewTranscodeMode ? '获取文件COS地址并拼接白板参数' : '发起转码任务'}}
          </v-stepper-step>

          <v-stepper-content step="2" v-if="useNewTranscodeMode">
            <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px">文件COS源地址</span>
            <p style="word-break: break-all">
              {{newTranscodeUrl}}
            </p>
            <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px">拼接参数后的文件地址</span>
            <p style="word-break: break-all">
              {{newTranscodeUrl}}<span style="color: red">?for_tiw=1</span>
            </p>
            <v-text-field
              v-model="uploadParams['courseware'].fileName"
              label="课件名称"
            ></v-text-field>

            <v-btn
              color="primary"
              @click="(newTranscodeUrl = ''),
              (transcodeFileObj = null),
              (uploadTranscodeFileDialog = false),
              (uploadSteps = 1)"
            >
              确认添加
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2" v-else>
            <div v-if="!transcodeStart">
              <v-radio-group
                v-model="transcodeStaticMode"
                row
              >
                <v-radio
                  label="动态转码(暂时只支持ppt,pptx)"
                  :value="false"
                ></v-radio>
                <v-radio
                  label="静态转码"
                  :value="true"
                ></v-radio>
              </v-radio-group>

              <v-btn
                color="primary"
                @click="createTranscodeTask()"
              >
                开始转码
              </v-btn>
            </div>

            <div v-else>
              <div class="mb-4">
                <v-alert
                  type="error"
                  v-if="transcodeErrMsg.status === 'ERROR'"
                >
                  <h4>{{transcodeErrMsg.code}}</h4>
                  {{transcodeErrMsg.message}}
                </v-alert>

                <v-progress-linear
                  v-else
                  class="mb-2"
                  stream
                  buffer-value="0"
                  v-model="transcodePercent"
                  height="25"
                  :color="transcodePercent === 100? 'success' : 'primary'"
                >
                  <strong>{{ transcodePercent }}%</strong>
                </v-progress-linear>

                <div v-if="transcodePercent === 100">
                  <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px">转码文件名</span>
                  <p style="word-break: break-all">
                    {{uploadParams.courseware.fileName}}
                  </p>
                  <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px">转码文件地址</span>
                  <p style="word-break: break-all">
                    {{uploadParams.courseware.file}}
                  </p>
                  <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px">文件页数</span>
                  <p style="word-break: break-all">
                    {{uploadParams.courseware.pages}}
                  </p>
                  <span style="color: rgba(0, 0, 0, 0.6); font-size: 12px">分辨率</span>
                  <p style="word-break: break-all">
                    {{uploadParams.courseware.resolution}}
                  </p>
                </div>
              </div>

              <v-btn
                color="primary"
                :disabled="transcodePercent !== 100"
                @click="(newTranscodeUrl = ''),
                (transcodeFileObj = null),
                (uploadTranscodeFileDialog = false),
                (uploadSteps = 1)"
              >
                确认添加
              </v-btn>
            </div>
          </v-stepper-content>
      </v-stepper>
    </v-dialog>
  </v-list>
</template>

<script>
import Config from '../config';
import TiwTranscode from '../util/TiwTranscode';

export default {
  name: 'Toolbar',
  data() {
    return {
      settingType: null,
      settingTabs: ['基础设置', '鼠标行为设置'],
      settingItems: [
        {
          drawEnable: true,
          handwritingEnable: true,
          showRemoteCursor: true,
          dataSyncEnable: true,
        },
        {
          turnPage: {
            whiteBoard: true,
            h5PPT: true,
            imgPPT: true,
            imgFile: true,
          },
        },
      ],

      currentToolType:
        window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_PEN,
      dialog: false,
      thin: 50,
      fontSize: 320,
      window,

      formulaEditorDialog: false,
      loadingEditor: true,

      customGraphDialog: false,
      inputCustomGraph: null,

      mediaTab: null,
      backgroundTab: null,
      elementTab: null,

      useNewTranscodeMode: true,

      showSettingPanel: false,

      uploadType: '',
      uploadTypeList: {
        courseware: {
          title: '课件资源',
        },
        media: {
          title: '多媒体资源',
        },
        background: {
          title: '背景资源',
        },
        element: {
          title: '白板元素',
        },
      },
      uploadParamType: '',
      uploadParams: {
        courseware: {
          title: '课件',
          file: null,
          fileName: null,
          accept: '',
          resolution: '',
          pages: 0,
        },
        video: {
          title: '视频文件(MP4)',
          file: '',
        },
        audio: {
          title: '音频文件(MP3)',
          file: '',
        },
        h5File: {
          title: 'H5文件',
          file: '',
        },
        backgroundH5: {
          title: 'H5背景',
          file: '',
        },
        backgroundImg: {
          title: '背景图片',
          file: '',
        },
        imageElement: {
          title: '图片元素',
          file: '',
          left: '',
          right: '',
        },
        h5Element: {
          title: 'H5元素',
          file: '',
          left: '',
          right: '',
        },
        mathBoard: {
          title: '数学画板元素',
          opts: {
            axisColor: '#AEAEAE',
            width: '600',
            height: '600',
          },
          left: '',
          right: '',
        },
        mathGraph: {
          title: '数学函数图像元素',
          opts: {
            mathBoardId: '',
            expression: '',
            color: '#ff0000',
            selectedColor: '#00ff00',
          },
          left: '',
          right: '',
        },
        mathGraphType: {
          title: '几何图形',
          type: null,
        },
        formula: {
          title: '学科公式',
          expression: '',
          erasable: true, // 是否可以擦除
          left: '',
          top: '',
        },
      },
      coursewareFile: null,

      customGraphImages: [
        'https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E4%B8%89%E8%A7%92%E5%BD%A2.svg',
        'https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E6%8A%9B%E7%89%A9%E7%BA%BF_parabolic9.svg',
        'https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E8%8F%B1%E5%BD%A2.svg',
        'https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E6%B1%BD%E8%BD%A6.svg',
        'https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E7%83%A7%E6%9D%AF.svg',
        'https://test-1259648581.cos.ap-shanghai.myqcloud.com/%E7%A3%81%E9%93%81.svg',
      ],

      mathBoardIds: [],

      mathGraphTypes: [
        {
          label: '选中',
          value: TEduBoard.TEduBoardMathGraphType.NONE,
        },
        {
          label: '点',
          value: TEduBoard.TEduBoardMathGraphType.POINT,
        },
        {
          label: '直线',
          value: TEduBoard.TEduBoardMathGraphType.LINE,
        },
        {
          label: '线段',
          value: TEduBoard.TEduBoardMathGraphType.LINE_SEGMENT,
        },
        {
          label: '射线',
          value: TEduBoard.TEduBoardMathGraphType.RAY,
        },
        {
          label: '圆',
          value: TEduBoard.TEduBoardMathGraphType.CIRCLE,
        },
        {
          label: '角',
          value: TEduBoard.TEduBoardMathGraphType.ANGLE,
        },
        {
          label: '多边形',
          value: TEduBoard.TEduBoardMathGraphType.POLYGON,
        },
        {
          label: '向量',
          value: TEduBoard.TEduBoardMathGraphType.VECTOR,
        },
        {
          label: '椭圆',
          value: TEduBoard.TEduBoardMathGraphType.ELLIPSE,
        },
        {
          label: '立方体',
          value: TEduBoard.TEduBoardMathGraphType.CUBE,
        },
        {
          label: '圆柱体',
          value: TEduBoard.TEduBoardMathGraphType.CYLINDER,
        },
        {
          label: '圆锥体',
          value: TEduBoard.TEduBoardMathGraphType.CIRCULAR_CONE,
        },
      ],

      cosInstance: null,
      uploadTranscodeFileDialog: false,
      uploadSteps: 1,
      transcodeFileObj: null,
      newTranscodeFileUploading: false,
      newTranscodeUrl: '',

      transcodePercent: 0,
      transcodeStaticMode: false,
      transcodeStart: false,
      transcodeErrMsg: {
        staus: 'SUCCESS',
        code: '',
        error: '',
      },
      colorTask: null // 设置背景颜色的任务
    };
  },

  mounted() {
    window.addEventListener('message', (event) => {
      try {
        const recvData = event.data;
        const isString = Object.prototype.toString.call(recvData) === '[object String]';
        const data = isString ? JSON.parse(recvData) : recvData;
        if (data.cmd === 'tedu-formula-data') {
          this.uploadParams.formula.expression = data.data;
          this.formulaEditorDialog = false;
          this.loadingEditor = true;
        }
      } catch (e) {
        // console.error(e);
      }
    });

    this.cosInstance = new window.COS({
      // 本地生成密钥（不推荐线上使用）
      SecretId: Config.tencentSecretId,
      SecretKey: Config.tencentSectetKey,
    });
  },

  watch: {
    '$store.state.current.fileInfo': {
      handler() {
        this.mathBoardIds = window.teduBoard
          .getBoardElementList()
          .filter(i => i.type
              === TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_BOARD)
          .map(i => i.elementId);
      },
      deep: true,
    },
    elementTab(val) {
      if (val === 3) {
        this.mathBoardIds = window.teduBoard
          .getBoardElementList()
          .filter(i => i.type
              === TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_BOARD)
          .map(i => i.elementId);
      }
    },
    useNewTranscodeMode() {
      this.newTranscodeUrl = '';
      this.transcodeFileObj = null;
      this.uploadTranscodeFileDialog = false;
      this.uploadSteps = 1;
      this.uploadParams.courseware.file = null;
      this.uploadParams.courseware.fileName = null;
      this.uploadParams.courseware.pages = 0;
      this.uploadParams.courseware.resolution = '';
    },
    uploadTranscodeFileDialog(val) {
      if (!val) {
        this.uploadSteps = 1;
      }
    },
  },

  methods: {
    formatColor(color) {
      const [r, g, b, a] = color.match(/[\d.]+/).map(i => +i);
      return { r, g, b, a };
    },

    setToolType(toolType, isSolidLine = true, isFill = false, startArrowType = 1, endArrowType = 1) {
      console.log('setToolType:', isSolidLine, isFill, startArrowType, endArrowType);
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
        fillType: isFill ? TEduBoard.TEduBoardFillType.SOLID : TEduBoard.TEduBoardFillType.NONE,
        startArrowType: startArrowType,
        endArrowType: endArrowType,
      });
    },

    setPenToolType(toolType, enablePenAutoFit = false) {
      this.currentToolType = toolType;
      window.teduBoard.setToolType(toolType);

      window.teduBoard.enablePenAutoFit(enablePenAutoFit, 2000);
      if (enablePenAutoFit) {
        window.teduBoard.setHandwritingEnable(false);
      } else {
        window.teduBoard.setHandwritingEnable(this.settingItems[0].handwritingEnable);
      }
    },

    setBrushThin(thin) {
      window.teduBoard.setBrushThin(thin);
    },

    setTextSize(size) {
      window.teduBoard.setTextSize(size);
    },

    setColor(color) {
      if (
        this.currentToolType
        === window.TEduBoard.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_TEXT
      ) {
        window.teduBoard.setTextColor(color.hex);
      } else {
        window.teduBoard.setBrushColor(color.hex);
      }
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

    showUploadDialog(type) {
      this.uploadType = type;
      this.dialog = true;
    },

    showSettingPanelDialog() {
      this.showSettingPanel = true;
    },

    uploadFile() {
      let type = '';
      if (this.uploadType === 'courseware') {
        type = 'courseware';
      } else if (this.uploadType === 'media') {
        if (this.mediaTab === 0) {
          type = 'video';
        } else if (this.mediaTab === 1) {
          type = 'audio';
        } else {
          type = 'h5File';
        }
      } else if (this.uploadType === 'background') {
        if (this.backgroundTab === 0) {
          type = 'backgroundH5';
        } else {
          type = 'backgroundImg';
        }
      } else {
        if (this.elementTab === 0) {
          type = 'imageElement';
        } else if (this.elementTab === 1) {
          type = 'h5Element';
        } else if (this.elementTab === 2) {
          type = 'mathBoard';
        } else if (this.elementTab === 3) {
          type = 'mathGraph';
        } else if (this.elementTab === 5) {
          type = 'formula';
        }
      }

      switch (type) {
        case 'courseware':
          if (this.useNewTranscodeMode) {
            window.teduBoard.addTranscodeFile({
              url: this.uploadParams.courseware.file,
              title:
                this.uploadParams.courseware.fileName
                || `测试文件-${Date.now()}`,
            });
          } else {
            window.teduBoard.addTranscodeFile({
              url: this.uploadParams.courseware.file,
              title:
                this.uploadParams.courseware.fileName
                || `测试文件-${Date.now()}`,
              pages: this.uploadParams.courseware.pages,
              resolution: this.uploadParams.courseware.resolution,
            });
          }
          this.uploadParams.courseware.file = null;
          this.uploadParams.courseware.fileName = null;
          this.uploadParams.courseware.pages = 0;
          this.uploadParams.courseware.resolution = '';
          break;
        case 'video':
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          window.teduBoard.addVideoFile(this.uploadParams.video.file);
          this.uploadParams.video.file = null;
          break;
        case 'audio':
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          window.teduBoard.addElement(
            window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_AUDIO,
            this.uploadParams.audio.file,
          );
          this.uploadParams.audio.file = null;
          break;
        case 'h5File':
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          window.teduBoard.addH5File(this.uploadParams.h5File.file);
          this.uploadParams.h5File.file = null;
          break;
        case 'backgroundImg':
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          window.teduBoard.setBackgroundImage(
            this.uploadParams.backgroundImg.file,
            window.TEduBoard.TEduBoardImageFitMode
              .TEDU_BOARD_IMAGE_FIT_MODE_CENTER,
          );
          this.uploadParams.backgroundImg.file = null;
          break;
        case 'backgroundH5':
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          window.teduBoard.setBackgroundH5(this.uploadParams.backgroundH5.file);
          this.uploadParams.backgroundH5.file = null;
          break;
        case 'h5Element': {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          const opt = {};
          if (this.uploadParams.h5Element.left) {
            opt.left = this.uploadParams.h5Element.left;
          }
          if (this.uploadParams.h5Element.top) {
            opt.top = this.uploadParams.h5Element.top;
          }
          window.teduBoard.addElement(
            window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_H5,
            this.uploadParams.h5Element.file,
            opt,
          );
          this.uploadParams.h5Element.file = null;
          this.uploadParams.h5Element.left = '';
          this.uploadParams.h5Element.top = '';
          break;
        }
        case 'imageElement': {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          const opt = {};
          if (this.uploadParams.imageElement.left) {
            opt.left = this.uploadParams.imageElement.left;
          }
          if (this.uploadParams.imageElement.top) {
            opt.top = this.uploadParams.imageElement.top;
          }
          window.teduBoard.addElement(
            window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_IMAGE,
            this.uploadParams.imageElement.file,
            opt,
          );
          this.uploadParams.imageElement.file = null;
          this.uploadParams.imageElement.left = '';
          this.uploadParams.imageElement.top = '';
          break;
        }
        case 'mathBoard': {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          const opt = {};
          if (this.uploadParams.mathBoard.left) {
            opt.left = this.uploadParams.mathBoard.left;
          }
          if (this.uploadParams.mathBoard.top) {
            opt.top = this.uploadParams.mathBoard.top;
          }
          window.teduBoard.addElement(
            window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_BOARD,
            this.uploadParams.mathBoard.opts,
            opt,
          );
          this.uploadParams.mathBoard.opts = {
            axisColor: '#AEAEAE',
            width: '600',
            height: '400',
          };
          this.uploadParams.mathBoard.left = '';
          this.uploadParams.mathBoard.top = '';
          break;
        }
        case 'mathGraph': {
          // 该接口为Demo体验接口，不保证稳定性，实际教学中请使用云API发起转码
          window.teduBoard.addElement(
            window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_MATH_GRAPH,
            this.uploadParams.mathGraph.opts,
          );
          this.uploadParams.mathGraph.opts = {
            mathBoardId: '',
            expression: '',
            color: '#ff0000',
            selectedColor: '#00ff00',
          };
          this.uploadParams.mathGraph.left = '';
          this.uploadParams.mathGraph.top = '';
          break;
        }

        case 'formula': {
          window.teduBoard.addElement(TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_FORMULA, {
            expression: this.uploadParams.formula.expression,
          }, {
            erasable: this.uploadParams.formula.erasable,
            left: `${this.uploadParams.formula.left}%`,
            top: `${this.uploadParams.formula.top}%`,
          });
          this.uploadParams.formula = {
            title: '学科公式',
            expression: '',
            erasable: true, // 是否可以擦除
            left: '',
            top: '',
          };
          break;
        }
      }
      this.dialog = false;
    },

    setCustomGraph(url) {
      window.teduBoard.addElement(
        window.TEduBoard.TEduBoardElementType.TEDU_BOARD_ELEMENT_CUSTOM_GRAPH,
        url,
      );
    },

    setDrawEnable() {
      window.teduBoard.setDrawEnable(this.settingItems[0].drawEnable);
    },

    setHandwritingEnable() {
      window.teduBoard.setHandwritingEnable(this.settingItems[0].handwritingEnable);
    },

    setDataSyncEnable() {
      window.teduBoard.setDataSyncEnable(this.settingItems[0].dataSyncEnable);
    },

    setRemoteCursorVisible() {
      window.teduBoard.setRemoteCursorVisible(this.settingItems[0].showRemoteCursor);
    },

    addToCustomGraphList() {
      if (!this.customGraphImages.includes(this.inputCustomGraph)) {
        this.customGraphImages.push(this.inputCustomGraph);
        console.log(this.customGraphDialog);
      }
      this.customGraphDialog = false;
    },

    viewDoc() {
      window.open(
        'https://cloud.tencent.com/document/product/1137/55888',
        '_blank',
      );
    },

    // 设置数学工具
    setMathGraphType() {
      window.teduBoard.setMathGraphType(
        this.uploadParams.mathGraphType.type,
        true,
      );
    },

    // 设置鼠标操作行为
    setMouseToolBehavior() {
      window.teduBoard.setMouseToolBehavior({
        turnPage: this.settingItems[1].turnPage,
      });
    },

    uploadNewTranscodeFile() {
      if (!this.transcodeFileObj) return;

      this.newTranscodeFileUploading = true;
      this.cosInstance.putObject({
        Bucket: Config.cosBucket, /* 必须 */
        Region: Config.cosRegion,     /* 存储桶所在地域，必须字段 */
        Key: this.transcodeFileObj.name,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: this.transcodeFileObj, // 上传文件对象
        onProgress: (progressData) => {
          if (progressData.percent === 1) {
            this.newTranscodeFileUploading = false;
            this.uploadSteps = 2;
            this.transcodeStart = false;
            this.transcodeErrMsg.status = 'SUCCESS';
            this.transcodePercent = 0;
          }
        },
      }, async (err, data) => {
        if (!err) {
          this.newTranscodeUrl = `https://${data.Location}`;
          this.uploadParams.courseware.file = `${this.newTranscodeUrl}?for_tiw=1`;
          this.uploadParams.courseware.fileName = this.transcodeFileObj.name;
        }
      });
    },

    createTranscodeTask() {
      this.transcodeStart = true;
      TiwTranscode.createTranscodeTask({
        Url: this.newTranscodeUrl,
        IsStaticPPT: this.transcodeStaticMode,
      }, (data) => {
        if (data.status === 'SUCCESS') {
          this.transcodePercent = data.fileData.Progress;
          this.transcodeErrMsg.status = 'SUCCESS';
          if (this.transcodePercent === 100) {
            this.uploadParams.courseware.file = `${data.fileData.ResultUrl}`;
            this.uploadParams.courseware.fileName = `${data.fileData.Title}`;
            this.uploadParams.courseware.pages = `${data.fileData.Pages}`;
            this.uploadParams.courseware.resolution = `${data.fileData.Resolution}`;
          }
        } else {
          this.transcodeErrMsg = {
            status: 'ERROR',
            code: data.code,
            message: data.message,
          };
        }
      });
    },

    setPiecewiseErasureEnable(enable) {
      window.teduBoard.setPiecewiseErasureEnable(enable);
    },
  },
};
</script>

<style scoped>
</style>
