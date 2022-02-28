<template>

<PullDownRefreshView  id="dynamic-scroll-view" :scroll-top="scrollTop" @on-refresh="refresh" 
		:refresher="!isMyselfDynamicShow">
		<!-- 动态 -->

		<view class="scroll-box">
			<view v-for="(item,index) in currentList" :key="item._id">
				<Dynamic :domIndex="index" :imgList="item.imgList" :avatar="item.userInfo[0].avatar"
					:isNeedFocus='!isMyselfDynamicShow' :nickName="item.userInfo[0].nickName"
					:publish_date="item.publish_date" :content="item.content" :isLike="item.isLike"
					:isCollect="item.isCollect" :like_count="item.like_count" :collectionNumber="item.collectionNumber"
					:chatNumber="item.chatNumber" @longpress="longtap(item._id,index)"
					@clickDynamic="clickDynamic(index)" @clickUser="clickUser(item.id)" @clickFocus="clickFocus(index)"
					@clickThumbsup="clickThumbsup(item)" @clickCollectionNumber="clickCollectionNumber(item)"
					@clickChat="clickChat(item)">
				</Dynamic>
			</view>
			<view class="loading">
				{{isLoad?"loading":"not find more"}}
			</view>
		</view>



	</PullDownRefreshView>

	

</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	let observer = null;
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

				isRefreshing: false, // 是否在刷新中
				isInfiniting: false, // 是否在加载中
				triggered: true,
				isLoad: true,
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
			async refreshing() {
				if (this.isRefreshing) return;
				this.isRefreshing = true
				this.triggered = true;
				this.isInfiniting = false;
				this.dynamicList = await this.getDynamics();

				this.triggered = false;
				this.isRefreshing = false;
				this.isInfiniting = true;

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

		},
		computed: {

			endIndex() {
				return Math.min(this.startIndex + this.currentNodesNumber, this.dynamicList.length - 1)
			},
			currentList() {

				return this.dynamicList.slice(this.startIndex, this.endIndex);
			},


		},

		async created() {
			this.dynamicList = await this.init()
	

			this.$nextTick(function() {
				observer = uni.createIntersectionObserver(this);
				observer.relativeTo('#dynamic-scroll-view').observe('.loading', (res) => {
					if (res.intersectionRatio > 0) {
						
						if (this.endIndex === this.dynamicList.length - 1) {
							this.isLoad = false
							observer.disconnect()
						
						}else{
							this.currentNodesNumber += 2
						}
						
					}
					
				})

				this.$root.$on('del-dynaimc', async () => {
					this.dynamicList = await this.init()
				})
			})
		},
		onUnload() {
			if (observer) {
				observer.disconnect()
			}
		}
	};
</script>
<style lang="scss">
	.scroll-box {
		margin-bottom: 200rpx;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
