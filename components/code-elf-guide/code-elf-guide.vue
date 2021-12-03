<template>
	<view class="content" v-show="isShow">
		<swiper class="swiper" 
		:autoplay="autoplay" 
		:duration="duration">
			<swiper-item  >
				<view class="swiper-item" >
					<view class="swiper-item-img"><image src="../../static/img/logo.png" mode="aspectFit"></image></view>
					
				</view>
				<!-- <view class="jump-over" @tap="launchFlag()">{{jumpover}}</view> -->
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props:{
			isShow:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				
				background: ['color1', 'color2', 'color3'],
				autoplay: false,
				duration: 500,
				jumpover: '跳过',
				experience: '立即体验'
			}
		},
		methods: {
			launchFlag(){
				this.$emit('input',false)
				// uni.switchTab({
				// 	url: '../../pages/tabBar/design-home/design-home'
				// });
			}
		}
	}
</script>
<style scoped>
	
	.content{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
	}
	.swiper{
		width: 100%;
		height: 100%;
		background-color: #f8eddb;
	}
	.swiper-item {
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		display: flex;
		/* justify-content: center; */
		align-items:flex-end;
		flex-direction:column-reverse
	}
	.swiper-item-img{
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}
	.swiper-item-img image{
		width: 100%;
		height: 100%;
	}
	.uniapp-img{
		height: 20%;
		
		display: flex;
		justify-content: center;
		align-items:center;
		overflow: hidden;
	}
	.uniapp-img image{
		width: 40%;
	}
	
	.jump-over,.experience{
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		border: 1px solid #454343;
		z-index: 999;
	}
	.jump-over{
		right: 45upx;
		top: 125upx;
	}
	.experience{
		right: 50%;
		margin-right: -105upx;
		bottom: 0;
	}
</style>
