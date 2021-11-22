<template>
	<view class="publish">
		
		<view class="upload-box">
			<uni-file-picker class="grid-img" v-model="fileList" file-mediatype="image" mode="grid"
				file-extname="png,jpg" ref="imageUpload" :limit="9" return-type="array" :image-styles="imageStyles"
				:auto-upload="false" @success="uploadSuccess" @fail="uploadFail" @select="uploadSelect" />
		</view>
		<view class="contain">
			<view class="title">

				<u-input type="text" v-model="title" placeholderStyle="font-size: 18px;" placeholder='这里填写标题~'>
				</u-input>
			</view>

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
	export default {
		data() {
			return {
				title: '',
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
		methods: {
			toTextEditor() {
				uni.navigateTo({
					url: '../../pages/textEditor/textEditor'
				})
				
			},
			uploadFile() {
				this.$refs.imageUpload.upload()
			},

			// 获取上传状态
			uploadSelect(e) {



			},

			publishNote() {
				
			},

			// 上传成功
			uploadSuccess(e) {
				const image = e.tempFiles[0];
			},

			// 上传失败
			uploadFail(e) {
				console.log('上传失败：', e)
			}
		},

	}
</script>

<style lang="scss" scoped>
	@mixin card-box {
	margin: 30rpx 20rpx;
	padding:50rpx 0;
	background-color: #ffffff;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	border-radius: 20rpx;
	}
	.publish {
		
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
			.title {
				margin: 20rpx;
				/deep/ .uni-input-input {
					font-size: 18px;
				}
			}


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
		
		}
	}
</style>
