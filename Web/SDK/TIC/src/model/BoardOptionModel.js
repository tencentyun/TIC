function BoardOptionModel() {
  this.id = null;
  this.ratio = '16:9';
  this.drawEnable = true;
  this.textFamily = null;
  this.textStyle = 0;
  this.textSize = 320;
  this.textColor = null;
  this.brushColor = '#ff0000';
  this.brushThin = 100;
  this.toolType = 1;
  this.globalBackgroundColor = '#ffffff';
  this.boardFileFitMode = 0; //
  this.scale = 100; //
  this.smoothLevel = 0.1; // 平滑系数
  this.preloadDepth = 5; // 预加载深度
}

BoardOptionModel.prototype.setData = function (data) {
  Object.assign(this, data);
};

export default BoardOptionModel;
