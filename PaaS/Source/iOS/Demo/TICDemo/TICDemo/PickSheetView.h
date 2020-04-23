//
//  PickSheetView.h
//  TICDemo
//
//  Created by kennethmiao on 2019/4/25.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import <UIKit/UIKit.h>
@interface PickSheetView : UIView
@property (nonatomic, strong) void (^block)(UIColor *color);
- (void)setColor:(UIColor *)color;
@end


