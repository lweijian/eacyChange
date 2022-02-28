<template>
	<view class="design-home">
		<!-- <code-elf-guide  :isShow="isLoadingShow"  ></code-elf-guide> -->
		<view class="logo">
			<image src="/static/img/bulb.png" style="width: 70vw;margin: 50rpx 15vw;" mode="widthFix"></image>
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
		isLoadingShow: true,

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
			toLogin(){
			
				uni.reLaunch({
				    url: '../../login/login'
				});
			},
				toTest() {
						uni.navigateTo({
							url: '../../test/test'
						})
					},


		},
	async onLoad() {
		
		let uniIDToken=uni.getStorageSync('uni_id_token');
		let uniIdTokenExpired=uni.getStorageSync('uni_id_token_expired');
		if(!uniIDToken){
			// this.isLoadingShow=false;
			this.toLogin()
			return
		}
		let timestamp=new Date().getTime();
		if(uniIdTokenExpired&&timestamp<uniIdTokenExpired){
			let tokenResult = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					}
				})
				// token是否正确
				if (tokenResult?.result?.code === 0) {
					this.login(tokenResult.result.userInfo);
				}
		}else{
			this.toLogin();
		}
		
		
		
			// this.isLoadingShow=false;
		},
	}
</script>

<style>
	page {
		position: relative;
		background-color: #f8eddb;
	}
</style>
<style lang="scss" scoped>
	// .mask{
	// 	position: fixed;
	// 	top: 0;
	// 	left: 0;
	// 	right: 0;
	// 	bottom: 0;
	// 	background:#ffaa00;
	// z-index: 999;
	// }

	.logo {
		width: 100%;
		height: 600rpx;
	}

	.function-button {
		width: 100%;

		button[type=default] {
			margin: 100rpx 15vw 0;
			width: 70vw;
			background-color: #ffaa00;
			border-radius: 50rpx;
			color: #ffffff;


		}
	}
</style>
