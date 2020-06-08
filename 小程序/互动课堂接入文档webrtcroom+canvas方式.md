出于政策和合规的考虑，微信暂时没有放开所有小程序对`live-pusher`和`live-player`标签的支持。
需要在小程序管理后台选择【设置】>【接口设置】中自助开通该组件权限，如下图所示：
![](https://mc.qcloudimg.com/static/img/a34df5e3e86c9b0fcdfba86f8576e06a/weixinset.png)

## 版本要求
微信6.6.6版本开始支持。

##  集成 TIC SDK

>? 本文档适用于使用trtc-room + canvas方式(不推荐，推荐使用[trtc-room + webview方式](互动课堂接入文档.md))；小程序端 TIC 将以组件的方式集成，接入过程中只需要关注 tic-component 和 trtc--room。

> 两种方式能力对比

|      白板功能点         |     【trtc-room + canvas方式】支持  | 【trtc-room + webview方式】支持 | 说明 |
| ------------------ | -------- |------|------|
| 画笔 | ✔ |  ✔ | |
| 橡皮 | ✔ |  ✔ | |
| 激光笔 | ✔  | ✔ | |
| 直线 | ✔ |  ✔ | | |
| 空心椭圆 | ✔ |  ✔ | |
| 空心矩形 | ✔ |  ✔ | |
| 实心椭圆 | ✔ |  ✔ | |
| 实心矩形 | ✔ |  ✔ | |
| 背景色 | ✔ |  ✔ | |
| 背景图 | ✔ |  ✔ | |
| H5背景 | ✖ |  ✔ | |
| 点选 | ✔ |  ✔ | |
| 框选 | ✔ |  ✔ | |
| 撤销 | ✔ |  ✔ | |
| 重做 | ✔ |  ✔ | |
| 文件展示 | ✔  | ✔ | 支持PPT、PDF、WORD、EXCEL |
| 文件上传 | ✔  | ✔ | 支持PPT、PDF、WORD、EXCEL，图片 |
| 动画H5PPT | ✖  | ✔ | |
| 放大 | ✖ |  ✔ | |
| 缩小 | ✖ |  ✔ | |
| 拖动 | ✖ |  ✔ | |
| 初始化设置白板比例 | ✔  | ✔ | |
| 文字输入/展示 | ✖ | ✔  | |
| 涂鸦平滑级别 | ✔ |  ✔  | |
| 动态设置白板比例 | ✖ |  ✔ | |
| 白板内容填充方式 | ✖ |  ✔ | |

### 源码简介

```
- components
  - tic-component tic 组件
  - board-component 白板组件
  - libs 依赖库
  - webim-component IM 组件
  - trtc-room trtc 组件
  - event 事件监听
  - elk-component 日志组件
```

#### tic-component

TIC 组件：统一对外提供服务和接口的组件。

#### board-component

白板组件：主要包含白板 SDK 和白板布局文件样式，是一个整体，可以将 board-component 理解为 boardSDK，不需要再单独进行开发。

#### event

事件监听模型。

#### libs

组件中依赖的库文件。

#### webim-component

 IM 组件：白板之间实时同步数据与课堂内互动聊天的通道。

####  trtc-room

trtc-room 组件：与其他端音视频互通的组件。

### 配置合法域名

在 [微信公众平台](https://mp.weixin.qq.com/) 登录您小程序的账号和密码，选择【设置】>【 开发设置】，配置服务器 request 合法域名。

>? 以下域名为互动课堂 SDK 中必须的域名，另外还需要加上您业务服务器的域名。

| 域名 | 说明 |
| --- | ---  |
| `https://yun.tim.qq.com` |        白板服务器域名     |
| `https://aegis.qq.com` |   日志服务域名          |
| `https://report-log-lv0.api.qcloud.com` |   日志服务域名          |
| `https://cloud.tencent.com` |     trtc 推拉流服务域名        |
| `https://webim.tim.qq.com` |     IM 服务域名        |
| `https://pingtas.qq.com` |     IM 服务域名        |


### 创建小程序应用

通过微信开发者工具创建好应用后，将下载的 TIC 源码复制到项目中。

![](https://main.qcloudimg.com/raw/62f3070c82af5ed40bf22913857ce5ea.jpg)

## 使用流程

TIC 使用的一般流程如下：

![业务流程](https://main.qcloudimg.com/raw/5c11f1a14f74b00988c5c43dddff2d41.png) 

其中**创建课堂**为教师角色特有流程，学生角色无需调用。

### 获取组件实例
页面 onLoad 后获取组件实例示例如下：

```
onLoad: function (options) {
  // 获取 tic 组件
  var tic = this.selectComponent('#tx_board');
  // 获取 trtc-room 组件
  let trtcRoomContext = this.selectComponent('#trtcroom')
}
```

### 初始化

```
tic.init(sdkAppId, callback);
```

参数 | 类型 | 必填 | 说明 |
---------| ---- | --------- | -----
sdkAppId | Integer | 是 | 腾讯云应用的唯一标识，可在 [实时音视频控制台](https://console.cloud.tencent.com/rav) 查看
callback | Function | 是 | 回调

- callback回调参数:

| 参数 | 类型 |  说明 |
| ---------| ---- | --------- |
| module | Integer | 0：IM 模块；1：TRTC 模块；2：白板模块 |
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述 |

### 登录

```
tic.login(loginConfig, callback);
```

参数 | 类型 | 必填 | 说明 |
---------| ---- | --------- | -----
loginConfig.userId | String | 是 | 用户名
loginConfig.userSig | String | 是 | 登录鉴权信息
callback | Function | 是 | 回调

>?开发调试阶段，用户可在腾讯云控制台使用开发辅助工具，生成临时的 uid 和 userSig 用于开发测试，详情请参考 [生成签名](https://cloud.tencent.com/document/product/647/17275)。

- callback 回调参数：

| 参数 | 类型  | 说明 |
| ---------| ---- | --------- |
| module | Integer | 0：IM 模块；1：TRTC 模块；2：白板模块
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述

###  登出

```
tic.logout(callback);
```

参数 | 类型 | 必填 | 说明 |
---------| ---- | --------- | -----
callback | Function | 是 | 回调

- callback 回调参数：

| 参数 | 类型 |  说明 |
| ---------| ---- | --------- |
| module | Integer |0：IM 模块；1：TRTC 模块；2：白板模块
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述

### 创建课堂

```
tic.createClassroom(classId, callback);
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
classId | Integer | 是 | 课堂 ID，32位整型，取值范围[1, 2147483647]
callback | Function | 是 | 回调

- callback 回调参数：

| 参数 | 类型 |  说明 |
| ---------| ---- | --------- |
| module | Integer |0：IM 模块；1：TRTC 模块；2：白板模块
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述


### 销毁课堂

本方法只能由课堂的创建者调用，会彻底将课堂销毁，清除白板所有数据，解散课堂 IM 群组。

```
tic.destroyClassroom(classId, callback)
```
参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
classId | Integer | 是 | 课堂 ID，32位整型，取值范围[1, 2147483647]
callback | Function | 是 | 回调

- callback 回调参数：

| 参数 | 类型 |  说明 |
| ---------| ---- | --------- |
| module | Integer | 0：IM 模块；1：TRTC 模块；2：白板模块
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述

### 加入课堂

```
tic.joinClassroom(classId, boardOption, callback);
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
classId | Integer | 是 | 课堂 ID，32位整型，取值范围[1, 2147483647]，由业务方下发，并保证每次下发的 classId 是唯一不重复的
boardOption | Integer | 是 | boardOption 参数
callback | Function | 是 | 回调

- boardOption 参数：

| 参数	                   | 类型	| 必填 | 默认值 |说明 |
| ------------------------| --------- | ----- | ----- | --------- |
| ratio                   |  String  | 否 | 16:9 | 白板尺寸/比例<br> 传字符串宽高比，例如设置4:3，白板 SDK 会以参数 ID 所在节点的宽高以4:3的方式来计算出白板的宽高
| drawEnable              |  Boolean  | 否 | true | 是否可以涂鸦
| brushColor              |  String  | 否 | #ff0000 | 涂鸦颜色，支持 hex、rgba 格式，如 #ffffff，rgba(255, 255, 255, 0.3)    
| brushThin               |  Number  | 否 | 100 | 涂鸦粗细，实际像素值取值（brushThin * 白板的高度 / 10000）px，如果结果小于1px，则涂鸦的线条会半透明
| toolType                |  Number  | 否 | 1 | 涂鸦类型，默认画笔<br/> 1. 画笔<br/> 2. 橡皮擦<br/> 3. 激光笔<br/> 4. 直线<br/> 5. 空心椭圆<br/> 6. 空心矩形<br/> 7. 实心椭圆<br/> 8. 实心矩形<br/> 9. 点选工具<br/> 10. 框选工具<br/>
| globalBackgroundColor   |  String  | 否 | #ffffff | 全局背景色，支持 hex、rgba 格式，如 #ffffff，rgba(255, 255, 255, 0.3)          
| dataSyncEnable | Boolean | 否 | true | 是否数据同步 |
| smoothLevel | Number | 否 | 0.1 | 平滑级别，取值0～1之间的浮点数，0表示不启用平滑 |   

- callback 回调参数：

| 参数 | 类型 |  说明 |
| ---------| ---- | --------- |
| module | Integer |  0：IM 模块；1：TRTC 模块；2：白板模块
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述


### 退出课堂

调用退出课堂，只是调用者自己退出课堂。

```
tic.quitClassroom(callback);
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
callback | Function | 是 | 回调

- callback 回调参数：

| 参数 | 类型 |  说明 |
| ---------| ---- | --------- |
| module | Integer |0：IM 模块；1：TRTC 模块；2：白板模块
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述


### 收发消息

TIC 封装了 WebIM 发消息的常用接口，每个发消息接口在 addTICMessageListener 监听中都能找到对应的接收消息回调，具体对应关系如下：

| 发送消息接口 |	接收消息回调 |	参数说明 |
| ------------| ------------ | -------- |
| sendTextMessage | 	onTICRecvTextMessage | 	发送和接收 C2C 文本消息 |
| sendCustomMessage | 	onTICRecvCustomMessage | 	发送和接收 C2C 自定义消息 |
| sendGroupTextMessage | 	onTICRecvGroupTextMessage | 	发送和接收群文本消息 |
| sendGroupCustomMessage | 	onTICRecvGroupCustomMessage | 	发送和接收群自定义消息 |

####  发送 C2C 文本消息

```
tic.sendTextMessage(userId, text, callback)
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
userId | String | 是 | 消息接收者
text | String | 是 | 文本消息内容
callback | Function | 是 | 回调

#### 发送 C2C 自定义消息

```
tic.sendCustomMessage(userId, data, callback)
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
userId | String | 是 | 消息接收者
data | String | 是 | 自定义消息内容
callback | Function | 是 | 回调

#### 发送群（课堂所在群组）文本消息

```
tic.sendGroupTextMessage(text, callback)
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
text | String | 是 | 文本消息内容
callback | Function | 是 | 回调

#### 发送群（课堂所在群组）自定义消息

```
tic.sendGroupCustomMessage(data, callback)
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
data | String | 是 | 自定义消息内容
callback | Function | 是 | 回调

- callback 回调参数：

| 参数 | 类型 |  说明 |
| ---------| ---- | --------- |
| module | Integer | 0：IM 模块；1：TRTC 模块；2：白板模块 |
| code | Integer | 错误码，0：正确<br/>[IM 模块错误码文档](https://cloud.tencent.com/document/product/269/1671) <br/>[TRTC 模块错误码文档](https://cloud.tencent.com/document/product/647/34342)<br/>[白板模块错误码](../互动白板接口文档.md) |
| desc | String | 错误描述 |


更多高级 IM 操作，请通过获取 IM 实例进行操作，详情请参考 [IM 文档](https://cloud.tencent.com/document/product/269/1594)。

```
tic.getImInstance()
```

### 监听 IM 消息回调

```
var listener = {
  /**
    * 收到 C2C 文本消息
    * @param fromUserId		发送此消息的用户id
    * @param text				收到消息的内容
    * @param textLen			收到消息的长度
    */
  onTICRecvTextMessage: (fromUserId, text, textLen) => {
  },

  /**
    * 收到 C2C 自定义消息
    * @param fromUserId		发送此消息的用户id
    * @param data				收到消息的内容
    * @param dataLen			收到消息的长度
    */
  onTICRecvCustomMessage: (fromUserId, data, textLen) => {

  },

  /**
    * 收到群文本消息
    * @param fromUserId		发送此消息的用户id
    * @param text				收到消息的内容
    * @param textLen			收到消息的长度
    */
  onTICRecvGroupTextMessage: (fromUserId, text, textLen) => {

  },

  /**
    * 收到群自定义消息
    * @param fromUserId		发送此消息的用户id
    * @param data				收到消息的内容
    * @param dataLen			收到消息的长度
    */
  onTICRecvGroupCustomMessage: (fromUserId, data, textLen) => {

  },

  /**
    * 所有消息
    * @param msg	IM 消息体
    * @note 所有收到的消息都会在此回调进行通知，包括前面已经封装的文本和自定义消息（白板信令消息除外）
    */
  onTICRecvMessage(msg) {

  }
}
tic.addTICMessageListener(listener)
```


###  移除 IM 消息回调

```
tic.removeTICMessageListener(listener)
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
listener | Function | 否 | 移除 addTICMessageListener 设置的监听，为空表示，移除所有的


### 监听 IM 事件回调

```
var lisenter = {
  /**
	 * 用户进入房间
	 * @param {Array} members	 进入房间的用户id
	 */
  onTICMemberJoin: (members) => {
    
  },

  /**
	 * 用户退出房间
	 * @param {Array} members	 退出房间的用户id
	 */
  onTICMemberQuit: (members) => {
    
  },

  /**
	 * 课堂被销毁
	 */
  onTICClassroomDestroy: () => {
    
  }
}
this.ticSdk.addTICEventListener(lisenter);
```

### 移除 IM  事件回调

```
tic.removeTICEventListener(listener)
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
listener | Function | 否 | 移除 addTICEventListener 设置的监听，为空表示，移除所有

### 监听 IM 状态回调


```
var lisenter = {
  /**
	 * 被踢下线(账号在其他设备登录)
	 */ 
  onTICForceOffline: () => {
   
  }
}
this.ticSdk.addTICStatusListener(lisenter);

```

### 移除 IM 状态回调

```
tic.removeTICStatusListener(listener)
```

参数 | 类型 | 必填 | 说明
--------- | --------- | -----| ---
listener | Function | 否 | 移除 addTICStatusListener 设置的监听，为空表示，移除所有


###   使用音视频trtc-room

> [trtc-room文档](https://cloud.tencent.com/document/product/647/32183)


### 使用互动白板

白板相关操作可直接调用 TIC 提供的获取白板实例接口来执行，TIC 不做任何封装，详情请参见 [互动白板接入文档](./互动白板接入文档.md)。

```
var teduBoard = tic.getBoardInstance()
```

## 常见错误码

| 错误码 |描述 |
| -- | -- |
| 10001 | 没有权限使用视频组件 |
| 10002 | 缺少必要参数 userId |
| 10003 | 缺少必要参数 sdkAppId |
| 10004 | 缺少必要参数 userSig |
| 10005 | 缺少必要参数 roomId |
| 70346 | 缺少必要参数 userSig |
| 80 | 进房密钥 privateMapKey 不能为空 |
| 82 | 参数检测失败 |
| 86 | 进房密钥 privateMapKey 已过期 |
| 87 | 进房密钥 privateMapKey 不正确 |
| 88 | 还没有购买实时音视频套餐包 |
