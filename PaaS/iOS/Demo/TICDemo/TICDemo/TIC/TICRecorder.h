//
//  TICRecorder.h
//  TICDemo
//
//  Created by kennethmiao on 2019/5/21.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TICDef.h"

@interface TICRecorder : NSObject
- (void)sendOfflineRecordInfo:(NSString *)groupId ntpServer:(NSString *)ntpServer callback:(TICCallback)callback;
- (void)reportGroupId:(NSString *)groupId sdkAppId:(int)sdkAppId userId:(NSString *)userId userSig:(NSString *)userSig;
@end

