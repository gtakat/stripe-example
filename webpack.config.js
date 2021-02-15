require('dotenv').config({ path: __dirname + '/.env' });
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    customer: './src/client/customer.js',
    payment: './src/client/payment.js',
    refund: './src/client/refund.js'
  },
  output: {
    path: `${__dirname}/public/js`,
    // filename: 'bundle.js'
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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        STRIPE_PUBLIC_KEY: JSON.stringify(process.env.STRIPE_PUBLIC_KEY)
      }
    })
  ]
};