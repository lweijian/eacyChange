<template>
	<view>
		<view class="header">
			<navHeader>

			</navHeader>
		</view>

		<!-- 选项卡 -->
		<view class="u-tabs">
			<u-tabs :list="tabList" :is-scroll="true" bar-width="100" active-color="#000000" :current="current" @change="change"></u-tabs>
		</view>

		<!-- 选项卡内容 -->
		<view class="u-tabs-content">
			
			<Dynamic v-for="(item,index) in dynamicList" :key="item.id" :imgList="item.imgList" :avatar="item.avatar"
				:name="item.name" :publishTime="item.publishTime" :content="item.content" :isLike="item.isLike"
				:isCollect="item.isCollect" :likeNumber="item.likeNumber" :collectionNumber="item.collectionNumber"
				:chatNumber="item.chatNumber" @clickDynamic="clickDynamic(index)" @clickUser="clickUser(item.id)"
				@clickFocus="clickFocus(index)" @clickThumbsup="clickThumbsup(item)"
				@clickCollectionNumber="clickCollectionNumber(item)" @clickChat="clickChat(item)">
			</Dynamic>
		</view>



	</view>
</template>

<script>
	export default {
		name: "handmadeCircle",
		data() {
			return {
				// 选项卡

				tabList: [{

					name: '综合圈'
				}, {
					name: '服装裁剪'
				}, ],
				// 选项卡下标
				current: 0,
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
			clickThumbsup(e, e2) {
				e.isLike = !e.isLike;

			},
			// 点击收藏
			clickCollectionNumber(e) {
				console.log(e);
				e.isCollect = !e.isCollect;
				console.log('clickcollectionNumber');
			},
			// 点击聊天
			clickChat(e) {
				console.log(e);
				console.log('clickChat');
			},
			// 选项卡，索引改变方法
			change(index) {
				this.current = index;

			},

		}

	};
</script>

<style lang="scss">

</style>
