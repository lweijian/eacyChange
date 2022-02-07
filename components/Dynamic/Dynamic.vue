<template>
	<view class="dynamic" @click="clickDynamic() ">
		<view class="user__container">
			<view class="user__header-warp">
				<!-- 头像组 -->
				<view class="user__header" @click.stop="clickUser()">
					<image class="user__header-image" :src="avatar" mode="aspectFill"></image>
				</view>
			</view>
			<view class="user__content">
				<view class="user__content-main">
					<text class="user__content-title uni-ellipsis" @click.stop="clickUser()">{{ nickName }}</text>
					<uni-dateformat class="user__content-note uni-ellipsis" :date="publish_date"
						:threshold="[60000, 3600000]"> </uni-dateformat>
				</view>
				<view v-if="isNeedFocus" class="user__content-extra">
					<slot>
						<text :class="isFocusOn?'user__focus-on':'user__focus-off'"
							@click.stop="clickFocus()">{{isFocusOn?'已关注':'关注' }}</text>
					</slot>
				</view>
			</view>
		</view>


		<view class="text">{{content}}</view>
		<view class="allImage">
			<view class="imgList">
				<view class="images" v-for="(item,index) in imgList" :key="index">

					<image @click.stop="previewImg()"  class="oneimg" :src="item"
						mode="aspectFill" :style="{width:imgWidth+'px','max-height':imgHeight+'px'}"></image>
				</view>
			</view>
		</view>
		<view class="operate" :style="'width: 100%;display:'+operateDisplay">
			<u-grid :col="4" :border="false">
				<u-grid-item>
					<span :style="'color:'+thumbsupColor" @click.stop="clickThumbsup()">
						<u-icon name="thumb-up" size="34" :style="'margin-right: 2px;color:'+thumbsupColor"></u-icon>
						{{like_count?like_count:'点赞'}}
					</span>
				</u-grid-item>
				<u-grid-item>
					<span :style="'color:'+starColor" @click.stop="clickCollectionNumber()">
						<u-icon name="star" size="34" :style="'margin-right: 2px;color:'+starColor"></u-icon>
						{{collectionNumber?collectionNumber:'收藏'}}
					</span>
				</u-grid-item>
				<u-grid-item>
					<span style="color:gray" @click.stop="clickChat()">
						<u-icon name="chat" size="34" style="margin-right: 2px;color:gray"></u-icon>

						{{chatNumber?chatNumber:'评论'}}
					</span>
				</u-grid-item>
				<u-grid-item>
					<span style="color:gray" @click.stop="clickChat()">
						<u-icon name="zhuanfa" size="34" style="margin:2px 2px 0 0;color:gray"></u-icon>
						分享
					</span>
				</u-grid-item>
			</u-grid>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			
			avatar: {
				type: String
			},
			nickName: {
				type: String
			},
			publish_date: {
				type: Number,
			},
			isFocusOn: {
				type: Boolean,
				default: false
			},
			content: {
				type: String
			},
			imgList: {
				type: Array,
			},
			isLike: {
				type: Boolean,
				default: false
			},
			isCollect: {
				type: Boolean,
				default: false
			},
			like_count: {
				type: Number,
				default: 0
			},
			collectionNumber: {
				type: Number,
				default: 0
			},
			chatNumber: {
				type: Number,
				default: 0
			},
			userNoShow: {
				type: Boolean
			},
			isNeedFocus: {
				type: Boolean,
				default: true
			},
			operateNoShow: {
				type: Boolean
			}
		},
		data() {
			return {
				
				windowWidth: 0, //屏幕可用宽度
				windowHeight: 0, //屏幕可用高度
				imgWidth: 0, //图片宽度
				imgHeight: 0, //图片高度
				thumbsupColor: 'gray',
				starColor: 'gray',
				userDisplay: 'block',
				operateDisplay: 'block',
			}
		},
		created() {
			const res = uni.getSystemInfoSync();
			this.windowHeight = res.windowHeight;
			this.windowWidth = res.windowWidth;
			
			if (this.userNoShow) {
				this.userDisplay = 'none';
			}
			
			if (this.operateNoShow) {
				this.operateDisplay = 'none';
			}
			this.judgeImg();
			this.initOperate();
		},
		watch: {
			
		},
		methods: {
			// 预览图片
			previewImg() {
				uni.previewImage({
					urls: this.imgList,
					longPressActions: {
						itemList: ['保存图片'],
					}
				})
			},
			initOperate() {
				if (this.isLike) this.thumbsupColor = '#fb5f5f';
				if (this.isCollect) this.starColor = '#fb5f5f';
			},
			// 自适应判断
			judgeImg() {
				
				if (this.imgList.length == 1) {
					this.imgWidth = this.windowWidth * 5 / 6;
					this.imgHeight = this.windowHeight * 3 / 5;
				} else if (this.imgList.length == 2) {
					this.imgWidth = this.windowWidth * 3 / 7;
					this.imgHeight = this.imgWidth;
				} else {
					this.imgWidth = this.windowWidth / 3.6;
					this.imgHeight = this.imgWidth;
				}
			},
			
			/** 触发父级事件 */
			// 点击动态
			clickDynamic() {
				this.$emit('clickDynamic');
			},
			// 点击用户信息
			clickUser() {
				this.$emit('clickUser');
			},
			// 点击关注
			clickFocus() {
				this.$emit('clickFocus');
			},
			// 点赞
			clickThumbsup() {

				this.$emit(`clickThumbsup`);
				if (!this.isLike) {
					this.thumbsupColor = '#fb5f5f'
				} else {
					this.thumbsupColor = 'gray'
				};

			},
			// 点击收藏
			clickCollectionNumber() {
				this.$emit('clickCollectionNumber');

				if (!this.isCollect) {
					this.starColor = '#fb5f5f'
				} else {
					this.starColor = 'gray'
				};
			},
			// 点击聊天
			clickChat() {
				this.$emit('clickChat');
			}
			
		},
	
	}
