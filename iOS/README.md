
本文主要介绍如何快速运行互动课堂iOS/macOS版本Demo。

## 开发环境

- Xcode 9.0+
- OS X 10.10+的Mac真机
- 项目已配置有效的开发者签名

## 运行Demo



#### 1. 安装 CocoaPods

在终端窗口中输入如下命令（需要提前在 Mac 中安装 Ruby 环境）：

```
sudo gem install cocoapods
```

#### 2. 更新并安装 SDK

在终端窗口中输入如下命令以更新本地库文件：

```
pod install
```

或使用以下命令更新本地库版本：

```
pod update
```

pod命令执行完后，双击打开 .xcworkspace 后缀的工程文件即可编译运行。

