const path = require('path')
const CleanWebpack = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'public/dist'),
        publicPath: path.resolve(__dirname, 'public/dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts*/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanWebpack.CleanWebpackPlugin()
    ]
}