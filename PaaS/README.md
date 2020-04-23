本文主要介绍如何本地编译运行互动课堂`TICDemo`。

## 下载说明

如果您访问 Github 遇到问题，请使用腾讯云分流地址下载：

<table>
<tr>
<th style="text-align:center">Web</th>
<th style="text-align:center">小程序</th>
<th style="text-align:center">Windows</th>
<th style="text-align:center">Android</th>
<th style="text-align:center">iOS</th>
<th style="text-align:center">macOS</th>
</tr>
<tr>
<td style="text-align:center"><a href="https://tic-res-1259648581.file.myqcloud.com/demo/web/web-demo.zip">Download Zip</a></td>
<td style="text-align:center"><a href="https://tic-res-1259648581.file.myqcloud.com/demo/wx/%E5%B0%8F%E7%A8%8B%E5%BA%8F.zip">Download Zip</a></td>
<td style="text-align:center"><a href="https://tic-res-1259648581.file.myqcloud.com/demo/Windows.zip">Download Zip</a></td>
<td style="text-align:center"><a href="https://tic-res-1259648581.file.myqcloud.com/demo/android/TICDemo.zip">Download Zip</a></td>
<td style="text-align:center"><a href="https://tic-res-1259648581.file.myqcloud.com/demo/ios/TICDemo.zip">Download Zip</a></td>
<td style="text-align:center"><a href="https://tic-res-1259648581.file.myqcloud.com/demo/mac/src/TICDemo_Mac.zip">Download Zip</a></td>
</tr>
</table>

## Demo 下载

|所属平台|Demo 源码|Demo 运行说明| TIC 接入文档|
|:-:|:-:|:-:|:-:|
|Android|[Github](https://github.com/tencentyun/TIC/tree/master)|[Doc](./Android/README.md)|[Doc](./Docs/SDK文档/Android/互动课堂接入文档.md)|
|iOS|[Github](https://github.com/tencentyun/TIC/tree/master)|[Doc](./iOS/README.md)|[Doc](./Docs/SDK文档/iOS/互动课堂接入文档.md)|
|Windows|[Github](https://github.com/tencentyun/TIC/tree/master)|[Doc](./Windows/README.md)|[Doc](./Docs/SDK文档/Windows/互动课堂接入文档.md)|
|macOS|[Github](https://github.com/tencentyun/TIC/tree/master)|[Doc](./macOS/README.md)|[Doc](./Docs/SDK文档/macOS/互动课堂接入文档.md)|
|Web|[Github](https://github.com/tencentyun/TIC/tree/master)|[Doc](./Web/README.md)|[Doc](./Docs/SDK文档/Web/互动课堂接入文档.md)|
|小程序|[Github](https://github.com/tencentyun/TIC/tree/master)|[Doc](./小程序/README.md)|[Doc](./Docs/SDK文档/小程序/互动课堂接入文档.md)|

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



