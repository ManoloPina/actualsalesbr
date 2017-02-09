const webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {loader: 'babel-loader'}
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  target: 'node'
};
