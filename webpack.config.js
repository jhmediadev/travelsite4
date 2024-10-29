const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');
const postCSSPlugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-simple-vars'),
  require('postcss-nested'),
  require('autoprefixer'),
];

let cssConfig = {
  test: /\.css$/i,
  use: [
    { loader: 'css-loader', options: { url: false } },
    { loader: 'postcss-loader', options: { postcssOptions: { plugins: postCSSPlugins } } },
  ],
};

let pages = fse
  .readdirSync('./app')
  .filter(function (file) {
    return file.endsWith('.html');
  })
  .map(function (page) {
    return new HtmlWebpackPlugin({ filename: page, template: `./app/${page}`, scriptLoading: 'blocking' });
  });

let config = {
  entry: './app/assets/scripts/App.js',
  plugins: [new HtmlWebpackPlugin({ filename: 'index.html', template: './app/index.html' })],
  plugins: pages,
  module: {
    rules: [cssConfig],
  },
};

if (currentTask == 'dev') {
  cssConfig.use.unshift('style-loader');
  config.output = {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app'),
  };
  config.devServer = {
    watchFiles: ['app/**/*.html'],
    static: {
      directory: path.join(__dirname, 'app'),
    },
    hot: true,
    port: 3010,
    host: '0.0.0.0',
  };
  config.mode = 'development';
}

if (currentTask == 'build') {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.output = {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'dist'),
  };
  config.mode = 'production';

  config.plugins.push(new MiniCssExtractPlugin({ filename: 'styles.css' }));
}

// let deleteMeLater = {
//   // entry: './app/assets/scripts/App.js',
//   // output: {
//   //   filename: 'bundled.js',
//   //   path: path.resolve(__dirname, 'app'),
//   // },
//   // devServer: {
//   //   watchFiles: ['app/**/*.html'],
//   //   static: {
//   //     directory: path.join(__dirname, 'app'),
//   //   },
//   //   hot: true,
//   //   port: 3010,
//   // },
//   // mode: 'development',
//   // module: {
//   //   rules: [
//   //     {
//   //       test: /\.css$/i,
//   //       use: [
//   //         'style-loader',
//   //         { loader: 'css-loader', options: { url: false } },
//   //         { loader: 'postcss-loader', options: { postcssOptions: { plugins: postCSSPlugins } } },
//   //       ],
//   //     },
//   //   ],
//   // },
// };

module.exports = config;
