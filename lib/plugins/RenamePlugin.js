const fs = require('fs')
const path = require('path')

class RenamePlugin {
  run(compile) {
    compile.hooks.afterPlugins.tap('rename', function(res) {
      console.log('rename----', res)
      const ranNum = parseInt(Math.random() * 100000000)
      const err = fs.copyFileSync(path.join(__dirname,'../../dist/main.js'), path.join(__dirname,`../../dist/main.${ranNum}.js`))
      if(err) {
        console.log('获取文件失败')
      } else {
        // fs.delFileByName(path.join(__dirname,'../../dist/main.js'))
      }
      console.log('重新生成js成功');
      return ranNum
    })
  }
}

module.exports = RenamePlugin
