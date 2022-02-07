<template>
	<PullDownRefreshView :scroll-top="scrollTop" @on-refresh="refresh" @scroll='handleScroll()'
		:refresher="!isMyselfDynamicShow">

		<view class="dynamic-show-box">
			<!-- <view class="dynamic-show-box" :style="{transform:transformOffset}"> -->
			<!-- <view  class="virtual-occupancy" :style="{height:phantomHeight}"></view> -->
			<!-- 动态 -->
			<Dynamic class="dynamic" v-for="(item,index) in dynamicList" :key="item._id" :domIndex="index"
				:imgList="item.imgList" :avatar="item.userInfo[0].avatar" :isNeedFocus='!isMyselfDynamicShow'
				:nickName="item.userInfo[0].nickName" :publish_date="item.publish_date" :content="item.content"
				:isLike="item.isLike" :isCollect="item.isCollect" :like_count="item.like_count"
				:collectionNumber="item.collectionNumber" :chatNumber="item.chatNumber"
				@longpress="longtap(item._id,index)" @clickDynamic="clickDynamic(index)" @clickUser="clickUser(item.id)"
				@clickFocus="clickFocus(index)" @clickThumbsup="clickThumbsup(item)"
				@clickCollectionNumber="clickCollectionNumber(item)" @clickChat="clickChat(item)">
			</Dynamic>

		</view>
	</PullDownRefreshView>
</template>

<script>
	function getArrayLength(arr = []) {
		let len = 0;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]) {
				len++;
			}
		}
		return len;
	}
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: "DynamicShow",
		props: {

			isMyselfDynamicShow: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

				currentNodesNumber: 4,
				estimatedRowHeight: 500,
				isNeedGetInfo: true,
				currentListInfo: [],
				position: [],
				startIndex: 0,
				dynamicList: [],
			};
		},
		methods: {
			findStartIndex(scrollTop) {
				let startIndex = 0;
				let len = this.position.length;
				while (startIndex < len) {
					if (scrollTop < this.position[startIndex + 2].bottom) break;
					startIndex += 1;
				}
				return startIndex;
			},
			handleScroll(e) {
				// 	const {
				// 		scrollTop,
				// 	} = e.detail

				// 	if(scrollTop>this.position[this.position.length-1].bottom){

				// 		return
				// 	}

				// 	let startIndex = this.findStartIndex(scrollTop);

				// 	if (startIndex != this.startIndex) {
				// 		this.startIndex = startIndex;
				// 		this.isNeedGetInfo = true

				// 	}

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
				// this.list[e].isFocusOn = !this.list[e].isFocusOn;
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
			longtap(id, index) {

				if (!this.isMyselfDynamicShow) {
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
								let res = await this.delDynamic(id);

								if (res.result.code !== 200) {
									throw Error(res.result)
								}

								this.$root.$emit('del-dynaimc')

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

			delDynamic(id) {
				return uniCloud.callFunction({
					name: 'dynamics',
					data: {
						action: 'delDynamics',
						params: {
							id,
						}
					},
				})

			},
			async init() {
				let temp = await this.getDynamics();
				return temp;

				// for (let i = 0; i < this.dynamicList.length; i++) {

				// 	this.position.push({
				// 		index: i,
				// 		top: i * this.estimatedRowHeight,
				// 		height: this.estimatedRowHeight,
				// 		bottom: (i + 1) * this.estimatedRowHeight,
				// 		dValue: 0,
				// 	})
				// }
			},
			async getDynamics() {
				try {
					// 获取动态列表
					const getAllDynamics = await uniCloud.callFunction({
						name: 'dynamics',
						data: {
							action: this.isMyselfDynamicShow ? 'getDynamicsByUid' : 'getAllDynamics',
						}
					})
					return getAllDynamics.result?.dataSource?.data || [];

				} catch (e) {
					console.log(e)
					return [];
				}
			},
			async refresh(e) {
				this.dynamicList = await this.getDynamics();

				setTimeout(function() {
					e.complete();
				}, 600);
			}

		},
		computed: {
			// transformOffset() {
			// 	return `translate3d(0,${this.startIndex >= 1 ? this.position[this.startIndex - 1].bottom : 0}px,0)`;
			// },
			// endIndex() {
			// 	return this.startIndex + this.currentNodesNumber;
			// },
			// currentList() {

			// 	return this.dynamicList.slice(this.startIndex, this.endIndex);
			// },
			// phantomHeight() {

			// 	return `${this.position[this.position.length-1]?.bottom||0}px`;
			// },

		},
		watch: {
			// currentListInfo() {
			// 	let arrayLength = getArrayLength(this.currentListInfo)

			// 	if (arrayLength !== this.currentNodesNumber) return;
			// 	for (let i = 0; i < arrayLength; i++) {

			// 		let index = this.startIndex + i

			// 		let height = this.currentListInfo[i]?.height
			// 		let oldHeight = this.position[index].height;
			// 		let dValue = oldHeight - height;
			// 		if (dValue) {
			// 			this.position[index].top = this.position[index - 1]?.bottom +9||9
			// 			this.position[index].bottom =this.position[index].top + height
			// 			this.position[index].height = height
			// 			this.position[index].dValue = dValue;
			// 		}
			// 	}

			// },


		},

		async created() {
			this.dynamicList = await this.init()
			this.$root.$on('del-dynaimc',async () => {
				this.dynamicList = await this.init()
			})
		},

		updated() {
			// if (this.isNeedGetInfo) {
			// 	let query = uni.createSelectorQuery().in(this);
			// 	query.selectAll('.dynamic').fields({
			// 		size: true,
			// 		rect: true,
			// 	}, data => {
			// 		if (data.length > 0) {
			// 			this.currentListInfo = data;
			// 			this.isNeedGetInfo = false;

			// 		}
			// 	}).exec();
			// }

		}




	};
</script>
<style lang="scss">
	.dynamic-show-box {
		margin-bottom: 200rpx;

	}

	.virtual-occupancy {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}
</style>
