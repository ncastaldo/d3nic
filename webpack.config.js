const path = require('path')
// const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    entry: path.resolve(__dirname, 'src', 'app.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'd3nic' // names that global variable (in this case, it's d3nic.
  },
  module: {
    rules: [
      /* {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      } */
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  /* externals: {
        d3: 'd3'
    }, */
  devServer: {
    contentBase: path.resolve(__dirname, 'test'),
    compress: true,
    port: 7777
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}
