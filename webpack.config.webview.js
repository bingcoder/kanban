//@ts-check

"use strict";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const config = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/webview/main.tsx",
  output: {
    path: path.join(__dirname, "webview"),
  },
  target: "web",
  resolve: {
    alias: {
      "@": path.resolve("src/webview"),
    },
    extensions: [".ts", ".tsx", "..."],
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
    new ForkTsCheckerWebpackPlugin(),
  ],
};
module.exports = config;
