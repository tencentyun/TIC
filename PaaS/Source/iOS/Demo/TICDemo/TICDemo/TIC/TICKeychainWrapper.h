
#import <Foundation/Foundation.h>

@interface TICKeychainWrapper : NSObject
+ (NSMutableDictionary *)getKeychainQuery:(NSString *)service;
+ (BOOL)saveDate:(id)date withService:(NSString *)service;
// 从keychain中查找数据
+ (id)searchDateWithService:(NSString *)service;
// 更新keychain中的数据
+ (BOOL)updateDate:(id)date withService:(NSString *)service;
// 删除keychain中的数据
+ (BOOL)deleteDateiWithService:(NSString *)service;
@end
