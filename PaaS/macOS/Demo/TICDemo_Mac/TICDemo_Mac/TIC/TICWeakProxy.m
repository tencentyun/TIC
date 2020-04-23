//
//  TICWeakProxy.m
//  TICDemo
//
//  Created by kennethmiao on 2019/8/12.
//  Copyright © 2019 Tencent. All rights reserved.
//

#import "TICWeakProxy.h"

@implementation TICWeakProxy
+ (instancetype)proxyWithTarget:(id)target {
    TICWeakProxy *proxy = [TICWeakProxy alloc];
    proxy.target = target;
    return proxy;
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)sel {
    return [self.target methodSignatureForSelector:sel];
}

- (void)forwardInvocation:(NSInvocation *)invocation {
    [invocation invokeWithTarget:self.target];
}
@end
