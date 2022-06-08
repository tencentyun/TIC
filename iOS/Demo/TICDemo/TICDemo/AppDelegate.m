//
//  AppDelegate.m
//  TICDemo
//
//  Created by jameskhdeng(邓凯辉) on 2018/5/11.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import "AppDelegate.h"
#import "TICConfig.h"
#import "JMToast.h"
#import "IMManager.h"

@interface AppDelegate () <V2TIMSDKListener>

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    int sdkAppid = [[TICConfig shareInstance].sdkAppId intValue];
    BOOL sucess = [[IMManager sharedInstance] initSDK:sdkAppid listener:self];
    if (!sucess) {
        [[JMToast sharedToast] showDialogWithMsg:@"IM初始化失败！"];
    }
    return YES;
}

-(void)dealloc {
    [[IMManager sharedInstance] unInit];
}

- (void)applicationWillResignActive:(UIApplication *)application {
}


- (void)applicationDidEnterBackground:(UIApplication *)application {
    //此代码为了保证程序退后台仍能收到IM消息
    __block UIBackgroundTaskIdentifier bgTaskID;
    bgTaskID = [application beginBackgroundTaskWithExpirationHandler:^ {
        //不管有没有完成，结束 background_task 任务
        [application endBackgroundTask: bgTaskID];
        bgTaskID = UIBackgroundTaskInvalid;
    }];
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
}


- (void)applicationWillTerminate:(UIApplication *)application {
}

#pragma mark - V2TIMSDKListener
/// 当前IM用户被踢下线，此时可以 UI 提示用户，并再次调用 V2TIMManager 的 login() 函数重新登录。
- (void)onKickedOffline {
    [[IMManager sharedInstance] kickout];
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"账号被踢" message:nil preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [(UINavigationController *)self.window.rootViewController popToRootViewControllerAnimated:YES];
    }];
    [alert addAction:action];
    UIViewController *currentVC = ((UINavigationController *)self.window.rootViewController).topViewController;
    [currentVC presentViewController:alert animated:YES completion:nil];
}

/// IM在线时票据过期：此时您需要生成新的 userSig 并再次调用 V2TIMManager 的 login() 函数重新登录。
- (void)onUserSigExpired {
    [[JMToast sharedToast] showDialogWithMsg:@"票据过期,请重新生成userSig"];
    [(UINavigationController *)self.window.rootViewController popToRootViewControllerAnimated:YES];
}

@end
