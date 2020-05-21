//
//  JMToast.m
//  JDKit
//
//  Created by 邓凯辉 on 16/9/6.
//  Copyright © 2016年 tencent. All rights reserved.
//

#import "MBProgressHUD.h"
#import "JMToast.h"

@interface JMToast ()<MBProgressHUDDelegate>

@property (nonatomic, strong)MBProgressHUD *progressHUD;
@property (nonatomic, assign) NSTimeInterval interval;

@end

@implementation JMToast

+ (JMToast *)sharedToast {
    static JMToast *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[JMToast alloc]init];
    });
    return instance;
}

- (void)showDialogWithMsg:(NSString *)msg {
    self.interval = 2;
    if (msg.length <= 14) {
        [self jd_showDialogWithTitle:msg detail:nil];
    }else {
        [self jd_showDialogWithTitle:nil detail:msg];
    }}

- (void)showDialogWithMsg:(NSString *)msg interval:(NSTimeInterval)interval {
    NSAssert(interval > 0, @"error interval");
    self.interval = interval;
    if (msg.length <= 14) {
        [self jd_showDialogWithTitle:msg detail:nil];
    }else {
        [self jd_showDialogWithTitle:nil detail:msg];
    }
}

- (void)jd_showDialogWithTitle:(NSString *)title detail:(NSString *)detail {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.progressHUD.label.text        = title;
        self.progressHUD.detailsLabel.text = detail;
        //    self.progressHUD.minShowTime      = 0.0f;//连续多次发送同一失败的请求，minShowTime不能设置为0.3，这样会造成菊花转和错误提示同时出现。
        
        if (self.progressHUD.superview) {
            [self.progressHUD removeFromSuperview];
        }
        
        
        [[[UIApplication sharedApplication] keyWindow] addSubview:self.progressHUD];
        
        [self.progressHUD showAnimated:YES];
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            [self jd_progressTask];
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.progressHUD hideAnimated:YES];
            });
        });
    });
}

- (UIWindow *)window{
    return [[[UIApplication sharedApplication] windows] objectAtIndex:0];
}

- (void)jd_progressTask {
    NSAssert(self.interval > 0, @"error time");
    [NSThread sleepForTimeInterval:self.interval];
}

- (MBProgressHUD*)progressHUD {
    if (!_progressHUD) {
        _progressHUD = [[MBProgressHUD alloc]initWithView:[[UIApplication sharedApplication] keyWindow]];
        _progressHUD.delegate = self;
        _progressHUD.animationType = MBProgressHUDAnimationZoom;
        _progressHUD.mode = MBProgressHUDModeCustomView;
        _progressHUD.userInteractionEnabled = NO;
    }
    return _progressHUD;
}

@end
