//
//  ColorPickViewController.m
//  TICDemo_Mac
//
//  Created by kennethmiao on 2019/4/30.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import "ColorPickViewController.h"

@interface ColorPickViewController ()
@property (weak) IBOutlet NSTextField *redTextField;
@property (weak) IBOutlet NSTextField *greenTextField;
@property (weak) IBOutlet NSTextField *blueTextField;
@property (weak) IBOutlet NSSlider *redSlider;
@property (weak) IBOutlet NSSlider *greenSlider;
@property (weak) IBOutlet NSSlider *blueSlider;

@property (nonatomic, strong) NSColor *defaultColor;
@property (nonatomic, strong) NSColor *pickColor;
@end

@implementation ColorPickViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    const CGFloat *components = CGColorGetComponents(_defaultColor.CGColor);
    int r = components[0] * 255;
    int g = components[1] * 255;
    int b = components[2] * 255;
    self.redSlider.intValue = r;
    self.greenSlider.intValue = g;
    self.blueSlider.intValue = b;
    self.redTextField.intValue = r;
    self.greenTextField.intValue = g;
    self.blueTextField.intValue = b;
}
- (IBAction)onRedChanged:(id)sender {
    [self setColor];
}
- (IBAction)onGreenChanged:(id)sender {
    [self setColor];
}
- (IBAction)onBlueChanged:(id)sender {
    [self setColor];
}

- (void)setColor
{
    self.redTextField.intValue = self.redSlider.intValue;
    self.greenTextField.intValue = self.greenSlider.intValue;
    self.blueTextField.intValue = self.blueSlider.intValue;
    self.pickColor = [NSColor colorWithRed:self.redSlider.intValue / 255.0 green:self.greenSlider.intValue / 255.0 blue:self.blueSlider.intValue / 255.0 alpha:1.0];
    if(self.block){
        self.block(self.pickColor);
    }
}

- (void)setDefaultColor:(NSColor *)color
{
    _defaultColor = color;
    _pickColor = _defaultColor;
}
- (NSColor *)getPickColor
{
    return _pickColor;
}
@end
