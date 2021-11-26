<template>
	<view class="retrieve">
		<view class="header">
			<view class="title">
				地址信息
			</view>
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item  title="请选择或新建地址"></u-cell-item>
				</u-cell-group>
			</view>
			<view class="title">
				预约信息
			</view>
			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell-item  title="预约日期"></u-cell-item>
					<u-cell-item  title="预约重量"></u-cell-item>
					<u-cell-item icon="error-circle" :arrow="false" hover-class="none" title="请确认您回收的是可支配、合法的物品"></u-cell-item>
				</u-cell-group>
			</view>
		</view>
	
	<view class="footer">
		<view class="title">
			预约须知
		</view>
		<view class="info">
			<view>
				1.由于邮管局规定各快递公司全面推进实名制寄件,
				所以快递小哥上门收件时有可能会让您出示身份证,望您能够配合。
			</view>
			<view>
				2.上门收衣时间9:00-19:00
			</view>
			<view>
				3.旧衣物总重量不足3kg,请您积累到3kg以上方可上门回收哦
			</view>
			<view>
				4.上门收衣的快递小哥会在预约时间段内联系您,进行确认具体的上门时间,
				然后免费上门收取你的旧衣物
			</view>
		</view>
		<button type="default" @click=''>确认提交</button>
	</view>
	
	</view>
	


</template>

<script>
	export default {
		data() {
			return {

			}
		},

		methods: {


		}
	}
</script>

<style lang="scss" scoped>
	.retrieve {
		padding: 10rpx 0;
		width: 100vw;
	}
	.header{
		background-color: #ffffff;
		margin: 5rpx 0;
	}
	.footer{
		background-color: #ffffff;
		margin: 5rpx 0;
		padding: 10rpx 0;
	}
	.title {
	
		font-weight: bold;
		font-size: 30rpx;
		padding: 10rpx 5vw 0;
		line-height: 50rpx;
	}
	.info{
		padding:10rpx 5vw;
		line-height: 50rpx;
		font-size: 14px;
	}
	button[type=default]{
		margin: 40rpx 6vw 40rpx;
		width: 88vw;
	    background-color: #ffaa00;
	    border-radius: 50rpx;
	    color: #ffffff;
	}
</style>
