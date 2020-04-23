//
//  TICDef.m
//  TICDemo
//
//  Created by kennethmiao on 2019/3/27.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import "TICDef.h"

@implementation TICClassroomOption
- (id)init
{
    self = [super init];
    if(self){
        self.roleType = TIC_ROLE_TYPE_ANCHOR;
        self.classScene = TIC_CLASS_SCENE_VIDEO_CALL;
    }
    return self;
}
@end
