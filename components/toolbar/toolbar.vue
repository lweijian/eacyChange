<template>
	<view class="toolbar" :class="{'toolbar-black': theme === 'dark'}">

		<view>
			<!-- <scroll-view class="scroll-view" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view id="demo1" class="scroll-view-item uni-bg-red">A</view>
				<view id="demo2" class="scroll-view-item uni-bg-green">B</view>
				<view id="demo3" class="scroll-view-item uni-bg-blue">C</view>
			</scroll-view> -->
		</view>
		<!-- <u-tabs name="title" :list="toolArr"  :current="current" @change="change"> </u-tabs> -->
		<view class="pen-section">
			<view class="pen" :style="{backgroundColor: penColor, height: lineWidth}"></view>
			<slider min="1" max="20" :value="lineValue" block-size="20" activeColor="#ff875d" class="pen-slider"
				@change="penWidthChange" />
			<view class="pen-txt">{{lineWidth}}</view>
		</view>
		<view class="tool-section">

			<scroll-view class="scroll-view" scroll-x="true" @scroll="scroll" scroll-left="120">
				<view class="tool-item scroll-view-item" v-for="(item, index) in toolArr" :key="index">
					<block v-if="item.url === 'share'">
						<button open-type="share" class="tool-btn">
							<image class="icon" :src="item.select?item.selectIcon:item.icon" mode="aspectFit"></image>
							<text class="title" :class="{'title-select': item.select}">{{item.title}}</text>
						</button>
					</block>
					<block v-else>
						<button @click="toolItemAction(index)" class="tool-btn">
							<image class="icon" :src="item.select?item.selectIcon:item.icon" mode="aspectFit"></image>
							<text class="title" :class="{'title-select': item.select}">{{item.title}}</text>
						</button>
					</block>
				</view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			theme: {
				type: String,
				default () {
					return 'light';
				}
			},
			toolArr: {
				type: Array,
				default () {
					return [{
						title: '清空',
						icon: '../../static/img/drawCanvas/tool_clear.png',
						selectIcon: '../../static/img/drawCanvas/tool_clear_s.png',
						select: false,
						url: 'clear'
					}, {
						title: '橡皮',
						icon: '../../static/img/drawCanvas/tool_eraser.png',
						selectIcon: '../../static/img/drawCanvas/tool_eraser_s.png',
						select: false,
						url: 'eraser'
					}, {
						title: '画笔',
						icon: '../../static/img/drawCanvas/tool_pen.png',
						selectIcon: '../../static/img/drawCanvas/tool_pen_s.png',
						select: true,
						url: 'pen'
					}, {
						title: '颜色',
						icon: '../../static/img/drawCanvas/tool_color.png',
						selectIcon: '../../static/img/drawCanvas/tool_color_s.png',
						select: false,
						url: 'color'
					}, {
						title: '矩形',
						icon: '../../static/img/drawCanvas/tool_rect.png',
						selectIcon: '../../static/img/drawCanvas/tool_rect_s.png',
						select: false,
						url: 'hollowRect'
					}, {
						title: '圆形',
						icon: '../../static/img/drawCanvas/tool_circle.png',
						selectIcon: '../../static/img/drawCanvas/tool_circle_s.png',
						select: false,
						url: 'hollowCircle'
					}, {
						title: '矩形',
						icon: '../../static/img/drawCanvas/tool_rect_solid.png',
						selectIcon: '../../static/img/drawCanvas/tool_rect_solid_s.png',
						select: false,
						url: 'rect'
					}, {
						title: '圆形',
						icon: '../../static/img/drawCanvas/tool_circle_solid.png',
						selectIcon: '../../static/img/drawCanvas/tool_circle_solid_s.png',
						select: false,
						url: 'circle'
					}, {
						title: '分享',
						icon: '../../static/img/drawCanvas/tool_share.png',
						selectIcon: '../../static/img/drawCanvas/tool_share_s.png',
						select: false,
						url: 'share'
					},, {
						title: '保存',
						icon: '../../static/img/drawCanvas/tool_download.png',
						selectIcon: '../../static/img/drawCanvas/tool_download_s.png',
						select: false,
						url: 'save'
					}]
				}
			},
			penColor: {
				type: String,
				default () {
					return '#091A22';
				}
			}
		},
		data() {
			return {
				old: {
					scrollTop: 0
				},
				current: 0,
				lineWidth: '6px',
				lineValue: 6
			}
		},
		methods: {
			toolItemAction(index) {
				this.$emit('toolItemTap', index);
			},
			penWidthChange(e) {
			
				this.lineWidth = e.detail.value + 'px';
				this.lineValue = e.detail.value;
				this.$emit('penWidthChange', this.lineValue);
			},
			change(index) {
				this.current = index;
			},
			scroll: function(e) {
				
				this.old.scrollTop = e.detail.scrollTop
			},
		}
	}
</script>

<style lang="scss">
	.toolbar {
		background-color: #fff;

		.pen-section {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 0 20upx;
			height: 25px;

			.pen {
				width: 80upx;
				border-radius: 5upx;
			}

			.pen-slider {
				width: 60%;
			}

			.pen-txt {
				font-size: 28upx;
			}
		}

		.tool-section {
			// display: flex;
			// flex-wrap: wrap;
			height: 50px;

			.tool-item {
				width: 20%;
				height: 50%;
				margin:10rpx;
				.tool-btn {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
					width: 100%;

					.icon {
						width: 30upx;
						height: 30upx;
					}

					.title {
						font-size: 28upx;
						margin-left: 8upx;
					}

					.title-select {
						color: $uni-theme-color;
					}
				}
			}
		}
	}

	.toolbar-black {
		background-color: #202d1c;
	}

	.scroll-view {
		white-space: nowrap;
		width: 100%;
	}

	.scroll-view-item {
		display: inline-block;
		text-align: center;
		font-size: 36rpx;
	}
</style>
