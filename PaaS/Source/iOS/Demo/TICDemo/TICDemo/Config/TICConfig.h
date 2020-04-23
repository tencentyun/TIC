#import <Foundation/Foundation.h>


@interface TICConfig : NSObject
@property(nonatomic,copy) NSString *sdkAppId;            //app标识，可在实时音视频控制台(https://console.cloud.tencent.com/rav)创建自己的应用生成
@property(nonatomic,strong) NSMutableArray *userIds;     //用户id标识（可由业务后台自己管理）
@property(nonatomic,strong) NSMutableArray *userSigs;    //用于用户鉴权，生成方法https://cloud.tencent.com/document/product/647/17275 （可由业务后台自己管理）
+ (TICConfig *)shareInstance;
@end
