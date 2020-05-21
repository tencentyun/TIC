//
//  MenuTableViewController.m
//  TICDemo
//
//  Created by kennethmiao on 2019/4/25.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import "MenuTableViewController.h"
#import "PickSheetView.h"
#import "TableSheetView.h"
#import "TICManager.h"
#import <MobileCoreServices/MobileCoreServices.h>

@interface MenuTableViewController ()
@property (strong, nonatomic) UITableView *subTableView;
@property (strong, nonatomic) NSMutableArray *subMenus;
@property (strong, nonatomic) PickSheetView *pickView;
@property (strong, nonatomic) TableSheetView *tableSheet;
@property (strong, nonatomic) UIColor *brushColor;
@property (strong, nonatomic) UIColor *textColor;
@property (strong, nonatomic) UIColor *backColor;
@property (assign, nonatomic) NSInteger selectToolIndex;
@property (assign, nonatomic) NSInteger textStyleIndex;
@property (assign, nonatomic) NSInteger textFamilyIndex;
@property (weak, nonatomic) IBOutlet UIButton *undoButton;
@property (weak, nonatomic) IBOutlet UIButton *redoButton;
@property (weak, nonatomic) IBOutlet UISwitch *preRestStepSwitch;
@property (weak, nonatomic) IBOutlet UISwitch *nextRestStepSwitch;
@property (weak, nonatomic) IBOutlet UISwitch *gotoRestStepSwitch;

@end

@implementation MenuTableViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.7];
    self.brushColor = [UIColor colorWithRed:1.0 green:0 blue:0 alpha:1.0];
    self.textColor = [UIColor colorWithRed:1.0 green:0 blue:0 alpha:1.0];
    self.backColor = [UIColor colorWithRed:1.0 green:1.0 blue:1.0 alpha:1.0];
}



- (void)setCanUndo:(BOOL)canUndo
{
    self.undoButton.enabled = canUndo;
}

- (void)setCanRedo:(BOOL)canRedo
{
    self.redoButton.enabled = canRedo;
}

#pragma mark - action

- (IBAction)onSwitchCamera:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onSwitchCamera)]){
        [self.delegate onSwitchCamera];
    }
}

- (IBAction)onCameraStateChanged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onCameraStateChanged:)]){
        BOOL state = ((UISwitch *)sender).isOn;
        [self.delegate onCameraStateChanged:state];
    }
}

- (IBAction)onMicStateChaged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onMicStateChaged:)]){
        BOOL state = ((UISwitch *)sender).isOn;
        [self.delegate onMicStateChaged:state];
    }
}

- (IBAction)onSpeakerStateChaged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onMicStateChaged:)]){
        BOOL state = ((UISwitch *)sender).isOn;
        [self.delegate onMicStateChaged:state];
    }
}

- (IBAction)onDrawStateChanged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onDrawStateChanged:)]){
        BOOL state = ((UISwitch *)sender).isOn;
        [self.delegate onDrawStateChanged:state];
    }
}

- (IBAction)onSyncDataChanged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onSyncDataChanged:)]){
        BOOL state = ((UISwitch *)sender).isOn;
        [self.delegate onSyncDataChanged:state];
    }
}


- (IBAction)onSelectToolType:(id)sender {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"鼠标"];
    [array addObject:@"画笔"];
    [array addObject:@"橡皮擦"];
    [array addObject:@"激光笔"];
    [array addObject:@"直线"];
    [array addObject:@"空心椭圆"];
    [array addObject:@"空心矩形"];
    [array addObject:@"实心椭圆"];
    [array addObject:@"实心矩形"];
    [array addObject:@"点选工具"];
    [array addObject:@"框选工具"];
    [array addObject:@"文本工具"];
    [array addObject:@"缩放移动"];
    
    
    [self.tableSheet setSelectIndex:self.selectToolIndex];
    [self.tableSheet setData:array];
    __weak typeof(self) ws = self;
    self.tableSheet.block = ^(NSInteger index){
        ws.selectToolIndex = index;
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSelectToolType:)]){
            [ws.delegate onSelectToolType:(int)index];
        }
    };
    [self.view.superview addSubview:self.tableSheet];
}

- (IBAction)onSelectBrushColor:(id)sender {
    [self.pickView setColor:self.brushColor];
    __weak typeof(self) ws = self;
    self.pickView.block = ^(UIColor *color){
        ws.brushColor = color;
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSelectBrushColor:)]){
            [ws.delegate onSelectBrushColor:color];
        }
    };
    [self.view.superview addSubview:self.pickView];
}

