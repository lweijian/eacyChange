<template>
	<view class="text-editor">

		<view class="title">

			<u-input type="text" v-model="title" placeholderStyle="font-size: 18px;" placeholder='这里填写文章标题~'>
			</u-input>
			<view class="upload-box">
				<uni-file-picker title="上传的第一张图片为文章封面" class="grid-img" file-mediatype="image" mode="grid" file-extname="png,jpg"
					 :limit="9" return-type="array" :image-styles="imageStyles" :auto-upload="true"
					@success="uploadSwiperSuccess" @fail="uploadSwiperFail" @select="uploadSwiperSelect"
					@delete="uploadSwiperDelete" />

			</view>
		</view>
		<view class="edit-content">
			<mp-html ref="article" container-style="padding:20px" :content="content"
				domain="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo" :editable="editable" @remove="remove" />
		</view>
		<block v-if="modal">
			<view class="mask" />
			<view class="modal">
				<view class="modal_title">{{modal.title}}</view>
				<input class="modal_input" :value="modal.value" maxlength="-1" auto-focus @input="modalInput" />
				<view class="modal_foot">
					<view class="modal_button" @tap="modalCancel">取消</view>
					<view class="modal_button" style="color:#576b95;border-left:1px solid rgba(0,0,0,.1)"
						@tap="modalConfirm">确定</view>
				</view>
			</view>
		</block>
		<view class="footer-box">
			<view class="editor_toolbox">
				<i class="iconfont icon-undo" data-method="undo" @tap="edit" />
				<i class="iconfont icon-redo" data-method="redo" @tap="edit" />
				<i class="iconfont icon-img" data-method="insertImg" @tap="edit" />
				<i class="iconfont icon-video" data-method="insertVideo" @tap="edit" />
				<i class="iconfont icon-link" data-method="insertLink" @tap="edit" />
				<i class="iconfont icon-text" data-method="insertText" @tap="edit" />
				<i class="iconfont icon-clear" @tap="clear" />
				<i class="iconfont icon-save" @tap="publish" />
			</view>
		</view>

	</view>
</template>

<script>

	export default {
		data() {
			return {
				title: "",
				content: "",

				detailSwiper: [],
				modal: null,
				editable: true,
				imageList: []
			}
		},
		computed: {
		
		},

		onReady() {
			/**
			 * @description 设置获取链接的方法
			 * @param {String} type 链接的类型（img/video/audio/link）
			 * @param {String} value 修改链接时，这里会传入旧值
			 * @returns {Promise} 返回线上地址
			 *   type 为音视频时可以返回一个数组作为源地址
			 *   type 为 audio 时，可以返回一个 object，包含 src、name、author、poster 等字段
			 */
			this.$refs.article.getSrc = (type, value) => {
				return new Promise((resolve, reject) => {
					if (type === 'img') {
						uni.showActionSheet({
							itemList: ['本地选取', '远程链接'],
							success: res => {
								if (res.tapIndex === 0) {
									// 本地选取
									uni.chooseImage({
										count: value === undefined ? 9 :
										1, // 2.2.0 版本起插入图片时支持多张（修改图片链接时仅限一张）
										success: res => {
											uni.showLoading({
												title: '上传中',
												mask:true
											});
											(async () => {
												const arr = []
												for (let item of res
														.tempFilePaths) {
													// 依次上传
													const src = await this
														.upload(
															item)
													arr.push(src)
												}
												return arr
											})().then(res => {
												wx.hideLoading()
												resolve(res)
											})
										},
										fail: reject
									})
								} else {
									// 远程链接
									this.callback = {
										resolve,
										reject
									}
									this.$set(this, 'modal', {
										title: '图片链接',
										value
									})
								}
							}
						})
					} else {
						this.callback = {
							resolve,
							reject
						}
						let title
						if (type === 'video') {
							title = '视频链接'
						} else if (type === 'audio') {
							title = '音频链接'
						} else if (type === 'link') {
							title = '链接地址'
						}
						this.$set(this, 'modal', {
							title,
							value
						})
					}
				})
			}
		},
		methods: {
			// 删除图片/视频/音频标签事件
			remove(e) {
				// 删除线上图片资源
				if (e.type === 'img') {
					this.imageList.map((item) => {
						Object.keys(item).map((key) => {
							// 找到要删除图片文件的key
							if (key === e.src) {

								//调用云函数删除文件
								uniCloud.callFunction({
									name: 'articles',
									data: {
										action: 'delArticleImage',

										params: {
											fileID: item[key]
										}
									},
									success: (res) => {
										let index = this.imageList.indexOf(item)
										if (index > -1) {
											this.imageList.splice(index, 1);
										}
									},
									fail: (err) => {
										console.log(err)
									}
								})

							}
						})
					})

				}

			},
			// 处理模态框
			modalInput(e) {
				this.value = e.detail.value
			},
			modalConfirm() {
				this.callback.resolve(this.value || this.modal.value || '')
				this.$set(this, 'modal', null)
			},
			modalCancel() {
				this.callback.reject()
				this.$set(this, 'modal', null)
			},
			// 调用编辑器接口
			edit(e) {
				this.$refs.article[e.currentTarget.dataset.method]()
			},
			// 清空编辑器内容
			clear() {
				uni.showModal({
					title: '确认',
					content: '确定清空内容吗？',
					success: res => {
						if (res.confirm) {
							this.imageList.map((item) => {
								Object.keys(item).map((key) => {
									//调用云函数删除文件
									uniCloud.callFunction({
										name: 'articles',
										data: {
											action: 'delArticleImage',
											params: {
												fileID: item[key]
											}
										},
										fail: (err) => {
											console.log(err)
										}
									})
								})
							})
							this.imageList.length = 0;
							this.$refs.article.clear();
						}
					}
				})
			},
			// 保存编辑器内容
			publish() {

				uni.showModal({
					content: '是否发布文章',

					success: res => {
						if (res.confirm) {
							//调用云函数删除文件
						
						
							uniCloud.callFunction({
								name: 'articles',
								data: {
									action: 'addArticle',

									params: {
										
										detailSwiper: this.detailSwiper,
										title: this.title,
										content: this.$refs.article.getContent(),
									}
								},
								success: (res) => {
									console.log(res)
									// 结束编辑
									this.editable = false
									uni.reLaunch({
										url: '../creativeSharing/creativeSharing',
									});
								},
								fail: (err) => {
									console.log(err)
								}
							})

						}
					}
				})

			},
			upload(src) {
				return new Promise((resolve, reject) => {
					uniCloud.uploadFile({
						filePath: src,
						cloudPath: `${this.$u.guid()}.png`,
						success: (res) => {
							const fileID = res.fileID;
							const filePath = res.filePath;
							this.imageList.push({
								[filePath]: fileID
							})
							resolve(filePath)
						},
						fail(err) {
							reject(err)
						}
					});
				})
			},

			// 获取封面上传状态
			uploadSwiperSelect(e) {
				
			},

			// 上传成功
			uploadSwiperSuccess(e) {
				this.detailSwiper = e.tempFilePaths;
			},

			// 上传失败
			uploadSwiperFail(e) {
				console.log('上传失败：', e)
			},
			uploadSwiperDelete(e) {
				uniCloud.callFunction({
					name: 'articles',
					data: {
						action: 'delArticleImage',
						params: {
							fileID: e.tempFilePath
						}
					},
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
					}

				})

			}

		}
	}
