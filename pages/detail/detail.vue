<template>
	<view class="content">
		<view class="banner">
			<u-swiper :list="articles.detailSwiper" border-radius='0' height="400" :autoplay='false' />
			<view class="title-area">
				{{articles.title}}
			</view>
		</view>

		<view class="article-meta">
			<text class="article-meta-text article-author">{{articles.userInfo[0].nickName}}</text>
			<text class="article-meta-text article-text">发表于</text>
			<uni-dateformat class="article-meta-text article-time" :date="articles.publish_date"
				:threshold="[60000, 3600000]"> </uni-dateformat>
		</view>
		<view class="article-content">
			<mp-html :content="articles.content" />
		</view>
		<view class="comment-wrap"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articles: {},

			}
		},
		onLoad(event) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			uniCloud.callFunction({
				name: 'articles',
				data: {
					action: 'getArticleById',
					params: {
						id: event.id
					}
				},
				success: (res) => {
				
					if(res.result.dataSource.data.length===0){
						uni.showToast({
							title: '文章已被删除',
							duration: 600,
							icon:'error'
						});
						setTimeout(()=>{
							uni.navigateTo({
								url: `../creativeSharing/creativeSharing`
							})
						},700)
					}
					this.articles = res.result.dataSource.data[0] || {}
				},
				fail: (err) => {
				
					console.log(err)
				},
				complete: () => {
					uni.hideLoading()
				}
			})


		}
	}
</script>

<style>
	/* #ifndef APP-PLUS */
	page {
		min-height: 100%;
	}

	/* #endif */

	.banner {
		position: relative;
	}

	.title-area {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.3);
		bottom: 0;
		left: 0;
		width: 100%;
		font-size: 28rpx;
		padding: 12rpx 24rpx;
		color: rgba(255, 255, 255, 0.9);
	}



	.title-text {
		font-size: 16px;
		font-weight: 400;
		line-height: 20px;
		lines: 2;
		color: #ffffff;
		overflow: hidden;
	}

	.article-meta {
		padding: 10px 15px;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.article-meta-text {
		color: gray;
	}

	.article-text {
		font-size: 12px;
		line-height: 25px;
		margin: 0 10px;
	}

	.article-author {
		font-size: 15px;
	}

	.article-time {
		font-size: 15px;
	}

	.article-content {
		font-size: 15px;
		padding: 0 15px;
		margin-bottom: 15px;
		overflow: hidden;
	}
</style>