- (IBAction)onSelectBackgroundColor:(id)sender {
    [self.pickView setColor:self.backColor];
    __weak typeof(self) ws = self;
    self.pickView.block = ^(UIColor *color){
        ws.backColor = color;
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSelectBackgroundColor:)]){
            [ws.delegate onSelectBackgroundColor:color];
        }
    };
    [self.view.superview addSubview:self.pickView];
}

- (IBAction)onBrushThinChanged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onBrushThinChanged:)]){
        float value = ((UISlider *)sender).value;
        [self.delegate onBrushThinChanged:value];
    }
}


- (IBAction)onSelectTextColor:(id)sender {
    [self.pickView setColor:self.textColor];
    __weak typeof(self) ws = self;
    self.pickView.block = ^(UIColor *color){
        ws.textColor = color;
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSelectTextColor:)]){
            [ws.delegate onSelectTextColor:color];
        }
    };
    [self.view.superview addSubview:self.pickView];
}

- (IBAction)onTextSizeChanged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onTextSizeChanged:)]){
        float value = ((UISlider *)sender).value;
        [self.delegate onTextSizeChanged:value];
    }
}


- (IBAction)onSetBackgroundH5:(id)sender {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"https://www.qq.com"];
    
    [self.tableSheet setData:array];
    __weak typeof(self) ws = self;
    self.tableSheet.block = ^(NSInteger index){
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSetBackgroundH5:)]){
            [ws.delegate onSetBackgroundH5:array[index]];
        }
    };
    [self.view.superview addSubview:self.tableSheet];
}

- (IBAction)onSetTextStyle:(id)sender {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"常规样式"];
    [array addObject:@"粗体样式"];
    [array addObject:@"斜体样式"];
    [array addObject:@"粗斜体样式"];
    
    [self.tableSheet setSelectIndex:self.textStyleIndex];
    [self.tableSheet setData:array];
    __weak typeof(self) ws = self;
    self.tableSheet.block = ^(NSInteger index){
        ws.textStyleIndex = index;
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSetTextStyle:)]){
            [ws.delegate onSetTextStyle:(int)index];
        }
    };
    [self.view.superview addSubview:self.tableSheet];
}

- (IBAction)onSetTextFamily:(id)sender {
    NSArray *array =[UIFont familyNames];
    [self.tableSheet setSelectIndex:self.textFamilyIndex];
    [self.tableSheet setData:array];
    __weak typeof(self) ws = self;
    self.tableSheet.block = ^(NSInteger index){
        ws.textFamilyIndex = index;
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSetTextFamily:)]){
            [ws.delegate onSetTextFamily:array[index]];
        }
    };
    [self.view.superview addSubview:self.tableSheet];
}




- (IBAction)onUndo:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onUndo)]){
        [self.delegate onUndo];
    }
}

- (IBAction)onRedo:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onRedo)]){
        [self.delegate onRedo];
    }
}
- (IBAction)onClear:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onClear)]){
        [self.delegate onClear];
    }
}
- (IBAction)onClearDraw:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onClearDraw)]){
        [self.delegate onClearDraw];
    }
}

- (IBAction)onReset:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onReset)]){
        [self.delegate onReset];
    }
}

- (IBAction)onSetBackgroundImage:(id)sender {
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    picker.mediaTypes = [UIImagePickerController availableMediaTypesForSourceType:UIImagePickerControllerSourceTypeCamera];
    picker.delegate = (id<UINavigationControllerDelegate, UIImagePickerControllerDelegate>)self;
    [self presentViewController:picker animated:YES completion:nil];
}

- (IBAction)onAddBoard:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onAddBoard)]){
        [self.delegate onAddBoard];
    }
}

- (IBAction)onDeleteBoard:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(getBoardList)]
       && [self.delegate respondsToSelector:@selector(getCurrentBoard)]){
        NSArray *boards = [self.delegate getBoardList];
        NSString *curBoard = [self.delegate getCurrentBoard];
        NSInteger curIndex = [boards indexOfObject:curBoard];
        [self.tableSheet setSelectIndex:curIndex];
        [self.tableSheet setData:boards];
        __weak typeof(self) ws = self;
        self.tableSheet.block = ^(NSInteger index){
            if(ws.delegate && [ws.delegate respondsToSelector:@selector(onDeleteBoard:)]){
                NSString *delBoard = [boards objectAtIndex:index];
                [ws.delegate onDeleteBoard:delBoard];
            }
        };
        [self.view.superview addSubview:self.tableSheet];
    }
    
}

