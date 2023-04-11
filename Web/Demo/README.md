# tiw-web

## 项目安装
```
npm install
```

### 项目运行
```
npm run serve
```

### 项目打包
```
npm run build
```

### 项目语法检查
```
npm run lint
```

### 项目参数配置
```
// 修改config/index.js

export default {
  // 白板应用SdkAppId
  sdkAppId: 0,
  // 白板应用对应的密钥 https://cloud.tencent.com/document/product/1137/39907
  secretKey: '',
  // 白板应用签名过期时间（单位：秒）
  expireTime: 84600,
  // cos存储桶配置
  cosBucket: '',
  cosRegion: '',
  // 腾讯云账号API密钥（https://console.cloud.tencent.com/cam/capi）
  tencentSecretId: '',
  tencentSectetKey: '',
  // 发起转码请求服务端地址，参考 https://cloud.tencent.com/document/product/1137/40060
  createTranscodeUrl: '',
  // 查询转码进度服务端地址，参考 https://cloud.tencent.com/document/product/1137/40059
  describeTranscodeUrl: '',
};
```
