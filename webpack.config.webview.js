//@ts-check

"use strict";
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const config = {
  mode: "development",
  entry: "./src/webview/main.tsx",
  output: {
    path: path.join(__dirname, "webview"),
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/webview/index.html",
    }),
  ],
};
module.exports = config;
