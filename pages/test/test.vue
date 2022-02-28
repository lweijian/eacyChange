<template>
    <view class="container">
        <text>{{appear ? '小球出现' : '小球消失'}}</text>
        <view class="page-section">
            <scroll-view class="scroll-view" scroll-y>
                <view class="scroll-area">
                    <text class="notice">向下滚动让小球出现</text>
                    <view class="ball"></view>
					<view class="ball"></view>
					<view class="ball"></view>
					<view class="ball"></view>
					<view class="ball"></view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>
<script>
    let observer = null;
    export default {
        data() {
            return {
                appear: false
            }
        },
        onReady() {
            observer = uni.createIntersectionObserver(this,{observeAll:true});
            observer.relativeTo('.scroll-view').observe('.ball', (res) => {
				
              if (res.intersectionRatio > 0 && !this.appear) {
                this.appear = true;
              } else if (!res.intersectionRatio > 0 && this.appear) {
                this.appear = false;
              }
            })
        },
        onUnload() {
            if (observer) {
                observer.disconnect()
            }
        }
    }
</script>
<style>
    view,page {
        display: flex;
        flex-direction: column;
    }

    .scroll-view {
        height: 400rpx;
        background: #fff;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    .scroll-area {
        
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: .5s;
    }

    .notice {
        margin-top: 150rpx;
        margin: 150rpx 0 400rpx 0;
    }

    .ball {
        width: 200rpx;
        height: 200rpx;
        background: #1AAD19;
        border-radius: 50%;
		margin-bottom: 500rpx;
		
    }
</style>