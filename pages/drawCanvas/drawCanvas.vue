<template>
	<view class="board-container">
		<Toolbar :penColor="currentColor" @penWidthChange="penWidthChangeHandler" @toolItemTap="toolItemTapHandler" :toolArr="toolArr"></Toolbar>
		
		<view class="board" :class="{'board-out':colorPanelShow}">
			
			<canvas class="board-canvas" canvas-id="drawCanvas" disable-scroll="true"
			 @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"></canvas>
			
		</view>
		<ColorPanel @colorPickTap="colorPickTapHandler" :colorPanelShow="colorPanelShow"></ColorPanel>
	</view>
</template>

<script>

	import Toolbar from '../../components/toolbar/toolbar.vue'
	import ColorPanel from '../../components/colorPanel/color-panel.vue'
	import {
		customPrint
	} from '../../common/utils/utils.js'
	export default {
		components: {
		
			Toolbar,
			ColorPanel
		},
		data() {
			return {
				backgroundImageSrc:"",
				colorPanelShow: false,
				drawInfos: [],
				curDrawArr: [],
				startX: 0,
				startY: 0,
				drawContext: {},
				currentColor: '#091A22',
				begin: false,
				bgColor: 'white',
				toolArr: [{
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
				}, {
					title: '保存',
					icon: '../../static/img/drawCanvas/tool_download.png',
					selectIcon: '../../static/img/drawCanvas/tool_download_s.png',
					select: false,
					url: 'save'
				}],
				lineWidth: 6,
				penMode: true,
				rectMode: false,
				hollowRectMode: false,
				circleMode: false,
				hollowCircleMode: false,
				lastHollowRect: {},
				lastHollowCircle: {}
			}
		},
		onLoad(obj) {
			this.backgroundImageSrc=obj.backgroundImageSrc
			this.drawContext = uni.createCanvasContext('drawCanvas');
			this.initBoard();
			this.fillBackground(this.drawContext);
		},
		methods: {
			
			colorPickTapHandler(obj) {
				customPrint('我点击的颜色:' + JSON.stringify(obj));
				this.colorPanelShow = false;
				this.toolArr.forEach(item => {
					item.select = false;
					if (item.title === '画笔') {
						item.select = true;
					}
				})
				this.rectMode = false;
				this.hollowRectMode = false;
				this.circleMode = false;
				this.hollowCircleMode = false;
				this.penMode = true;
				this.currentColor = obj.color;
				this.drawContext.strokeStyle = obj.color;
			},
			penWidthChangeHandler(width) {
				this.lineWidth = width;
				customPrint('画笔宽度:' + width);
				this.drawContext.setLineWidth(width);
			},
			toolItemTapHandler(index) {
				const that = this;
				let url = this.toolArr[index]['url'];
				switch (url) {
					case 'clear':
						this.clearDrawBoard();
						break;
					case 'eraser':
						this.drawContext.strokeStyle = this.bgColor;
						this.colorPanelShow = false;
						break;
					case 'pen':
						this.drawContext.strokeStyle = this.currentColor;
						this.colorPanelShow = false;
						this.rectMode = false;
						this.hollowRectMode = false;
						this.circleMode = false;
						this.hollowCircleMode = false;
						this.penMode = true;
						break;
					case 'color':
						this.colorPanelShow = !this.colorPanelShow;
						// this.drawMode = this.colorPanelShow ? false : true;
						break;
					case 'save':
						uni.canvasToTempFilePath({
							canvasId: 'drawCanvas',
							success: function(res) {
								customPrint('回调参数:' + JSON.stringify(res));
								// 在H5平台下，tempFilePath 为 base64
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: function(res) {
										customPrint('成功回调参数:' + JSON.stringify(res));
										that.$api.msgSuccess('保存成功');
									},
									fail: function(res) {
										customPrint('失败回调参数:' + JSON.stringify(res));
										// that.$api.msgSuccess('保存成功');
									}
								});
							}
						})
				
						break;
					case 'hollowRect':
						this.hollowRectMode = true;
						this.rectMode = false;
						this.circleMode = false;
						this.hollowCircleMode = false;
						this.penMode = false;
						this.colorPanelShow = false;
						this.drawContext.strokeStyle = this.currentColor;
						// this.drawContext.restore();
						break;
					case 'hollowCircle':
						this.hollowRectMode = false;
						this.rectMode = false;
						this.circleMode = false;
						this.hollowCircleMode = true;
						this.penMode = false;
						this.colorPanelShow = false;
						this.drawContext.strokeStyle = this.currentColor;
						break;
					case 'rect':
						this.hollowRectMode = false;
						this.rectMode = true;
						this.circleMode = false;
						this.hollowCircleMode = false;
						this.penMode = false;
						this.colorPanelShow = false;
						this.drawContext.strokeStyle = this.currentColor;
						break;
					case 'circle':
						this.hollowRectMode = false;
						this.rectMode = false;
						this.circleMode = true;
						this.hollowCircleMode = false;
						this.penMode = false;
						this.colorPanelShow = false;
						this.drawContext.strokeStyle = this.currentColor;
						break;
					default:
						break;
				}
				if (url === 'clear' || url === 'save' || url === 'share') {
					return;
				}
				this.toolArr.forEach((item, indexPath) => {
					item.select = false;
					if (indexPath === index) {
						item.select = true;
					}
				})
			},
			clearDrawBoard() {
				this.initBoard();
				this.fillBackground(this.drawContext);
			},
			initBoard() {
				this.drawContext.setLineCap('round') // 让线条圆润
				this.drawContext.strokeStyle = this.currentColor;
				this.drawContext.setLineWidth(this.lineWidth);
			},
			touchStart(e) {
				customPrint('我能够进行绘制');
				if (this.penMode) {
					this.lineBegin(e.touches[0].x, e.touches[0].y)
				} else if (this.rectMode) {
					this.rectBegin(e.touches[0].x, e.touches[0].y)
				} else if (this.hollowRectMode) {
					this.hollowRectBegin(e.touches[0].x, e.touches[0].y)
				} else if (this.hollowCircleMode) {
					this.hollowCircleBegin(e.touches[0].x, e.touches[0].y)
				} else if (this.circleMode) {
					this.circleBegin(e.touches[0].x, e.touches[0].y)
				}
				this.curDrawArr.push({
					x: e.touches[0].x,
					y: e.touches[0].y
				});
			},
			touchMove(e) {
				if (this.begin) {
					if (this.penMode) {
						this.lineAddPoint(e.touches[0].x, e.touches[0].y);
						this.draw(true);
					} else if (this.rectMode) {
						this.drawRect(e.touches[0].x, e.touches[0].y, true);
					} else if (this.hollowRectMode) {
						this.drawHollowRect(e.touches[0].x, e.touches[0].y, true);
					} else if (this.hollowCircleMode) {
						this.drawHollowCircle(e.touches[0].x, e.touches[0].y, true);
					} else if (this.circleMode) {
						this.drawCircle(e.touches[0].x, e.touches[0].y, true);
					}
					this.curDrawArr.push({
						x: e.touches[0].x,
						y: e.touches[0].y
					});
				}
			},
			touchEnd(e) {
				// console.log('结束的坐标x:' + e.changedTouches[0].x + '结束的坐标y:' + e.changedTouches[0].y );
				if (this.penMode) {
					this.curDrawArr = [];
					this.lineEnd();
				} else if (this.rectMode) {
					this.drawRect(e.changedTouches[0].x, e.changedTouches[0].y, true);
				} else if (this.hollowRectMode) {
					this.drawHollowRect(e.changedTouches[0].x, e.changedTouches[0].y, true);
				} else if (this.hollowCircleMode) {
					this.drawHollowCircle(e.changedTouches[0].x, e.changedTouches[0].y, true);
				} else if (this.circleMode) {
					this.drawCircle(e.changedTouches[0].x, e.changedTouches[0].y, true);
				}
			},
			hollowRectBegin(x, y) {
				this.begin = true;
				this.drawContext.beginPath()
				this.startX = x;
				this.startY = y;
			},
			rectBegin(x, y) {
				this.begin = true;
				this.drawContext.beginPath()
				this.startX = x;
				this.startY = y;
			},
			hollowCircleBegin(x, y) {
				this.begin = true;
				this.drawContext.beginPath()
				this.startX = x;
				this.startY = y;
			},
			circleBegin(x, y) {
				this.begin = true;
				this.drawContext.beginPath()
				this.startX = x;
				this.startY = y;
			},
			/**
			 * 这里是画实体矩形
			 */
			drawRect(x, y, isReverse) {
				let width = (x - this.startX) ? (x - this.startX) : (this.startX - x);
				let height = (y - this.startY) ? (y - this.startY) : (this.startY - y);
				this.drawContext.rect(this.startX, this.startY, width, height);
				this.drawContext.setFillStyle(this.currentColor);
				this.drawContext.fill();
				this.draw(isReverse);
			},
			/**
			 * 这里是画空心矩形
			 * 方法是根据四个坐标点画
			 * 四条线进行连接
			 */
			drawHollowRect(x, y, isReverse) {
				let pointLT = {};
				let pointRB = {};
				let pointRT = {};
				let pointLB = {};
				let center = {};

				pointLT.X = (this.startX <= x) ? this.startX : x;
				pointLT.Y = (this.startY <= y) ? this.startY : y;

				pointRB.X = (this.startX >= x) ? this.startX : x;
				pointRB.Y = (this.startY >= y) ? this.startY : y;

				pointRT.X = pointRB.X;
				pointRT.Y = pointLT.Y;


				pointLB.X = pointLT.X;
				pointLB.Y = pointRB.Y;

				let width = (x - this.startX) ? (x - this.startX) : (this.startX - x);
				let height = (y - this.startY) ? (y - this.startY) : (this.startY - y);
				this.drawContext.rect(this.startX, this.startY, width, height);
				this.drawContext.setStrokeStyle(this.currentColor);
				this.drawContext.stroke();
				this.draw(isReverse);

				this.lastHollowRect = {
					x: this.startX,
					y: this.startY,
					width: Math.abs(width),
					height: Math.abs(height),
					pointLT: pointLT
				}
				this.clearLastHollowRect();
			},
			clearLastHollowRect() {
				customPrint('上一个矩形对象:' + JSON.stringify(this.lastHollowRect));
				this.drawContext.clearRect(this.lastHollowRect.pointLT.X + this.lineWidth / 2, this.lastHollowRect.pointLT.Y + this
					.lineWidth / 2, this.lastHollowRect.width - this.lineWidth, this.lastHollowRect.height - this.lineWidth);
			},
			clearLastHollowCircle(x, y, r, cxt) { //(x,y)为要清除的圆的圆心，r为半径，cxt为context
				var stepClear = 1; //别忘记这一步  
				clearArc(x, y, r);

				function clearArc(x, y, radius) {
					var calcWidth = radius - stepClear;
					var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);

					var posX = x - calcWidth;
					var posY = y - calcHeight;

					var widthX = 2 * calcWidth;
					var heightY = 2 * calcHeight;

					if (stepClear <= radius) {
						cxt.clearRect(posX, posY, widthX, heightY);
						stepClear += 1;
						clearArc(x, y, radius);
					}
				}
			},
			/**
			 * 这里是画
			 * 实心圆
			 */
			drawCircle(x, y, isReverse) {
				let pointLT = {};
				let pointRB = {};
				let pointRT = {};
				let pointLB = {};
				let center = {};

				pointLT.X = (this.startX <= x) ? this.startX : x;
				pointLT.Y = (this.startY <= y) ? this.startY : y;

				pointRB.X = (this.startX >= x) ? this.startX : x;
				pointRB.Y = (this.startY >= y) ? this.startY : y;

				pointRT.X = pointRB.X;
				pointRT.Y = pointLT.Y;


				pointLB.X = pointLT.X;
				pointLB.Y = pointRB.Y;

				center.X = (pointRB.X + pointLT.X) / 2;
				center.Y = (pointRB.Y + pointLT.Y) / 2;

				let dx = pointRB.X - pointLT.X;
				let dy = pointRB.Y - pointLT.Y;
				let r = Math.sqrt(dx * dx + dy * dy) / 2;

				// console.log('圆心坐标:' + JSON.stringify(center));
				// console.log('半径:' + JSON.stringify(r));
				this.drawContext.arc(center.X, center.Y, r, 0, 2 * Math.PI);
				this.drawContext.setFillStyle(this.currentColor);
				this.drawContext.fill();
				// this.drawContext.stroke();
				this.draw(isReverse);
			},
			/**
			 * 这里是画
			 * 空心圆
			 */
			drawHollowCircle(x, y, isReverse) {
				let pointLT = {};
				let pointRB = {};
				let center = {};

				pointLT.X = (this.startX <= x) ? this.startX : x;
				pointLT.Y = (this.startY <= y) ? this.startY : y;

				pointRB.X = (this.startX >= x) ? this.startX : x;
				pointRB.Y = (this.startY >= y) ? this.startY : y;

				center.X = (pointRB.X + pointLT.X) / 2;
				center.Y = (pointRB.Y + pointLT.Y) / 2;

				let dx = pointRB.X - pointLT.X;
				let dy = pointRB.Y - pointLT.Y;
				let r = Math.sqrt(dx * dx + dy * dy) / 2;

				// console.log('圆心坐标:' + JSON.stringify(center));
				// console.log('半径:' + JSON.stringify(r));
				this.drawContext.arc(center.X, center.Y, r, 0, 2 * Math.PI);
				// this.drawContext.setFillStyle(this.currentColor);
				// this.drawContext.fill();
				this.drawContext.stroke();
				
				this.drawContext.beginPath();
				this.drawContext.arc(center.X, center.Y, r - this.lineWidth / 2, 0, 2 * Math.PI);
				this.drawContext.setFillStyle(this.bgColor);
				this.drawContext.fill();
				
				this.draw(isReverse);

				// this.clearLastHollowCircle(center.X, center.Y, r - this.lineWidth / 2, this.drawContext);
			},
			// 开始绘制线条
			lineBegin(x, y) {
				this.begin = true;
				this.drawContext.beginPath()
				this.startX = x;
				this.startY = y;
				this.drawContext.moveTo(this.startX, this.startY)
				this.lineAddPoint(x, y);
			},
			// 绘制线条中间添加点
			lineAddPoint(x, y) {
				this.drawContext.moveTo(this.startX, this.startY)
				this.drawContext.lineTo(x, y);
				this.drawContext.stroke();
				this.startX = x;
				this.startY = y;
			},
			// 绘制线条结束
			lineEnd() {
				this.drawContext.closePath();
				this.begin = false;
			},
		
			fillBackground(context) {
				const query = uni.createSelectorQuery().in(this);
				query.select('.board').boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					context.setFillStyle('transparent');
					context.fillRect(0, 0, data.width, data.height); //TODO context的宽和高待定
					context.fill();
					let imageW = 318;
					let imageH = 288;
					let ImageX = (data.width - 318)/2;
					let ImageY = 80;
					context.drawImage(this.backgroundImageSrc, ImageX, ImageY, 318, 288);
					context.draw();
				}).exec();
			},
			// 绘制canvas
			// isReverse: 是否保留之前的像素
			draw(isReverse = false, cb) {
				this.drawContext.draw(isReverse, () => {
					if (cb && typeof(cb) == "function") {
						cb();
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.board-container {
		height: 100%;
		width: 100%;
		margin-top: 50rpx;
		// position: relative;
		// display: flex;
		// flex-direction: column;

		.board {
			position: fixed;
			top: 145px;
			left: 0;
			bottom: 0;
			right: 0;
			transform: translateY(0);
			display: block;
			
			#imgCut{
				width: 100vw;
				height: 800rpx;
				z-index: 1;
			}
			.board-canvas {
				width: 100%;
				height: 100%;
				z-index: 100;
			}

		}
		
		.board-out {
			transform: translateY(100%);
			display: none;
		}
	}
</style>
