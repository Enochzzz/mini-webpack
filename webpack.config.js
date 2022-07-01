const path = require('path')
const InitPlugin = require('./lib/plugins/InitPlugin')
const RenamePlugin = require('./lib/plugins/RenamePlugin')
const HtmlReloadPlugin = require('./lib/plugins/HtmlReloadPlugin')


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [path.join(__dirname, './lib/loader/less-loader.js')]
      }
    ]
  },
  plugins: [new InitPlugin, new RenamePlugin, new HtmlReloadPlugin]
}
