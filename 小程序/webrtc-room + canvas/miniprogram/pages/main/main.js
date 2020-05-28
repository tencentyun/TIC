// miniprogram/pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false,
    canUse: 0, // 是否可以使用音视频组件
    entryInfos: [
      {
        icon: "../../resources/images/board2.png",
        title: "互动课堂PaaS",
        desc: "webview方式",
        navigateTo: "/pages/tic/room_webview/index/index"
      },

      {
        icon: "../../resources/images/board1.png",
        title: "互动课堂PaaS",
        desc: "canvas方式",
        navigateTo: "/pages/tic/room_canvas/index/index"
      },

      // {
      //   icon: "../../resources/images/tic.png",
      //   title: '互动课堂SaaS',
      //   navigateTo: "/pages/saas/index/index"
      // }
    ]
  },

  // 点击事件
  onEntryTap(e) {
    if (this.data.canUse) {
      var toUrl = this.data.entryInfos[e.currentTarget.id].navigateTo;
      wx.navigateTo({
        url: toUrl,
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
        showCancel: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (!wx.createLivePlayerContext) {
      setTimeout(function () {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
          showCancel: false
        });
      }, 0);
    } else {
      // 版本正确，允许进入
      this.data.canUse = 1;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})