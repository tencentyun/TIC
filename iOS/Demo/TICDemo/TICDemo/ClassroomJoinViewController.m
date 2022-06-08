//
//  ClassroomJoinViewController.m
//  TICDemo
//
//  Created by jameskhdeng(邓凯辉) on 2018/5/15.
//  Copyright © 2018年 Tencent. All rights reserved.
//

#import "ClassroomJoinViewController.h"
#import "ClassroomViewController.h"
#import "JMLoadingHUD.h"
#import "JMToast.h"
#import "TICConfig.h"
#import "IMManager.h"
#import "BoardManager.h"


@interface ClassroomJoinViewController ()
@property (weak, nonatomic) IBOutlet UITextField *classIdTextField;
@end

@implementation ClassroomJoinViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.navigationItem setHidesBackButton:YES];
    self.title = self.userId;
    UIBarButtonItem *rightBarItem = [[UIBarButtonItem alloc] initWithTitle:@"退出" style:UIBarButtonItemStylePlain target:self action:@selector(onLogout)];
    self.navigationItem.rightBarButtonItem = rightBarItem;
}

#pragma mark - ClassRoom
// 进入ClassroomViewController视图
- (void)enterClassRoom:(TEduBoardController *)boardController {
    NSString *classId = self.classIdTextField.text;
    NSString *userId = self.title;
    UIStoryboard *story = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
    // 创建classRoom视图
    ClassroomViewController *classRoom = [story instantiateViewControllerWithIdentifier:@"ClassroomViewController"];
    classRoom.classId = classId;
    classRoom.userId = userId;
    classRoom.boardController = boardController;
    [self.navigationController pushViewController:classRoom animated:YES];
}

// 加入课堂
- (IBAction)onJoinClass:(id)sender {
    NSString *classId = self.classIdTextField.text;
    if (classId.length <= 0) {
        [[JMToast sharedToast] showDialogWithMsg:@"房间号不能为空"];
        return;
    }

    [JMLoadingHUD show];
    __weak typeof(self) ws = self;
    // 1、IM进群组
    [[IMManager sharedInstance] joinIMGroup:classId callback:^(int code, NSString *desc) {
        if (code == 0) {
            // 2、创建白板
            [[BoardManager sharedInstance] creteBoard:[TICConfig shareInstance].sdkAppId
                                                  userId:self.userId
                                                 userSig:self.userSig
                                                 classId:classId
                                                callback:^(int code, NSString * _Nullable desc, TEduBoardController * _Nullable boardController) {
                [JMLoadingHUD hide];
                if (code == 0) {
                    [ws enterClassRoom:boardController];
                }
                else {
                    [[JMToast sharedToast] showDialogWithMsg:[NSString stringWithFormat:@"白板初始化失败：%d %@", code, desc]];
                }
            }];
        }
        else {
            [JMLoadingHUD hide];
            [[JMToast sharedToast] showDialogWithMsg:[NSString stringWithFormat:@"加入IM群组失败：%d %@", code, desc]];
        }
    }];
}

//退出登录
- (void)onLogout
{
    __weak typeof(self) ws = self;
    // 退出IM登录
    [[IMManager sharedInstance] logout:^(int code, NSString * _Nullable desc) {
        if (code == 0) {
            [ws.navigationController popViewControllerAnimated:YES];
        }
        else {
            [[JMToast sharedToast] showDialogWithMsg:[NSString stringWithFormat:@"退出课堂失败：%d %@", code, desc]];
        }
    }];
}
@end
