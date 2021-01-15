<font color='red'>
注意：此开源项目仅用于演示一种组合腾讯云的互动白板、TRTC、IM 产品进行在线授课的方案。我们无法对此开源项目的可靠性负责，也不提供技术支持。请勿直接在生产系统中使用。
</font>

## 方案简介

腾讯云在线教育互动课堂（Tencent Interact Class，TIC）是集实时音视频、交互式白板涂鸦、IM 聊天室、PPT 课件共享、屏幕分享和录制回放等功能于一体的一站式在线教育互动课堂解决方案。

* [互动白板官网](https://cloud.tencent.com/document/product/1137)
* [实时音视频官网](https://cloud.tencent.com/document/product/647)
* [即时通信官网](https://cloud.tencent.com/document/product/269)

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
<td style="text-align:center">
<img src="https://main.qcloudimg.com/raw/6cf3b2864c6ad847f380e4877f56ed93.png" width="150"/></td>
<td style="text-align:center"><img src="https://main.qcloudimg.com/raw/98569a546d085544b5171670e6e60c11.png" width="150"/></td>
<td style="text-align:center"><img src="https://main.qcloudimg.com/raw/b660a6c57aecebf6a0c749a1daf8532a.jpg" width="150"/></td>
<td style="text-align:center">
<a href="https://demo.qcloudtiw.com/mac/app/TICDemo_Mac.zip">点击下载</a>
</td>
<td style="text-align:center">
<a href="https://demo.qcloudtiw.com/win/exe/tic_demo.zip">点击下载</a>
</td>
<td style="text-align:center">
<a href="https://demo.qcloudtiw.com/web/latest/index.html">点击体验</a>
</td>
</tr>
</table>

* iOS 和 Android 扫码后，请输入安装密码 `tiw` 后即可安装。
* 实时音视频 Web 端所依赖的 WebRTC 技术由于各浏览器实现差异，在移动端兼容性较差，不建议您在移动端使用。本 Demo 只针对桌面端浏览器做过适配，若需要在移动端使用，需要您自行做移动端适配工作。
* 本 Demo 仅用于演示互动白板产品功能，源码对外开放，可供您接入时参考，但是 Demo 本身未经过严格测试，若您计划将 Demo 代码用于生产环境，请确保发布前自行进行充分测试，避免发生潜在问题可能给您造成损失。

<table>
<tr>
<td>
iOS
</td>
<td>
Android
</td>
</tr>
<tr>
<td style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/e21c76fabb83e3185679ad28f175eafb.png"/></td>
<td style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/ecc0f984442bd32aec81879a6cf41961.png"/></td>
</tr>
</table>

<table>
<tr>
<td>
Mac
</td>
<td>
Windows
</td>
<td>
Web
</td>
</tr>
<tr>
<td style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/7ee48a5592da9acc2347b421e0170a71.png"/></td>
<td style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/f79cfa748fa69cd2be23abd899726c18.png"/></td>
<td style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/db4305fa7ee7e02abf09ba3cda82c084.png"/></td>
</tr>
</table>


## Demo 编译

为避免开发测试导致账号被强制下线，您需要替换自己的`SDKAppID`和测试账号信息。登录 [实时音视频控制台](https://console.cloud.tencent.com/trtc)，选择左侧菜单栏【开发辅助】>【UserSig生成&校验】，在【应用（SDKAppID）】下拉框中选择对应的应用，生成一组`UserID`和`UserSig`。最后将`SDKAppID`以及`UserID`对应的`UserSig`替换配置文件中对应的字段即可。

|所属平台|配置文件路径|
|-|-|
|Android|Android/Demo/app/src/main/res/raw/config.json|
|iOS|iOS/Demo/TICDemo/TICDemo/Config/config.json|
|Windows|Windows/Demo/config.json|
|macOS|macOS/Demo/TICDemo_Mac/TICDemo_Mac/Config/config.json|
|Web|Web/Demo/js/account_dev.js|
|小程序|小程序/Demo/miniprogram/pages/tic/account.js|

## 优秀案例

<table>
<tr>
<td>
<a href="https://mp.weixin.qq.com/s/uGVhpxRW4ZYXwlmZr8diuA">网壳课堂</a> - 灵活的多人白板互动，让课堂更有参与感
</td>

<td>
<a href="https://mp.weixin.qq.com/s/ssXmeEAYp7gJcxKr0hnPnw">毛豆课堂</a> - 让每一个孩子成为最好的自己
</td>
</tr>
<tr>
<td style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/b625503511f2612b91612fdff54d5c78.png"/></td>
<td style="text-align:center; width:33%;"><img src="https://main.qcloudimg.com/raw/bc4b24a2fee707bca7488cb034fe0530.png"/></td>
</tr>
</table>

<table>
<tr>
</tr>
<tr>
</tr>
</table>





