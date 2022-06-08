#import "ViewController.h"
#import "TICConfig.h"
#import "ClassroomJoinViewController.h"
#import "JMLoadingHUD.h"
#import "JMToast.h"
#import "IMManager.h"

#if TARGET_OS_IPHONE
#import <TEduBoard/TEduBoard.h>
#else
#import <TEduBoard_Mac/TEduBoard.h>
#endif

@interface ViewController () <UIPickerViewDelegate, UIPickerViewDataSource>
@property (weak, nonatomic) IBOutlet UIPickerView *userPickView;
@property (weak, nonatomic) IBOutlet UILabel *imsdkVerLabel;
@property (weak, nonatomic) IBOutlet UILabel *boardVerLabel;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"TICDemo";
    
    self.imsdkVerLabel.text = [NSString stringWithFormat:@"IMSDK: %@", [[V2TIMManager sharedInstance] getVersion]];
    self.boardVerLabel.text = [NSString stringWithFormat:@"TEduBoard: %@", [TEduBoardController getVersion]];
}

- (IBAction)onLogin:(UIButton *)button {
    NSInteger index = [_userPickView selectedRowInComponent:0];
    NSString *userId = [TICConfig shareInstance].userIds[index];
    NSString *userSig = [TICConfig shareInstance].userSigs[index];
    
    [JMLoadingHUD show];
    [JMLoadingHUD setTitle:@"登录中..."];
    __weak typeof(self) ws = self;
    // IM登录
    [[IMManager sharedInstance] login:userId userSig:userSig callback:^(int code, NSString * _Nullable desc) {
        if (code == 0) {
            [JMLoadingHUD hide];
            [[JMToast sharedToast] showDialogWithMsg:@"登录成功"];
            UIStoryboard *story = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
            ClassroomJoinViewController *join = [story instantiateViewControllerWithIdentifier:@"ClassroomJoinViewController"];
            join.userId = userId;
            join.userSig = userSig;
            [ws.navigationController pushViewController:join animated:YES];
        }
        else {
            [JMLoadingHUD hide];
            [[JMToast sharedToast] showDialogWithMsg:[NSString stringWithFormat:@"登录失败: %d,%@",code, desc]];
        }
    }];
}

#pragma mark - pick delegate
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView
{
    return 1;
}

- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component
{
    return [TICConfig shareInstance].userIds.count;
}

- (NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component
{
    return [TICConfig shareInstance].userIds[row];
}
@end
