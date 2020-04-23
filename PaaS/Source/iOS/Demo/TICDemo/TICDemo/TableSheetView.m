//
//  TableSheetView.m
//  TICDemo
//
//  Created by kennethmiao on 2019/4/25.
//  Copyright © 2019年 Tencent. All rights reserved.
//

#import "TableSheetView.h"

@interface TableSheetView () <UITableViewDelegate, UITableViewDataSource>
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@property (nonatomic, strong) NSArray *data;
@property (nonatomic, assign) NSInteger index;
@end

@implementation TableSheetView

- (void)awakeFromNib
{
    [super awakeFromNib];
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
}
- (void)setData:(NSArray *)data
{
    _data = data;
    [self.tableView reloadData];
}

- (void)setSelectIndex:(NSInteger)index
{
    self.index = index;
}

- (IBAction)onCancel:(id)sender
{
    [self removeFromSuperview];
}

- (IBAction)onConfirm:(id)sender
{
    [self removeFromSuperview];
    if(self.block){
        self.block(self.index);
    }
}

- (void)tableView:(UITableView *)tableView didDeselectRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    [cell setSelected:NO animated:NO];
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    if(self.index != indexPath.row){
        UITableViewCell *cell = [tableView cellForRowAtIndexPath:[NSIndexPath indexPathForRow:self.index inSection:0]];
        [cell setSelected:NO animated:NO];
        self.index = indexPath.row;
    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.data.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if(!cell){
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
        cell.textLabel.textAlignment = NSTextAlignmentCenter;
    }
    cell.textLabel.text = self.data[indexPath.row];
    __weak typeof(self) ws = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        [cell setSelected:(indexPath.row == ws.index) animated:NO];
    });
    return cell;
}
@end
