const TEST_ACCOUNT = require('../../account');

Page({
  data: {
    sdkAppId: TEST_ACCOUNT.sdkappid,
    array: TEST_ACCOUNT.users,
    roomID: 0,
    role: 0, // 0 学生， 1： 老师
    index: Math.floor((Math.random() * TEST_ACCOUNT.users.length))
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindRoomID: function (e) {
    var self = this;
    self.setData({
      roomID: e.detail.value
    });
  },

  onLoad: function () {},

  radioChange(ev) {
    this.setData({
      role: ev.detail.value * 1
    })
  },

  onClick() {
    if (!this.data.roomID || isNaN(this.data.roomID)) {
      wx.showToast({
        icon: 'none',
        title: '房间号只支持32位整型数字'
      })
      return;
    }
    var url = `/pages/tic/room_webview/room/room?sdkAppId=${this.data.sdkAppId}&userId=${TEST_ACCOUNT.users[this.data.index]['userId']}&userSig=${TEST_ACCOUNT.users[this.data.index]['userToken']}&roomID=${this.data.roomID}&role=${this.data.role}`;
    wx.navigateTo({
      url: url
    });
  }
})