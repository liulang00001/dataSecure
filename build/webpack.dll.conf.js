const path = require('path')
const webpack = require('webpack') // 调用webpack内置DllPlugin插件
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 提取css
const AssetsPlugin = require('assets-webpack-plugin') // 生成文件名，配合HtmlWebpackPlugin增加打包后dll的缓存
const merge = require('webpack-merge')
const package = require('../package.json')
const webpackConfig = require('./webpack.base.conf')
const name = (package.name || '').replace(/-/g, '_');

//如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
let dependencies = Object.keys(package.dependencies) || []
let unlist = ['normalize.css', 'jsonlint', 'jszip', 'font-awesome', 'serve-static', 'github-markdown-css', 'vue-particles', 'v-code-diff']
dependencies = dependencies.length > 0 ? dependencies.filter(item => unlist.indexOf(item) === -1) : []

delete webpackConfig.entry
delete webpackConfig.output

module.exports = merge(webpackConfig, {
  entry: {
    libs: dependencies
  },
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].[chunkhash:7].js',
    library: '[name]_library',
    libraryTarget: 'umd',// 把子应用打包成 umd 库格式
    jsonpFunction: `webpackJsonp_${name}`,
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../dll/[name]-mainfest.json'),
      name: '[name]_library',
      context: __dirname // 执行的上下文环境，对之后DllReferencePlugin有用
    }),
    new ExtractTextPlugin('[name].[contenthash:7].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: './dll'
    })
  ]
})
