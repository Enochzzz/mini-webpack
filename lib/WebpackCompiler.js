// babylon主要把源码转成ast。Babylon 是 Babel 中使用的 JavaScript 解析器。
// @babel/traverse 对ast解析遍历语法树 负责替换，删除和添加节点
// @babel/types 用于AST节点的Lodash-esque实用程序库
// @babel/generator 结果生成

const babylon = require('babylon')
const traverse = require('@babel/traverse').default;
const type = require('@babel/types');
const generator = require('@babel/generator').default
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const tapable = require('tapable')

class WebpackCompiler {
  constructor(config) {
    this.config = config
    this.modules = {}
    this.root = process.cwd() //当前项目地址   
    this.entryPath = './' + path.relative(this.root, this.config.entry);
    this.hooks = {
      entryInit: new tapable.SyncHook(),
      beforeCompile: new tapable.SyncHook(),
      afterCompile: new tapable.SyncHook(),
      afterPlugins: new tapable.SyncWaterfallHook(['hash']),
      aftermit: new tapable.SyncWaterfallHook(['hash'])
    }

    const plugins = this.config.plugins
    if(Array.isArray(plugins)) {
      plugins.forEach(item => {
        item.run(this)
      })
    }
  }

  run() {
    // 启动项目
    this.hooks.entryInit.call()
    // 编译前
    this.hooks.beforeCompile.call()
    this.buildModule(this.entryPath)
    // 编译后
    this.hooks.afterCompile.call()
    this.outputFile()
    // 执行完plugins后
    this.hooks.afterPlugins.call()
    // 结束后运行
    this.hooks.aftermit.call()
  }

  // 解析转换js代码
  parse(source, parentpath) {
    // 源码转换为ast
    let ast = babylon.parse(source) 
    // 存取依赖
    let dep = [] 
    // 通过处理ast的方式，操作代码
    traverse(ast, {
      CallExpression(p) {
        let node = p.node
        if(node.callee.name === 'require') {
          // 将源码中的require 替换成我们的'__webpack_require__'
          node.callee.name = '__webpack_require__';
          // 生成moduleName
          const moduleName = './' + path.join(parentpath, node.arguments[0].value)
          // 记录包含的require的名称，后面需要遍历换成源码
          dep.push(moduleName)
          // 源码替换
          node.arguments = [type.stringLiteral(moduleName)]
        }
      }
    })
    let sourceCode = generator(ast).code
    return {
      sourceCode,
      dep
    }
  }

  // 生成main文件，完成递归
  buildModule(modulePath, isEntry) {
    // 获取源码
    const source = this.getSourceByPath(modulePath)
    // 转换路径名称
    const moduleName = './' + path.relative(this.root, modulePath)
    // 处理代码，获取转换后的代码，以及源码中已经require的文件名称数组
    const {sourceCode, dep} = this.parse(source, path.dirname(moduleName))
    // 以{moduleName: sourceCode} 存入 modules对象
    this.modules[moduleName] = sourceCode
    // 递归处理依赖
    dep.forEach(i => {
      this.buildModule(path.resolve(this.root, i))
    })
  }

  getSourceByPath(modulePath) {
    // 通过路径读取源码
    let content = fs.readFileSync(modulePath, 'utf8')

    // 获取loader信息 loader 就是在拿到源文件代码后 通过rules的规则匹配后缀 多做一层转换
    const rules = this.config.module.rules

    for(let i = 0; i < rules.length; i++) {
      const {test, use} = rules[i]
      let len = use.length
      if(test.test(modulePath)) {
        function changeLoader() {
          // 倒叙执行 先拿最后一个
          let loader = require(use[--len])
          content = loader(content)
          if(len>0) {
            changeLoader()
          }
        }
        changeLoader()
      }
    }

    // 返回代码
    return content
  }

  outputFile() {
    // 获取模板
    let templateStr = this.getSourceByPath(path.join(__dirname, 'main.ejs'))
    // 填充数据
    let code = ejs.render(templateStr, {
      entryPath: this.entryPath,
      modules: this.modules
    })
    // 处理输出地址
    let outPath = path.join(this.config.output.path, this.config.output.filename)
    // 写入
    fs.writeFileSync(outPath, code)
  }
}

module.exports = WebpackCompiler


const installModule = {}
function __webpack_require__(moduleId) {
  if(installModule[moduleId]) {
    return installModule[moduleId].exports
  }

  const module = installModule[moduleId] = {
    id: moduleId,
    load: false,
    exports: {}
  }

  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)

  module.load = true
  
  return module.exports
}
