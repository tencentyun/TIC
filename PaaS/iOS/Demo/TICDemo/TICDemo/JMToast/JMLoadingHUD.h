//
//  JMLoadingHUD.h
//  JMBankCore
//
//  Created by 邓凯辉 on 2017/5/31.
//  Copyright © 2017年 tencent. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JMLoadingHUD : NSObject

+ (instancetype)sharedInstance;

+ (void)setUserInterfaceEnable:(BOOL)isEnable;

+ (void)setTitle:(NSString *)title;

+ (void)show;
+ (void)hide;

@end
