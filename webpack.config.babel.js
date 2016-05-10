import path from 'path'

export default {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'build/Release'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    }
}