- (IBAction)onGotoBoard:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(getBoardList)]
       && [self.delegate respondsToSelector:@selector(getCurrentBoard)]){
        
        BOOL state = _gotoRestStepSwitch.isOn;
        
        NSArray *boards = [self.delegate getBoardList];
        NSString *curBoard = [self.delegate getCurrentBoard];
        NSInteger curIndex = [boards indexOfObject:curBoard];
        [self.tableSheet setSelectIndex:curIndex];
        [self.tableSheet setData:boards];
        __weak typeof(self) ws = self;
        self.tableSheet.block = ^(NSInteger index){
            if(ws.delegate && [ws.delegate respondsToSelector:@selector(onGotoBoard:resetStep:)]){
                NSString *gotoBoard = [boards objectAtIndex:index];
                [ws.delegate onGotoBoard:gotoBoard resetStep:state];
            }
        };
        [self.view.superview addSubview:self.tableSheet];
    }
}
- (IBAction)onBoardScaleChanged:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onBoardScaleChanged:)]){
        int value = ((UISlider *)sender).value;
        [self.delegate onBoardScaleChanged:value];
    }
}
- (IBAction)onBoardContentFitMode:(id)sender {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"内容宽高<=白板宽高"];
    [array addObject:@"白板宽高<=容器宽高"];
    [array addObject:@"白板宽高>=容器宽高"];
    
    int curMode = 0;
    if(_delegate && [_delegate respondsToSelector:@selector(getBoardContentFitMode)]){
        curMode = [_delegate getBoardContentFitMode];
    }
    [self.tableSheet setSelectIndex:curMode];
    [self.tableSheet setData:array];
    __weak typeof(self) ws = self;
    self.tableSheet.block = ^(NSInteger index){
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onBoardContentFitMode:)]){
            [ws.delegate onBoardContentFitMode:(int)index];
        }
    };
    [self.view.superview addSubview:self.tableSheet];
}

- (IBAction)onBoardRatioChanged:(id)sender {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"16:9"];
    [array addObject:@"4:3"];
    
    NSString *curRatio = @"16:9";
    if(_delegate && [_delegate respondsToSelector:@selector(getBoardRatio)]){
        curRatio = [_delegate getBoardRatio];
    }
    NSInteger curIndex = [array indexOfObject:curRatio];
    [self.tableSheet setSelectIndex:curIndex];
    [self.tableSheet setData:array];
    __weak typeof(self) ws = self;
    self.tableSheet.block = ^(NSInteger index){
        NSString *selectRatio = [array objectAtIndex:index];
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onBoardRatioChanged:)]){
            [ws.delegate onBoardRatioChanged:selectRatio];
        }
    };
    [self.view.superview addSubview:self.tableSheet];
}


- (IBAction)onPreBoard:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onPreBoard:)]){
        BOOL state = _preRestStepSwitch.isOn;
        [self.delegate onPreBoard:state];
    }
}
- (IBAction)onNextBoard:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onNextBoard:)]){
        BOOL state = _nextRestStepSwitch.isOn;
        [self.delegate onNextBoard:state];
    }
}

- (IBAction)onPreStep:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onPreStep)]){
        [self.delegate onPreStep];
    }
}
- (IBAction)onNextStep:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(onNextStep)]){
        [self.delegate onNextStep];
    }
}

- (IBAction)onUploadFile:(id)sender {
//    NSMutableArray *array = [NSMutableArray array];
//    NSString *test1Path = [[NSBundle mainBundle] pathForResource:@"local_test1" ofType:@"pptx"];
//    NSString *test2Path = [[NSBundle mainBundle] pathForResource:@"local_test2" ofType:@"pptx"];
//    NSString *test3Path = [[NSBundle mainBundle] pathForResource:@"小程序插件统计报表" ofType:@"pdf"];
//    
//    [array addObject:test1Path];
//    [array addObject:test2Path];
//    [array addObject:test3Path];
//    [array addObject:@"http://e4fb-edu-1400127140-1257240443.cos.ap-shanghai.myqcloud.com/TIC/WEB/1557368577909_3.%E6%88%AA%E4%B8%80%E4%B8%AA%E5%87%A0%E4%BD%95%E4%BD%93.ppt"];
//    
//    [self.tableSheet setData:array];
//    __weak typeof(self) ws = self;
//    self.tableSheet.block = ^(NSInteger index){
//        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onUploadFile:)]){
//            [ws.delegate onUploadFile:array[index]];
//        }
//    };
//    [self.view.superview addSubview:self.tableSheet];
}

