<template>
	<view>
		<u-popup border-radius="14" v-model="showPopup" :closeable="true" @close="close" mode="bottom" height="250px" :mask="false">
			<view class="tips">
				<u-tag text="+自定义贴纸" shape="circle" type="success" class="margin-left-8" @click="chooseImage(['album','camera'])" />
				<u-tabs :list="categoryList" active-color="red" :show-bar="false" :is-scroll="true" :current="tabIndex" @change="tabChange"></u-tabs>
			</view>
			
			<view class="wrap">
				<mescroll-uni v-if="categoryId" top="180" style="height: 150px;" ref="mescrollRef" @init="mescrollInit" @down="downCallback"
				 @up="upCallback">
					<view class="img-wrap">
						<u-image width="100rpx" height="100rpx" style="display: inline;text-align: center;margin: 8px;" v-for="(image,index) in imageList"
						 :key="image._id" :src="image.url" @click="$emit('selectMask',image)">
							{{index+1}}
						</u-image>
					</view>
				</mescroll-uni>
			</view>

		</u-popup>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";

	export default {
		props: {
			// show: {
			// 	type: Boolean,
			// 	default: false
			// },
		},
		data() {
			return {
				categoryId: null, //'600e9b5f665c390001230510',
				categoryList: [],
				tabs: [],
				tabIndex: 0, // tab下标
				imageList: [],
				total: 0,
				page: {
					current: 1,
					size: 10
				},
				showPopup: false,
			};
		},
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		// computed: {
		// 	showPopup: {
		// 		get: function() {
		// 			return this.show
		// 		},
		// 		set: function() {}
		// 	},
		// },
		mounted() {
			this.getDecalsCategory()
		},
		methods: {
			close() {
				
				// this.showPopup=false
				// this.$emit('close')
			},
			show() {
				this.showPopup = true
			},
			getDecalsCategory() {
				const _this = this
				uniCloud.callFunction({
					name: 'image',
					data: {
						action: 'getImageCategory',
						params: {
							frozen: 0
						}
					},
					success(response) {
						
						const {
							code,
							result
						} = response.result
						// console.log(' decalsCategory :',response.result)
						if (code === 200) {
							_this.categoryList = result
							_this.tabs = result.map(r => r.name)
							_this.categoryId = result[0] ? result[0]._id : null
						}
					},
					fail() {},
					complete() {}
				});
		
			},
			tabChange(index) {
				// console.log('tabChange', index),
					this.tabIndex = index;
				this.categoryId = this.categoryList[index]._id;
				// this.$nextTick(() => {
				// 	this.imageList = [] // 先置空列表,显示加载进度
				// 	this.mescroll.resetUpScroll() // 再刷新列表数据
				// })
			},
			upCallback(page) {
					uni.getImageInfo({
				            src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-8fc916b8-077c-4613-a6a5-a4677d83a5a0/ca18fc6d-a5b1-4b4d-835f-cb7183fb6b46.jpg',
				            success:  (image)=> {
				            	this.imageList =[{_id:'1',url:image.path}];
				            }
				        });
			
				this.mescroll.endSuccess(1, 1);
				//联网加载数据
				// this.getImage({
				// 	current: page.num,
				// 	size: page.size
				// })
			},
			async getImage(pageConf) {
				if (!this.categoryId) {
					uni.showToast({
						icon: 'none',
						title: '分类id不存在'
					})
					this.mescroll.endErr();
					return '分类id不存在'
				}
				const params = {
					image_category: this.categoryId,
					page: pageConf ? pageConf : {
						current: 1,
						size: 10
					}
				}
				const {
					code,
					result,
					page,
				} = await this.$request({
					name: 'image',
					data: {
						action: 'getImages',
						params
					},
				})
				if (code === 200) {
					if (page.current === 1) {
						this.imageList = result
					} else {
						this.imageList = this.imageList.concat(result)
					}
					this.page = page
					this.total = page.total
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					console.log('this.$refs.mescrollRef.mescroll', this.$refs.mescrollRef.mescroll)
					this.mescroll.endSuccess(result.length, page.total);
				} else {
					this.mescroll.endErr();
				}
			},
			chooseImage(sourceType) {
				const _this = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType,
					success: function(chooseRes) {
						_this.selectedFilePath = chooseRes.tempFilePaths[0]
						_this.$emit('selectMask', {
							url: chooseRes.tempFilePaths[0]
						})
					}
				});
			},

		}
	}
</script>

<style lang="scss">
	.wrap {
		position: relative;
		overflow: hidden;
	}

	.tips {
		position: fixed;
		height: 70px;
		color: red;
		top: 0;
		display: inline;
		margin: 15px 40px 0 10px;
		z-index: 200000;
	}

	.img-wrap {
		padding-left: 16px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

	}
</style>
