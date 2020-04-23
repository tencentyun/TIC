//
//  UIViewController+Utils.m
//  SmallParty
//
//  Created by jameskhdeng(邓凯辉) on 2017/9/29.
//  Copyright © 2017年 Tencent. All rights reserved.
//

#import "UIViewController+Utils.h"

@implementation UIViewController (Utils)

- (void)showAlertWithTitle:(NSString *)title msg:(NSString *)msg handler:(void (^)(UIAlertAction *action))handler {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:msg preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        if (handler) {
            handler(nil);
        }
    }];
    [alert addAction:action];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)showCancleAlertWithTitle:(NSString *)title msg:(NSString *)msg handler:(void (^)(UIAlertAction *action))handler {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:msg preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction *action = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        if (handler) {
            handler(nil);
        }
    }];
    [alert addAction:action];
    UIAlertAction *action1 = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        
    }];
    [alert addAction:action1];
    [self presentViewController:alert animated:YES completion:nil];
}

- (void)showActionSheetWithTitle:(NSString *)title firstButton:(NSString *)btnTitle1 firstHandler:(void (^)(UIAlertAction *action))handler secondButton:(NSString *)btnTitle2 secondHandler:(void (^)(UIAlertAction *action))handler2 {
    UIAlertController *actionSheet = [UIAlertController alertControllerWithTitle:nil message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    if (btnTitle1.length > 0) {
        UIAlertAction *action = [UIAlertAction actionWithTitle:btnTitle1 style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            if (handler) {
                handler(nil);
            }
        }];
        [actionSheet addAction:action];
    }
    
    if (btnTitle2.length > 0) {
        UIAlertAction *action2 = [UIAlertAction actionWithTitle:btnTitle2 style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            if (handler2) {
                handler2(nil);
            }
        }];
        [actionSheet addAction:action2];
    }
    
    UIAlertAction *action3 = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        
    }];
    [actionSheet addAction:action3];
    
    [self presentViewController:actionSheet animated:YES completion:nil];
}

@end
