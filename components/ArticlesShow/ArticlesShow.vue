<template>
	<PullDownRefreshView @on-refresh="refresh" :refresher="!isMyselfArticlesShow">

		<view class="wrap" style="margin-bottom: 150rpx;" v-if="showWaterFall">
			<u-waterfall v-model="articlesList" ref="uWaterfall" idKey="_id" >
				<template v-slot:left="{ leftList }">
					<view class="work-warter" v-for="(item, index) in leftList" :key="item._id"
						@click="toDetail(item._id)" @longpress="longtap(item._id)">
						<u-lazy-load threshold="-450" border-radius="10" :image="item.cover" :index="index">
						</u-lazy-load>
						<view class="work-title u-line-2">{{ item.title }}</view>
						<view class="info-box">
							<view class="left-box u-line-1">
								<u-icon class="work-nickName" :label="item.userInfo[0].nickName" size="22"
									label-size="22" :name="item.userInfo[0].avatar" />
							</view>
							<view class="right-box">
								<u-icon class="like-icon" name="heart" size="22" label-size="22"
									:label="item.like_count" />
							</view>
						</view>

					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view class="work-warter" v-for="(item, index) in rightList" :key="item._id"
						@click="toDetail(item._id)" @longpress="longtap(item._id)">
						<u-lazy-load threshold="-450" border-radius="10" :image="item.cover" :index="index">
						</u-lazy-load>
						<view class="work-title u-line-2">{{ item.title }}</view>

						<view class="info-box">
							<view class="left-box u-line-1">
								<u-icon class="work-nickName" :label="item.userInfo[0].nickName" size="22"
									label-size="22" :name="item.userInfo[0].avatar" />
							</view>
							<view class="right-box">
								<u-icon class="like-icon" name="heart" size="22" label-size="22"
									:label="item.like_count" />

							</view>

						</view>

					</view>
				</template>
			</u-waterfall>
			<!-- <u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore> -->
		</view>
	</PullDownRefreshView>
</template>

<script>
	export default {
		name: 'ArticlesShow',

		data() {
			return {
				showWaterFall:true,
				articlesList: [],
				loadStatus: 'loadmore',
			};
		},
		props: {
			isMyselfArticlesShow: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			async init() {
				this.articlesList = await this.getArticles()
				
			},
			async getArticles() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				try {
					// 获取文章列表
					const getAllArticles = await uniCloud.callFunction({
						name: 'articles',
						data: {
							action: this.isMyselfArticlesShow ? 'getArticlesByUid' : 'getAllArticles'
						}
					})
					return getAllArticles.result?.dataSource?.data || []

				} catch (e) {

					console.log(e)
				} finally {
					uni.hideLoading();
				}

				return [];

			},
			async refresh(e) {
				// 获取文章列表
		
				let temp =await this.getArticles()
				  if(this.articlesList.length!==temp.length){
					  this.showWaterFall=false;
					  this.articlesList=temp;
				  }
						
				setTimeout(()=> {
					e.complete();
					this.showWaterFall=true
				}, 600);
			},
			toDetail(id) {
				uni.navigateTo({
					url: `../../pages/detail/detail?id=${id}`
				})
			},
			longtap(id) {
				if (!this.isMyselfArticlesShow) {
					return
				}
				uni.showModal({
					content: '是否确认删除',
					success: async (res) => {
						try {
							if (res.confirm) {
								uni.showLoading({
									title: '删除中'
								});
								await this.delArticle(id);
								this.removeItem(id)
								
								uni.hideLoading();
								uni.showToast({
									title: '删除成功',
									duration: 600
								});
							}
						} catch (e) {
							console.log(e)
							uni.showToast({
								title: '删除失败',
								duration: 1000
							});
						}

					}
				});

			},
			
			delArticle(id) {
				return uniCloud.callFunction({
					name: 'articles',
					data: {
						action: 'delArticles',
						params: {
							id,
						}
					},
				})

			},
			removeItem(id){
				this.$refs.uWaterfall.remove(id);
			}
		},
		mounted() {
			this.init()
		},
	}
</script>



<style lang="scss" scoped>
	.work-warter {
		border-radius: 10px;
		margin: 10rpx 10rpx 30rpx 10rpx;
		background-color: #ffffff;
		padding: 8px;
		position: relative;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
	}





	.work-image {
		width: 100%;
		border-radius: 4px;
	}

	.work-title {
		font-size: 30rpx;
		margin-top: 5px;
		color: $u-main-color;
		word-break: break-all;
	}

	.work-tag {
		display: flex;
		margin-top: 5px;
	}

	.work-tag-owner {
		background-color: $u-type-error;
		color: #ffffff;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}

	.work-tag-text {
		border: 1px solid $u-type-primary;
		color: $u-type-primary;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}

	.work-price {
		font-size: 30rpx;
		color: $u-type-error;
		margin-top: 5px;
	}

	.info-box {
		position: relative;
		height: 22rpx;
		width: 100%;
		margin-top: 22rpx;

		.left-box {

			position: absolute;
			left: 0;
			bottom: 0;
			width: 220rpx;

			.work-nickName {
				color: $u-tips-color;
			}
		}

		.right-box {
			position: absolute;
			right: 20rpx;
			bottom: 0;

		}



	}
</style>
