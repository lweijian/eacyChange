<template>
	<view class="content">
		<u-loading color="red" :show="loading" class="loading"></u-loading>
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>

		</view>
		<view class="btn-row">
			<button type="primary" class="primary"  @tap="loginByPwd">密码登录</button>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="btn-row">

			<button type="primary" class="primary" open-type="getUserInfo" 
				@tap="oneClickLogin()">微信一键登录</button>

		</view>
		<!-- #endif -->

		<view class="action-row">
			<navigator url="./register">注册账号</navigator>
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
	} from '@/common/utils.js'

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
		computed: mapState(['forcedLogin', 'hasLogin', 'univerifyErrorMsg', 'hideUniverify']),
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

			async loginByPwd() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				this.loading = true;
				if (this.username.length < 3) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 3 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				const data = {
					username: this.username,
					password: this.password,
					captcha: this.captchaText,
					...captchaOptions
				};
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'login',
						params: data
					},
					success: (e) => {
						if (e.result.code == 0) {
							this.needCaptcha = false;

							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							uni.setStorageSync('uni_id_token', e.result.token)
							uni.setStorageSync('username', e.result.username)
							uni.setStorageSync('nickName', e.result.nickName)
							uni.setStorageSync('avatar', e.result.avatar)
							uni.setStorageSync('login_type', 'online')
							uni.setStorageSync('uni_id_has_pwd', true)
							this.loading = false;
							this.toHome();

						} else {
							uni.showModal({
								content: e.result.message,
								showCancel: false
							})

							this.needCaptcha = e.result.needCaptcha;
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							if (this.needCaptcha) {
								this.captcha('createCaptcha')
							}
						}
					},
					fail: (e) => {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					},
					complete: () => {
						this.loginBtnLoading = false
					}
				})

			},
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

				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				uni.reLaunch({
					url: '../tabBar/design-home/design-home',
				});
			},
			updateUser(uniIdToken, userInfo) {
				// 更新用户信息
				return new Promise((resolve,reject)=>{
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
						fail(err){
							reject(err);
						}
					})
					
				})
				
			},

			async loginByWeixin() {
				this.loading = true;
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
					uni.setStorageSync('uni_id_token_expired', loginByWeixinResult.result.tokenExpired)
					uni.setStorageSync('login_type', 'online')
					await	this.updateUser(loginByWeixinResult.result.token,this.userInfo)
					this.loading = false;
					this.toHome()
				}
			},

			async oneClickLogin() {
			
				this.userInfo= await this.getUserProfile();
				if(this.userInfo){
					this.loginByWeixin();
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





	.loading {
		position: absolute;
		top: 49vh;
		left: 49vw;
	}
</style>
