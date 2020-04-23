//
//  AppDelegate.m
//  TICDemo
//
//  Created by jameskhdeng(邓凯辉) on 2018/5/11.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import "AppDelegate.h"
#import "TICManager.h"
#import "TICConfig.h"

@interface AppDelegate () <TICStatusListener>

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    int sdkAppid = [[TICConfig shareInstance].sdkAppId intValue];
    [[TICManager sharedInstance] init:sdkAppid callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            [[TICManager sharedInstance] addStatusListener:self];
        }
    }];
    return YES;
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

#pragma mark - status listener
- (void)onTICForceOffline {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"账号被踢" message:nil preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [(UINavigationController *)self.window.rootViewController popToRootViewControllerAnimated:YES];
    }];
    [alert addAction:action];
    UIViewController *currentVC = ((UINavigationController *)self.window.rootViewController).topViewController;
    [currentVC presentViewController:alert animated:YES completion:nil];
}
- (void)onTICUserSigExpired
{
    
}

@end
