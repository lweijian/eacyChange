<template>
	<view>
		<view v-if="showHeader" class="status" :style="{position:headerPosition,top:statusTop}"></view>
		<view v-if="showHeader" class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="addr"></view>
		</view>
	<!-- 	占位 -->
		<view v-if="showHeader" class="place"></view> 
	<!-- 	用户信息 -->
		<view class="user">
			 <!-- 头像 -->
			<view class="left">
				<image :src="user.face" @tap="toSetting"></image>
			</view>
			<!-- 昵称 -->
			<view class="right">
				<view class="username" @tap="toLogin">{{user.username}}</view>

			</view>
			<!--个性签名  数据展示 -->
			<view class="signature" @tap="toLogin">{{user.signature}}</view>
			<view class="data-show">
				<view class="data-item" v-for="(item,index) in user.dataShow">
					<view class="data-number"> {{item.number}}</view>
					<view class="data-name"> {{item.name}}</view>

				</view>

			</view>

			<view class="icon-btn">
				<view>编辑资料</view>
				<view class="icon setting" @tap="toSetting"></view>
			</view>


		</view>

		<view class="user-tabs">
			<!-- 选项卡 -->
			<view class="tabs">
				<u-tabs :list="tabList" :is-scroll="false"   inactive-color='#bdbdbd' active-color="#000000" bar-height="5" bar-width="60" :current="current" @change="change"></u-tabs>
			</view>
			<!-- 选项卡内容 -->
			<view class="tabs-content"></view>
		</view>


	

	</view>




</template>
<script>
	export default {
		data() {
			return {
				isfirst: true,
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				//个人信息,
				user: {
					username: '游客1002',
					face: '/static/img/face.jpg',
					signature: '点击昵称跳转登录/注册页',
					integral: 0,
					balance: 0,
					envelope: 0,
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
				tabList: [
					{
					name: '关注'
				}, {
					name: '图文'
				}, {
					name: '视频'
				}, {
					name: '集市'
				}],
				// 选项卡下标
				current: 0,
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		onLoad() {
			this.statusHeight = 0;
			// #ifndef H5
			this.showHeader = false;
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif
		},
		onReady() {
			//此处，演示,每次页面初次渲染都把登录状态重置
			uni.setStorage({
				key: 'UserInfo',
				data: false,
				success: function() {},
				fail: function(e) {}
			});
		},
		onShow() {
			uni.getStorage({
				key: 'UserInfo',
				success: (res) => {
					if (!res.data) {
						if (this.isfirst) {
							//this.toLogin();
						}
						return;
					}
					this.user = res.data;
				},
				fail: (e) => {
					//this.toLogin(); 
				}
			});
		},
		methods: {
			
			// 选项卡，索引改变方法
			change(index) {
				this.current = index;
			
			},
			//消息列表
			toMsg() {
				uni.navigateTo({
					url: '../../msg/msg'
				})
			},
			toOrderList(index) {
				uni.setStorageSync('tbIndex', index);
				uni.navigateTo({
					url: '../../user/order_list/order_list?tbIndex=' + index
				})
			},
			toSetting() {
				uni.navigateTo({
					url: '../../user/setting/setting'
				})
			},
			toMyQR() {
				uni.navigateTo({
					url: '../../user/myQR/myQR'
				})
			},
			toLogin() {
				uni.showToast({
					title: '请登录',
					icon: "none"
				});
				uni.navigateTo({
					url: '../../login/login'
				})
				this.isfirst = false;
			},
			isLogin() {
				//实际应用中,用户登录状态应该用token等方法去维持登录状态.
				const value = uni.getStorageSync('UserInfo');
				if (value) {
					return true;
				}
				return false
			},
			toDeposit() {
				uni.navigateTo({
					url: '../../user/deposit/deposit'
				})
			},
			toPage(url) {
				if (!url) {
					uni.showToast({
						title: '模板未包含此页面',
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
<style lang="scss">
	$HeadColor:#5a5c6b;
	$FontColor:#eee;

	page {
		position: relative;
		background-color: #fff;
	}

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

	

	.user {
		
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

			.username {
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

	.user-tabs {
		height: 500upx;
		background-color: #fff;
		width: 750rpx;
		border: 1px solid #fff;
		position: relative;
		bottom: 50rpx;
		border-radius: 5%;
		.tabs{
	/deep/	#u-tab-item-0{
			font-weight: 600 !important;
		}
			position: relative;
			margin: 0 50upx;
		/deep/	.u-tab-bar{
				    background-color: red !important;
			}
		}
		
	}
</style>
