//
//  TICReport.m
//  TICDemo_Mac
//
//  Created by 缪少豪 on 2019/7/5.
//  Copyright © 2019 Tencent. All rights reserved.
//

#import "TICReport.h"
#import "TICDevice.h"
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonHMAC.h>

@implementation TICReportParam

@end

@implementation TICReport
+ (void)report:(TICReportParam *)param
{
    NSString *sysVersion =  [TICDevice getSystemVersion];
    NSString *uuid = [TICDevice getUUID];
    NSString *devType = [TICDevice getDevType];
    TICNetType netType = [TICDevice getNetype];
    NSString *netTypeString = [TICReport getNetTypeString:netType];
    NSString *eventString = [TICReport getEventString:param.event];
    NSString *platform;
#if TARGET_OS_IPHONE
    platform = @"iOS";
#else
    platform = @"macOS";
#endif
    NSString *kvStr = [NSString stringWithFormat:@"%@=%ld&%@=%@&%@=%@&%@=%@&%@=%@&%@=%@&%@=%@&%@=%ld&%@=%@&%@=%@&%@=%ld&%@=%@&%@=%ld&%@=%@&%@=%ld&%@=%@&%@=%@",
                       @"sdkAppId", (long)param.sdkAppId,
                       @"userId", param.userId == nil ? @"" : param.userId,
                       @"sdkVersion", param.sdkVersion == nil ? @"" : param.sdkVersion,
                       @"devId", uuid == nil ? @"" : uuid,
                       @"devType", devType == nil ? @"" : devType,
                       @"netType", netTypeString,
                       @"platform", @"",
                       @"timestamp", (long)([[NSDate date] timeIntervalSince1970] * 1000),
                       @"platform", platform,
                       @"sysVersion", sysVersion == nil ? @"" : sysVersion,
                       @"roomId", (long)param.roomId,
                       @"event", eventString,
                       @"errorCode", (long)param.errorCode,
                       @"errorMsg", param.errorMsg,
                       @"timeCost", (long)param.timeCost,
                       @"data", param.data == nil ? @"" : param.data,
                       @"ext", param.ext == nil ? @"" : param.ext];
    NSDictionary *dict = @{@"business":@"tic2.0", @"dcid":@"dc0000", @"version":@(0), @"kv_str":kvStr};
    NSData *data = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:nil];
    NSString *dataStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSString *sign = [TICReport md5:dataStr];
    
    NSString *url = [NSString stringWithFormat:@"https://ilivelog.qcloud.com/log/report?sign=%@", sign];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    request.HTTPMethod = @"POST";
    request.HTTPBody = data;
    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        
    }];
    [task resume];
}

+ (NSString *)md5:(NSString *)string {
    if (!string){
        return nil;
    }
    const char *cStr = string.UTF8String;
    unsigned char result[CC_MD5_DIGEST_LENGTH];
    CC_MD5(cStr, (CC_LONG)strlen(cStr), result);
    NSMutableString *md5Str = [NSMutableString string];
    for (int i = 0; i < CC_MD5_DIGEST_LENGTH; ++i) {
        [md5Str appendFormat:@"%02x", result[i]];
    }
    return md5Str;
}

+ (NSString *)getNetTypeString:(TICNetType)netType
{
    switch (netType) {
        case TICNet_None:
            return @"";
            break;
        case TICNet_Wifi:
            return @"Wifi";
            break;
        case TICNet_4G:
            return @"4G";
            break;
        case TICNet_3G:
            return @"3G";
            break;
        case TICNet_2G:
            return @"2G";
            break;
        default:
            break;
    }
    return @"";
}

+ (NSString *)getEventString:(TICReportEvent)event
{
    switch (event) {
        case TIC_REPORT_INITSDK_START:
            return @"initSdk_start";
            break;
        case TIC_REPORT_INITSDK_END:
            return @"initSdk_end";
            break;
        case TIC_REPORT_LOGIN_START:
            return @"login_start";
            break;
        case TIC_REPORT_LOGIN_END:
            return @"login_end";
            break;
        case TIC_REPORT_LOGOUT_START:
            return @"logout_start";
            break;
        case TIC_REPORT_LOGOUT_END:
            return @"logout_end";
            break;
        case TIC_REPORT_CREATE_GROUP_START:
            return @"createGroup_start";
            break;
        case TIC_REPORT_CREATE_GROUP_END:
            return @"createGroup_end";
            break;
        case TIC_REPORT_DELETE_GROUP_START:
            return @"deleteGroup_start";
            break;
        case TIC_REPORT_DELETE_GROUP_END:
            return @"deleteGroup_end";
            break;
        case TIC_REPORT_JOIN_GROUP_START:
            return @"joinGroup_start";
            break;
        case TIC_REPORT_JOIN_GROUP_END:
            return @"joinGroup_end";
            break;
        case TIC_REPORT_INIT_BOARD_START:
            return @"initBoard_start";
            break;
        case TIC_REPORT_INIT_BOARD_END:
            return @"initBoard_end";
            break;
        case TIC_REPORT_SYNC_BOARD_HISTORY_END:
            return @"syncBoardHistory_end";
            break;
        case TIC_REPORT_ENTER_ROOM_START:
            return @"enterRoom_start";
            break;
        case TIC_REPORT_ENTER_ROOM_END:
            return @"enterRoom_end";
            break;
        case TIC_REPORT_QUIT_GROUP_START:
            return @"quitGroup_start";
            break;
        case TIC_REPORT_QUIT_GROUP_END:
            return @"quitGroup_end";
            break;
        case TIC_REPORT_RECORD_INFO_START:
            return @"sendOfflineRecordInfo_start";
            break;
        case TIC_REPORT_RECORD_INFO_END:
            return @"sendOfflineRecordInfo_end";
            break;
        case TIC_REPORT_VIDEO_AVAILABLE:
            return @"onUserVideoAvailable";
            break;
        case TIC_REPORT_AUDIO_AVAILABLE:
            return @"onUserAudioAvailable";
            break;
        case TIC_REPORT_SUB_STREAM_AVAILABLE:
            return @"onUserSubStreamAvailable";
            break;
        case TIC_REPORT_FORCE_OFFLINE:
            return @"onForceOffline";
            break;
        case TIC_REPORT_SIG_EXPIRED:
            return @"onUserSigExpired";
            break;
        default:
            break;
    }
    return @"";
}
@end
