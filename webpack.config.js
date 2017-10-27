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
      },
      {
        test: /\.ts|\.tsx$/,
        use: 'ts-loader',
        include: __dirname
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
}
