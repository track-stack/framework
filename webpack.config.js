module.exports = {
  entry: "./lib/trackstack.js",
  output: {
    path: __dirname,
    filename: "index.js",
    library: '',
    libraryTarget: 'commonjs'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2017']
        }
      }
    ]
  }
}
