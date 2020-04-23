//
//  PickSheetView.m
//  TICDemo
//
//  Created by kennethmiao on 2019/4/25.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import "PickSheetView.h"

@interface PickSheetView ()
@property (weak, nonatomic) IBOutlet UILabel *colorLabel;
@property (weak, nonatomic) IBOutlet UILabel *redLabel;
@property (weak, nonatomic) IBOutlet UILabel *greenLabel;
@property (weak, nonatomic) IBOutlet UILabel *blueLabel;
@property (weak, nonatomic) IBOutlet UISlider *redSlider;
@property (weak, nonatomic) IBOutlet UISlider *greenSlider;
@property (weak, nonatomic) IBOutlet UISlider *blueSlider;
@end

@implementation PickSheetView
- (void)awakeFromNib
{
    self.colorLabel.layer.cornerRadius = self.colorLabel.frame.size.width / 2;
    [self.colorLabel.layer setMasksToBounds:YES];
    [super awakeFromNib];
}

- (void)setColor:(UIColor *)color
{
    const CGFloat *components = CGColorGetComponents(color.CGColor);
    int r = components[0] * 255;
    int g = components[1] * 255;
    int b = components[2] * 255;
    self.redLabel.text = [@(r) stringValue];
    self.greenLabel.text = [@(g) stringValue];
    self.blueLabel.text = [@(b) stringValue];
    self.redSlider.value = r;
    self.greenSlider.value = g;
    self.blueSlider.value = b;
    self.colorLabel.backgroundColor = color;
}

- (IBAction)onRedChanged:(id)sender {
    int value = (int)((UISlider *)sender).value;
    self.redLabel.text = [@(value) stringValue];
    [self setColor];
}

- (IBAction)onGreenChanged:(id)sender
{
    int value = (int)((UISlider *)sender).value;
    self.greenLabel.text = [@(value) stringValue];
    [self setColor];
}

- (IBAction)onBlueChanged:(id)sender
{
    int value = (int)((UISlider *)sender).value;
    self.blueLabel.text = [@(value) stringValue];
    [self setColor];
}

- (void)setColor
{
    float r = [self.redLabel.text floatValue] / 255.0;
    float g = [self.greenLabel.text floatValue] / 255.0;
    float b = [self.blueLabel.text floatValue] / 255.0;
    self.colorLabel.backgroundColor = [UIColor colorWithRed:r green:g blue:b alpha:1.0];
}

- (IBAction)onCancel:(id)sender
{
    [self removeFromSuperview];
}

- (IBAction)onConfirm:(id)sender
{
    [self removeFromSuperview];
    if(self.block){
        self.block(self.colorLabel.backgroundColor);
    }
}

@end
