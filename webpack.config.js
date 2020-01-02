const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  entry: "./src/index.ts",
  output: {
    hashDigestLength: 6,
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].chunk.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /\.(vert|frag)$/,
        use: "raw-loader"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html", title: "Breakout" })
  ]
};
