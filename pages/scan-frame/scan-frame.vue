<template>
	<view>
		<!-- #ifndef H5 -->
		<camera device-position="back" flash="auto" @error="error" style="width: 100%; height: 80vh;">
				<cover-image src="../../static/img/scan-frame/scan-clothes.png" class="scan-img"></cover-image>
			</camera>
			<view class="scan-text">请将衣服放置框内</view>
			<button type="primary" @click="takePhoto">拍照</button>
		<!-- 	<image mode="widthFix" class="photos-box" :src="src"></image> -->
		<!-- #endif -->

	</view>
</template>

<script>
	export default {
		name:'scan-frame',
		data() {
			return {
				src: ""
			}
		},
		methods: {
			takePhoto() {
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: (photo) => {
						uni.showModal({
						    title: '选择框',
						    content: '是否需要进行抠图',
						    success:  (res)=> {
							let	path =photo.tempImagePath;
						        if (res.confirm) {
						         uni.navigateTo({
						             url: `../penCut/penCut?backgroundImageSrc=${path}`
						         });
						        } else if (res.cancel) {
						         uni.navigateTo({
						             url: `../drawCanvas/drawCanvas?backgroundImageSrc=${path}`
						         });
						        }
						    }
						});
						
						
						/* 返回调用页面并把图片URL传递过去 */
						/* let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2]; 
						prevPage.setData({
							"image": res.tempImagePath,
						})
						uni.navigateBack(); */
						
						/* 调用页面获取图片URL方法 */
						/* let pages = getCurrentPages();
						let currPage = pages[pages.length-1];
						if(typeof(currPage.data.image) != undefined && currPage.data.image != null){
							console.log('获取图片：', currPage.data.image)
						} */
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
	.scan-img{
		opacity: 0.4;
		width: 100%;
		height:80vh;
	}
	.scan-text{
		font-size: 20px;
		text-align: center;
		line-height: 60upx;
	}
</style>
