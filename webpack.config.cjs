const path = require('path')
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  entry: './client/client.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'client') // was client
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
      'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
    }),
  ].filter(Boolean),
}
