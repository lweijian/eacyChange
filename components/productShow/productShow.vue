<template>
		<!-- 商品列表 -->
		<view class="goods-list">
		
			<view class="product-list">
				<view
					class="product"
					v-for="product in productList"
					:key="product.goods_id"
					@tap="toGoods(product)"
				>
					<image mode="widthFix" :src="product.img"></image>
					<view class="introduce">{{ product.name }}</view>
					<view class="info">
						<view class="author">
							<image class="head-img" src="../../static/img/VIP.png" mode="heightFix"></image>
							<view class="author-name">{{ product.authorName }}</view>
						</view>
						
						<view class="slogan">
							<u-icon name="thumb-up"/>
						{{ product.slogan }}
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
	
</template>

<script>
	export default {
		name:"productShow",
		props:['productList','loadingText'],
		data() {
			return {
		
			};
		},


		methods: {

		
			//商品跳转
			toGoods(e) {
				uni.showToast({ title: '商品' + e.goods_id, icon: 'none' });
				uni.navigateTo({
					url: '../../goods/goods'
				});
			},
		
		}
	}
</script>

<style lang="scss">
.goods-list {
	// background-color: #f4f4f4;
	

	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
	.product-list {
		
		padding: 0 4% 3vw 4%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.product {
			width: 48%;
			border-radius: 20upx;
			background-color: #fff;
			margin: 0 0 15upx 0;
			box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
			image {
				width: 100%;
				border-radius: 20upx 20upx 0 0;
			}
			.introduce {
				width: 92%;
				padding: 8upx 4%;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				text-align: justify;
				overflow: hidden;
				font-size: 30upx;
			}
			.info {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				padding: 10upx 4% 10upx 4%;
				.author{
					display: flex;
					align-items: center;
					.head-img{
						height: 40upx;
						width: 40upx;
						margin: 0 10upx;
						image{
							width: 100%;
							height: 100%;
							border-radius: 100%;
							
						}
					}
					.author-name {
					
						font-size: 12upx;
						
					}
					}
				.slogan {
					color: #807c87;
					font-size: 24upx;
				}
			}
		}
	}
}

</style>
