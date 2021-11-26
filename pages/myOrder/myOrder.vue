<template>
	<view>

		<view class="u-tabs">
			<u-tabs :list="tabList" :bar-height='4' :bar-width='75' :bold="false" inactive-color='#a8aaad'
				:active-item-style='activeItemStyle' :bar-style='barStyle' :is-scroll="false" :current="current"
				@change="change"></u-tabs>
		</view>

		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="list.length==0">
					<view class="text">
						没有相关订单
					</view>
				</view>

				<view class="row" v-for="(row,index) in list" :key="index">
					<view class="status">{{statusText[row.status]}}</view>
					<view class="order-info">
						<view class="left">
							<image :src="row.image"></image>
						</view>
						<view class="right">
							<view class="title">
								{{row.title}}
							</view>
							<view class="spec">{{row.spec}}</view>
							<view class="price-number">
								<view class="price">￥{{row.payment/100}}</view>
								x<view class="number">{{row.numner}}</view>
							</view>
						</view>

					</view>
					<view class="detail">
						<view class="number">共{{row.numner}}件商品</view>
						<view class="sum">合计￥<view class="price">{{row.payment/100}}</view>
						</view>
						<view class="nominal">(含运费 ￥{{row.freight/100}})</view>
					</view>
					<view class="btns">
						<block v-if="row.status=='unpaid'">
							<view class="default" @tap="cancelOrder(row)">取消订单</view>
							<view class="pay" @tap="toPayment(row)">付款</view>
						</block>
						<block v-if="row.status=='back'">
							<view class="default" @tap="remindDeliver(row)">提醒发货</view>
						</block>
						<block v-if="row.status=='unreceived'">
							<view class="default" @tap="showLogistics(row)">查看物流</view>
							<view class="pay">确认收货</view>
							<view class="pay">我要退货</view>
						</block>
						<block v-if="row.status=='received'">
							<view class="default">评价</view>
							<view class="default">再次购买</view>
						</block>
						<block v-if="row.status=='completed'">
							<view class="default">再次购买</view>
						</block>
						<block v-if="row.status=='refunds'">
							<view class="default">查看进度</view>
						</block>
						<block v-if="row.status=='cancelled'">
							<view class="default">已取消</view>
						</block>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				barStyle: {
					backgroundColor: 'red'
				},
				activeItemStyle: {

					color: 'black'
				},
				tabList: [{
					id: 0,
					name: '待付款',
					status: 'unpaid'
				}, {
					id: 1,
					name: '待发货',
					status: 'back'
				}, {
					id: 2,
					name: '待收货',
					status: 'unreceived'
				}, {
					id: 3,
					name: '待评价',
					status: 'received'
				}, {
					id: 4,
					name: '待收货',
					status: 'refunds'
				}],
				// 选项卡下标
				current: 0,

				statusText: {
					unpaid: '等待付款',
					back: '等待商家发货',
					unreceived: '商家已发货',
					received: '等待用户评价',
					completed: '交易已完成',
					refunds: '商品退货处理中',
					cancelled: '订单已取消'
				},
				orderList: {
					unpaid: [{
							status: "unpaid",
							_id: 0,
							goods_id: 0,
							image: '/static/img/goods/p1.jpg',
							title: '商品名称商品名称商品名称商品名称商品名称',

							payment: 16800,
							freight: 1200,
							spec: '规格:S码',
							numner: 1,
							
						},
						{
							status: "unpaid",
							_id: 1,
							goods_id: 1,
							image: '/static/img/goods/p1.jpg',
							title: '商品名称商品名称商品名称商品名称商品名称',
							payment: 16800,
							freight: 1200,
							spec: '规格:S码',
							numner: 1,
							
						}
					],

					back: [],
					unreceived: [{
						status: "unreceived",
						_id: 3,
						goods_id: 1,
						image: '/static/img/goods/p1.jpg',
						title: '商品名称商品名称商品名称商品名称商品名称',

						payment: 16800,
						freight: 1200,
						spec: '规格:S码',
						numner: 1,
						
					}],
					received: [{
						status: "received",
						_id: 4,
						goods_id: 1,
						image: '/static/img/goods/p1.jpg',
						title: '商品名称商品名称商品名称商品名称商品名称',

						payment: 16800,
						freight: 1200,
						spec: '规格:S码',
						numner: 1,
					
					}],
					refunds: [{
						status: "refunds",
						_id: 6,
						goods_id: 1,
						image: '/static/img/goods/p1.jpg',
						title: '商品名称商品名称商品名称商品名称商品名称',
						payment: 16800,
						freight: 1200,
						spec: '规格:S码',
						numner: 1,
						total_fee: this.payment * this.number
					}]


				},
				//订单列表 演示数据
				list: [],
				tabbarStatus: 'unpaid'
			};
		},
		methods: {
			change(index) {
				this.current = index;
				this.tabbarStatus = this.tabList[index].status;
				this.list = this.orderList[this.tabbarStatus];
			},
			showLogistics(row) {

			},
			remindDeliver(row) {
				uni.showToast({
					title: '已提醒商家发货'
				})
			},
			cancelOrder(row) {
				uni.showModal({
					title: '取消订单',
					content: '确定取消此订单？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');

							this.doCancelOrder(row._id);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			doCancelOrder(_id) {
				
				let targetOrder = this.orderList['unpaid'][_id];
				console.log(targetOrder)
				targetOrder.status = 'cancelled';
			},
			toPayment(row) {
				//本地模拟订单提交UI效果
				uni.showLoading({
					title: '正在获取订单...'
				})
				let paymentOrder = [];
				paymentOrder.push(row);
				setTimeout(() => {
					uni.setStorage({
						key: 'paymentOrder',
						data: paymentOrder,
						success: () => {

							uni.hideLoading();
							uni.navigateTo({
								url: '../pay/payment/payment?amount=' + row.payment / 100
							})
						}
					})
				}, 500)
			}
		},

		onLoad(option) {

			this.list = this.orderList[this.tabbarStatus];


		},

	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}


	.order-list {
		position: relative;

		padding-top: 20upx;
		width: 100%;

		.list {
			width: 96%;
			margin: 0 4%;

			.onorder {
				width: 100%;
				height: 50vw;
				display: flex;
				justify-content: center;
				align-content: center;
				flex-wrap: wrap;

				image {
					width: 20vw;
					height: 20vw;
					border-radius: 100%;

				}

				.text {
					width: 100%;
					height: 60upx;
					font-size: 28upx;
					color: #444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.row {
				width: calc(100% - 40upx);
				padding: 10upx 20upx;
				border-radius: 10upx;
				background-color: #fff;
				margin-bottom: 20upx;

				.status {
					font-size: 26upx;
					color: #ec652f;
					height: 50upx;
					display: flex;
					align-items: center;
				}

				.order-info {
					width: 100%;
					display: flex;

					.left {
						flex-shrink: 0;
						width: 25vw;
						height: 25vw;

						image {
							width: 25vw;
							height: 25vw;
							border-radius: 10upx;
						}
					}

					.right {
						width: 100%;
						margin-left: 10upx;
						position: relative;

						.title {
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.spec {
							color: #a7a7a7;
							font-size: 22upx;

						}

						.price-number {
							position: absolute;
							bottom: 0;
							width: 100%;
							display: flex;
							justify-content: flex-end;
							font-size: 22upx;
							color: #333;
							display: flex;
							align-items: flex-end;

							.price {
								font-size: 24upx;
								margin-right: 5upx;
							}

						}
					}
				}

				.detail {
					display: flex;
					justify-content: flex-end;
					align-items: flex-end;
					height: 60upx;
					font-size: 26upx;

					.sum {
						padding: 0 8upx;
						display: flex;
						align-items: flex-end;

						.price {
							font-size: 30upx;
						}
					}

				}

				.btns {
					height: 80upx;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					view {
						min-width: 120upx;
						height: 50upx;
						padding: 0 20upx;
						border-radius: 50upx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 28upx;
						margin-left: 20upx;
					}

					.default {
						border: solid 1upx #ccc;
						color: #666;
					}

					.pay {
						border: solid 1upx #ec652f;
						color: #ec652f;
					}
				}
			}
		}
	}
</style>
