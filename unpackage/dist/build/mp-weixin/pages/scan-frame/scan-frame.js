(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/scan-frame/scan-frame"],{4860:function(n,t,a){"use strict";a.r(t);var e=a("5fd3"),c=a.n(e);for(var u in e)"default"!==u&&function(n){a.d(t,n,(function(){return e[n]}))}(u);t["default"]=c.a},"5fd3":function(n,t,a){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={name:"scan-frame",data:function(){return{src:""}},methods:{takePhoto:function(){var t=n.createCameraContext();t.takePhoto({quality:"high",success:function(t){n.showModal({title:"选择框",content:"是否需要进行抠图",success:function(a){var e=t.tempImagePath;a.confirm?n.navigateTo({url:"../penCut/penCut?backgroundImageSrc=".concat(e)}):a.cancel&&n.navigateTo({url:"../drawCanvas/drawCanvas?backgroundImageSrc=".concat(e)})}})}})},error:function(n){console.log(n.detail)}}};t.default=a}).call(this,a("543d")["default"])},6059:function(n,t,a){"use strict";a.r(t);var e=a("c8b1"),c=a("4860");for(var u in c)"default"!==u&&function(n){a.d(t,n,(function(){return c[n]}))}(u);a("6ca5");var r,o=a("f0c5"),f=Object(o["a"])(c["default"],e["b"],e["c"],!1,null,null,null,!1,e["a"],r);t["default"]=f.exports},"6ca5":function(n,t,a){"use strict";var e=a("7834"),c=a.n(e);c.a},7834:function(n,t,a){},a975:function(n,t,a){"use strict";(function(n){a("e2fc");e(a("66fd"));var t=e(a("6059"));function e(n){return n&&n.__esModule?n:{default:n}}n(t.default)}).call(this,a("543d")["createPage"])},c8b1:function(n,t,a){"use strict";var e;a.d(t,"b",(function(){return c})),a.d(t,"c",(function(){return u})),a.d(t,"a",(function(){return e}));var c=function(){var n=this,t=n.$createElement;n._self._c},u=[]}},[["a975","common/runtime","common/vendor"]]]);