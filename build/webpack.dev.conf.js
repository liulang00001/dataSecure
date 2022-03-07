'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const bundleConfig = require('../dll/bundle-config.json')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let env = require('../config/dev.env');
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
// 增加环境变量
env.GIT_REPO_INFO = JSON.stringify(process.env.GIT_REPO_INFO);
env.RELEASE = JSON.stringify(process.env.RELEASE);
env.ENVIRONMENT = JSON.stringify(process.env.env_config);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'vue-element-admin',
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
      libJsName: bundleConfig ? '/static/' + bundleConfig.libs.js : ''
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../dll'), // dll设置，改为dll
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../static/robots.txt'),
        to: './',
      },
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['robots.txt']
      }
    ]),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dll/libs-mainfest.json') // 指向生成的manifest.json
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
