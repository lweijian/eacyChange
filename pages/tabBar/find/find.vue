<template>
	<view>
		<!-- 头部搜索框 -->

		<serachHeader></serachHeader>
		<!-- nav长列表 -->
		<view class="nav">
			<view class="nav-item" v-for="(item,index) in navList" :key="item.id" @tap="toHandmadeCircle(item.toUrl)" >
				<view class="nav-img">
					<image :src="item.imgSrc"></image>
				</view>
				<view class="nav-info">
					{{item.name}}
				</view>
			</view>
		</view>

		<!-- 动态 -->
		<Dynamic v-for="(item,index) in dynamicList" :key="item.id" :imgList="item.imgList" :avatar="item.avatar" :name="item.name"
			:publishTime="item.publishTime" :content="item.content" :isLike="item.isLike"
			:isCollect="item.isCollect" :likeNumber="item.likeNumber"
			:collectionNumber="item.collectionNumber" :chatNumber="item.chatNumber" @clickDynamic="clickDynamic(index)"
			@clickUser="clickUser(item.id)" @clickFocus="clickFocus(index)" @clickThumbsup="clickThumbsup(item)"
			@clickCollectionNumber="clickCollectionNumber(item)" @clickChat="clickChat(item)">
		</Dynamic>
	</view>
</template>

<script>
	export default {
		name: "find",
		data() {
			return {
				navList: [{
						id: '手工圈',
						imgSrc: '../../../static/img/find/手工圈.png',
						name: '手工圈',
						toUrl:"../../handmadeCircle/handmadeCircle"
					},
					{
						id: '达人推荐',
						imgSrc: '../../../static/img/find/达人推荐.png',
						name: '达人推荐',
						toUrl:"../../handmadeCircle/handmadeCircle"
					},
					{
						id: '加好友',
						imgSrc: '../../../static/img/find/加好友.png',
						name: '加好友',
						toUrl:"../../handmadeCircle/handmadeCircle"
					}
				],
				dynamicList: [{
						id: '小新',
						avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1950846641,3729028697&fm=26&gp=0.jpg',
						name: '小新',
						publishTime: 1617086756,
						content: '你爱我，我爱你，蜜雪冰城甜蜜蜜',
						imgList: [
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
							'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
						],
						isLike: true,
						isCollect: true,
						likeNumber: 2,
						collectionNumber: 2,
						chatNumber: 2,
						isFocusOn: false,
					},

					{
						id: '小白',
						avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2291332875,175289127&fm=26&gp=0.jpg',
						name: '小白',
						publishTime: 1617036656,
						content: '  足不出户享国内核医学领域顶级专家云诊断，“中山-联影”分子影像远程互联融合创新中心揭牌 ',
						imgList: [
							'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
						],
						isLike: false,
						isCollect: false,
						likeNumber: 0,
						collectionNumber: 0,
						chatNumber: 2,
						isFocusOn: false,
					},
					{
						id: '小新1',
						avatar: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1950846641,3729028697&fm=26&gp=0.jpg',
						name: '小新',
						publishTime: 1617046556,
						content: '  外交部：一小撮国家和个人编造所谓新疆“强迫劳动”的故事，其心何其毒也！ ',
						imgList: [
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
							'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
						],
						isLike: true,
						isCollect: false,
						likeNumber: 4,
						collectionNumber: 22,
						chatNumber: 52,
					},
					{
						id: '小龙马',
						avatar: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3717120934,3932520698&fm=26&gp=0.jpg',
						name: '小龙马',
						publishTime: 1616086456,
						content: 'DCloud有800万开发者,uni统计手机端月活12亿。是开发者数量和案例最丰富的多端开发框架。 欢迎知名开发商提交案例或接入uni统计。 新冠抗疫专区案例 uni-app助力',
						imgList: [
							'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
							'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
						],
						isLike: true,
						isCollect: false,
						likeNumber: 25,
						collectionNumber: 0,
						chatNumber: 7,
					},
					{
						id: '风清扬',
						avatar: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2590128318,632998727&fm=26&gp=0.jpg',
						name: '风清扬',
						publishTime: 1607086356,
						content: '划个水',
						imgList: [
							'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
							'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2369680151,826506100&fm=26&gp=0.jpg',
							'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1976832114,2993359804&fm=26&gp=0.jpg',
						],
						isLike: true,
						isCollect: true,
						likeNumber: 3,
						collectionNumber: 2,
						chatNumber: 2,
					}
				]

			};
		},
		methods: {
			
			toHandmadeCircle(toUrl) {
				uni.navigateTo({
					url: toUrl
				})
			},
			clickDynamic(e) {
				console.log('childDynamic');
			},
			// 点击用户信息
			clickUser(e) {
				console.log(e);
				console.log('childUser');
			},
			// 点击关注
			clickFocus(e) {
				this.list[e].isFocusOn = !this.list[e].isFocusOn;
				console.log(e);
				console.log('childUser');
			},
			// 点赞
			clickThumbsup(e,e2) {
				e.isLike=!e.isLike;
			
			},
			// 点击收藏
			clickCollectionNumber(e) {
				console.log(e);
				e.isCollect=!e.isCollect;
				console.log('clickcollectionNumber');
			},
			// 点击聊天
			clickChat(e) {
				console.log(e);
				console.log('clickChat');
			}

		}

	};
</script>

<style lang="scss">
	page {
		position: relative;
		background-color: #f5f5f5;
	}

	.nav {
		margin: 10rpx 0rpx;
		background-color: #fff;
		display: flex;

		.nav-item {
			height: 120rpx;
			width: 150rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// align-content: center;
			font-size: 12px;

			image {
				height: 50rpx;
				width: 50rpx;
			}
		}
	}
</style>
