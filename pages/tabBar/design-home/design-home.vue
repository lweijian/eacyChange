<template>
	<view>
		<view class="function-button">
			
			<view class="clothes ">
				<u-button shape="circle" type="warning" size="default" @click='toCreativeSharing()'>创意分享</u-button>
			</view>
			
			<view class="clothes ">
				<u-button shape="circle" type="warning" size="default" @click='toDesign()'>旧衣改造</u-button>
			</view>
			
			<view class="clothes ">
				<u-button shape="circle" type="warning" size="default" @click='toTest()'>test页面</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				uniIdToken: ""
			};
		},
		methods: {
			...mapMutations(['login']),
			toDesign() {

				uni.navigateTo({
					url: '../../design/design'
				})
			},
			toCreativeSharing() {
				uni.navigateTo({
					url: '../../creativeSharing/creativeSharing'
				})
			},
			toTest() {
				uni.navigateTo({
					url: '../../detail/detail'
				})
			},
			toLogin() {
				uni.reLaunch({
					url: '../../login/login',
				});
			}

		},
		async onLoad() {
			let uniIdToken = uni.getStorageSync('uni_id_token');
			let tokenResult={};
			//是否存在token
			if (uniIdToken) {
			tokenResult	= await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					}
				})
			} else {
				this.toLogin();
			}

			// token是否正确
			if (tokenResult?.result?.code == 0) {
				//将用户信息保存到内存
				this.login(tokenResult.result.userInfo,uniIdToken);
				
			} else {
				this.toLogin();
			}


		}
	
	}
</script>

<style lang="scss">
	page {
		position: relative;
		background-color: #f8eddb;
	}

	/deep/.u-size-default {
		height: 160rpx;
	}

	.function-button {

		width: 100%;
		position: absolute;
		top: 40vh;

		.clothes {
			margin: 100rpx;
		}
	}
</style>
