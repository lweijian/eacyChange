<script>
	
	import config from '@/config.js'

	export default {
		onPageNotFound(msg) {
			uni.redirectTo({
		    	url: config.error.url
			})
		},
			onLaunch: function () {
			console.log('App Launch') 
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import "/static/iconfont/font.scss";
	/* #ifdef H5 */ uni-page-head { display: none; } /* #endif */
</style>
