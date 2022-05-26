const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  entry: {
    entry: path.resolve(__dirname, "src", "app.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd",
    library: "d3nic", // global variable name
  },
  plugins: [new ESLintPlugin()],
  resolve: {
    extensions: [".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: {
    static: path.resolve(__dirname, "test"),
    compress: true,
    port: 7777,
  },
};
