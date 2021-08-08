<template>
		<!-- 广告图 -->
		<view class="banner"><image :src="bannerImg"></image></view>
</template>

<script>
	export default {
		props:['bannerImg'],
		name:"banner",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.banner {
	width: 92%;
	margin: 40upx 4%;
	image {
		width: 100%;
		height: 20vw;
		border-radius: 10vw;
		box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.3);
	}
}
</style>