</script>

<style lang="scss">
	@mixin card-box {
		margin: 20rpx 20rpx 40rpx;
		background-color: #ffffff;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		border-radius: 20rpx;
	}

	/* 想法图片排列样式 */
	.uni-list-chat__content-extra-text {
		color: #007AFF;
	}

	.dynamic {
		@include card-box;
		overflow: hidden;
		// margin: 10px 10px 40rpx;
	// 	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	// 	border-radius: 20rpx;
	// 	background-color: #fff;
	
	}

	.allImage {
		display: flex;
		margin-top: 10rpx;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.imgList {
		margin: 0 3%;
	}

	.images:not(:nth-child(3n)) {
		/* margin-right: 10rpx; */
	}

	.text {
		margin: 1% 4% 5%;
	}

	.images {
		margin-right: 10rpx;
		display: inline-block;
	}

	.operate {
		width: 94%;
		padding: 0 3%;
		font-size: 14px;
	}

	.chat-custom-right {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}

	.chat-custom-text {
		font-size: 12px;
		color: #999;
	}



	.user__container {
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		/* -webkit-flex-direction: row; */
		flex-direction: row;
		-webkit-box-flex: 1;
		/* -webkit-flex: 1; */
		flex: 1;
		padding: 10px 15px;
		position: relative;
		overflow: hidden;
	}

	.user__header {
		display: flex;
		width: 45px;
		height: 45px;
		border: 1px solid #eee;
		overflow: hidden;
		border-radius: 100%;
	}

	.user__header-image {
		width: 45px;
		height: 45px;
		border-radius: 100%;
	}

	.user__content {
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		flex-direction: row;
		-webkit-box-flex: 1;
		flex: 1;
		overflow: hidden;
		padding: 2px 0;
	}

	.user__content-main {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		padding-left: 10px;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		overflow: hidden;
	}

	.user__content-note {
		margin-top: 3px;
		color: #999;
		font-size: 12px;
		font-weight: normal;
		overflow: hidden;
	}

	.user__focus-on {
		padding: 3px 10px;
		border: 1px solid #fb5f5f;
		color: #fb5f5f;
		display: flex;
		font-size: 14px;
		border-radius: 3px;
	}

	.user__focus-off {
		padding: 3px;
		color: gray;
		font-size: 14px;
	}
</style>
