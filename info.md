[参考这里]: https://ask.dcloud.net.cn/article/35070 "参考这里"


> * 遇到问题或有建议可以评论留言或者[直接提问](https://ask.dcloud.net.cn/publish/ext/?pn=商城模板&uid=518399)
> * 如果觉得模板不错，<font color=#f00>给个五星鼓励鼓励</font>!

###已实现页面
* tabbar
	* 首页(subNvue导航栏)
	* 分类页(vue,nvue)
	* 购物车页(subNvue导航栏)
	* 个人中心页(subNvue导航栏)
* 下级页面
	* 商品列表页(vue,nvue)
	* 商品详情页
	* 订单确认页
	* 个人中心页
	* 登录页
	* 注册页
	* 重置密码页
	* 我的订单页(vue,nvue)
	* 设置页
	* 消息列表页
	* 聊天页
	* 我的二维码页
	* 优惠券页
	* 我的收藏页
	* 地址管理页
	* 地址编辑/新增页
	* 充值页
	* 订单支付页
	* 支付成功页
	* 评论列表

###模板说明
> * HX 2.0.3+ 版本的用户注意，模板nvue文件编译模式为**weex模式**，不支持uni-app模式(等uni-app模式完善后再支持)，也就是说，目前页面目录会同时有nvue和vue文件，APP端使用nvue文件，非APP端使用vue文件。
> * 首页、分类页左上角城市，使用了高德SDK获取城市信息，实际应用中请替换模板的高德KEY，[参考这里]。
> * 所有页面的字体图标归类到/static/iconfont/font.scss下，App.vue引入全局调用，同时目录下有ttf文件，低版本安卓如果图标不显示，可以引用ttf文件试试。
> * 模板中把表情上传到了第三方图床(仅供模板在APP和小程序中展示，请勿依赖此图床，实际使用中请自行上传到您的服务器中调用。)
> * 地址编辑/新增页使用了mpvue-citypicker城市选择组件
> * 模板页面之间耦合性低，页面除字体图标外的css都独立写在页面内部，只看上了模板中某个页面，可以很方便的拿出来单独使用(记得带上字体图标/static/iconfont/font.scss)。
> * 点击昵称跳转登录/注册页面
> * 模板中的搜索功能，建议用户直接做成跳转至[搜索模板](https://ext.dcloud.net.cn/plugin?id=91)进行搜索，需要自己动手实现。
> * 模板中除了商品详情页外的图片均放在本地，如果要做小程序的，要换成远程图片避免大小限制。
> * 模板商品图片采集于淘宝，分类图片使用[iconfont @是满月啊](https://www.iconfont.cn/collections/detail?cid=10840)，工具栏图标使用[iconfont @小胖要吃肉丸变成球球](https://www.iconfont.cn/collections/detail?cid=13655)，图片均只用于案例展示，请勿用于其他用途。
> * 编译样式需要安装scss插件，HBuilderX -> 工具 -> 插件安装 -> scss/sass编译 -> 安装
> * 如果觉得模板还不错<font color=#f00>给个五星鼓励鼓励</font>!

####APP端说明
> * 为了提高APP端性能，APP端部分页面配套了subNvue导航栏或nvue页面，使用模板时候需要注意
> * 使用模板中含有subNvue导航栏的页面时候，请注意配置page.json文件，模板为了兼容其他端，在vue页内也写有导航栏，在非APP端时候显示。
> * 含有nvue页面的页面目录中，会有vue和nvue两个文件，APP端使用nvue，非APP端使用vue文件。
> * 由于使用不同的页面，APP端和非APP端使用体验上有一定的差异。
> * 如果你不想要这些APP独有的元素，可以在模板中删除，vue文件也支持在APP中使用的(删除subNvue导航栏需要改动页面参数让vue页的导航栏显示在APP)。

![预览图](https://ae01.alicdn.com/kf/HTB1mCUASPTpK1RjSZKP7613UpXae.png)

###版本记录
-------------
* 2019-07-08
	* 1. 部分页面添加subNvue导航栏(仅支持APP，具体添加页面看页面列表标注)
	* 2. 所有页面的字体图标归类到/static/iconfont/font.scss下，App.vue引入全局调用，目录下有ttf文件，低版本安卓如果图标不显示可以引用ttf文件试试
	* 3. 修复H5端商品详情页导航栏的错位问题 感谢 <font color=#22ac38>@深蓝新创科技</font> 反馈

* 2019-06-25
	* 1. 增加评论列表页(商品详情页点击评论进入)
	* 2. 模板编译模式改为自定义组件模式
	* 3. 一些小的语法变更

* 2019-04-26
	* 1. 购物车 修复全选删除不能全部删除问题(低级错误啊啊啊啊 0..0)
	* 2. 修复地址编辑保存按钮错位问题
	* 3. 修复H5平台从订单确认页进入选择地址列表不能编辑地址问题

* 2019-04-25
	* 1. 购物车
		- 修复删除商品没更新selectedList问题
		- 修复手动输入数量价格不更新问题
		- 添加加入商品方法(说明请看代码注释)
	* 2. 完善购物流程(完善了从下单到支付完成的页面)
	* 3. 增加更多功能页面(详细请看下方“已实现页面”)

* 2019-04-15
	* 1. 客服聊天页 消息过长不换行问题。
	* 2. 商品列表页，我的订单页 修复H5下重复进入页面顶部栏消失问题。
	* 3. 登录页 安卓下，弹出键盘会把第三方登录按钮顶上来问题。

* 2019-04-12 
	* 1. 购物车页，修复数量没有垂直居中问题。
	* 2. 客服聊天页 修复点击发送图片按钮表情不收起的情况，优化初次进入页面时图片加载和调整聊天图片尺寸，把表情上传到了第三方图床(仅供模板在APP和小程序中展示，实际使用中请自行上传到您的服务器中调用。)

* 2019-04-11 
	* 1. 修复iOS下页面回弹导致头部抖动
	* 2. 购物车页 修复删除商品时动画错误问题
	* 3. 商品详情页 
		- 添加默认头部按钮半透明底色
		- 添加商品轮播图指示器
		- 添加分享弹窗(点击左下角分享)
		- 修复小程序下锚点不居中问题
		- 调整所有弹窗动画时长
	* 4. 增加页面 我的订单页,设置页,我的二维码页,消息列表页,聊天(客服)页