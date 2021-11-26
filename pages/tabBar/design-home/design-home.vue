<template>
	<view>
		<view class="logo">
			<image src="/static/img/logo.png" style="width: 70vw;margin: 20rpx 15vw;" mode="widthFix"></image>
		</view>	
		<view class="function-button">
				<button type="default" @click='toCreativeSharing()'>创意分享</button>
				<button type="default" @click='toDesign()'>旧衣改造</button>
				<!-- <button type="default" @click='toTest()'>test页面</button> -->
				
		
		
		
		
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
					url: '../../scan-frame/scan-frame'
				})
			},
			toCreativeSharing() {
				uni.navigateTo({
					url: '../../creativeSharing/creativeSharing'
				})
			},
			// toTest() {
			// 	uni.navigateTo({
			// 		url: '../../tiezhi-photo/tiezhi-photo'
			// 	})
			// },
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

	.logo{
		height: 560rpx;
		width: 100%;
	}

	.function-button {
		width: 100%;
		margin: 100rpx 0;
		button[type=default]{
			margin: 100rpx 15vw;
			width: 70vw;
		    background-color: #ffaa00;
		    border-radius: 50rpx;
		    color: #ffffff;
			
		
		}
	}

</style>
