const path = require('path');

module.exports = {
    entry: {
        writer: './client/writer.jsx',
        login: './client/login.jsx',
        feed: './client/feed.jsx',
        account: './client/account.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};