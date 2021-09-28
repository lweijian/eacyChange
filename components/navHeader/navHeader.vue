<template>
	<view>
		<view>
				<u-navbar  :title="title" >
					<view class="slot-wrap">
						<u-icon :name="iconName"  size="35"></u-icon>
					</view>
				</u-navbar>
				<view class="content">
					<!-- 正文内容 -->
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		name:"navHeader",
		props:{
			title:String,
			iconName:String
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		/* flex: 1; */
		/* 如果您想让slot内容与导航栏左右有空隙 */
		/* padding: 0 30rpx; */
	}
</style>
