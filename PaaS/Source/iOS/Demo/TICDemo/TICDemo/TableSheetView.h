//
//  TableSheetView.h
//  TICDemo
//
//  Created by kennethmiao on 2019/4/25.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import <UIKit/UIKit.h>


@interface TableSheetView : UIView
@property (nonatomic, strong) void (^block)(NSInteger index);
- (void)setSelectIndex:(NSInteger)index;
- (void)setData:(NSArray *)data;
@end
