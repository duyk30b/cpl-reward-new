/* eslint-disable import/no-extraneous-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import path from 'path'

export default (env = {}, options = {}) => ({
  entry: { bundle: './src/index' },
  output: {
    path: path.resolve('./build'),
    filename: '[name].js?[contenthash]',
    chunkFilename: 'chunk-[id].js?[contenthash]',
    // Dọn dẹp thư mục trước khi build
    clean: true,
  },
  optimization: {
    // Chế độ tách các file module
    splitChunks: {
      chunks: 'all',
      // maxSize: 250000,
    },
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
        exclude: /node_modules/,
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
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
    // plugins này để tạo file css riêng, không để css phía bên trong của js nữa
    new MiniCssExtractPlugin({
      filename: '[name].css?[contenthash]',
      chunkFilename: '[id].css?[contenthash]',
    }),
    new BundleAnalyzerPlugin({
      analyzerHost: 'localhost',
      analyzerPort: 5555,
    }),
  ],
  stats: {
    // Khi run, không hiển thị các module đã được tạo ra, trông code gọn gàng hơn
    // modules: false,
  },
})
