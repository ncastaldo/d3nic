const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        entry: __dirname + '/src/app.js'
    },
    output: {
        filename: 'd3nic.min.js',
        libraryTarget: 'var', // tells webpack to make the library available as a global variable.
        library: 'd3nic' // names that global variable (in this case, it's d3nic.
    },
    module: {
        rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
    },
    devServer: {
        contentBase: __dirname + '/test',
        compress: true,
        port: 7777
    },
    optimization:{
        minimize: true,
        minimizer: [new UglifyJsPlugin()],
    }
}