
#import "TICKeychainWrapper.h"
#import <Security/Security.h>

@implementation TICKeychainWrapper
// 根据特定的Service创建一个用于操作KeyChain的Dictionary
+ (NSMutableDictionary *)getKeychainQuery:(NSString *)service
{
    // 添加的字典不懂？
    return [NSMutableDictionary dictionaryWithObjectsAndKeys:
            (__bridge id)(kSecClassGenericPassword), kSecClass,
            service, kSecAttrService,
            service, kSecAttrAccount,
            kSecAttrAccessibleAfterFirstUnlock, kSecAttrAccessible,
            nil];
}

// 保存数据到keychain中
+ (BOOL)saveDate:(id)date withService:(NSString *)service
{
    // 1. 创建dictonary
    NSMutableDictionary * keychainQuery = [self getKeychainQuery:service];
    // 2. 先删除
    SecItemDelete((CFDictionaryRef)keychainQuery);
    // 3. 添加到date到query中
    [keychainQuery setObject:[NSKeyedArchiver archivedDataWithRootObject:date] forKey:(id<NSCopying>)kSecValueData];
    // 4. 存储到到keychain中
    OSStatus status = SecItemAdd((CFDictionaryRef)keychainQuery, NULL);
    
    return status == noErr ? YES : NO;
}

// 从keychain中查找数据
+ (id)searchDateWithService:(NSString *)service
{
    id retsult = nil;
    NSMutableDictionary * keychainQuery = [self getKeychainQuery:service];
    [keychainQuery setObject:(id)kCFBooleanTrue forKey:(id<NSCopying>)kSecReturnData];
    [keychainQuery setObject:(id)kSecMatchLimitOne forKey:(id<NSCopying>)kSecMatchLimit];
    
    CFTypeRef resultDate = NULL;
    if (SecItemCopyMatching((CFDictionaryRef)keychainQuery, &resultDate)== noErr) {
        @try{
            retsult = [NSKeyedUnarchiver unarchiveObjectWithData:(__bridge NSData *)resultDate];
        }
        @catch(NSException *e){
            NSLog(@"查找数据不存在");
        }
        @finally{
            
        }
    }
    if (resultDate) {
        CFRelease(resultDate);
    }
    return retsult;
}

// 更新keychain中的数据
+ (BOOL)updateDate:(id)date withService:(NSString *)service
{
    NSMutableDictionary * searchDictonary = [self getKeychainQuery:service];
    
    if (!searchDictonary) {return  NO;}
    
    NSMutableDictionary * updateDictonary = [NSMutableDictionary dictionary];
    [updateDictonary setObject:[NSKeyedArchiver archivedDataWithRootObject:date] forKey:(id<NSCopying>)kSecValueData];
    OSStatus status = SecItemUpdate((CFDictionaryRef)searchDictonary, (CFDictionaryRef)updateDictonary);
    return status == noErr ? YES : NO;
}

// 删除keychain中的数据
+ (BOOL)deleteDateiWithService:(NSString *)service
{
    NSMutableDictionary * keychainQuery = [self getKeychainQuery:service];
    OSStatus status = SecItemDelete((CFDictionaryRef)keychainQuery);
    return status == noErr ? YES : NO;
}

@end