- (IBAction)onSwitchFile:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(getFileList)]
       && [self.delegate respondsToSelector:@selector(getCurrentFile)]){
        NSArray *files = [self.delegate getFileList];
        NSString *curFile = [self.delegate getCurrentFile];
        NSInteger curIndex = [files indexOfObject:curFile];
        [self.tableSheet setSelectIndex:curIndex];
        [self.tableSheet setData:files];
        __weak typeof(self) ws = self;
        self.tableSheet.block = ^(NSInteger index){
            if(ws.delegate && [ws.delegate respondsToSelector:@selector(onSwitchFile:)]){
                NSString *switchFile = [files objectAtIndex:index];
                [ws.delegate onSwitchFile:switchFile];
            }
        };
        [self.view.superview addSubview:self.tableSheet];
    }
}
- (IBAction)onDeleteFile:(id)sender {
    if(self.delegate && [self.delegate respondsToSelector:@selector(getFileList)]
       && [self.delegate respondsToSelector:@selector(getCurrentFile)]){
        NSArray *files = [self.delegate getFileList];
        NSString *curFile = [self.delegate getCurrentFile];
        NSInteger curIndex = [files indexOfObject:curFile];
        [self.tableSheet setSelectIndex:curIndex];
        [self.tableSheet setData:files];
        __weak typeof(self) ws = self;
        self.tableSheet.block = ^(NSInteger index){
            if(ws.delegate && [ws.delegate respondsToSelector:@selector(onDeleteFile:)]){
                NSString *switchFile = [files objectAtIndex:index];
                [ws.delegate onDeleteFile:switchFile];
            }
        };
        [self.view.superview addSubview:self.tableSheet];
    }
}

- (IBAction)onAddH5File:(id)sender {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:@"https://cloud.tencent.com/"];
    [array addObject:@"https://cloud.tencent.com/product/tiw"];
    
    [self.tableSheet setData:array];
    __weak typeof(self) ws = self;
    self.tableSheet.block = ^(NSInteger index){
        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onAddH5File:)]){
            [ws.delegate onAddH5File:array[index]];
        }
    };
    [self.view.superview addSubview:self.tableSheet];
}

#pragma mark - document
- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentsAtURLs:(NSArray <NSURL *>*)urls {
//    NSURL *url = urls.firstObject;
//    NSString *path = [[url absoluteString] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
//    [url startAccessingSecurityScopedResource];
//    NSFileCoordinator *coordinator = [[NSFileCoordinator alloc] init];
//    NSError *error;
//    __weak typeof(self) ws = self;
//    [coordinator coordinateReadingItemAtURL:url options:0 error:&error byAccessor:^(NSURL *newURL) {
//        NSData *fileData = [NSData dataWithContentsOfURL:url];
//        NSString *fileName = [url lastPathComponent];
//        NSString *filePath = [[NSHomeDirectory() stringByAppendingString:@"/Library/Caches/"] stringByAppendingString:fileName];
//        [[NSFileManager defaultManager] createFileAtPath:filePath contents:fileData attributes:nil];
//        if(ws.delegate && [ws.delegate respondsToSelector:@selector(onUploadFile:)]){
//            [ws.delegate onUploadFile:filePath];
//        }
//    }];
//    [url stopAccessingSecurityScopedResource];
}
#pragma mark - photo
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info
{
    NSString *mediaType = [info objectForKey:UIImagePickerControllerMediaType];
    if([mediaType isEqualToString:(NSString *)kUTTypeImage]){
        UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
        UIImageOrientation imageOrientation=  image.imageOrientation;
        if(imageOrientation != UIImageOrientationUp)
        {
            UIGraphicsBeginImageContext(image.size);
            [image drawInRect:CGRectMake(0, 0, image.size.width, image.size.height)];
            image = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
        }
        NSData *data = UIImagePNGRepresentation(image);
        NSString *name = [NSString stringWithFormat:@"%ld.png", (long)[[NSDate date] timeIntervalSince1970] * 1000];
        NSString *path = [[NSHomeDirectory() stringByAppendingString:@"/Library/Caches/"] stringByAppendingString:name];
        if([[NSFileManager defaultManager] createFileAtPath:path contents:data attributes:nil]){
            if(self.delegate && [self.delegate respondsToSelector:@selector(onSetBackgroundImage:)]){
                [self.delegate onSetBackgroundImage:path];
            }
        }
    }
    [picker dismissViewControllerAnimated:YES completion:nil];
}

#pragma  mark - lazy load
- (PickSheetView *)pickView
{
    if(!_pickView){
        _pickView = [[NSBundle mainBundle] loadNibNamed:@"PickSheetView" owner:self options:nil][0];
        CGSize size = [_pickView sizeThatFits:[UIScreen mainScreen].bounds.size];
        _pickView.frame = CGRectMake(0, self.view.superview.frame.size.height - size.height, self.view.superview.frame.size.width, size.height);
    }
    return _pickView;
}

- (TableSheetView *)tableSheet
{
    if(!_tableSheet){
        _tableSheet = [[NSBundle mainBundle] loadNibNamed:@"TableSheetView" owner:self options:nil][0];
        CGFloat height = self.view.superview.frame.size.height / 3;
        _tableSheet.frame = CGRectMake(0, self.view.superview.frame.size.height - height, self.view.superview.frame.size.width, height);
    }
    return _tableSheet;
}
@end
