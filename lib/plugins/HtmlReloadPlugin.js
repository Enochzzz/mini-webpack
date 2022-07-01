const fs = require('fs')
const path = require('path')

class HtmlReloadPlugin {
  run(compile) {
    compile.hooks.afterPlugins.tap('htmlreload', function(res) {
      console.log('htmlreload---', res)
      let html = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf8')
      console.log(`main.${res}.js`,html, res, 88888)
      html = html.replace(/main.[\w]*.js/g, `main.${res}.js`)
      fs.writeFileSync('./public/index.html', html)
    })
  }
}

module.exports = HtmlReloadPlugin
