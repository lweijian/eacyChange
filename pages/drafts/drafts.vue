<template>
	<view>
		<view class="drafts-header">
			<text class="drafts-title">自动保存草稿</text>
			<u-switch class="drafts-switch" size="40" v-model="checked" active-color="green"></u-switch>
		</view>
		<u-grid :col="3" :border="false">
			<u-grid-item v-for="item in drafts" :key="item._id">
				<image class="grid-img" @click="handleClickImage(item)" :src="item.image.url" />
			</u-grid-item>
			<u-grid-item>
				<uni-file-picker class="grid-img" v-model="fileList" file-mediatype="image" mode="grid"
					file-extname="png,jpg" ref="drafts" :limit="1" return-type="array" :image-styles="imageStyles"
					:auto-upload="false" @success="uploadSuccess" @fail="uploadFail" @select="uploadSelect" />
			</u-grid-item>
		</u-grid>
		<view>
			<u-popup v-model="popupShow" safe-area-inset-bottom="" mode='bottom'>
				<image class="current-image" :src="currentImage.image.url" />
				<u-button @click='handleSaveImage()'>下载草稿图片</u-button>

				<u-button @click='handleDelImage()'>删除草稿图片</u-button>
			</u-popup>

		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {


				checked: false,
				currentImage: {},
				drafts: [],
				fileList: [],
				imageStyles: {
					width: 128,
					height: 128,
				},
				popupShow: false
			};
		},

		methods: {
			refresh() {
				this.fileList = [];
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uniCloud.callFunction({
					name: 'drafts',
					data: {
						action: 'getDraft',
					},
					success: (res) => {
						this.drafts = res.result?.dataSource?.data || [];
					},
					fail: (err) => {
						console.log(err)
					},
					complete: () => {
						uni.hideLoading();
					}
				})
			},
			handleSaveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.currentImage.image.path,
					fail: (err) => {
						console.log(err)
					}
				})
			},
			handleDelImage() {
				const id = this.currentImage._id;
				const fileID = this.currentImage.image.fileID;
				uni.showModal({
					content: '是否确认删除',
					success: (res) => {

						if (res.confirm) {
							this.popupShow = false
							uni.showLoading({
								title: '删除中'
							});
							uniCloud.callFunction({
								name: 'drafts',
								data: {

									action: 'delDraft',
									params: {
										id,
										fileID
									}
								},
								success: (res) => {
									uni.hideLoading();
									this.refresh()
									uni.showToast({
										title: '删除成功',
										duration: 600
									});
								},
								fail: (err) => {
									console.log(err)
									uni.showToast({
										title: '删除失败',
										duration: 1000
									});
								}
							})

						} else if (res.cancel) {
							this.popupShow = false
						}
					}
				});


			},
			handleClickImage(currentImage) {
				this.currentImage = currentImage;
				this.popupShow = true;
			},


			uploadInDrafts() {
				this.$refs.drafts.upload()
			},

			// 获取上传状态
			uploadSelect(e) {

				uni.showModal({
					title: '',
					content: '是否确认上传',
					success: (res) => {
						if (res.confirm) {
							this.uploadInDrafts();
						}
					}
				});

			},

			// 上传成功
			uploadSuccess(e) {
				const image = e.tempFiles[0];

				uniCloud.callFunction({
					name: 'drafts',
					data: {

						action: 'addDraft',
						params: {
							image
						},
					},
					success: (res) => {

						this.refresh()
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},

			// 上传失败
			uploadFail(e) {
				console.log('上传失败：', e)
			}
		},
		onLoad() {
			this.refresh()
		}
	}
</script>


<style lang="scss">
	.drafts-header {
		width: 100vw;
		position: relative;
		padding: 0 20rpx;
		height: 100rpx;
		font-size: 14px;

		.drafts-switch {
			position: absolute;
			right: 20rpx;
			top: 10rpx;
		}
	}

	.grid-img {
		position: relative;
		margin: 0 6%;
		width: 86%;
		height: 220rpx;
		border: none;
	}

	.current-image {
		position: relative;
		margin: 20rpx 35%;
		width: 220rpx;
		height: 220rpx;
		border: none;
	}
</style>
