import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

export default (env = {}, options = {}) => {
    const devMode = options.mode == "development";
    return {
        entry: { bundle: './src/index' },
        output: {
            path: path.resolve('./dist'),
            filename: '[name].js?[contenthash]',
            chunkFilename: 'chunk-[id].js?[contenthash]',
            // Dọn dẹp thư mục trước khi build
            clean: true,
        },
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
                    use: 'ts-loader',
                    // exclude: /node_modules/,
                },
                {
                    test: /\.(sass|scss|less|css)$/i,
                    use: [
                        devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { sourceMap: devMode ? true : false }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: devMode ? true : false }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: devMode ? true : false,
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
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images',
                        name: '[name].[ext]?[contenthash]',
                    },
                },
            ]
        },
        devtool: devMode ? 'inline-source-map' : false,
        resolve: {
            //Khi tìm file import, với các file trùng tên, thì theo thứ tự tsx ưu tiên nhất
            extensions: ['.tsx', '.ts', '.jsx', '.js'],
            alias: {
                '@': path.resolve('src'),
                '@@': path.resolve(),
            }
        },
        plugins: [
            //plugins này để tạo file html có tích hợp sẵn file bundle.js
            new HtmlWebpackPlugin({
                templateContent: `<html><head><meta charset="UTF-8"></head><body><div id="root"></div></body></html>`,
                meta: { 'viewport': 'width=device-width, initial-scale=1.0' },
            }),
            //plugins này để tạo file css riêng, không để css phía bên trong của js nữa
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: devMode ? "[name].css" : "[name].css?[contenthash]",
                chunkFilename: devMode ? "chunk-[id].css" : "chunk-[id].css?[contenthash]",
            })
        ],
        stats: {
            // Khi run, không hiển thị các module đã được tạo ra, trông code gọn gàng hơn
            // modules: false,
        },
        devServer: {
            static: path.resolve('./dist'),
            port: 5556,
            //hot: reload mà không cần tải lại trang
            hot: true,
        },
    }
};