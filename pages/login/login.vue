<template>
	<view class="content">


		<view class="logo">
			<image src="/static/img/logo.png" style="width: 70vw;margin: 20rpx 15vw;" mode="widthFix"></image>
		</view>	
		<view class="login-info">
			<view class="title">EASY CHANGE</view>
			<view class="title-info">create and enjoy life~</view>
		</view>
		<view class="btn-row">

			<button type="default" class="button-login" open-type="getUserInfo" @click="oneClickLogin()">授权登录</button>

		</view>
		

		<!-- 	<view class="action-row">
			<navigator url="./register">注册账号</navigator>
		</view> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		univerifyLogin,
		univerifyErrorHandler
	} from '@/common/univerify.js'
	import {
		getDeviceUUID
	} from '@/common/utils/utils.js'
	let weixinAuthService;
	const captchaOptions = {
		deviceId: getDeviceUUID(),
		scene: 'login'
	}

	export default {

		data() {
			return {
				platform: uni.getSystemInfoSync().platform,
				userInfo: {},
				username: '',
				password: '',
				positionTop: 0,
				isDevtools: false,
				loading: false,

			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),

			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},

			// 	async loginByPwd() {
			// 		/**
			// 		 * 客户端对账号信息进行一些必要的校验。
			// 		 * 实际开发中，根据业务需要进行处理，这里仅做示例。
			// 		 */
			// 		this.loading = true;
			// 		if (this.username.length < 3) {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: '账号最短为 3 个字符'
			// 			});
			// 			return;
			// 		}
			// 		if (this.password.length < 6) {
			// 			uni.showToast({
			// 				icon: 'none',
			// 				title: '密码最短为 6 个字符'
			// 			});
			// 			return;
			// 		}
			// 		const data = {
			// 			username: this.username,
			// 			password: this.password,
			// 			captcha: this.captchaText,
			// 			...captchaOptions
			// 		};
			// 		uniCloud.callFunction({
			// 			name: 'user-center',
			// 			data: {
			// 				action: 'login',
			// 				params: data
			// 			},
			// 			success: (e) => {
			// 				if (e.result.code == 0) {
			// 					this.needCaptcha = false;

			// 					uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
			// 					uni.setStorageSync('uni_id_token', e.result.token)
			// 					uni.setStorageSync('username', e.result.username)
			// 					uni.setStorageSync('nickName', e.result.nickName)
			// 					uni.setStorageSync('avatar', e.result.avatar)
			// 					uni.setStorageSync('login_type', 'online')
			// 					uni.setStorageSync('uni_id_has_pwd', true)
			// 					this.loading = false;
			// 					this.toHome();

			// 				} else {
			// 					uni.showModal({
			// 						content: e.result.message,
			// 						showCancel: false
			// 					})

			// 					this.needCaptcha = e.result.needCaptcha;
			// 					uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
			// 					if (this.needCaptcha) {
			// 						this.captcha('createCaptcha')
			// 					}
			// 				}
			// 			},
			// 			fail: (e) => {
			// 				uni.showModal({
			// 					content: JSON.stringify(e),
			// 					showCancel: false
			// 				})
			// 			},
			// 			complete: () => {
			// 				this.loginBtnLoading = false
			// 			}
			// 		})

			// 	},

			// 验证
			oauth() {
				return new Promise((resolve, reject) => {

					// #ifdef MP-WEIXIN
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code)
						},
						fail(err) {

							reject(new Error('微信登录失败'))
						}
					})
					// #endif
				})
			},

			getUserProfile() {
				return new Promise((resolve, reject) => {
					if (uni.getUserProfile) {
						uni.getUserProfile({
							desc: "更新用户信息",
							success: (res) => {

								resolve(res.userInfo)
							},
							fail: (err) => {
								reject(err)
							}
						})

					}



				})
			},

			toHome() {
				uni.reLaunch({
					url: '../tabBar/design-home/design-home',
				});
			},
			updateUser(uniIdToken, userInfo) {
				// 更新用户信息
				return new Promise((resolve, reject) => {
					uniCloud.callFunction({
						name: 'user-center',
						data: {
							uniIdToken: uniIdToken,
							action: 'updateUser',
							params: {
								userInfo
							},
						},
						success(res) {
							uni.setStorageSync('nickName', userInfo.nickName)
							uni.setStorageSync('avatar', userInfo.avatarUrl)
							resolve(res)
						},
						fail(err) {
							reject(err);
						}
					})

				})

			},

			async loginByWeixin() {
				uni.showLoading({
					title:'登录中',
					mask:true
				})
				let code = await this.oauth()
				let loginByWeixinResult = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'loginByWeixin',
						params: {
							code
						}
					}
				})


				if (loginByWeixinResult.result.code === 0) {

					uni.setStorageSync('uni_id_token', loginByWeixinResult.result.token)
					uni.setStorageSync('hasLogin', true)
					uni.setStorageSync('uni_id_token_expired', loginByWeixinResult.result.tokenExpired)
					uni.setStorageSync('login_type', 'online')
					await this.updateUser(loginByWeixinResult.result.token, this.userInfo)
					this.loading = false;
					this.login(this.userInfo, loginByWeixinResult.result.token)
					uni.hideLoading()
					this.toHome()
				}
			},

			async oneClickLogin() {
				try{
				this.userInfo= await this.getUserProfile();
						this.loginByWeixin();
					
				}catch(e){
					console.log(e)
				}
				
			}
		},


		onReady() {
			this.initPosition();


			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		}
	}
</script>
<style>
	page{
		background-color: #f8eddb;
	}
</style>
<style  scoped>
	.login-type {
		display: flex;
		justify-content: center;
	}

	.login-type-btn {
		line-height: 30px;
		margin: 0px 15px;
	}

	.login-type-btn.act {
		color: #0FAEFF;
		border-bottom: solid 1px #0FAEFF;
	}



	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
	.logo{
		height: 560rpx;
		width: 100%;
	}

	.login-info{
		position: relative;
		top: 100rpx;
		color: #ffaa00;
		text-align: center;
		height: 200rpx;
		width: 750rpx;
	}
	.title{
		font-size: 35px;
	}
	.title-info{
		font-size: 14px;
	}
	

	
	button[type=default]{
		
		margin: 100rpx 15vw;
		width: 70vw;
	    background-color: #ffaa00;
	    border-radius: 50rpx;
	    color: antiquewhite;
	
	}





	
</style>
