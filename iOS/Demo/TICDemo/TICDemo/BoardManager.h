//
//  BoardManager.h
//  白板集成示例
//
//  Created by 张小桥 on 2022/5/9.
//

#import <Foundation/Foundation.h>
#if TARGET_OS_IPHONE
#import <TEduBoard/TEduBoard.h>
#else
#import <TEduBoard_Mac/TEduBoard.h>
#endif

typedef void (^CreteBoardCallback)(int code, NSString * _Nullable desc, TEduBoardController * _Nullable boardController);

NS_ASSUME_NONNULL_BEGIN

@interface BoardManager : NSObject
@property (nonatomic, strong) NSString *sdkAppID;
@property (nonatomic, strong) NSString *userId;
@property (nonatomic, strong) NSString *userSig;
@property (nonatomic, strong) NSString *classId;
@property (nonatomic, strong)TEduBoardController * _Nullable boardController;
+ (instancetype)sharedInstance;

-(void)creteBoard:(NSString*)sdkAppId userId:(NSString*)userId userSig:(NSString*)userSig classId:(NSString*)classId callback:(CreteBoardCallback)callback;
- (void)destroyBoard;

@end

NS_ASSUME_NONNULL_END
