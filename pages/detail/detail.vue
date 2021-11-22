<template>
  <view class="content">
    <view class="banner" auto-focus>
      <image class="banner-img" :src="articles.cover"></image>
      <view class="title-area">
        <text class="title-text">{{articles.title}}</text>
      </view>
    </view>
    <view class="article-meta">
      <text class="article-meta-text article-author">{{articles.nickName}}</text>
      <text class="article-meta-text article-text">发表于</text>
	  <uni-dateformat class="article-meta-text article-time" :date="articles.publish_date" :threshold="[60000, 3600000]"> </uni-dateformat>
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
	uniCloud.callFunction({
		name: 'articles',
		data: {
			action: 'getArticleById',
			params:{
				id:event.id
			}
		},
		success: (res) => {
			this.articles=res.result.dataSource.data[0]||{}
		},
		fail: (err) => {
			 
			console.log(err)
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
    height: 180px;
    position: relative;
    background-color: #ccc;
    flex-direction: row;
    overflow: hidden;
  }

  .banner-img {
	  width: 100%;
    flex: 1;
  }

  .title-area {
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 15px;
    z-index: 11;
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
