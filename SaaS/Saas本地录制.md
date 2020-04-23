## 1 本地录制的优点
本地录制可以在上课过程中，在本地电脑将老师上课的窗口录制为视频，并同步将视频上传到腾讯云平台，课程结束后满足老师分享视频和方便学生回放查看的业务场景。相对于后台录制，本地录制有下面的优点：
    1. 可以100%还原上课场景，包含窗口内动画效果;
    2. 可以在本地和云端点播平台都生成录制文件，方便课后回放和传播;
    查看[本地录制示例视频](http://1259648581.vod2.myqcloud.com/6f833813vodcq1259648581/3e40a1e05285890797762686165/playlist.f5.mp4)。

## 2 如何使用本地录制?
在Windows saas客户端以**老师或者助教**身份进入课堂，可使用本地录制工具。

## 3 开始录制
   在进入课堂后，点击"录制按钮"会弹出选择框，确认视频文件存放目录。如下图，如果选择"开始录制"，则最终生成的目录地址为C:\\User\\您的用户名\\TClass\\record目录下，如果选择“修改保存目录并开始录制”，在录制结束后，视频文件会存放在您指定的目录。
![](https://main.qcloudimg.com/raw/0d52484ddcc2c279a2abd3ba99386566.png)

在开始录制后，在聊天区看到"您已开启本地录制"提示，同时在标题栏右方有一个图标，表示正在上传录制文件，当鼠标放在此图标上时，会显示上传进度，如下图。
![](https://main.qcloudimg.com/raw/c254f2022910352440eb24db5216ed72.png)


## 4 结束录制
  当老师上课结束后，点“录制按钮”会停止录制，同时在聊天区给出提示"您已停止本地录制"。一般情况下，停止录制后"本地录制上传图标"还会持续存在很短时间，用于将录制的分片文件上传到腾讯云后台，方便后续查看和分享。
  ![](https://main.qcloudimg.com/raw/93260ad930a8768a14cc656c45b777e6.png)


## 5 如何查看录制的视频文件?
#### 查看本地的视频文件
如果您在"开始录制"时没有修改存放视频文件的目录，则可以在C:\\User\\您的用户名\\TClass\\record目录下找到视频文件，如下图。视频文件可以使用VLC播放器或者腾讯视频播放器打开观看。
    ![](https://main.qcloudimg.com/raw/c43eb074d139f61dad8df5786b465d35.png)

#### 查看上传到腾讯云的视频文件
1. 以管理员身份登录[互动课堂控制台](https://tedu.console.qcloudtrtc.com/index.html#/login)。
2. 登录完成后，进入"录制管理"，会看到本地录制的所有视频，点击"播放"可以查看视频。
  ![](https://main.qcloudimg.com/raw/fbfe9bb83bf148022b1a31b27845bc51.png)

## 6 怎么设置录制回调和查看回调结果?
#### 设置录制回调
如果您在录制结束后，想获取录制结果，可以通过注册回调的方式及时响应。设置回调的方式：
1. 以管理员身份登录[互动课堂控制台](https://tedu.console.qcloudtrtc.com/index.html#/login)。
2. 登录完成后，进入"机构设置"，可以看到"回调URL"，在这里设置您的回调地址。
  ![](https://main.qcloudimg.com/raw/ed1dcc7eb88b679aea7f0a86126c1d2b.png)

#### 查看回调结果
 在您设置录制回调地址后，互动课堂后台发起回调请求，用户后台必须回复响应包，响应包中 error_code 如果不为0，或者没有回复响应包，互动课堂后台会持续发送回调请求（重试10次，每次间隔1分钟）。

- 接口 URL：https://用户回调地址?公共参数
- 方法：`POST`
- Content-Type：`application/json`
- 事件名称: local_record_callback

- 参数：

| 参数名 | 类型 | 描述 | 是否必填 | 默认值 |
| :------ | :--- | :---- | :--------: | :-----: |
| class_id | int | 课堂ID | 是 | - |
| class_topic | string | 课堂主题/课堂名字 | 否 | 课堂 ID 的字符串形式 |
| teacher_id | string | 教师 ID | 是 | - |
| assistant_id | string | 助教 ID | 是 | - |
| start_time | int | 视频开始时间 | 是 | - |
| stop_time | int | 视频结束时间 | 是 | - |
| class_start_time | int | 课堂开始时间 | 是 | - |
| class_stop_time | int | 课堂结束时间 | 是 | - |
| user_id | int | 录制者id | 是 | - |
| record_type | string | 录制类型（online_record:在线录制，local_record:本地录制） | 是 | - |
| file_id | int | 视频文件id | 是 | - |
| file_format | int | 视频文件格式 | 是 | - |
| file_size | int | 视频文件大小 | 是 | - |
| file_url | int | 视频文件地址 | 是 | - |
| duration | int | 视频文件时长 | 是 | - |

- 返回值 

| 参数名 | 类型 | 描述 | 是否必填 | 备注 |
| :------ | :--- | :---- | :--------: | :-----: |
| error_code | int | 错误码 | 是 | 填0 |

- 示例说明
``` json
 {
  "event":"local_record_callback",
  "data":{
    "record_info":{
        "sdkappid":14000000,
        "class_id":1123123,
        "class_topic":"课堂",
        "teacher_id":"老师id",
        "assistant_id":"助教id",
        "start_time":12121212,
        "stop_time":13131313,
        "class_start_time":121212,
        "class_stop_time":13131313,
        "user_id":"录制者id",
        "record_type":"local_record",
        "file_id":"video id",
        "file_format":"MP4",
        "file_size":"文件大小",
        "file_url":"文件播放地址",
        "duration":123
    }
  }
}
//响应：
 {
  "error_code":0
}
```


## 7 常见问题
1. **在Win7上录制视频时，发现录制窗口被遮挡;**
原因：因为窗口抗遮挡是通过Desktop Window Manager服务来实现, 如果使用本地录制服务的windows机器没有打开此服务，会导致不能抗遮挡.
开启方式：
- 按下“Win+R”组合键呼起运行，在框内输入“services.msc”按下回车键打开“服务”窗口,如图所示：
![](https://main.qcloudimg.com/raw/8185861a279c73fec0e488b90328a46d.png)
- 在服务窗口中找到并双击打开“Desktop Window Manager Session Manager”服务，如下图。
![](https://main.qcloudimg.com/raw/6e25c9059e48c3894da500c502570e61.png)

- 点击常规选卡，将启动类型修改为“自动”，点击“应用”，然后点击“启动”，最后点击确定即可。如下图：
 ![](https://main.qcloudimg.com/raw/2370e6858df828a0ae93263f72b46fea.png)

2. **在停止录制结之后，在互动课堂控制台不能马上查到当前录制的视频**
  - 在录制结束后，还需要将录制分片文件上传，虽然上传服务是边录边上传，但最后一个分片生成后还需要一个短暂的上传时间，我们从统计结果来看，一般情况下在2分钟内可以上传完成(依赖于用户的网络状态)。
  - 在上传结束后，腾讯云后台还需要将上传的若干视频分片进行拼接，这个过程需要3-5分钟。(此时间后续可优化)
  所以，基于上面的两个原因，在录制结束后，估计要在5-10分钟，可查到录制的视频结果。