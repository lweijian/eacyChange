<template>
	<view class="content">


		<view class="logo">
			<image src="/static/img/bulb.png" style="width: 70vw;margin: 20rpx 15vw;" mode="widthFix"></image>
		</view>
		<view class="login-info">
			<view class="title">EASY CHANGE</view>
			<view class="title-info">create and enjoy life~</view>
		</view>
		<view class="btn-row">

			<button type="default" class="button-login" open-type="getUserInfo" @click="oneClickLogin()">授权登录</button>

		</view>



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

				userInfo: {},
				username: '',
				password: '',

				isDevtools: false,
				loading: false,

			}
		},
		onShow() {
			// #ifdef MP-WEIXIN  
			if (wx.hideHomeButton) {
				wx.hideHomeButton();
			}
			// #endif
		},
		methods: {
			...mapMutations(['login']),
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
					title: '登录中',
					mask: true
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
				try {
					this.userInfo = await this.getUserProfile();
					this.loginByWeixin();

				} catch (e) {
					console.log(e)
				}

			}
		},



	}
</script>
<style>
	page {
		background-color: #f8eddb;
	}
</style>
<style scoped>
	.content {
		margin-top: 200rpx;
	}

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

	.logo {
		height: 560rpx;
		width: 100%;
	}

	.login-info {
		position: relative;
		top: 100rpx;
		color: #ffaa00;
		text-align: center;
		height: 200rpx;
		width: 750rpx;
	}

	.title {
		font-size: 35px;
	}

	.title-info {
		font-size: 14px;
	}



	button[type=default] {

		margin: 100rpx 15vw;
		width: 70vw;
		background-color: #ffaa00;
		border-radius: 50rpx;
		color: antiquewhite;

	}
</style>
