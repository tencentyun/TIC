//
//  TICDevice.h
//  TAISDK
//
//  Created by kennethmiao on 2018/12/11.
//  Copyright © 2018年 kennethmiao. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, TICNetType)
{
    TICNet_None   =   0,
    TICNet_Wifi   =   1,
    TICNet_2G     =   2,
    TICNet_3G     =   3,
    TICNet_4G     =   4,
};

@interface TICDevice : NSObject
+ (NSString *)getSystemVersion;
+ (NSString *)getDevType;
+ (NSString *)getUUID;
+ (TICNetType)getNetype;
@end
