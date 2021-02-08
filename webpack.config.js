module.exports = {
  mode: 'development',
  entry: './src/client/index.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      path: "path-browserify",
      https: "https-browserify",
      http: "stream-http",
      stream: "stream-browserify"
    }
  }
};