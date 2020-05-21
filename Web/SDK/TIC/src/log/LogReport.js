import md5 from 'js-md5';

class LogReport {

  constructor() {
    this.reportApi = 'https://ilivelog.qcloud.com/log/report';

    this.reportData = {
      business: 'tic2.0',
      dcid: 'dc0000',
      version: 0,
      kv_str: ''
    };

    this.businessData = {
      sdkAppId: '', //int	应用标识
      userId: '', //String	用户Id
      sdkVersion: '', //String	sdk版本号
      devId: '', //String	设备Id
      devType: '', //String	设备型号
      netType: '', //String	网络类型，"Wifi","4G","3G","2G"
      platform: 'Web', //String	平台，"iOS","Android","macOS","Windows","Web","小程序"
      sysVersion: navigator.userAgent, //String	系统版本
      roomId: '', //String	房间号

      event: '', //String	事件
      errorCode: '', //int	错误码
      errorDesc: '', //String	错误信息
      timeCost: '', //int	耗时（ms）
      timestamp: '', //int64	时间戳（ms）
      data: '', //String	事件数据
      ext: '', //String	扩展字段
    }
  }

  setSdkAppId(sdkAppId) {
    this.businessData.sdkAppId = sdkAppId;
  }

  setUserId(userId) {
    this.businessData.userId = userId;
  }

  setSdkVersion(sdkVersion) {
    this.businessData.sdkVersion = sdkVersion;
  }

  setRoomId(roomId) {
    this.businessData.roomId = roomId;
  }

  getXHR() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
      }
    }
    if (xmlhttp == null) {
      return;
    }
    return xmlhttp;
  }

  post() {
    var arr = [];
    for (var p in this.businessData) {
      if (p === 'errorDesc') {
        arr.push(`${p}=${encodeURIComponent(this.businessData[p])}`);
      } else {
        arr.push(`${p}=${this.businessData[p]}`);
      }
    }
    this.reportData.kv_str = arr.join('&');

    var xhr = this.getXHR();
    xhr.open('POST', this.reportApi + '?sign=' + md5(JSON.stringify(this.reportData)), true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(this.reportData));
  }

  report(eventName, data) {
    this.businessData.event = eventName;
    Object.assign(this.businessData, {
      timestamp: Date.now()
    }, data);
    this.post();
  }
}

LogReport.EVENT_NAME = {
  INITSDK_START: 'initSdk_start', //	im初始化	
  INITSDK_END: 'initSdk_end', //	im初始化	
  LOGIN_START: 'login_start', //	im登陆	
  LOGIN_END: 'login_end', //	im登陆	
  LOGOUT_START: 'logout_start', //	im登出	
  LOGOUT_END: 'logout_end', //	im登出	
  CREATEGROUP_START: 'createGroup_start', //	创建群组	
  CREATEGROUP_END: 'createGroup_end', //	创建群组	
  DELETEGROUP_START: 'deleteGroup_start', //	销毁群组	
  DELETEGROUP_END: 'deleteGroup_end', //	销毁群组	
  JOINGROUP_START: 'joinGroup_start', //	加入群组	
  JOINGROUP_END: 'joinGroup_end', //	加入群组	
  JOINCHATGROUP_START: 'joinChatGroup_start', //	加入群组	
  JOINCHATGROUP_END: 'joinChatGroup_end', //	加入群组	
  INITBOARD_START: 'initBoard_start', //	初始化白板	
  INITBOARD_END: 'initBoard_end', //	初始化白板	
  SYNCBOARDHISTORY_END: 'syncBoardHistory_end', //	白板历史数据同步	
  ENTERROOM_START: 'enterRoom_start', //	trtc进房	
  ENTERROOM_END: 'enterRoom_end', //	trtc进房	
  QUITGROUP_START: 'quitGroup_start', //	退出群组	
  QUITGROUP_END: 'quitGroup_end', //	退出群组	
  SENDOFFLINERECORDINFO_START: 'sendOfflineRecordInfo_start', //	发送对时信息	
  SENDOFFLINERECORDINFO_END: 'sendOfflineRecordInfo_end', //	发送对时信息	
  ONUSERAUDIOAVAILABLE: 'onUserAudioAvailable', //	音频是否启用	{userId:, available:}
  ONUSERVIDEOAVAILABLE: 'onUserVideoAvailable', //	视频是否启用	{userId:, available:}
  ONUSERSUBSTREAMAVAILABLE: 'onUserSubStreamAvailable', //	辅流是否启用	{userId:, available:}
  ONFORCEOFFLINE: 'onForceOffline', //	被强制下线	
  ONUSERSIGEXPIRED: 'onUserSigExpired', //	userSig过期	
  ONTEBERROR: 'onTEBError', //	错误信息	
  ONTEBWARNING: 'onTEBWarning', //	警告信息
}

export default LogReport;