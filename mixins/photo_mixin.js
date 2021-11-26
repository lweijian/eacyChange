import {
	aliyun_oss_domain,
	BUCKET,
	REGION
} from '@/common/api-config.js'
import {
	pathToBase64,
	base64ToPath
} from 'image-tools'
const OSS = require('ali-oss');

export default {
	data() {
		return {
			certificate: {
				accessKeyId: null,
				accessKeySecret: null,
				bucket: null,
				region: null,
				signature: null,
				policy: null,
			},

		}
	},
	methods: {
		// 获取上传凭证
		async getCertificate() {
			return this.$request({
				name: 'file',
				data: {
					action: 'certificate',
					params: {}
				},
			})
		},
		// 校验图片是否含有违法违规内容
		async imgSecCheck(localPath) {
			const base64Res = await this.getImgBase64(localPath)
			if (base64Res.code !== 200) {
				return base64Res
			}
			// console.log('base64', base64Res)		
			return await this.$request({
				name: 'file',
				dataType: 'json',
				data: {
					action: 'imgSecCheck',
					params: {
						source: base64Res.result
					}
				},
			})
		},
		async getImgBase64(localPath) {
			console.log('localPath', localPath)
			return new Promise((resolve, reject) => {
				uni.getFileSystemManager().readFile({
					filePath: localPath,
					encoding: 'base64',
					success: res => {
						let datas = res.data
						// console.log('datas', datas)
						// const base64 = uni.arrayBufferToBase64(datas)
						resolve({
							code: 200,
							result: datas
						})
					},
					fail: (e) => {
						console.error('getImgBase64 fail', e)
						reject({
							message: 'base64转换出错'
						})
					}
				})
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
		async uploadFile(regionPath, localPath) {
			// 上传前获取凭证
			let certificate
			const certificateRes = await this.getCertificate();
			if (certificateRes.code !== 200) {
				return certificateRes
			} else {
				certificate = certificateRes.result
			}
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: aliyun_oss_domain,
					filePath: localPath,
					name: 'file', // 必须填file。
					formData: {
						key: regionPath,
						success_action_status: 200,
						OSSAccessKeyId:  certificate.accessKeyId,
						policy: certificate.policy,
						signature: certificate.signature
					},
					success(uploadRes) { // filePath、fileId
						// console.log('uploadFile uploadRes:', uploadRes)
						const store = OSS({
							accessKeyId: certificate.accessKeyId,
							accessKeySecret: certificate.accessKeySecret,
							region: certificate.region,
							bucket: certificate.bucket,
						});
						// https和http都出现过，目前未知原因
						const url = store.signatureUrl(regionPath);
						const httpsUrl = 'https:' + url.substring(url.indexOf('/'))
						console.log('url success:', url)
						resolve({
							code:200,
							url: httpsUrl
						})
					},
					fail(e) {
						// 上传失败
						// console.log('uni.uploadFile fail:', e)
						reject({
							code:500,
							message: '上传失败'
						})
					}
				});
			})
		},
		downloadFile(url = null) {
			if (!url) {
				uni.showModal({
					content: '请先选择照片',
					showCancel: false
				})
				return
			}
			uni.showLoading({
				title: '下载中...',
				mask: true
			})
			uni.saveImageToPhotosAlbum({
				filePath: url, //res.tempFilePath,
				success: function(res) {
					uni.showModal({
						content: '已保存至相册',
						showCancel: false
					})
				},
				fail() {
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
				},
				complete() {
					uni.hideLoading()
				}
			});
		},
		async facebody(sourceUrl,type) {
			return this.$request({
				name: 'file',
				data: {
					action: 'facebody',
					params: {
						type,
						sourceUrl: sourceUrl,
					}
				},
			})
		},
		async segmentImg(sourceUrl,type) {
			return this.$request({
				name: 'file',
				data: {
					action: 'segmentImg',
					params: {
						type,
						sourceUrl: sourceUrl,
					}
				},
			})
		},
	}
}
