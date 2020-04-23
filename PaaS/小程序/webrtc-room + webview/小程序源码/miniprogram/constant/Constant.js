const CONSTANT = {
  IM: {
    LOGIN_EVENT: 'login_event', // 登录事件
    JOIN_GROUP_EVENT: 'join_group_event', // 创建|加入群组事件
    CONNECTION_EVENT: 'connection_event', // 连接状态事件
    BIG_GROUP_MSG_NOTIFY: 'big_group_msg_notify', // 大群消息通知
    MSG_NOTIFY: 'msg_notify', // 普通群消息
    GROUP_SYSTEM_NOTIFYS: 'group_system_notifys', // 监听（多终端同步）群系统消息事件，必填
    GROUP_INFO_CHANGE_NOTIFY: 'group_info_change_notify', // 监听群资料变化事件，选填
    KICKED: 'kicked' // 被踢下线
  },

  ROOM: {
    ERROR_OPEN_CAMERA: -4, //打开摄像头失败
    ERROR_OPEN_MIC: -5, //打开麦克风失败
    ERROR_PUSH_DISCONNECT: -6, //推流连接断开
    ERROR_CAMERA_MIC_PERMISSION: -7, //获取不到摄像头或者麦克风权限
    ERROR_EXCEEDS_THE_MAX_MEMBER: -8, // 超过最大成员数
    ERROR_REQUEST_ROOM_SIG: -9, // 获取房间SIG错误
    ERROR_JOIN_ROOM: -10, // 进房失败

    SUCC_PUSH: 10, // 推流成功
    SUCC_JOIN_ROOM: 11, // 进房成功
    SUCC_MEMBERS_LIST: 12, // 成员列表

    NETWORK_CHANGE: 13, // 网络改变
    PUSHER_LOADING: 14, // 推流端loading
    PUSHER_PLAY: 15, // 推流端play

    PLAYER_LOADING: 16, // 对端loading
    PLAYER_PLAY: 17, // 对端loading
    PLAYER_DISCONNECT: 18, // 对端断开连接

    // 正常退房
    EXIT_ROOM: 19 // 正常退房
  },

  BOARD: {
    // 白板SDK鉴权失败
    VERIFY_SDK_ERROR: String(-4000),

    // 实时数据
    REAL_TIME_DATA: String(4001),
    // 新增白板
    ADD_BOARD: String(4002),
    // 删除白板
    DELETE_BOARD: String(4003),
    // 切换白板
    SWITCH_BOARD: String(4004),
    // 增加组
    ADD_GROUP: String(4005),
    // 删除组
    DELETE_GROUP: String(4006),
    // 切换组
    SWITCH_GROUP: String(4007),

    // 各端同步数据
    ADD_DATA_ERROR: String(4008),

    // 背景图片开始加载
    IMG_START_LOAD: String(4009),

    // 图片加载完成
    IMG_LOAD: String(4010),

    // 图片加载错误
    IMG_ERROR: String(4011),

    // 图片加载中断
    IMG_ABORT: String(4012),

    // 历史数据同步完成
    HISTROY_DATA_COMPLETE: String(4013),

    // 白板SDK鉴权通过
    VERIFY_SDK_SUCC: String(4014),

    CANVAS_MOUSEDOWN: String(4015),

    CANVAS_MOUSEMOVE: String(4016),

    CANVAS_MOUSEUP: String(4017),

    CANVAS_MOUSELEAVE: String(4018),
  },

  EVENT: {
    BOARD: {
      'TEB_INIT': 'TEB_INIT',
      'TEB_OPERATE_CANUNDO_STATUS_CHANGED': 'TEB_OPERATE_CANUNDO_STATUS_CHANGED',
      'TEB_OPERATE_CANREDO_STATUS_CHANGED': 'TEB_OPERATE_CANREDO_STATUS_CHANGED',
      'TEB_ADDBOARD': 'TEB_ADDBOARD',
      'TEB_SYNCDATA': 'TEB_SYNCDATA',
      'TEB_ERROR': 'TEB_ERROR',
      'TEB_WARNING': 'TEB_WARNING',
      'TEB_HISTROYDATA_SYNCCOMPLETED': 'TEB_HISTROYDATA_SYNCCOMPLETED',
      'TEB_IMAGE_STATUS_CHANGED': 'TEB_IMAGE_STATUS_CHANGED',
      'TEB_H5BACKGROUND_STATUS_CHANGED': 'TEB_H5BACKGROUND_STATUS_CHANGED',
      'TEB_DELETEBOARD': 'TEB_DELETEBOARD',
      'TEB_GOTOBOARD': 'TEB_GOTOBOARD',
      'TEB_ADDH5PPTFILE': 'TEB_ADDH5PPTFILE',
      'TEB_ADDFILE': 'TEB_ADDFILE',
      'TEB_DELETEFILE': 'TEB_DELETEFILE',
      'TEB_FILEUPLOADSTATUS': 'TEB_FILEUPLOADSTATUS',
      'TEB_SWITCHFILE': 'TEB_SWITCHFILE',
      'TEB_SETBACKGROUNDIMAGE': 'TEB_SETBACKGROUNDIMAGE',
      'TEB_TRANSCODEPROGRESS': 'TEB_TRANSCODEPROGRESS',
      'TEB_ADDTRANSCODEFILE': 'TEB_ADDTRANSCODEFILE',
    }
  }
}

module.exports = CONSTANT;