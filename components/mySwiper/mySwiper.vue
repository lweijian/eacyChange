<template>
	<!-- 轮播图 -->
	<view class="swiper">
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in swiperList" :key="swiper.id">
					<image :src="swiper.img" @tap="toSwiper(swiper)"></image>
				</swiper-item>
			</swiper>
			<view class="indicator">
				<view
					class="dots"
					v-for="(swiper, index) in swiperList"
					:class="[currentSwiper >= index ? 'on' : '']"
					:key="index"
				></view>
			</view>
		</view>
	</view>
		
</template>

<script>
	export default {
		name:"mySwiper",
		props:['swiperList'],
		data() {
			return {
			currentSwiper: 0,
			}
		},
		methods:{
			//轮播图跳转
			toSwiper(e) {
				uni.showToast({ title: e.src, icon: 'none' });
			},
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			}
	},
	}
</script>

<style lang="scss">
.swiper {
		width: 100%;
		margin-top: 10upx;
		display: flex;
		justify-content: center;

		.swiper-box {
			width: 92%;
			height: 30.7vw;

			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 30.7vw;

				swiper-item {
					image {
						width: 100%;
						height: 30.7vw;
					}
				}
			}

			.indicator {
				position: absolute;
				bottom: 20upx;
				left: 20upx;
				background-color: rgba(255, 255, 255, 0.4);
				width: 150upx;
				height: 5upx;
				border-radius: 3upx;
				overflow: hidden;
				display: flex;

				.dots {
					width: 0upx;
					background-color: rgba(255, 255, 255, 1);
					transition: all 0.3s ease-out;

					&.on {
						width: (100%/3);
					}
				}
			}
		}
	}

</style>
