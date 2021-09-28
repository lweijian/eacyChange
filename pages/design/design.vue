<template>
	<view>
	
		<view class="function-button">
			<view class="design two-dimensional">
				<u-button shape="circle" type="warning" size="default" @click='toTwoDimensional()'>二维改造</u-button>
			</view>
			<view class="design three-dimensional">
				<u-button shape="circle" type="warning" size="default" @click=''>三维改造</u-button>
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
		methods: {
			toTwoDimensional() {
				
				// uni.chooseImage({
				//   success: (res)=>{
				//   console.log(res)
				//   }
				// })
			console.log(11)
				uni.navigateTo({
					url: '../scan-frame/scan-frame'
				})
			},
			toRecycling() {
				
				// uni.navigateTo({
				// 	url: '../../recycling/recycling'
				// })
			}
		}
	}
</script>

<style lang="scss">
	page {
		position: relative;
		background-color: #f8eddb;
	}

	/deep/.u-size-default {
		height: 160rpx;
	}

	.function-button {

		width: 100%;
		position: absolute;
		top: 40vh;

		.design {
			margin: 100rpx;
		}
	}
</style>
