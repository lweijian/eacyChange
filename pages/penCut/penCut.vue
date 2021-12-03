<template>
	<view class="content">
		<view class="tools">

			<img class="imgCut" style="width: 100vw; height: 60vh;" :src='backgroundImageSrc' />
			<canvas id="canvas" @touchstart='touchStartEvent($event)' @touchmove='touchMoveEvent($event)'
				@touchend='touchEndEvent($event)' style="width: 100vw; height: 60vh;" canvas-id="canvas" />

		</view>
		<view class="cropper-buttons ">
			<view class="op" @click="chooseImage(['album','camera'])">{{backgroundImageSrc?'重新选择':'选择图片'}}</view>
			<view class="op" @click="reDo()">重做</view>

			<view class="op" @click="downLoad()">下载</view>
		</view>
	</view>
</template>

<script>
	// 坐标点的类
	class Point {
		constructor(x, y) {
			this.pointx = x;
			this.pointy = y;
		}
	}
	export default {
		data() {
			return {
				//背景图片
				backgroundImageSrc: "",
				//缓存画布实例
				context: {},
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
					roundRr: 5,
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

				this.canvas.height = data.height;
				this.canvas.width = data.width;

			}).exec();
			this.context = uni.createCanvasContext('canvas');

		},
		onLoad(obj) {
this.backgroundImageSrc = obj.backgroundImageSrc;
		},
		methods: {
			chooseImage(sourceType) {

				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType,
					success: (chooseRes) => {
						this.backgroundImageSrc = chooseRes.tempFilePaths[0]

					}
				});
			},
			// 画线
			drawLine(context, startX, startY, endX, endY) {
				context.moveTo(startX, startY);
				context.lineTo(endX, endY);
				context.stroke();

			},
			// 画圆
			drawArc(context, x, y) {

				context.beginPath();
				context.arc(x, y, this.canvas.roundRr, 0, 2 * Math.PI);
				context.stroke();

			},

			//更新画线
			drawAllLineAndArc(context) {

				//画线
				let pointList = this.canvas.pointList;
				if (pointList.length > 1) {
					// 画圈
					for (let i = 0, len = pointList.length; i < len; i++) {

						this.drawArc(context, pointList[i].pointx, pointList[i].pointy);

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
			//判断是否为空
			notEmptyObj(obj) {
				if (obj !== null && obj !== undefined && obj !== "") {
					return true;
				}
				return false;
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



			//判断结束点是否与起始点重合；
			equalStartPoint(pointList, x, y) {

			let	pointNumber=pointList.length;
				if (pointNumber > 2 && Math.abs((x - pointList[0].pointx) * (x - pointList[0].pointx)) + Math.abs((y -
						pointList[0].pointy) * (y - pointList[0].pointy)) <= this.canvas.roundR * this.canvas.roundR) {
					//如果闭合
					this.canvas.isClose = true;
				}
			// 使得最后一个点和第一个点重叠
				if (this.canvas.isClose === true) {
					pointList[pointNumber - 1].pointx = pointList[0].pointx;
					pointList[pointNumber - 1].pointy = pointList[0].pointy;
				}
			},
			// 再次渲染
			renderAgain() {
				if (this.canvas.isClose) {
					this.fillBackColor(this.context);
				}
				this.drawAllLineAndArc(this.context);
			},
			//判断点击的点是坐标数组中的哪个点
			judgeWhichPoint(pointList, x, y) {
			
			
				for (let i = 0; i < pointList.length; i++) {
					if (Math.abs((x - pointList[i].pointx) * (x - pointList[i].pointx)) + Math.abs((y - pointList[i]
							.pointy) * (y - pointList[i].pointy)) <= 3 * this.canvas.roundR * this.canvas.roundR) {
						
						this.canvas.curPointIndex = i;
						this.renderAgain();
						return;
					}
				}
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
				let pointNumber = pointList.length;
			
				//是不是触屏了
				if (this.canvas.paint) {
					if (pointNumber > 0&&!this.canvas.isClose) {
						this.equalStartPoint(pointList, pointList[pointNumber - 1].pointx, pointList[pointList
							.length - 1].pointy);
					}
					if(this.canvas.isClose){
						pointList[pointNumber - 1].pointx = pointList[0].pointx;
						pointList[pointNumber - 1].pointy = pointList[0].pointy;
						pointList[this.canvas.curPointIndex].pointx = x;
						pointList[this.canvas.curPointIndex].pointy = y;
					}
					this.renderAgain()
					
				}


				//添加动态线：
				this.drawAllMove(this.context, x, y);
				this.context.draw()
			},
			touchStartEvent(event) {
				let {
					x,
					y
				} = this.getXAndY(event)
				this.canvas.paint = true;

				//如果闭合了，判断当前点是抠图点的哪一个
				if (this.canvas.isClose) {
					this.judgeWhichPoint(this.canvas.pointList, x, y)
				}
			},
			touchEndEvent(event) {
				let {
					x,
					y
				} = this.getXAndY(event)
				// 画布

				let pointList = this.canvas.pointList
				//触屏结束
				this.canvas.paint = false;
				
					if (pointList.length < 1) {
						pointList.push(new Point(x, y));
						this.drawArc(this.context, pointList[pointList.length - 1].pointx, pointList[pointList.length -
							1].pointy);
							this.context.draw()
							return
					}
				
					//如果闭合：禁止添加新的点；
					if (!this.canvas.isClose) { //没有闭合
						pointList.push(new Point(x, y));
						//验证抠图是否闭合：闭合，让结束点=开始点；添加标记
						this.equalStartPoint(pointList, pointList[pointList.length - 1].pointx, pointList[pointList
							.length - 1].pointy);
							
					} 
			
				this.renderAgain()
				this.context.draw()

			},

			saveImageToPhotosAlbum(filePath) {


				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success: (res) => {
						uni.showModal({
							content: '已保存至相册',
							showCancel: false
						})

					},
					fail: (e) => {
						// #ifdef MP-WEIXIN
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							fail: (res) => {
								uni.showModal({
									content: '检测到您没打开获取信息功能权限，是否去设置打开？',
									confirmText: "确认",
									cancelText: '取消',
									success: (res) => {
										if (res.confirm) {
											uni.openSetting({
												success: (res) => {
													console.log(res);
												}
											})
										} else {
											console.log('取消');
										}
									}
								})
							}
						})

						// #endif

					},
					complete: () => {
						this.reDo();
					}

				});
			},
			//函数：重做，清空
			reDo() {
				this.context.restore()
				this.clearCanvas(this.context);
				this.context.draw()
				//清空listPoint();
				this.canvas.pointList.length = 0;
				//isClose闭合重新设为false;
				this.canvas.isClose = false;
			},

			async downLoad() {

				let tempPointList = [];
				// let context = uni.createCanvasContext('canvas')
				if (this.notEmptyObj(this.canvas.pointList) && this.canvas.pointList.length > 1) {
					tempPointList = JSON.parse(JSON.stringify(this.canvas.pointList));
					if (!this.canvas.isClose) {
						uni.showToast({
							title: '请闭合抠图点',
							icon: 'error'
						})
						return;
					}
				} else {
					uni.showToast({
						title: '请进行抠图操作',
						icon: 'error'
					})
					return;
				}


				this.context.beginPath();
				this.context.moveTo(tempPointList[0].pointx, tempPointList[0].pointy)
				for (let i = 1; i < tempPointList.length; i++) {
					this.context.lineTo(tempPointList[i].pointx, tempPointList[i].pointy);
				}
				this.context.lineTo(tempPointList[0].pointx, tempPointList[0].pointy);
				this.context.save()
				this.context.clip();
				uni.getImageInfo({
					src: this.backgroundImageSrc,
					success: (res) => {
						this.context.drawImage(res.path, 0, 0,
							this.canvas.width, this.canvas.height);

						this.context.draw(false, () => {

							uni.canvasToTempFilePath({
								x: 0,
								y: 0,
								width: this.canvas.width,
								height: this.canvas.height,
								destWidth: this.canvas.width,
								destHeight: this.canvas.height,
								canvasId: 'canvas',
								success: (res) => {
									// 
									// #ifdef H5

									let url = res.tempFilePath;
									let oA = document.createElement("a");
									oA.download = " "; // 设置下载的文件名，默认是'下载'  
									oA.href = url;
									oA.click();
									document.body.appendChild(oA);
									oA.remove(); // 下载之后把创建的元素删除  
									uni.showToast({
										title: '下载成功',
									})
									console.log('在H5平台下，tempFilePath 为 base64,请自行处理')
									console.log(res.tempFilePath)
									// #endif
									// #ifndef H5
									this.saveImageToPhotosAlbum(res.tempFilePath)
									// #endif


								},
								fail: (err) => {
									this.reDo();
								}
							})
						})

					}
				})
			}

		}


	}
</script>

<style lang="scss" scoped>
	.tools {
		position: absolute;
		clear: both;

	}

	.imgCut {

		position: absolute;
		z-index: 1;
	}

	#canvas {
		z-index: 2;
	}


	.cropper-buttons {
		display: flex;
		position: fixed;
		bottom: 5px;
		height: 60rpx;
		width: 100%;

		.op {
			font-size: 32rpx;
			width: 50%;
			text-align: center;
		}
	}
</style>
