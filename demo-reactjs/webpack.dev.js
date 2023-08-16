/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import Env from './config.js'

export default (env = {}, options = {}) => ({
  entry: { bundle: './src/index' },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js?[contenthash]',
    chunkFilename: 'chunk-[id].js?[contenthash]',
    publicPath: '/',
  },
  cache: { type: 'memory' },
  optimization: {
    // Chế độ tách các file module
    splitChunks: { chunks: 'all' },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // "@babel/preset-env",
              '@babel/preset-react',
            ],
          },
        },
        // include: path.resolve('./src'),
      },
      {
        test: /\.(ts|tsx)$/i,
        use: [
          // This option turns off type checking.
          { loader: 'ts-loader', options: { transpileOnly: true } },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss|css)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name].[ext]?[contenthash]',
            },
          },
        ],
      },
    ],
  },
  devtool: 'inline-source-map',
  resolve: {
    // Khi tìm file import, với các file trùng tên, thì theo thứ tự tsx ưu tiên nhất
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve('src'),
      '@@': path.resolve(),
    },
  },
  plugins: [
    // plugins này để tạo file html có tích hợp sẵn file bundle.js
    new HtmlWebpackPlugin({
      templateContent: '<html><head><meta charset="UTF-8"></head><body><div id="root"></div></body></html>',
      meta: { viewport: 'width=device-width, initial-scale=1.0' },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: path.resolve('./dist'),
    port: Env.LOCAL_POST,
    compress: true,
    hot: true, // hot: reload mà không cần tải lại trang
    historyApiFallback: true, // F5 vẫn giữ được router
  },
})