</script>

<style lang="scss">
	@mixin card-box {
		margin: 0rpx 5vw;
		width: 90vw;
		background-color: #ffffff;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		border-radius: 20px;
	}

	page {
		background-color: rgb(244, 244, 244);
	}

	.text-editor {
		.title {
			margin: 30rpx 5vw 40rpx 5vw;
			padding: 20rpx 20rpx 40rpx 20rpx;
			width: 90vw;
			background-color: #ffffff;
			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
			border-radius: 20px;
		}
	}

	.edit-content {
		@include card-box;

	}

	.footer-box {
		height: 100rpx;

		.editor_toolbox {
			position: fixed;
			bottom: 0;
			width: 100%;
			z-index: 999;
			background-color: #EDEDED;
			display: flex;
			padding: 5px;
			box-sizing: border-box;
			line-height: 1.6;
		}

	}


	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.iconfont {
		flex: 1;
		text-align: center;
		font-family: "iconfont" !important;
		font-size: 22px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-undo:before {
		content: "\e607";
	}

	.icon-redo:before {
		content: "\e606";
	}

	.icon-img:before {
		content: "\e6e2";
	}

	.icon-video:before {
		content: "\e798";
	}

	.icon-link:before {
		content: "\e60d";
	}

	.icon-text:before {
		content: "\e6ce";
	}

	.icon-clear:before {
		content: "\e637";
	}

	.icon-save:before {
		content: "\e501";
	}

	/* 模态框 */
	.modal {
		position: fixed;
		top: 50%;
		left: 16px;
		right: 16px;
		background-color: #fff;
		border-radius: 12px;
		transform: translateY(-50%);
	}

	.modal_title {
		padding: 32px 24px 16px;
		font-size: 17px;
		font-weight: 700;
		text-align: center;
	}

	.modal_input {
		display: block;
		padding: 5px;
		margin: 0 24px 32px 24px;
		font-size: 14px;
		border: 1px solid #dfe2e5;
	}

	.modal_foot {
		display: flex;
		line-height: 56px;
		font-weight: 700;
		border-top: 1px solid rgba(0, 0, 0, .1);
	}

	.modal_button {
		flex: 1;
		text-align: center;
	}

	/* 蒙版 */
	.mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: black;
		opacity: 0.5;
	}
</style>
