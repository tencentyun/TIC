//
//  ClassroomViewController.h
//  TICDemo
//
//  Created by jameskhdeng(邓凯辉) on 2018/5/15.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import <UIKit/UIKit.h>
#if TARGET_OS_IPHONE
#import <TEduBoard/TEduBoard.h>
#else
#import <TEduBoard_Mac/TEduBoard.h>
#endif

@interface ClassroomViewController : UIViewController
@property (nonatomic, strong) NSString *classId;
@property (nonatomic, strong) NSString *userId;
@property (nonatomic, strong) TEduBoardController *boardController;
@end
