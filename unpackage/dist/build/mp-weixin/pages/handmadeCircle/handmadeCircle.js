(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/handmadeCircle/handmadeCircle"],{"10cc":function(t,c,i){"use strict";(function(t){i("e2fc");n(i("66fd"));var c=n(i("28b1"));function n(t){return t&&t.__esModule?t:{default:t}}t(c.default)}).call(this,i("543d")["createPage"])},"1fe8":function(t,c,i){"use strict";Object.defineProperty(c,"__esModule",{value:!0}),c.default=void 0;var n={name:"handmadeCircle",data:function(){return{tabList:[{name:"综合圈"},{name:"服装裁剪"}],current:0,dynamicList:[{id:"小新",avatar:"https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1950846641,3729028697&fm=26&gp=0.jpg",name:"小新",publishTime:1617086756,content:"你爱我，我爱你，蜜雪冰城甜蜜蜜",imgList:["https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg","https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg"],isLike:!0,isCollect:!0,likeNumber:2,collectionNumber:2,chatNumber:2,isFocusOn:!1},{id:"小白",avatar:"https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2291332875,175289127&fm=26&gp=0.jpg",name:"小白",publishTime:1617036656,content:"  足不出户享国内核医学领域顶级专家云诊断，“中山-联影”分子影像远程互联融合创新中心揭牌 ",imgList:["https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg"],isLike:!1,isCollect:!1,likeNumber:0,collectionNumber:0,chatNumber:2,isFocusOn:!1},{id:"小新1",avatar:"https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1950846641,3729028697&fm=26&gp=0.jpg",name:"小新",publishTime:1617046556,content:"  外交部：一小撮国家和个人编造所谓新疆“强迫劳动”的故事，其心何其毒也！ ",imgList:["https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg","https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg","https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg","https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg","https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg"],isLike:!0,isCollect:!1,likeNumber:4,collectionNumber:22,chatNumber:52},{id:"小龙马",avatar:"https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3717120934,3932520698&fm=26&gp=0.jpg",name:"小龙马",publishTime:1616086456,content:"DCloud有800万开发者,uni统计手机端月活12亿。是开发者数量和案例最丰富的多端开发框架。 欢迎知名开发商提交案例或接入uni统计。 新冠抗疫专区案例 uni-app助力",imgList:["https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg","https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg","https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg"],isLike:!0,isCollect:!1,likeNumber:25,collectionNumber:0,chatNumber:7},{id:"风清扬",avatar:"https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2590128318,632998727&fm=26&gp=0.jpg",name:"风清扬",publishTime:1607086356,content:"划个水",imgList:["https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg","https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg","https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg","https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg"],isLike:!0,isCollect:!0,likeNumber:3,collectionNumber:2,chatNumber:2}]}},methods:{clickDynamic:function(t){console.log("childDynamic")},clickUser:function(t){console.log(t),console.log("childUser")},clickFocus:function(t){this.list[t].isFocusOn=!this.list[t].isFocusOn,console.log(t),console.log("childUser")},clickThumbsup:function(t,c){t.isLike=!t.isLike},clickCollectionNumber:function(t){console.log(t),t.isCollect=!t.isCollect,console.log("clickcollectionNumber")},clickChat:function(t){console.log(t),console.log("clickChat")},change:function(t){this.current=t}}};c.default=n},"28b1":function(t,c,i){"use strict";i.r(c);var n=i("80a8"),s=i("884e");for(var e in s)"default"!==e&&function(t){i.d(c,t,(function(){return s[t]}))}(e);var o,u=i("f0c5"),a=Object(u["a"])(s["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],o);c["default"]=a.exports},"80a8":function(t,c,i){"use strict";i.d(c,"b",(function(){return s})),i.d(c,"c",(function(){return e})),i.d(c,"a",(function(){return n}));var n={navHeader:function(){return i.e("components/navHeader/navHeader").then(i.bind(null,"8907"))},uTabs:function(){return Promise.all([i.e("common/vendor"),i.e("uview-ui/components/u-tabs/u-tabs")]).then(i.bind(null,"0bce"))},Dynamic:function(){return i.e("components/Dynamic/Dynamic").then(i.bind(null,"d0bb"))}},s=function(){var t=this,c=t.$createElement;t._self._c},e=[]},"884e":function(t,c,i){"use strict";i.r(c);var n=i("1fe8"),s=i.n(n);for(var e in n)"default"!==e&&function(t){i.d(c,t,(function(){return n[t]}))}(e);c["default"]=s.a}},[["10cc","common/runtime","common/vendor"]]]);