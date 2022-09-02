const publicPath = process.env.publicPath || '/';
console.log('publicPath:', publicPath);
module.exports = {
  publicPath: publicPath,
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => options);
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '互动白板-体验课堂';
        return args
      });
  },
  transpileDependencies: [
    'vuetify',
  ],
};
