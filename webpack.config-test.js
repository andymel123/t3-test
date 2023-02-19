const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/test-ortho/index.ts',
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'target'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/test-ortho/index.html'
    })
  ],
  devServer: {
    // static: {
    //   directory: path.join(__dirname, 'target'),
    // },
    // following dirs will be served by the dev server
    static: [
      path.join(__dirname, 'target'),
      path.join(__dirname, 'data')
    ],
    compress: true,
    port: 9000,
  },
};