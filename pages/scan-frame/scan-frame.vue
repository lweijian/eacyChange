<template>
	<view>
		<!-- #ifndef H5 -->
		<camera device-position="back" flash="auto" @error="error" style="width: 100%; height: 70vh;">
			<cover-image src="../../static/img/scan-frame/scan-clothes.png" class="scan-img"></cover-image>
		</camera>
		<view class="scan-text">请将衣服放置框内</view>
		
			<button type="default" @click="takePhoto">拍照</button>
		
		
			<button type="default" @click="choosePhoto">选择相册文件</button>
	

		<!-- #endif -->

	</view>
</template>

<script>
	export default {
		name: 'scan-frame',
		data() {
			return {
				
			}
		},
		methods: {
			toDesign(path) {
				uni.showModal({
					title: '前往设计',
					cancelText: '设计',
					confirmText: '抠图',
					success: (res) => {
						
						if (res.confirm) {
							uni.navigateTo({
								url: `../penCut/penCut?backgroundImageSrc=${path}`
							});
						} else if (res.cancel) {
							uni.navigateTo({
								url: `../tiezhi-photo/tiezhi-photo?backgroundImageSrc=${path}`
							});
						}
					}
				});

			},
			takePhoto() {
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: (photo) => {
						this.toDesign(photo.tempImagePath)
					}
				});
			},
			choosePhoto() {
				
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType:['album','camera'],
					success: (chooseRes) => {
						this.src = 
						this.toDesign(chooseRes.tempFilePaths[0]);
					}
				});
			},
			error(e) {
				console.log(e.detail);
			}
		}
	}
</script>

<style>
	page {
		position: relative;
		background-color: #f8eddb;
	}
	
</style>
<style scoped>

	.scan-img {
		opacity: 0.4;
		width: 100%;
		height: 70vh;
	}

	.scan-text {
		font-size: 20px;
		text-align: center;
		line-height: 60upx;
	}
	button[type=default]{
	
		margin: 10rpx 15vw 50rpx;
		width: 70vw;
	    background-color: #ffaa00;
	    border-radius: 50rpx;
	    color: antiquewhite;
	
	}
</style>
