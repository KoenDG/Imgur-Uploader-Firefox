const path = require("path")

module.exports = {
    mode: 'development',

    entry: {
        popup: './src/app.js',
        upload_panel: './src/upload_panel.js',
        background: './src/background.js',
        settings_options: './src/settings/options.js',
        settings_image_manage: './src/settings/image_manage.js',
        content: './src/content.js',
        token: './src/token.js'
    },
    output: {
        path: __dirname + "/build/js",
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',

    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['babel-preset-env']
                }
            }
        ]
    }
};
