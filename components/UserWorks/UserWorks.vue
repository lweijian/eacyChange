<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="addr"></view>
		</view>
		<!-- 	占位 -->
		<view v-if="showHeader" class="place"></view>
		<!-- 	用户信息 -->
		<view class="userInfo">
			<!-- 头像 -->
			<view class="left">
				<image :src="userInfo.avatar" @tap="toSetting"></image>
			</view>
			<!-- 昵称 -->
			<view class="right">
				<view class="nickName" @tap="toLogin">{{userInfo.nickName}}</view>

			</view>
			<!--个性签名  数据展示 -->
			<view class="signature" @tap="toLogin">{{userInfo.signature}}</view>
			<view class="data-show">
				<view class="data-item" v-for="(item,index) in userInfo.dataShow">
					<view class="data-number"> {{item.number}}</view>
					<view class="data-name"> {{item.name}}</view>

				</view>

			</view>

			<view class="icon-btn">
				<view>编辑资料</view>
				<view class="icon setting" @tap="toSetting"></view>
			</view>


		</view>





		<view class="tabs-box">
			<view class="tabs">
				<u-tabs :list="tabList" :is-scroll="false" inactive-color='#bdbdbd' active-color="#000000"
					:show-bar="false" :current="current" @change="change"></u-tabs>
			</view>

		</view>
		<view class="tabs-content">
			<PullDownRefreshView :refresher="false" @on-refresh="refresh">
				<ArticlesShow v-show="current==0" :articlesList='articlesList' />
				<DynamicShow :isNeedFocus="false" v-show="current==1" :dynamicList="dynamicList" />
			</PullDownRefreshView>
		</view>



	</view>




</template>
<script>
	export default {
		name: 'UserWorks',
		data() {
			return {
				isfirst: true,
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				articlesList: [],
				dynamicList: [],
				//个人信息,
				userInfo: {
					nickName: '',
					avatar: '',
					signature: '',
					dataShow: [{
						name: " 关注",
						number: 110
					}, {
						name: "粉丝",
						number: 120
					}, {
						name: "点赞与收藏",
						number: 120
					}]
				},
				// 选项卡
				tabList: [{
					name: '文章'
				}, {
					name: '动态'
				}, {
					name: '草稿箱'
				}],
				// 选项卡下标
				current: 0,
			}
		},
		mounted() {
			this.userInfo.avatar = uni.getStorageSync('avatar');
			this.userInfo.nickName = uni.getStorageSync('nickName');
			this.init();
		},
		methods: {

			init() {
				// 文章列表初始化
				uniCloud.callFunction({
					name: 'articles',
					data: {
						action: 'getArticlesByUid'
					},
					success: (res) => {
						this.articlesList = res.result.dataSource.data
					},
					fail: (err) => {
						console.log(err)
					}
				})
				// 动态列表初始化
				uniCloud.callFunction({
					name: 'dynamics',
					data: {
						action: 'getDynamicsByUid',
					},
					success: (res) => {
						this.dynamicList = res.result.dataSource.data
					},
					fail: (e) => {
						console.log(e)
					}
				})

			},

			refresh(hideLoading) {
				if (this.current == 0) {
					// 获取文章列表
					uniCloud.callFunction({
						name: 'articles',
						data: {
							action: 'getArticlesByUid'
						},
						success: (res) => {
							this.articlesList = res.result.dataSource.data

						},
						fail: (err) => {

							console.log(err)
						},
						complete: () => {
							setTimeout(function() {
								hideLoading.complete();
							}, 600);
						}
					})

				} else if (this.current == 1) {
					// 获取动态列表
					uniCloud.callFunction({
						name: 'dynamics',
						data: {
							action: 'getDynamicsByUid',
						},
						success: (res) => {
							this.dynamicList = res.result.dataSource.data
						},
						fail: (e) => {
							console.log(e)
						},
						complete: () => {
							setTimeout(function() {
								hideLoading.complete();
							}, 600);
						}
					})
				}
			},

			// 选项卡，索引改变方法
			change(index) {
				this.current = index;

			},
			//消息列表
			toMsg() {
				this.toPage('../../msg/msg')
			},
			toOrderList(index) {
				uni.setStorageSync('tbIndex', index);
				this.toPage(`../../user/order_list/order_list?tbIndex=${index}`)

			},
			toSetting() {
				this.toPage('../../user/setting/setting')
			},
			toMyQR() {
				this.toPage('../../user/myQR/myQR')
			},
			toLogin() {
				uni.showToast({
					title: '请登录',
					icon: "none"
				});
				this.toPage('../../login/login');

				this.isfirst = false;
			},

			toDeposit() {
				toPage('../../user/deposit/deposit');
			},
			toPage(url) {
				if (!url) {
					uni.showToast({
						title: '未包含此页面',
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	$HeadColor:#5a5c6b;
	$FontColor:#eee;



	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: $HeadColor;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */

	}

	.header {

		height: 100rpx;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: $HeadColor;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

	}

	.place {
		background-color: $HeadColor;
		height: 100rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}



	.userInfo {

		width: 100%;
		padding: 0 4%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		position: relative;
		background-color: $HeadColor;
		padding-bottom: 100rpx;

		.left {
			width: 15vw;
			height: 15vw;
			flex-shrink: 0;
			margin-right: 20rpx;

			border-radius: 100%;

			image {
				width: 15vw;
				height: 15vw;
				border-radius: 100%;
			}

		}

		.right {
			width: 80%;

			.nickName {
				font-size: 36rpx;
				color: $FontColor;
			}

		}

		.signature {
			width: 100%;
			overflow: hidden;
			margin: 30upx 0;
			color: $FontColor;
			font-size: 24rpx;

		}

		.data-show {
			display: flex;

			color: $FontColor;


			.data-item {
				margin-right: 60upx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.data-name {
					font-size: 20rpx;

				}
			}

		}

		.icon-btn {
			width: 300rpx;
			height: 60rpx;
			flex-shrink: 0;
			display: flex;
			color: $FontColor;
			position: absolute;
			right: 0;
			bottom: 105rpx;

			view {
				width: 170upx;
				border: 1px solid #fff;
				border-radius: 50% / 50%;
				font-size: 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 24upx;
				opacity: 0.7;
			}

			.icon {
				border: 1px solid #fff;
				width: 100rpx;
				height: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 42rpx;
				color: $FontColor;
			}
		}

	}

	.tabs-box {
		position: sticky;
		left: 0;
		right: 0;
		top: 0;
		width: 100%;
		z-index: 1000;

		.tabs {
			top: 300rpx;
			background-color: #ffffff;
			padding: 0 50upx;
		}
	}

	

	.tabs-content {
		padding: 0;
	}

	.sticky {
		width: 750rpx;
		height: 120rpx;
		background-color: #2979ff;
		color: #fff;
		padding: 24rpx;
	}
</style>
