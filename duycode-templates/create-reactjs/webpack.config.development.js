import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default (env = {}, options = {}) => {
    return {
        entry: { bundle: './src/index' },
        output: {
            path: path.resolve('./dist'),
            filename: '[name].js?[contenthash]',
            chunkFilename: 'chunk-[id].js?[contenthash]',
        },
        cache: { type: 'memory' },
        optimization: {
            // Chế độ tách các file module
            splitChunks: {
                chunks: 'all',
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/i,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            "presets": [
                                // "@babel/preset-env",
                                "@babel/preset-react"
                            ]
                        }
                    },
                    // include: path.resolve('./src'),
                },
                {
                    test: /\.(ts|tsx)$/i,
                    use: [
                        // This option turns off type checking.
                        { loader: 'ts-loader', options: { transpileOnly: true } }
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(sass|scss|less|css)$/i,
                    use: [
                        "style-loader",
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                // Phải có options này mới dùng được antd, cha tổ :((
                                lessOptions: {
                                    javascriptEnabled: true,
                                }
                            }
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
                    ]
                },
            ]
        },
        devtool: 'inline-source-map',
        resolve: {
            //Khi tìm file import, với các file trùng tên, thì theo thứ tự tsx ưu tiên nhất
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                '@': path.resolve('src'),
                '@@': path.resolve(),
            }
        },
        plugins: [
            // plugins này để tạo file html có tích hợp sẵn file bundle.js
            new HtmlWebpackPlugin({
                templateContent: `<html><head><meta charset="UTF-8"></head><body><div id="root"></div></body></html>`,
                meta: { 'viewport': 'width=device-width, initial-scale=1.0' },
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
            static: path.resolve('./dist'),
            port: 5555,
            compress: true,
            //hot: reload mà không cần tải lại trang
            hot: true,
        },
    }
};