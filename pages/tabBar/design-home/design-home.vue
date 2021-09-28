<template>
	<view>
		<view class="function-button">
			<view class="clothes design">
				<u-button shape="circle" type="warning" size="default" @click='toDesign()'>旧衣改造</u-button>
			</view>
			<view class="clothes recycling">
				<u-button shape="circle" type="warning" size="default" @click='toRecycling()'>旧衣回收</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uniIdToken: ""
			};
		},
		methods: {
			toDesign() {

				uni.navigateTo({
					url: '../../design/design'
				})
			},
			toRecycling() {
				uni.navigateTo({
					url: '../../recycling/recycling'
				})
			},
			toLogin(){
			uni.reLaunch({
				url: '../../login/login',
			});
			}
			
		},
	async onLoad() {
		let uniIdToken = uni.getStorageSync('uni_id_token');
		if(uniIdToken){
			//数据成功获取，用户已登录
			let	isTrueToken= await uniCloud.callFunction({
					name: 'user-center',
				data: {
						uniIdToken:uniIdToken,
						action: 'checkToken',
						}
					})
			if(isTrueToken.result.code==0){
				
				uni.setStorageSync('nickName', isTrueToken.result.userInfo.nickname)
				uni.setStorageSync('avatar', isTrueToken.result.userInfo.avatar)
			}else{
				this.toLogin()
			}
		}else{
			this.toLogin()
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
