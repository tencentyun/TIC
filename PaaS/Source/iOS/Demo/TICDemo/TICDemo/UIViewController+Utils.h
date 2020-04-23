//
//  UIViewController+Utils.h
//  SmallParty
//
//  Created by jameskhdeng(邓凯辉) on 2017/9/29.
//  Copyright © 2017年 Tencent. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIViewController (Utils)

- (void)showAlertWithTitle:(NSString *)title msg:(NSString *)msg handler:(void (^)(UIAlertAction *action))handler;
- (void)showCancleAlertWithTitle:(NSString *)title msg:(NSString *)msg handler:(void (^)(UIAlertAction *action))handler;
- (void)showActionSheetWithTitle:(NSString *)title firstButton:(NSString *)btnTitle1 firstHandler:(void (^)(UIAlertAction *action))handler secondButton:(NSString *)btnTitle2 secondHandler:(void (^)(UIAlertAction *action))handler2;

@end
