//
//  TICWeakProxy.h
//  TICDemo
//
//  Created by kennethmiao on 2019/8/12.
//  Copyright © 2019 Tencent. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface TICWeakProxy : NSProxy
+ (instancetype)proxyWithTarget:(id)target;
@property (weak, nonatomic) id target;
@end
