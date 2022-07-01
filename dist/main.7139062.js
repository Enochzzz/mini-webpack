(function(modules) {
    // 固定代码
    function __webpack_require__() {}
    return __webpack_require__(__webpack_require__.s = "./src\index.js");
})
({
    
        "./src\index.js": (function (module, exports,__webpack_require__) {
            eval(`__webpack_require__("./src\\style.less");

function a() {
  console.log(12345);
}`);
      }),
    
        "./src\style.less": (function (module, exports,__webpack_require__) {
            eval(`let style = document.createElement('style');
style.innerHTML = "body .a {\\n  background-color: skyblue;\\n}\\n";
document.head.appendChild(style);`);
      }),
    
});
