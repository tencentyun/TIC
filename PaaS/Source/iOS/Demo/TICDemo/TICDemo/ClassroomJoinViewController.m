//
//  ClassroomJoinViewController.m
//  TICDemo
//
//  Created by jameskhdeng(邓凯辉) on 2018/5/15.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import "ClassroomJoinViewController.h"
#import "TICManager.h"
#import "ClassroomViewController.h"

@interface ClassroomJoinViewController ()
@property (weak, nonatomic) IBOutlet UITextField *classIdTextField;
@end

@implementation ClassroomJoinViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.navigationItem setHidesBackButton:YES];
    
    UIBarButtonItem *rightBarItem = [[UIBarButtonItem alloc] initWithTitle:@"退出" style:UIBarButtonItemStylePlain target:self action:@selector(onLogout)];
    self.navigationItem.rightBarButtonItem = rightBarItem;
}

#pragma mark - ClassRoom

// 创建课堂
- (IBAction)onCreateClass:(id)sender {
    NSString *classId = self.classIdTextField.text;
    if (classId.length <= 0) {
        return;
    }
    [JMLoadingHUD show];
    [[TICManager sharedInstance] createClassroom:[classId intValue] classScene:TIC_CLASS_SCENE_VIDEO_CALL callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            [[JMToast sharedToast] showDialogWithMsg:@"创建课堂成功，请\"加入课堂\""];
        }
        else{
            if(code == 10021){
                [[JMToast sharedToast] showDialogWithMsg:@"该课堂已被他人创建，请\"加入课堂\""];
            }
            else if(code == 10025){
                [[JMToast sharedToast] showDialogWithMsg:@"该课堂已创建，请\"加入课堂\""];
            }
            else{
                [[JMToast sharedToast] showDialogWithMsg:[NSString stringWithFormat:@"创建课堂失败：%d %@", code, desc]];
            }
        }
        [JMLoadingHUD hide];
    }];

}

// 销毁课堂
- (IBAction)onDestroyClass:(id)sender {
    NSString *classId = self.classIdTextField.text;
    if (classId.length <= 0) {
        return;
    }
    [JMLoadingHUD show];
    [[TICManager sharedInstance] destroyClassroom:[classId intValue] callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            [[JMToast sharedToast] showDialogWithMsg:@"销毁课堂成功"];
        }
        else if(code == 10010){
            [[JMToast sharedToast] showDialogWithMsg:@"课堂不存在"];
        }
        else if(code == 10007){
            [[JMToast sharedToast] showDialogWithMsg:@"非创建者没有权限销毁课堂"];
        }
        else{
            [[JMToast sharedToast] showDialogWithMsg:[NSString stringWithFormat:@"销毁课堂失败：%d %@", code, desc]];
        }
        [JMLoadingHUD hide];
    }];
    
}


// 加入课堂
- (IBAction)onJoinClass:(id)sender {
    NSString *classId = self.classIdTextField.text;
    NSString *userId = self.title;
    if (classId.length <= 0) {
        return;
    }

    [JMLoadingHUD show];
    UIStoryboard *story = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
    ClassroomViewController *classRoom = [story instantiateViewControllerWithIdentifier:@"ClassroomViewController"];
    classRoom.classId = classId;
    classRoom.userId = userId;
    TICClassroomOption *option = [[TICClassroomOption alloc] init];
    option.classId = [classId intValue];
    
    [[TICManager sharedInstance] addMessageListener:classRoom];
    [[TICManager sharedInstance] addEventListener:classRoom];
    __weak typeof(self) ws = self;
    [[TICManager sharedInstance] joinClassroom:option callback:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            [JMLoadingHUD hide];
            [ws.navigationController pushViewController:classRoom animated:YES];
        }
        else{
            if(code == 10015){
                [[JMToast sharedToast] showDialogWithMsg:@"课堂不存在，请\"创建课堂\""];
            }
            else{
                [[JMToast sharedToast] showDialogWithMsg:[NSString stringWithFormat:@"加入课堂失败：%d %@", code, desc]];
            }
            [JMLoadingHUD hide];
        }
    }];
}

//退出登录
- (void)onLogout
{
    [[TICManager sharedInstance] logout:^(TICModule module, int code, NSString *desc) {
        if(code == 0){
            //登出成功
        }
        else{
            //登出失败
        }
    }];
    [self.navigationController popViewControllerAnimated:YES];
}
@end
