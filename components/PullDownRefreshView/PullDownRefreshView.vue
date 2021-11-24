<template>

	<scroll-view scroll-y style="height: 100%;width: 100%;" :refresher-enabled="refresher"
		:refresher-threshold="threshold" :refresher-triggered="triggered" @refresherrefresh="refreshing"
		:scroll-anchoring="anchoring" >
		<slot></slot>

	</scroll-view>

</template>

<script>
	export default {
		name: "PullDownRefreshView",
		props: {
			refresher: {
				type: Boolean,
				default: true,
			},
			threshold: {
				type: Number,
				default: 20,
			},
			anchoring: {
				type: Boolean,
				default: true,
			},
			infiniting: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				isRefreshing: false, // 是否在刷新中
				isInfiniting: this.infiniting, // 是否在加载中
				triggered: true,

			};
		},
		methods: {
			refreshing() {
				if (this.isRefreshing) return;
				this.isRefreshing = true
				this.triggered = true;
				this.isInfiniting = false;
				this.$emit('onRefresh', {
					complete: this.refresherComplete
				});
			},
			refresherComplete() {
				this.triggered = false;
				this.isRefreshing = false;
				this.isInfiniting = true;
			},

		}
	}
</script>
