<template>
	<view>

		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="getUserInfo.avatar" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{getUserInfo.nickName}}</view>
				<view class="u-font-14 u-tips-color">{{info}}</view>
			</view>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item :arrow='false'>

					<view slot='title' class="info">
						<view class="info-content">公益币：{{charityFund}}元</view>
						<view class="info-content">优惠券：{{coupon}}张</view>
					</view>
				</u-cell-item>

			</u-cell-group>

		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item v-for="item in option" :key='item.id' :icon="item.icon" :title="item.title"
					@click='toDrafts(item.url)'></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="维护上传"></u-cell-item>
				<u-cell-item icon="setting" title="使用说明"></u-cell-item>
				<u-cell-item icon="error-circle" title="退出登录" @click='logout'></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				info: '用户没有编辑简介哦',
				show: true,
				charityFund: 4399,
				coupon: 3,
				option: [{
						id: 1,
						icon: "star",
						title: "草稿箱",
						url: '../../drafts/drafts'
					},
					{
						id: 2,
						icon: "photo",
						title: "订单详情",
						url: '../../myOrder/myOrder'
					},
					{
						id: 3,
						icon: "coupon",
						title: "我的消费",
						url: '../../drafts/drafts'
					}
				]
			}
		},
		computed: {

			...mapGetters([
				'getUserInfo',
			])
		},
		onLoad() {
		},
		onPullDownRefresh() {
			// this.updateInfo()

		},
		methods: {
			...mapMutations(['login']),
			logout() {
				uni.showModal({
				
					content:'是否确认登出',
					success: (res) => {
						if (res.confirm) {
							uniCloud.callFunction({
								name: 'user-center',
								data: {
									action: 'logout'
								},
								success: (res) => {
									uni.removeStorageSync('uni_id_token');
									uni.removeStorageSync('uni_id_token_expired');
									uni.reLaunch({
										url: '../../login/login',
									});
								},
								fail: (err) => {
									console.log(err)
								}
							})
						}
					}
				});


			},
			getUserProfile() {
				return new Promise((resolve, reject) => {
					if (uni.getUserProfile) {
						uni.getUserProfile({
							desc: "更新用户信息",
							success: (res) => {
								console.log(res)
								this.nickName = res.userInfo.nickName;
								this.avatar = res.userInfo.avatarUrl
								resolve(res.userInfo)
							},
							fail: (err) => {
								reject(err)
							}
						})

					}

				})
			},
			updateUser(uniIdToken, userInfo) {
				// 更新数据库用户信息
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						uniIdToken: uniIdToken,
						action: 'updateUser',
						params: {
							userInfo
						}
					},
					success() {
						this.login(userInfo, uniIdToken);
					}
				})

			},
			toDrafts(targetUrl) {
				uni.navigateTo({
					url: targetUrl
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.info {
		display: flex;

		.info-content {
			width: 50vw;
			text-align: center;
		}
	}
</style>
