## 方案简介

腾讯云在线教育互动课堂（Tencent Interact Class，TIC）是集实时音视频、交互式白板涂鸦、IM 聊天室、PPT 课件共享、屏幕分享和录制回放等功能于一体的一站式在线教育互动课堂解决方案。

## Demo 体验

<table>
<tr>
<th style="text-align:center">Android</th>
<th style="text-align:center">iOS</th>
<th style="text-align:center">小程序</th>
<th style="text-align:center">Mac OS</th>
<th style="text-align:center">Windows</th>
<th style="text-align:center">Web</th>
</tr>
<tr>
<td style="text-align:center"><img src="https://main.qcloudimg.com/raw/6cf3b2864c6ad847f380e4877f56ed93.png" width="150"/></td>
<td style="text-align:center"><img src="https://main.qcloudimg.com/raw/98569a546d085544b5171670e6e60c11.png" width="150"/></td>
<td style="text-align:center"><img src="https://main.qcloudimg.com/raw/b660a6c57aecebf6a0c749a1daf8532a.jpg" width="150"/></td>
<td style="text-align:center">
<a href="https://demo.qlcoudtiw.com/mac/app/TICDemo_Mac.zip">点击下载</a>
</td>
<td style="text-align:center">
<a href="https://demo.qlcoudtiw.com/wins/exe/TICDemo_Windows.zip">点击下载</a>
</td>
<td style="text-align:center">
<a href="https://tic-demo-1259648581.cos.ap-shanghai.myqcloud.com/index.html">点击体验</a>
</td>
</tr>
</table>

>? iOS 和 Android 扫码后，请输入安装密码 `tiw` 后即可安装。

**iOS**

<table>
<tr>
<th style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/ed7cf5d61d672b5a33ccc5127c603d00.jpg"/></th>
<th style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/70bc3687abd7d8e9a073a231a78685cf.jpg"/></th>
<th style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/d2371d5aebab2f6fe4be2c985e9250d5.jpg"/></th>
</tr>
</table>

**Android**

<table>
<tr>
<th style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/e22dad1473a0365b77508bda74538d94.jpg"/></th>
<th style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/d8d89cf70076c579a4328e36af99c7a4.jpg"/></th>
<th style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/1e7f984701abb1cef08513f085087bef.jpg"/></th>
</tr>
</table>

**Mac OS**

![](https://main.qcloudimg.com/raw/89b12ab1c38739de7ff3366e275f2ece.jpg)

**Windows**

![](https://main.qcloudimg.com/raw/5e3691859f5ef2694c99f1a0d487461d.jpg)

**Web**

![](https://main.qcloudimg.com/raw/e049152ec1eea11c633b952753337af5.jpg)


## Demo 编译

为避免开发测试导致账号被强制下线，您需要替换自己的`SDKAppID`和测试账号信息。

登录 [实时音视频控制台](https://console.cloud.tencent.com/trtc)，选择左侧菜单栏【开发辅助】>【UserSig生成&校验】，在【应用（SDKAppID）】下拉框中选择对应的应用，生成一组`UserID`和`UserSig`。
![](https://main.qcloudimg.com/raw/80eed8e45a6bfd403db05ec96b24072e.png)
然后将`SDKAppID`以及`UserID`对应的`UserSig`替换配置文件中对应的字段即可。

|所属平台|配置文件路径|
|-|-|
|Android|Android/Demo/app/src/main/res/raw/config.json|
|iOS|iOS/Demo/TICDemo/TICDemo/Config/config.json|
|Windows|Windows/Demo/config.json|
|macOS|macOS/Demo/TICDemo_Mac/TICDemo_Mac/Config/config.json|
|Web|Web/Demo/js/account_dev.js|
|小程序|小程序/Demo/miniprogram/pages/tic/account.js|



