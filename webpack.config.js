const path = require("path");
const webpack = require("webpack");
// const nodeExternals = require("webpack-node-externals");
// const keysTransformer = require("ts-transformer-keys/transformer").default;
// const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    api: path.resolve(__dirname, "src", "api", "index.ts")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src")
    },
    modules: ["node_modules"]
  },
  target: "node",
  // externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: {
          loader: "ts-loader",
          // options: {
          //   configFile: path.resolve(__dirname, "tsconfig.json"),
          //   getCustomTransformers: program => ({
          //     before: [keysTransformer(program)]
          //   })
          // }
        }
      },
      {
        test: /\.json$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: {
          loader: "json-loader"
        }
      }
    ]
  },
  plugins: [
    // new webpack.EnvironmentPlugin({
    //   NODE_ENV: process.env.NODE_ENV
    // }),
    // new Dotenv({
    //   path: path.join(__dirname, ".env"),
    //   systemvars: true
    // })
  ]
};
