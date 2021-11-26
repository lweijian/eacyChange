<template>
	<view class="content" :style="{width: SCREEN_WIDTH+'px',height: height+'px'}">
		<view id="wrap" class="image-wrap" :style="{width: img_width+'px',height: img_height+'px'}">
			<!-- <u-image width="100%" height="300rpx" :src="src"></u-image> -->
			<canvas class="canvas-target" canvas-id="canvas-target" :style="{width: img_width+'px',height: img_height+'px',right:-(img_width+SCREEN_WIDTH)+'px'}"
			 ></canvas>
			<image v-if="bgImg" id="handle_photo" @touchend="touchEndAll" @touchstart="touchStartPhoto" @touchmove="touchMove"
			 class="source-img" :src="bgImg" mode="widthFix"></image>
			<image v-if="!bgImg" id="handle_photo" @touchend="touchEndAll" @touchstart="touchStartPhoto" @touchmove="touchMove" class="source-img" :style="'width: 300px;height: 350px;'+'background-color:'+backgroundColor+';'"
			 mode="widthFix"></image>
			<image @touchstart.stop="touchStartAll" @touchmove.stop="touchMove" v-for="(mask) in addMaskList" :key="mask.id" :id="'mask'+mask.id"
			 class="mask" :class="{ 'mask-with-border': mask.editing }" :src="mask.url" :style="{opacity:mask.alpha , top: mask.center.y - mask.size.height / 2 + 'px', left: mask.center.x - mask.size.width / 2 + 'px', transform: 'rotate(' + mask.rotate + 'deg)' + 'scaleX(' + mask.scale.width + ')'+ 'scaleY(' + mask.scale.height + ')'}"></image>
			<image @touchstart.stop="touchStartAll" @touchmove.stop="touchMove" class="rotate" :class="{ 'hide-handle': !(editMask.editing) }"
			 :style="{ top: editMask.rotateCenter.y - 10 + 'px', left: editMask.rotateCenter.x - 10 + 'px' }" id="rotate" src="../../static/img/rotate.png"></image>
			<image @touchstart.stop="touchStartAll" @touchmove.stop="touchMove" class="shrink" :class="{ 'hide-handle': !(editMask.editing) }"
			 :style="{ top: editMask.shrinkCenter.y - 10 + 'px', left: editMask.shrinkCenter.x - 10 + 'px' }" id="shrink" src="../../static/img/shrink.png"></image>
		</view>

		<view class="toolbar-box" :style="{ height: toolbarHeight + 'px' }">
			<view class="toolbar">
