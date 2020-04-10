const path = require("path");

module.exports = {
  entry: path.join(__dirname, "../electron.ts"),
  output: {
    filename: "electron.js",
    path: path.join(__dirname, "../build")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  }
};
