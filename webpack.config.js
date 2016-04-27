'use strict'

let path = require('path')
let webpack = require('webpack')
let devtool

if (process.env.NODE_ENV !== 'production') {
 devtool = 'source-map'
}

module.exports = {
  entry: './frontend/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'application.js'
  },
  resolve: {
    root: path.resolve('./node_modules')
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        cacheDirectory: true
      }
    }]
  },
  devtool: devtool,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    }),
    new webpack.ContextReplacementPlugin(
        /moment[\/\\]locale$/, /de/
    )
  ]
}
