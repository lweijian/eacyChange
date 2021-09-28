<template>
	<view>
		<view class="drafts-header">
			<text class="drafts-title">自动保存草稿</text>
			<u-switch class="drafts-switch" size="40" v-model="checked" active-color="green"></u-switch>
		</view>
		<u-grid :col="3" :border="false">
				<u-grid-item  v-for="item in drafts"  :key=item.id >
				
				<image class="grid-img" :src="item.imgSrc" ></image>
				 
				</u-grid-item>
			</u-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: false,
				drafts:[
					{id:0,name:'test0',imgSrc:"",isChoose:false},
					{id:1,name:'test1',imgSrc:"",isChoose:false},
					{id:2,name:'test2',imgSrc:"",isChoose:false},
					{id:3,name:'test3',imgSrc:"",isChoose:false},
					{id:4,name:'test4',imgSrc:"",isChoose:false},
				]
			};
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss">
	.drafts-header{
		width: 100vw;
		position: relative;
		padding: 10rpx 20rpx;
		height: 100rpx;
		font-size: 14px;
		.drafts-switch{
			position: absolute;
			right: 20rpx;
			top: 10rpx;
		}
	}
.grid-img {
		
		margin: 4rpx 10%;
		width:80%;
		height: 300rpx;
		border: none;
	}
</style>
