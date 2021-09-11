<template>
	<view>

		<view class="function-button">
			<view class="clothes transform">
				<u-button shape="circle" type="warning" size="default">旧衣改造</u-button>
			</view>
			<view class="clothes recycling">
				<u-button shape="circle" type="warning" size="default">旧衣回收</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods:{
			totransform
		}
	}
</script>

<style lang="scss">
	page {
		position: relative;
		background-color: #f8eddb;
	}

	/deep/.u-size-default{
			height: 160rpx;
		}
	.function-button {
	
		width: 100%;
		position: absolute;
		top: 40vh;

		.clothes {
			margin: 100rpx;
		}
	}
</style>
