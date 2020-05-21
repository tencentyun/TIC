//
//  JMLoadingHUD.m
//  JMBankCore
//
//  Created by 邓凯辉 on 2017/5/31.
//  Copyright © 2017年 tencent. All rights reserved.
//

#import "JMLoadingHUD.h"
#import "MBProgressHUD.h"

@interface JMLoadingHUD () {
    BOOL _isShow;
}

@property (nonatomic, strong) MBProgressHUD *loadingHUD;

@end

@implementation JMLoadingHUD

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    static JMLoadingHUD *sharedInstance = nil;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[JMLoadingHUD alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[[UIApplication sharedApplication] keyWindow] addSubview:self.loadingHUD];
    }
    return self;
}

+ (void)show {
    dispatch_async(dispatch_get_main_queue(), ^{
        JMLoadingHUD *hud = [self sharedInstance];
        if (hud->_isShow) {
            return;
        }
        [hud.loadingHUD showAnimated:YES];
        hud->_isShow = YES;
    });
}

+ (void)hide {
    dispatch_async(dispatch_get_main_queue(), ^{
        JMLoadingHUD *hud = [self sharedInstance];
        hud.loadingHUD.label.text = @"";
        [hud.loadingHUD hideAnimated:YES];
        hud->_isShow = NO;
    });
}

+ (void)setTitle:(NSString *)title {
    dispatch_async(dispatch_get_main_queue(), ^{
        JMLoadingHUD *hud = [self sharedInstance];
        hud.loadingHUD.label.text = title;
    });
}

#pragma mark - Accessor
+ (void)setUserInterfaceEnable:(BOOL)isEnable {
    JMLoadingHUD *hud = [self sharedInstance];
    hud.loadingHUD.userInteractionEnabled = isEnable;
}

- (MBProgressHUD *)loadingHUD {
    if (!_loadingHUD) {
        _loadingHUD = [[MBProgressHUD alloc] initWithView:[[UIApplication sharedApplication] keyWindow]];
//        _loadingHUD.delegate = self;
        _loadingHUD.mode = MBProgressHUDModeIndeterminate;
        _loadingHUD.graceTime = 0.7;
        _loadingHUD.minShowTime = 0.5;
        _loadingHUD.animationType = MBProgressHUDAnimationZoom;
        _loadingHUD.userInteractionEnabled = NO;
    }
    return _loadingHUD;
}

@end
