//
//  MenuTableViewController.h
//  TICDemo
//
//  Created by kennethmiao on 2019/4/25.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol MenuTableViewControllerDelegate <NSObject>
- (void)onSpeakerStateChaged:(BOOL)state;
//board（涂鸦）
- (void)onDrawStateChanged:(BOOL)state;
- (void)onSyncDataChanged:(BOOL)state;
- (void)onMagicPenChanged:(BOOL)state;
- (void)onPiecewiseErasureChanged:(BOOL)state;
- (void)onSelectToolType:(int)toolType;
- (void)onSelectCustomGraph:(NSString *)url;
- (void)onSelectBrushColor:(UIColor *)color;
- (void)onSelectBackgroundColor:(UIColor *)color;
- (void)onBrushThinChanged:(float)thin;
- (void)onSelectTextColor:(UIColor *)color;
- (void)onTextSizeChanged:(float)thin;
- (void)onSetBackgroundH5:(NSString *)url;
- (void)onAddH5File:(NSString *)url;
- (void)onSetTextStyle:(int)style;
- (void)onSetTextFamily:(NSString *)family;
- (void)onAddMathBoard;
- (void)onSetMathGraphType:(NSInteger)type;
- (void)onSetOwnerNickNameVisible:(BOOL)state;


- (void)onUndo;
- (void)onRedo;
- (void)onClear;
- (void)onClearDraw;
- (void)onReset;
- (void)onSetBackgroundImage:(NSString *)path;
//board（白板）
- (void)onAddBoard;
- (void)onDeleteBoard:(NSString *)boardId;
- (void)onGotoBoard:(NSString *)boardId resetStep:(BOOL)resetStep;
- (void)onPreBoard:(BOOL)resetStep;
- (void)onNextBoard:(BOOL)resetStep;
- (NSArray<NSString *> *)getBoardList;
- (NSString *)getCurrentBoard;
- (void)onPreStep;
- (void)onNextStep;
- (void)onBoardScaleChanged:(int)scale;
- (void)onBoardContentFitMode:(int)mode;
- (int)getBoardContentFitMode;
- (void)onBoardRatioChanged:(NSString *)ratio;
- (NSString *)getBoardRatio;
//board（文件）
- (void)onSwitchFile:(NSString *)fileId;
- (void)onDeleteFile:(NSString *)fileId;
- (NSArray<NSString *> *)getFileList;
- (NSString *)getCurrentFile;
@end

@interface MenuTableViewController : UITableViewController
@property (nonatomic, weak) id<MenuTableViewControllerDelegate> delegate;
- (void)setCanUndo:(BOOL)canUndo;
- (void)setCanRedo:(BOOL)canRedo;
@end

