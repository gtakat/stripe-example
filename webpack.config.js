require('dotenv').config({ path: __dirname + '/.env' });
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    customer: './src/client/customer.js',
    card: './src/client/card.js',
    card_change: './src/client/card_change.js',
    card_detach: './src/client/card_detach.js',
    payment: './src/client/payment.js',
    refund: './src/client/refund.js',
    subscription: './src/client/subscription.js',
    subscription_user_action: './src/client/subscription_user_action.js',
    subscription_cancel: './src/client/subscription_cancel.js',
    subscription_change_plan: './src/client/subscription_change_plan.js',
    subscription_staged_price: './src/client/subscription_staged_price.js',
    subscription_promotion_code: './src/client/subscription_promotion_code.js',
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