//
//  ClassroomViewController.h
//  TICDemo
//
//  Created by jameskhdeng(邓凯辉) on 2018/5/15.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "TICManager.h"

@interface ClassroomViewController : UIViewController <TICEventListener, TICMessageListener>
@property (nonatomic, strong) NSString *classId;
@property (nonatomic, strong) NSString *userId;
@end
