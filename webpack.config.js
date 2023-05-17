const path = require('path')

module.exports = {
    mode: 'none',
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
    }
}