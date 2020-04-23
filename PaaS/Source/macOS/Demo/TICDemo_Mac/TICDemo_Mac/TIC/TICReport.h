//
//  TICReport.h
//  TICDemo_Mac
//
//  Created by 缪少豪 on 2019/7/5.
//  Copyright © 2019 Tencent. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, TICReportEvent)
{
    TIC_REPORT_INITSDK_START,
    TIC_REPORT_INITSDK_END,
    TIC_REPORT_LOGIN_START,
    TIC_REPORT_LOGIN_END,
    TIC_REPORT_LOGOUT_START,
    TIC_REPORT_LOGOUT_END,
    TIC_REPORT_CREATE_GROUP_START,
    TIC_REPORT_CREATE_GROUP_END,
    TIC_REPORT_DELETE_GROUP_START,
    TIC_REPORT_DELETE_GROUP_END,
    TIC_REPORT_JOIN_GROUP_START,
    TIC_REPORT_JOIN_GROUP_END,
    TIC_REPORT_INIT_BOARD_START,
    TIC_REPORT_INIT_BOARD_END,
    TIC_REPORT_SYNC_BOARD_HISTORY_END,
    TIC_REPORT_ENTER_ROOM_START,
    TIC_REPORT_ENTER_ROOM_END,
    TIC_REPORT_QUIT_GROUP_START,
    TIC_REPORT_QUIT_GROUP_END,
    TIC_REPORT_RECORD_INFO_START,
    TIC_REPORT_RECORD_INFO_END,
    TIC_REPORT_VIDEO_AVAILABLE,
    TIC_REPORT_AUDIO_AVAILABLE,
    TIC_REPORT_SUB_STREAM_AVAILABLE,
    TIC_REPORT_FORCE_OFFLINE,
    TIC_REPORT_SIG_EXPIRED,
    TIC_REPORT_BOARD_ERROR,
    TIC_REPORT_BOARD_WARNING,
};

@interface TICReportParam : NSObject
@property (nonatomic, assign) int sdkAppId;
@property (nonatomic, strong) NSString *userId;
@property (nonatomic, strong) NSString *sdkVersion;
@property (nonatomic, assign) int roomId;
@property (nonatomic, assign) TICReportEvent event;
@property (nonatomic, assign) int errorCode;
@property (nonatomic, strong) NSString *errorMsg;
@property (nonatomic, assign) int timeCost;
@property (nonatomic, strong) NSString *data;
@property (nonatomic, strong) NSString *ext;

@end

@interface TICReport : NSObject
+ (void)report:(TICReportParam *)param;
@end

