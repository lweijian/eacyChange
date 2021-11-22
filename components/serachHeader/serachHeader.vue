<template>
	<view>
		<!-- 状态栏 -->
		<view v-if="showHeader" class="status"
			:style="{ position: headerPosition,top:statusTop,opacity: afterHeaderOpacity}"></view>
		<!-- 顶部导航栏 -->
		<view v-if="showHeader" class="header"
			:style="{ position: headerPosition,top:headerTop,opacity: afterHeaderOpacity }">
	
			<!-- 搜索框 -->
			<view class="input-box">
				<input placeholder="请输入搜索关键字" placeholder-style="color:#c0c0c0;" @tap="toSearch()" />
				<view class="icon search"></view>
			</view>
			<!-- 右侧图标按钮 -->
			<view class="icon-msg">
				<u-icon class="icon" name="chat" @tap="toMsg"></u-icon>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="showHeader" class="place"></view>
			
	</view>
</template>

<script>
	export default {
		name:"serachHeader",
		data() {
					return {
						showHeader: true,
						afterHeaderOpacity: 1, //不透明度
						headerPosition: 'fixed',
						headerTop: null,
						statusTop: null,
						
					};
				},
				onPageScroll(e) {
					//兼容iOS端下拉时顶部漂移
					this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
					this.headerTop = e.scrollTop >= 0 ? null : 0;
					this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
				},
				
				//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
				onPullDownRefresh() {
					setTimeout(function() {
						
					}, 1000);
				},
			//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
			
			onReachBottom() {
				uni.showToast({ title: '触发上拉加载' });},
				
					
			
				methods: {
					
		
					//消息列表
					toMsg() {
						uni.navigateTo({
							url: '../../msg/msg'
						})
					},
					//搜索跳转
					toSearch() {
						uni.showToast({
							title: '建议跳转到新页面做搜索功能'
						});
					},
			
				
		
			
				}
		
			};
		
		
		
	</script>

<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
	}


	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 100%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;

		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

	
		.input-box {
			margin-left:40rpx ;
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}

			input {
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
				width: 550upx;
			}
		}

		.icon-msg {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}

	.place {
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
</style>
