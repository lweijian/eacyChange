<template>
	<view class="publish">

		<view class="upload-box">
			<uni-file-picker class="grid-img" v-model="fileList" file-mediatype="image" mode="grid"
				file-extname="png,jpg" ref="imageUpload" :limit="9" return-type="array" :image-styles="imageStyles"
				:auto-upload="false" @success="uploadImageSuccess" @fail="uploadImageFail" @select="uploadImageSelect"
				 @delete="uploadImageDelete" />
		</view>
		<view class="contain">
			<!-- <view class="title">

				<u-input type="text" v-model="title" placeholderStyle="font-size: 18px;" placeholder='这里填写标题~'>
				</u-input>
			</view> -->
			<view class="content">
				<u-input v-model="content" type="textarea" border="true" :height="textareaHeight" placeholder='添加正文'
					:auto-height="autoHeight" />
			</view>
			<view class="label">
				<u-tag v-for="item in label" :key="item.id" class="label-item" :text='item.text' mode="light"
					shape="circle" type="info" />
			</view>
			<view class="tool-box">
				<view class="to-richtext" @click="toTextEditor">
					<u-icon name="edit-pen" size="40" label="长文编辑" label-size="20" label-pos="bottom"></u-icon>
				</view>
				<view class="publish-note">
					<u-button shape="circle" type="warning" size="default" @click='publishNote'>发布笔记</u-button>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				// title: '',
				uploadImageNumber:0,
				content: '',
				label: [{
					id: '1',
					text: '# 话题',
				}, {
					id: '2',
					text: '@ 用户',
				}],
				textareaHeight: 200,
				autoHeight: true,
				fileList: [],
				imageStyles: {
					width: 120,
					height: 120,
				},
			};
		},
		computed: {
			...mapGetters([
				'getUserInfo',
			])
		},
		methods: {
			
			toTextEditor() {
				uni.navigateTo({
					url: '../../pages/textEditor/textEditor'
				})
			},
			refresh(){
			uni.redirectTo({
				url: '../../pages/creativeSharing/creativeSharing'
			})
			},
			delDynamicImage(fileIDList) {
				
				uni.callFunction({
					name: 'dynamics',
					data: {
						action: 'delDynamicImage',
						
						params: {
							fileIDList
						}
					}
				})
			},

			addDynamic(userInfo, uploadImageResult) {
				
				const fileIDList = uploadImageResult?.tempFilePaths
				uniCloud.callFunction({
					name: 'dynamics',
					data: {
						action: 'addDynamic',	
						params: {
							nickName: userInfo.nickName,
							avatar: userInfo.avatar,
							content: this.content,
							imgList: uploadImageResult?.tempFilePaths||[],
						}
					},
					success: (res) => {
						uni.hideLoading()
						uni.showToast({
							title: '发布成功',
							duration: 600
						});
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '发布失败',
							duration: 600
						});
						if(fileIDList){
							this.delDynamicImage(fileIDList);
						}	
					},
					complete:()=>{
						this.refresh();
						
					}
				})
			},



			publishNote() {
				uni.showModal({
					content: '是否发布动态',
					success: async res => {
						if (res.confirm) {
							// 上传图片
						this.$refs.imageUpload.upload();
							if(this.uploadImageNumber>0){
								this.$refs.imageUpload.upload();
							}else{
								this.addDynamic(this.getUserInfo)
							}
							
							uni.showLoading({
								title: '发布中'
							})
						}
					}
				})
			},
			uploadImageSelect(e){
				if(e.tempFilePaths){
					this.uploadImageNumber=e.tempFilePaths.length;
				}else{
					this.uploadImageNumber=0;
				}
				
			},
			// 上传成功
			uploadImageSuccess(e) {
				// 图片上传成功则上传数据库表
				uni.hideLoading()
				this.addDynamic(this.getUserInfo, e)
				
			},

			// 上传失败
			uploadImageFail(e) {
				console.log('上传失败：', e)
				uni.hideLoading();
				uni.showToast({
					title: '上传失败',
					duration: 600
				});
			},
			uploadImageDelete(e){
				
				this.uploadImageNumber=e.uploadImageNumber;
				
				
			}
		},

	}
</script>

<style lang="scss" scoped>
	@mixin card-box {
		margin: 30rpx 20rpx;
		padding: 50rpx 0;
		background-color: #ffffff;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		border-radius: 20rpx;
	}


	.upload-box {
		display: flex;
		@include card-box;
	}

	.grid-img {
		position: relative;
		margin: 0 3% 0 6%;
		border: none;
	}

	.contain {
		@include card-box;

		// .title {
		// 	margin: 20rpx 40rpx;

		// 	/deep/ .uni-input-input {
		// 		font-size: 18px;
		// 	}
		// }

		.content {
			margin: 20rpx;
		}

		.label {
			margin: 20rpx;
			display: flex;
			flex-wrap: wrap;

			.label-item {
				margin-top: 20rpx;
				margin-right: 20rpx;
			}
		}
	}


	.tool-box {

		padding: 100rpx 0;
		width: 100%;
		position: relative;

		.to-richtext {
			position: absolute;
			left: 20rpx;
		}

		.publish-note {
			position: absolute;
			width: 70vw;
			right: 40rpx;
		}
	}
</style>