<!-- 				<view v-if="editMask.editing" class="scroll-view-item_H not-active-text" @click="setAlpha()">透明度
					<slider activeColor="#F0AD4E" style="display: inline-block;width: 450rpx;" :value="editMask.alpha" block-size="20"
					 @change="setAlpha" step="0.01" min="0" max="1" show-value /> -->
				</view>
				<view v-if="editMask.editing" class="scroll-view-item_H active-text" @click="clear()">清除贴纸</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		v4 as uuidv4
	} from 'uuid'
	import {
		_throttle
	} from '../../common/utils/utils.js'
	const sysInfo = uni.getSystemInfoSync();
	const isIphoneX = sysInfo.model.search('iPhone X') !== -1 || sysInfo.model.search('iPhone 11') !== -1
	const paddingBottom = isIphoneX ? 30 : 0;
	const bottomNavHeight = 40;
	const toolbarHeight = 40;
	const SCREEN_WIDTH = sysInfo.windowWidth
	const SCREEN_HEIGHT = sysInfo.windowHeight - bottomNavHeight - toolbarHeight - paddingBottom - 40

	export default {
		props: {
			height: {
				type: Number,
				default: SCREEN_HEIGHT
			},
			selectedFilePath: {
				type: String,
				default: ''
			},
			bgColor: {
				type: String,
				default: ''
			},
			maskList: {
				type: Array,
				default: () => [{
					id: 1,
					url: ''
				}]
			}
		},
		data() {
			return {
				SCREEN_WIDTH, // 图片容器宽度,
				SCREEN_HEIGHT,
				img_width: SCREEN_WIDTH,
				img_height: this.height || SCREEN_HEIGHT,
				bottomNavHeight: bottomNavHeight,
				toolbarHeight: toolbarHeight,
				canvasCtx: null,
				addMaskList: [],
				editMask: this.getNewMask(),
				bgImg: this.selectedFilePath,
				bgImgInfo: null,
				backgroundColor: this.bgColor,
			};
		},
		watch: {
			selectedFilePath: function(val) {
				this.bgImg = val;
				if(val){
					setTimeout(() => {
						const _this = this
						const query = uni.createSelectorQuery().in(this);
						query.select('#handle_photo').boundingClientRect(data => {
							_this.img_width = data.width
							_this.img_height = data.height
							_this.bgImgInfo = data
						}).exec()
					}, 100)
				}

			},
			bgColor: function(val) {
				this.backgroundColor = val
			},
		},
		mounted() {
			console.log('mounted')
			this.canvasCtx = uni.createCanvasContext('canvas-target', this);
			this.$on('save', function() {
				console.log('onsave')
				this.save()
			})
		},
		methods: {
			getNewMask() {
				return { // 贴图层
					id: '',
					editing: false,
					url: '',
					scale: {
						width: 1,
						height: 1,
					}, // 缩放比例
					rotate: 0, // 旋转角度
					alpha: 1,
					size: {
						width: 100,
						height: 100,
					},
					center: { // 贴图层中心点坐标
						x: this.img_width / 2,
						y: this.img_height / 2
					},
					leftTopPoint: {
						x: (this.img_width - 100) / 2,
						y: (this.img_height - 100) / 2
					},
					start: {
						x: null,
						y: null,
					},
					rotateCenter: {
						x: (this.img_width + 100) / 2,
						y: (this.img_height - 100) / 2
					},
					shrinkCenter: {
						x: (this.img_width + 100) / 2,
						y: (this.img_height + 100) / 2
					}
				} // 正在编辑的贴纸
			},
			setAlpha(e) {
				console.log('e', e)
				const index = this.addMaskList.findIndex(item => item.id === this.editMask.id)
				this.editMask.alpha = e.detail.value
				this.addMaskList[index].alpha = e.detail.value
			},
			clear() {
				this.addMaskList = this.addMaskList.filter(item => item.id !== this.editMask.id)

				this.editMask.id = ''
				this.editMask.editing = false
				this.$emit('clear')
			},
			touchStartAll(e) {
				if(e.target.id!=='handle_photo'){
					e.preventDefault()
				}
				if (e.target.id.includes('mask')) {
					const id = e.target.id.substring(4)
					const index = this.addMaskList.findIndex(item => item.id === id)
					this.editMask.editing = true
					this.addMaskList.map((item, i) => {
						if (i === index) { //正在编辑此mask
							item.editing = true
							this.editMask = item
						} else {
							item.editing = false
						}
					})
				}
				if (e.target.id != "") {
					let editMask
					if (e.target.id.includes('mask')) {
						const id = e.target.id.substring(4)
						const index = this.addMaskList.findIndex(item => item.id === id)
						editMask = this.addMaskList[index];
					} else {
						editMask = this.editMask
					}
					const i = this.addMaskList.findIndex(item => item.id === editMask.id)
					editMask.start.x = e.touches[0].clientX
					editMask.start.y = e.touches[0].clientY
					this.addMaskList[i] = editMask
				}
			},
			touchMove(e) {
				if (e.target.id !== 'handle_photo') {
					e.preventDefault()
				}
				_throttle(this.touchMoveAll(e), 400)
			},
			touchMoveAll: function(e) {
				let editMask
				if (e.target.id.includes('mask')) {
					const id = e.target.id.substring(4)
					const index = this.addMaskList.findIndex(item => item.id === id)
					editMask = this.addMaskList[index];
					// console.log('editMask', index)
				} else {
					editMask = this.editMask
				}
				const i = this.addMaskList.findIndex(item => item.id === editMask.id)

				// 触摸点
				const old_x = editMask.start.x
				const old_y = editMask.start.y
				const current_x = e.touches[0].clientX
				const current_y = e.touches[0].clientY
				// 伸缩比例
				const old_scale = editMask.scale;
				const old_rotate = editMask.rotate;
				const moved_x = current_x - editMask.start.x //滑动距离x
				const moved_y = current_y - editMask.start.y //滑动距离y
				// 正在编辑的mask的中心点
				const old_center_x = editMask.center.x
				const old_center_y = editMask.center.y
				// 伸缩操作点
				const old_shrink_center_x = editMask.shrinkCenter.x
				const old_shrink_center_y = editMask.shrinkCenter.y
				const new_shrink_center_x = old_shrink_center_x + moved_x
				const new_shrink_center_y = old_shrink_center_y + moved_y
				// 旋转操作点
				const old_rotate_center_x = editMask.rotateCenter.x
				const old_rotate_center_y = editMask.rotateCenter.y
				const new_rotate_center_x = old_rotate_center_x + moved_x
				const new_rotate_center_y = old_rotate_center_y + moved_y
				if (e.target.id.includes('mask')) {
					editMask.center.x = old_center_x + moved_x
					editMask.center.y = old_center_y + moved_y
					editMask.shrinkCenter.x = new_shrink_center_x
					editMask.shrinkCenter.y = new_shrink_center_y
					editMask.rotateCenter.x = new_rotate_center_x
					editMask.rotateCenter.y = new_rotate_center_y
					editMask.start.x = current_x
					editMask.start.y = current_y
				} else if (e.target.id.includes('shrink')) {
					// 得到拉伸点到中心点的距离，可算出伸缩比例
					// console.log(this.editMask.rotate)
					const diff_x_old = old_shrink_center_x - editMask.center.x
					const diff_y_old = old_shrink_center_y - editMask.center.y
					const diff_x_new = new_shrink_center_x - editMask.center.x
					const diff_y_new = new_shrink_center_y - editMask.center.y
					const distance_old = Math.sqrt(diff_x_old * diff_x_old + diff_y_old * diff_y_old)
					const distance_new = Math.sqrt(diff_x_new * diff_x_new + diff_y_new * diff_y_new)
					const jiaodu_new = (Math.atan2(diff_y_new, diff_x_new) / Math.PI) * 180 - editMask.rotate
					const jiaodu_old = (Math.atan2(diff_y_old, diff_x_old) / Math.PI) * 180 - editMask.rotate
					const width_new = distance_new * Math.cos(jiaodu_new * (Math.PI / 180))
					const height_new = distance_new * Math.sin(jiaodu_new * (Math.PI / 180))
					const width_old = distance_old * Math.cos(jiaodu_old * (Math.PI / 180))
					const height_old = distance_old * Math.sin(jiaodu_old * (Math.PI / 180))

					const width_scale = (width_new / width_old) * old_scale.width
					const height_scale = (height_new / height_old) * old_scale.height

					// if (width_scale >= 0.2 && height_scale >= 0.2) {
					editMask.scale.width = width_scale
					editMask.scale.height = height_scale
					editMask.shrinkCenter.x = new_shrink_center_x
					editMask.shrinkCenter.y = new_shrink_center_y

					// 计算旋转点位置(拉伸时x,x1,y,y1平行)
					const distance_r = Math.sqrt(editMask.size.width * editMask.size.width * width_scale * width_scale +
						editMask.size.height * editMask.size.height * height_scale * height_scale) //旋转半径
					const jiaodu = (Math.atan2(height_scale, width_scale) / Math.PI) * 180
					const rotate_x = Math.cos((jiaodu - editMask.rotate) * (Math.PI / 180)) * distance_r
					const rotate_y = Math.sin((jiaodu - editMask.rotate) * (Math.PI / 180)) * distance_r
					editMask.rotateCenter.x = old_center_x + rotate_x / 2
					editMask.rotateCenter.y = old_center_y - rotate_y / 2

					editMask.start.x = current_x
					editMask.start.y = current_y
					// }

					// console.log('this.editMask.scale:',distance_old,distance_new,this.editMask.scale)
				} else if (e.target.id.includes('rotate')) {
					// console.log('old_center_x:', old_center_x, old_center_y)
					// 得到旋转点到中心点的距离，可算出旋转角度
					const diff_rotate_x_old = old_rotate_center_x - old_center_x
					const diff_rotate_y_old = old_rotate_center_y - old_center_y
					const diff_rotate_x_new = new_rotate_center_x - old_center_x
					const diff_rotate_y_new = new_rotate_center_y - old_center_y

					const distance_r = Math.sqrt(editMask.size.width * editMask.size.width * old_scale.width * old_scale.width +
						editMask.size.height * editMask.size.height * old_scale.height * old_scale.height) //旋转半径

					const angle_old = (Math.atan2(diff_rotate_y_old, diff_rotate_x_old) / Math.PI) * 180
					const angle_new = (Math.atan2(diff_rotate_y_new, diff_rotate_x_new) / Math.PI) * 180
					const rotate = angle_new - angle_old + old_rotate
					editMask.rotate = rotate
					const jiaodu = (Math.atan2(old_scale.height, old_scale.width) / Math.PI) * 180
					const rotate_x = Math.cos((jiaodu - rotate) * (Math.PI / 180)) * distance_r
					const rotate_y = Math.sin((jiaodu - rotate) * (Math.PI / 180)) * distance_r
					// console.log('rotate:x:y', rotate, rotate_x, rotate_y)
					editMask.rotateCenter.x = old_center_x + rotate_x / 2
					editMask.rotateCenter.y = old_center_y - rotate_y / 2

					// 计算收缩点位置
					const shrink_x = Math.cos((jiaodu + rotate) * (Math.PI / 180)) * distance_r
					const shrink_y = Math.sin((jiaodu + rotate) * (Math.PI / 180)) * distance_r
					editMask.shrinkCenter.x = old_center_x + shrink_x / 2
					editMask.shrinkCenter.y = old_center_y + shrink_y / 2
					editMask.start.x = current_x
					editMask.start.y = current_y
				}
				this.addMaskList[i] = editMask
			},
			touchEndAll(e) {

			},
			touchStartPhoto() {
				this.editMask.editing = false
				this.addMaskList.map(item => {
					item.editing = false
					return item
				})

			},
			async getImgInfo(path) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: path,
						success: function(imgInfo) {
							resolve({
								code: 200,
								imgInfo
							})
						},
						fail(err) {
							console.log(err)
							reject('获取图片信息失败' + err)
						}
					});
				})
			},
			//从网络图片添加mask
			selectMask(mask, clear = false) {
				console.log('mask:', mask)
				const _this = this
				let src = mask.url
				if (src.includes('https://')) {
					src = src + '!mobile_edit'
				}
				uni.getImageInfo({
					src: src,
					success: function(_imgInfo) {
						// console.log('_imgInfo',_imgInfo)
						const editMask = _this.getNewMask();
						editMask.url = _imgInfo.path;
						editMask.id = uuidv4();
						editMask.editing = true;
						editMask.sourceWidth = _imgInfo.width;
						editMask.sourceHeight = _imgInfo.height;
						let addMaskList
						if (clear) {
							addMaskList = []
						} else {
							addMaskList = _this.addMaskList
							addMaskList.map(item => {
								item.editing = false
							})
						}
						addMaskList.push(editMask)
						_this.addMaskList = addMaskList
						_this.editMask = editMask
					},
					fail(err) {
						console.error(err)
					}
				});
			},
			//从本地图片添加mask
			addLocalMask(localPath, clear = false) {
				const editMask = this.getNewMask();
				editMask.url = localPath;
				editMask.id = uuidv4();
				editMask.editing = true;
				let addMaskList
				if (clear) {
					addMaskList = []
				} else {
					addMaskList = this.addMaskList
					addMaskList.map(item => {
						item.editing = false
					})
				}

				addMaskList.push(editMask)
				this.addMaskList = addMaskList
				this.editMask = editMask
			},
			async save() {
				if (!this.bgImg && this.addMaskList.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择图片或贴纸'
					})
					return
				}

				const data = this.bgImgInfo
				const _this = this
				_this.canvasCtx.clearRect(0, 0, this.img_width, this.img_height)
				if (_this.bgColor) {
					_this.canvasCtx.setFillStyle(_this.bgColor)
					_this.canvasCtx.fillRect(0, 0, _this.img_width, _this.img_height)
				}
				if (_this.bgImg) {
					// console.log('imgInfo', imgInfo)
					console.log('data', data)
					console.log('_this.img_height', _this.img_height)
					_this.canvasCtx.drawImage(_this.bgImg, 0, 0, data.width, data.height)
				}
				// // 画贴纸
				for (let mask of _this.addMaskList) {
					const mask_width = mask.size.width * mask.scale.width
					const mask_height = mask.size.height * mask.scale.height
					const mask_center_x = mask.center.x
					const mask_center_y = mask.center.y
					_this.canvasCtx.translate(mask.center.x, mask.center.y)
					_this.canvasCtx.rotate((mask.rotate * Math.PI) / 180)
					_this.canvasCtx.setGlobalAlpha(mask.alpha)
					_this.canvasCtx.drawImage(mask.url, -mask_width / 2, -mask_height / 2, mask_width, mask_height)
					// _this.canvasCtx.drawImage(mask.url, 0,0,mask.sourceWidth,mask.sourceHeight,-mask_width / 2, -mask_height / 2, mask_width, mask_height)
					_this.canvasCtx.rotate(-(mask.rotate * Math.PI) / 180)
					_this.canvasCtx.translate(-mask.center.x, -mask.center.y)
				}
				// console.log('_this.canvasCtx---', _this.canvasCtx)
				//总体绘画出来保存到相册
				_this.canvasCtx.draw(false, function() {
					// console.log('draw', data)
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: data && data.width || _this.img_width,
						height: data && data.height || _this.img_height,
						canvasId: 'canvas-target',
						success: function(res) {
							// 在H5平台下，tempFilePath 为 base64
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function(res) {
									uni.showModal({
										content: '已保存至相册',
										showCancel: false
									})
								},
								fail(e) {
									uni.authorize({
										scope: 'scope.writePhotosAlbum',
										success: (res) => {
											console.log('11111');
										},
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
									// console.error('saveImageToPhotosAlbum', e)
								},
								complete() {
									// uni.hideLoading()
								}
							});
						},
						fail(e) {
							console.error('canvasToTempFilePath', e)
						},
						complete() {
							// _this.canvasCtx.clearRect(0, 0, _this.img_width, _this.img_height)
						 //    _this.canvasCtx.draw()
						}
					}, _this)
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		position: relative;
		overflow: auto;
		margin: 100rpx 0;
	}

	.image-wrap {
		overflow: hidden;
		// display: inline;
		position: relative;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;

		.source-img, {
			// display: inline;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			// background-color: #18B566;
		}
		.canvas-target {
			position: absolute;
			// background-color: #18B566;
		}

		.mask {
			height: 100px;
			width: 100px;
			box-sizing: border-box;
			position: absolute;
			border: 1px dashed rgba(255, 255, 255, 0.0);
		}

		.mask-with-border {
			border: dashed 1px white !important;
		}

		.rotate,
		.shrink {
			position: absolute;
			width: 40rpx;
			height: 40rpx;
			background: #666;
			border-radius: 50%;
		}

		.hide-handle {
			display: none;
		}

		.canvas-target {
			visibility: hidden;
		}
	}

	.toolbar-box {
		width: 100%;
		position: fixed;
		top: 90px;

		.toolbar {
			height: 40px;
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
	}
</style>
