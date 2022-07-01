class InitPlugin{
  run(compile) {
    compile.hooks.entryInit.tap('init', function(res){
      console.log('编译开始---', res)
    })
  }
}

module.exports = InitPlugin
