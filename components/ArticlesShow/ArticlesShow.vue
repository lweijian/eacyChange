<template>
	<view class="wrap" style="margin-bottom: 150rpx;">
		<u-waterfall v-model="articlesList" ref="uWaterfall">
			<template v-slot:left="{ leftList }">
				<view class="work-warter" v-for="(item, index) in leftList" :key="item._id" @click="toDetail(item._id)">
					<u-lazy-load threshold="-450" border-radius="10" :image="item.cover" :index="index"></u-lazy-load>
					<view class="work-title u-line-2">{{ item.title }}</view>
					<view class="info-box">
						<view class="left-box u-line-1">
							<u-icon class="work-nickName" :label="item.nickName" size="22" label-size="22"
								:name="item.avatar" />
						</view>
						<view class="right-box">
							<u-icon class="like-icon" name="heart" size="22" label-size="22" :label="item.like_count" />

						</view>
					</view>

				</view>
			</template>
			<template v-slot:right="{ rightList }">
				<view class="work-warter" v-for="(item, index) in rightList" :key="item._id"
					@click="toDetail(item._id)">
					<u-lazy-load threshold="-450" border-radius="10" :image="item.cover" :index="index"></u-lazy-load>
					<view class="work-title u-line-2">{{ item.title }}</view>

					<view class="info-box">
						<view class="left-box u-line-1">
							<u-icon class="work-nickName" :label="item.nickName" size="22" label-size="22"
								:name="item.avatar" />
						</view>
						<view class="right-box">
							<u-icon class="like-icon" name="heart" size="22" label-size="22" :label="item.like_count" />

						</view>

					</view>

				</view>
			</template>
		</u-waterfall>
		<!-- <u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore> -->
	</view>
</template>

<script>
	export default {
		name: 'ArticlesShow',
		props: {
			articlesList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {

				loadStatus: 'loadmore',
			};
		},
		methods: {
			init() {
				

			},
			addRandomData() {

			},
			toDetail(id) {
				uni.navigateTo({
					url: `../../pages/detail/detail?id=${id}`
				})
			},

			clear() {
				this.$refs.uWaterfall.clear();
			}
		},
		mounted() {
			this.init()
		},
		// onReachBottom() {
		// 	this.loadStatus = 'loading';
		// 	// 模拟数据加载
		// 	setTimeout(() => {
		// 		this.addRandomData();
		// 		this.loadStatus = 'loadmore';
		// 	}, 1000);
		// },

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
