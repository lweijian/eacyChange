<template>
	<view class="cus-flex-col cus-space-between">

		<decals ref="decalsRef" style="width: 100%;" :selectedFilePath="selectedFilePath"></decals>

		<!-- <view class="back op" @click="back">返回</view> -->
		<view class="cropper-buttons cus-flex-row">
			<view class="op" @click="chooseImage(['album','camera'])">{{selectedFilePath?'重新选择':'选择图片'}}</view>
			<view class="op" @click="save">保存</view>
			<!-- <view class="op" @click="test">test</view> -->
			<view class="op" @click="showPopup()">选择贴纸</view>
		</view>
		<decals-popup ref="decalsPopup" @selectMask="selectMask" @addLocalMask="addLocalMask"></decals-popup>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				show: false,
				selectedFilePath: null,
			};
		},
		onLoad(e) {
		this.selectedFilePath=e.backgroundImageSrc;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			showPopup() {
				this.$refs.decalsPopup.show()
			},
			// closePopup() {
			// 	this.showPopup(false)
			// },
			chooseImage(sourceType) {
				
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType,
					success: (chooseRes)=> {

						this.selectedFilePath = chooseRes.tempFilePaths[0]

					}
				});
			},

			//从网络图片添加mask
			selectMask(mask) {
				this.$refs.decalsRef.selectMask(mask)
			},
			//从本地图片添加mask
			addLocalMask(localPath) {
				this.$refs.decalsRef.addLocalMask(localPath)
			},
			save() {
				this.$refs.decalsRef.save()
			},
		},
	}
</script>

<style lang="scss">

	.cropper-buttons {
		display: flex;
		position: fixed;
		bottom: 5px;

		width: 100%;

		.op {
			font-size: 32rpx;
			width: 50%;
			text-align: center;
		}
	}

	.back {
		position: fixed;
		left: 16px;
		top: 40px;
	}
</style>
