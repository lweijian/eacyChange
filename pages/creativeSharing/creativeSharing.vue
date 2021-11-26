<template>
	<view>
		<view class="wrap">
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition"
				@animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<view class="header-tabs-box">
						<view class="header-tabs">
							<u-tabs activeColor="#000000 " inactive-color="#8e8e8e" :show-bar="false" :list="headerList"
								:current="headerCurrent" @change="headerChange" :is-scroll="false"></u-tabs>
						</view>
					</view>

					<PullDownRefreshView @on-refresh="refresh">
						<view class="page-box">

							<!-- 文章展示 -->
							<ArticlesShow v-show="headerCurrent==0" :articlesList='articlesList' />
							<!-- 动态展示 -->
							<DynamicShow v-show="headerCurrent==1" :dynamicList="dynamicList" />

						</view>

					</PullDownRefreshView>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<retrieve />
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item ">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page-box">
							<PublishEdit />
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item swiper-item-whileBackground">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<UserWorks />
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#000000 " inactive-color="#8e8e8e" :show-bar="false" ref="tabs" :bold="false"
					:list="footerList" :current="footerCurrent" @change="footerListChange" :is-scroll="false"
					swiperWidth="750"></u-tabs-swiper>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

				headerList: [{
					name: '文章'
				}, {
					name: '动态'
				}],
				dynamicList: [],
				articlesList: [],
				headerCurrent: 0,
				footerList: [{
						name: '创意'
					},
					{
						name: '回收'
					},
					{
						name: '发布'
					},
					{
						name: '作品',
					}
				],
				footerCurrent: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
			};
		},
		onLoad() {

			this.init();

		},
		// onPullDownRefresh() {

		// },
		computed: {},
		methods: {

			async init() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				try {
					// 获取文章列表
					const getAllArticles = await uniCloud.callFunction({
						name: 'articles',
						data: {
							action: 'getAllArticles'
						}
					})
					
					this.articlesList = getAllArticles.result?.dataSource?.data || []
					
				} catch (e) {
					console.log(e)
				}
				uni.hideLoading();
				try {
					// 获取动态列表
					const getAllDynamics = await uniCloud.callFunction({
						name: 'dynamics',
						data: {
							action: 'getAllDynamics',
						}
					})
					this.dynamicList = getAllDynamics.result?.dataSource?.data || []
				} catch (e) {
					console.log(e)
				}


			},
			refresh(e) {
				if (this.headerCurrent == 0) {
					// 获取文章列表
					uniCloud.callFunction({
						name: 'articles',
						data: {
							action: 'getAllArticles'
						},
						success: (res) => {
							this.articlesList = res.result.dataSource.data
						},
						fail: (err) => {

							console.log(err)
						},
						complete: () => {
							setTimeout(function() {
								e.complete();
							}, 600);
						}
					})

				} else if (this.headerCurrent == 1) {
					// 获取动态列表
					uniCloud.callFunction({
						name: 'dynamics',
						data: {
							action: 'getAllDynamics',
						},
						success: (res) => {
							this.dynamicList = res.result.dataSource.data
						},
						fail: (e) => {
							console.log(e)
						},
						complete: () => {
							setTimeout(function() {
								e.complete();
							}, 600);
						}
					})


				}




			},

			reachBottom() {
				// 此tab为空数据
				if (this.current != 2) {
					this.loadStatus.splice(this.current, 1, "loading")
					// setTimeout(() => {
					// 	this.getOrderList(this.current);
					// }, 1200);
				}
			},
			headerChange(index) {
				this.headerCurrent = index;
			},
			// footerTab栏切换
			footerListChange(index) {
				this.swiperCurrent = index;
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	};
</script>


<style>
	/* page不能写带scope的style标签中，否则无效 */
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="scss" scoped>
	.header-tabs-box {
		height: 88rpx;
		width: 100%;

		.header-tabs {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			z-index: 999;
		}
	}

	.centre {
		text-align: center;
		margin: 200rpx auto;
		font-size: 32rpx;

		image {
			width: 164rpx;
			height: 164rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
		}

		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}

		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {

		height: 100%;
	}

	.swiper-item-whileBackground {
		background-color: #ffffff;
	}
</style>
