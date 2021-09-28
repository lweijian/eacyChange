<template>
	<view class="content">
		<view class="tools">
			<input type="button" value="重做" id="redo" @tap='reDo()' />
			<input type="button" value="裁剪" id="btnCut" @tap='cutImg()' />
			<input type="button" value="下载" id="btnDown" @tap='downLoad()' />
			<img id="imgCut" style="width: 100vw; height: 600rpx;" :src='backgroundImageSrc' />
			<canvas id="canvas" @touchstart='touchStartEvent($event)' @touchmove='touchMoveEvent($event)'
				@touchend='touchEndEvent($event)' style="width: 100vw; height: 600rpx;" canvas-id="canvas" />

		</view>
		<!-- 
		<img id="imgCutShow" :src="imgCutShowSrc"> -->
	</view>
</template>

<script>
	import Point from '../../static/js/Point.js'
	export default {
		data() {
			return {
				backgroundImageSrc: "",
				keepBackground: true,
				imgCutShowSrc: "",
				img: {

					id: "imgCut",
					width: 0,
					height: 0
				},
				canvas: {
					id: "canvas",
					width: 0,
					height: 0,
					//坐标点集合
					pointList: [],
					//临时存储坐标点
					tempPointList: [],
					//圆点的触发半径：
					roundR: 10,
					//圆点的显示半径：
					roundRr: 1,
					//当前拖动点的索引值；
					curPointIndex: 0,
					//判断是否点击拖动
					paint: false,
					//判断是否点圆点拖动，并瞬间离开,是否拖动点；
					juPull: false,
					//判断是否闭合
					isClose: false,

				},
			}
		},


		onReady() {


			const query = uni.createSelectorQuery().in(this);
			query.select(`#${this.canvas.id}`).boundingClientRect(data => {
				this.img.height = data.height;
				this.img.width = data.width;
				this.canvas.height = data.height;
				this.canvas.width = data.width;

			}).exec();
		},
		onLoad(obj) {
			this.backgroundImageSrc = obj.backgroundImageSrc;

		},
		methods: {
			// 画线
			drawLine(context, startX, startY, endX, endY) {
				context.moveTo(startX, startY);
				context.lineTo(endX, endY);
				context.stroke();

			},
			// 画圆
			drawArc(context, x, y) {
				context.beginPath();
				context.arc(x, y, this.canvas.roundRr, 360, Math.PI * 2, true);
				context.closePath();
				context.stroke();
			},

			//更新画线
			drawAllLine(context) {
				//画线
				let pointList = this.canvas.pointList;
				if (pointList.length > 1) {
					// 画圈
					for (let i = 0, len = pointList.length; i < len; i++) {
						this.drawArc(context, pointList[i].pointx, pointList[i]
							.pointy);
					}
					// 画线
					for (let i = 0, len = pointList.length; i < len - 1; i++) {
						this.drawLine(context, pointList[i].pointx, pointList[i]
							.pointy, pointList[i + 1].pointx, pointList[i + 1].pointy
						);

					}
				}
			},

			//动态线针：(光标的x,y)
			drawAllMove(context, x, y) {
				if (!this.canvas.isClose) {
					if (this.canvas.pointList.length >= 1) {
						//重画：
						this.clearCanvas(context);
						let pointList = this.canvas.pointList;
						for (let i = 0; i < this.canvas.pointList.length - 1; i++) {
							//画线
							this.drawLine(context, pointList[i].pointx, pointList[i].pointy, pointList[i + 1].pointx,
								pointList[i +
									1].pointy);
							////画圈
							this.drawArc(context, pointList[i].pointx, pointList[i].pointy);
							if (i == this.canvas.pointList.length - 2) {
								this.drawArc(context, pointList[i + 1].pointx, pointList[i + 1].pointy);
							}
						}
						if (pointList.length == 1) {
							this.drawArc(context, pointList[0].pointx, pointList[0].pointy);
						}
						this.drawArc(context, x, y);
						this.drawLine(context, pointList[this.canvas.pointList.length - 1].pointx, pointList[this.canvas
							.pointList
							.length - 1].pointy, x, y);

					}
				}
			},

			//清空画布
			clearCanvas(context) {
				context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			},

			//填充背景色
			fillBackColor(context) {



				context.setFillStyle('white')
				context.fillRect(0, 0, this.canvas.width, this.canvas.height)
				context.globalCompositeOperation = 'destination-out';

				context.beginPath();
				for (let i = 0; i < this.canvas.pointList.length; i++) {
					context.lineTo(this.canvas.pointList[i].pointx, this.canvas.pointList[i].pointy);
				}
				context.closePath();
				context.fill();
				context.globalCompositeOperation = "destination-over";

			},

			//设置初始坐标点
			setOriPoints(context, pointObj) {
				this.clearCanvas(context);
				if (pointObj != null && pointObj.length > 0) {
					this.canvas.pointList = pointObj.concat();
					if (pointObj.length > 1 && pointObj[pointObj.length - 1].pointx === pointObj[0].pointx) {
						this.canvas.isClose = true;
						this.fillBackColor(context);
					} else {
						this.drawAllLine(context);
					}
				}
			},




			//判断结束点是否与起始点重合；
			equalStartPoint(pointList, x, y) {
				if (pointList.length > 2 && Math.abs((x - pointList[0].pointx) * (x - pointList[0].pointx)) + Math.abs((y -
						pointList[0].pointy) * (y - pointList[0].pointy)) <= this.canvas.roundR * this.canvas.roundR) {
					//如果闭合
					this.canvas.isClose = true;
					pointList[pointList.length - 1].pointx = pointList[0].pointx;
					pointList[pointList.length - 1].pointy = pointList[0].pointy;
				} else {
					this.canvas.isClose = false;
				}
			},

			//判断鼠标点是不是在圆的内部：
			roundIn(context, pointList, x, y) {

				if (!this.canvas.juPull) {

					for (let i = 0; i < pointList.length; i++) {

						if (Math.abs((x - pointList[i].pointx) * (x - pointList[i].pointx)) + Math.abs((y - pointList[i]
								.pointy) * (y - pointList[i].pointy)) <= 2.5 * this.canvas.roundR * this.canvas.roundR) {

							//说明点击圆点拖动了；

							this.canvas.juPull = true; //拖动
							this.canvas.curPointIndex = i;
							pointList[i].pointx = x;
							pointList[i].pointy = y;

							//重画：
							this.clearCanvas(context);

							if (this.canvas.isClose) {
								this.fillBackColor(context);
							}
							this.drawAllLine(context);
							return;
						}
					}

				} else { //拖动中

					pointList[this.canvas.curPointIndex].pointx = x;
					pointList[this.canvas.curPointIndex].pointy = y;
					//重画：
					this.clearCanvas(context);
					if (this.canvas.isClose) {
						this.fillBackColor(context);
					}
					this.drawAllLine(context);
				}
			},

			//移动点坐标数组
			movePointArray(pointArray) {
				let smallX = pointArray[0].pointx;
				let smallY = pointArray[0].pointy;
				let bigX = smallX;
				let bigY = smallY;
				let tempArray = new Array();
				for (let i = 1; i < pointArray.length; i++) {
					if (pointArray[i].pointx < smallX) {
						smallX = pointArray[i].pointx;
					}
					if (pointArray[i].pointx > bigX) {
						bigX = pointArray[i].pointx;
					}
					if (pointArray[i].pointy < smallY) {
						smallY = pointArray[i].pointy;
					}
					if (pointArray[i].pointy > bigY) {
						bigY = pointArray[i].pointy;
					}
				}
				for (let i = 0; i < pointArray.length; i++) {
					pointArray[i].pointx -= smallX;
					pointArray[i].pointy -= smallY;
				}
				tempArray[0] = new Point(smallX, smallY);
				tempArray[1] = new Point(bigX, bigY);
				return tempArray;
			},
			// 得到x，y坐标
			getXAndY(event) {
				let x = event.changedTouches[0].x;
				let y = event.changedTouches[0].y
				return {
					x,
					y
				}
			},

			touchMoveEvent(event) {

				let {
					x,
					y
				} = this.getXAndY(event)

				let pointList = this.canvas.pointList
				let context = uni.createCanvasContext('canvas')
				//是不是触屏了
				if (this.canvas.paint) {

					// console.log(x,y)
					if (pointList.length > 0) {
						this.equalStartPoint(pointList, pointList[pointList.length - 1].pointx, pointList[pointList
							.length - 1].pointy);
					}
					this.roundIn(context, pointList, x, y);
				}
				//判断是否在直线上
				//光标移动到线的附近如果是闭合的需要重新划线，并画上新添加的点
				// this.AddNewNode(x, y);
				//添加动态线：
				this.drawAllMove(context, x, y);
				context.draw()
			},
			touchStartEvent(event) {
				let context = uni.createCanvasContext('canvas')
				this.canvas.paint = true;

				//点击判断是否需要在线上插入新的节点：
				if (this.canvas.tempPointList.length > 0) {

					this.canvas.pointList.splice(this.canvas.tempPointList[1].pointx, 0, new Point(this.canvas
						.tempPointList[0].pointx, this.canvas.tempPointList[0].pointy));
					//
					//清空临时数组
					this.canvas.tempPointList.length = 0;
				}


			},
			touchEndEvent(event) {
				let {
					x,
					y
				} = this.getXAndY(event)
				// 画布
				let context = uni.createCanvasContext('canvas')
				let pointList = this.canvas.pointList
				//拖动结束
				this.canvas.paint = false;

				//拖动结束；
				if (this.canvas.juPull) {

					this.canvas.juPull = false;
					this.canvas.curPointIndex = 0;
					//验证抠图是否闭合：闭合，让结束点=开始点；添加标记
					this.equalStartPoint(pointList, pointList[pointList.length - 1].pointx, pointList[pointList.length - 1]
						.pointy);
				} else {

					//如果闭合：禁止添加新的点；
					if (!this.canvas.isClose) { //没有闭合
						pointList.push(new Point(x, y));

						//验证抠图是否闭合：闭合，让结束点=开始点；添加标记
						this.equalStartPoint(pointList, pointList[pointList.length - 1].pointx, pointList[pointList
							.length - 1].pointy);
						//判断是否闭合：
						//重新画；
						if (pointList.length > 1) {
							// 画圈
							for (let i = 0, len = pointList.length; i < len; i++) {
								this.drawArc(context, pointList[i].pointx, pointList[i]
									.pointy);

							}
							// 画线
							for (let i = 0, len = pointList.length; i < len - 1; i++) {
								this.drawLine(context, pointList[i].pointx, pointList[i]
									.pointy, pointList[i + 1].pointx, pointList[i + 1].pointy
								);

							}

						} else {

							this.drawArc(context, pointList[pointList.length - 1].pointx, pointList[pointList.length - 1]
								.pointy);
						}
					} else {
						//闭合
						this.fillBackColor(context)

					}
				}
				//验证是否填充背景：
				if (this.canvas.isClose) {
					this.fillBackColor(context);
					this.drawAllLine(context);
				}
				context.draw()

			},
			//判断是否为空
			notEmptyObj(obj) {
				if (obj !== null && obj !== undefined && obj !== "") {
					return true;
				}
				return false;
			},

			saveImageToPhotosAlbum(filePath) {
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success: () => {
						console.log('保存成功')

					},
					fail: (res) => {
						console.log('保存失败')

					}
				});

			},
			//函数：重做，清空
			reDo() {
				let context = uni.createCanvasContext('canvas')
				this.clearCanvas(context);
				context.draw()
				//清空listPoint();
				this.canvas.pointList.length = 0;
				//isClose闭合重新设为false;
				this.canvas.isClose = false;
			},
			cutImg() {
				let context = uni.createCanvasContext('canvas')
				this.clearCanvas(context);
				context.draw()
				context.setStrokeStyle("#ffffff")
				this.fillBackColor(context)
				this.drawAllLine(context);
				context.draw()
			},
			async downLoad() {
				let tempPointArray = [];
				let tempPointList = [];
				let context = uni.createCanvasContext('canvas')
				if (this.notEmptyObj(this.canvas.pointList) && this.canvas.pointList.length > 1) {
					tempPointList = JSON.parse(JSON.stringify(this.canvas.pointList));
					tempPointArray = this.movePointArray(tempPointList);
				} else {
					uni.showToast({
						title: '请先进行抠图操作'
					})
					return;
				}


				context.beginPath();

				for (let i = 0; i < tempPointList.length; i++) {
					context.lineTo(tempPointList[i].pointx, tempPointList[i].pointy);
				}
				context.lineTo(tempPointList[0].pointx, tempPointList[0].pointy);
				context.clip();
				// 保留背景色
				if (this.keepBackground) {

					uni.getImageInfo({
						src: this.backgroundImageSrc,
						success: (res) => {

							context.drawImage(res.path, tempPointArray[0].pointx * -1, tempPointArray[0]
								.pointy * -1,
								this.img.width, this.img.height);

							context.draw(false, () => {

								uni.canvasToTempFilePath({
									x: 0,
									y: 0,
									width: this.canvas.width,
									height: this.canvas.height,
									destWidth: this.canvas.width,
									destHeight: this.canvas.width,
									canvasId: 'canvas',
									success: (res) => {

										// 在H5平台下，tempFilePath 为 base64
										console.log(res.tempFilePath)
										this.imgCutShowSrc = res.tempFilePath
										this.saveImageToPhotosAlbum(this.imgCutShowSrc)
									}
								})
							})

						}
					})
				} else {
					// 不保留背景色
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: this.canvas.width,
						height: this.canvas.height,
						destWidth: this.canvas.width,
						destHeight: this.canvas.width,
						canvasId: 'canvas',
						success: (res) => {


							this.imgCutShowSrc = res.tempFilePath
							this.saveImageToPhotosAlbum(this.imgCutShowSrc)
						}
					})




				}









			}

		}


	}
</script>

<style>
	.canvasDiv {
		border: 1px dashed #c89191;
	}

	#imgCutShow {
		position: absolute;
		display: none;
		border: 1px dashed #c89191;
		margin: 0px 410px;
	}

	.tools {
		position: absolute;
		clear: both;

	}

	#drawPanel,
	#canvas,
	#imgCut {

		position: absolute;

	}

	#canvas {
		z-index: 2;

	}

	#imgCut {
		z-index: 1;
	}

	#imgCutShow {
		position: absolute;
		bottom: 0;
	}
</style>
