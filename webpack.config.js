const path = require('path')

module.exports = {
    entry: {
        popup: path.resolve(__dirname, './src/app.js'),
        upload_panel: path.resolve(__dirname, './src/upload_panel.js'),
        background: path.resolve(__dirname, './src/background.js'),
        settings_options: path.resolve(__dirname, './src/settings/options.js'),
        settings_image_manage: path.resolve(__dirname, './src/settings/image_manage.js'),
        content: path.resolve(__dirname, './src/content.js'),
        token: path.resolve(__dirname, './src/token.js'),
    },
    output: {
        path: path.resolve(__dirname, '/build/js'),
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-es2015'],
                },
            },
        ],
    },
};
