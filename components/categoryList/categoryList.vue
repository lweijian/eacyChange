<template>
	<!-- 分类列表 -->
	<view class="category-list">
		<view
			class="category"
			v-for="(row, index) in categoryList"
			:key="index"
			@tap="toCategory(row)"
		>
			<view class="img"><image :src="row.img"></image></view>
			<view class="text">{{ row.name }}</view>
		</view>
		</view>
	
</template>

<script>
	export default {
		name:"categoryList",
		props:['categoryList'],
		data() {
			return {
			
			};
		}
	}
</script>

<style lang="scss">
.category-list {
	width: 92%;
	margin: 0 4%;
	padding: 0 0 30upx 0;
	border-bottom: solid 2upx #f6f6f6;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.category {
		width: 25%;
		margin-top: 50upx;
		display: flex;
		flex-wrap: wrap;
		.img {
			width: 100%;
			display: flex;
			justify-content: center;
			image {
				width: 9vw;
				height: 9vw;
			}
		}
		.text {
			margin-top: 16upx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 24upx;
			color: #3c3c3c;
		}
	}
}


</style>
