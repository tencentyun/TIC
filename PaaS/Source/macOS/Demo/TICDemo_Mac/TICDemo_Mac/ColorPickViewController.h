//
//  ColorPickViewController.h
//  TICDemo_Mac
//
//  Created by kennethmiao on 2019/4/30.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import <Cocoa/Cocoa.h>

NS_ASSUME_NONNULL_BEGIN

@interface ColorPickViewController : NSViewController
@property (nonatomic, strong) void (^block)(NSColor *color);
- (void)setDefaultColor:(NSColor *)color;
- (NSColor *)getPickColor;
@end

NS_ASSUME_NONNULL_END
