//
//  JMToast.h
//  JDKit
//
//  Created by 邓凯辉 on 16/9/6.
//  Copyright © 2016年 tencent. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface JMToast : NSObject

/**
 *  @brief 提示框
 *
 *  @return 提示框单例
 */
+ (JMToast *)sharedToast;

/**
 *  @brief 弹出提示  3秒的弹出时间
 *
 *  @param msg 提示语
 */
- (void)showDialogWithMsg:(NSString*)msg;

/**
 *  @brief 弹出提示
 *
 *  @param msg      提示语
 *  @param interval 弹出时间
 */
- (void)showDialogWithMsg:(NSString*)msg interval:(NSTimeInterval)interval;

@end
