const Constant = {
  TICModule: {
    TICMODULE_IMSDK: 0, //IMSDK模块
    TICMODULE_TRTC: 1, //TRTC模块
    TICMODULE_BOARD: 2, //BOARD模块
    TICMODULE_TIC: 3, //TIC模块
  },

  /**
   * 课堂场景
   **/
  TICClassScene: {
    TIC_CLASS_SCENE_VIDEO_CALL: 0, //实时通话模式，支持1000人以下场景，低延时
    TIC_CLASS_SCENE_LIVE: 1, //直播模式，支持1000人以上场景，会增加600ms左右延时
  },

  /**
   * 房间角色
   * 仅适用于直播模式（TIC_CLASS_SCENE_LIVE），角色TIC_ROLE_TYPE_ANCHOR具有上行权限
   **/
  TICRoleType: {
    TIC_ROLE_TYPE_ANCHOR: 20, //主播
    TIC_ROLE_TYPE_AUDIENCE: 21, //观众
  },

  TICDisableModule: {
    TIC_DISABLE_MODULE_NONE: 0, //默认全部启用
    TIC_DISABLE_MODULE_TRTC: (1 << 1), //禁用TRTC
  }
};




export default Constant;