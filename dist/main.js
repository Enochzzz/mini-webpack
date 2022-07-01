(function(modules) {
    // 固定代码
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
    return __webpack_require__(__webpack_require__.s = "./src\index.js");
})
({
    
        "./src\index.js": (function (module, exports,__webpack_require__) {
            eval(`__webpack_require__("./src\\style.less");

const a = __webpack_require__("./src\\a.js");

console.log(__webpack_require__("./src\\a.js"), 2222222222);

function c() {
  console.log(a);
}

c();`);
      }),
    
        "./src\style.less": (function (module, exports,__webpack_require__) {
            eval(`let style = document.createElement('style');
style.innerHTML = "body .a {\\n  background-color: skyblue;\\n}\\n";
document.head.appendChild(style);`);
      }),
    
        "./src\a.js": (function (module, exports,__webpack_require__) {
            eval(`exports = {
  a: 1,
  b: 2
};`);
      }),
    
});
