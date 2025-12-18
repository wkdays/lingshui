<template>
	<view class="container">
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			src: ''
		}
	},
	onLoad(query) {
		const raw = query && query.url ? decodeURIComponent(query.url) : ''
		this.src = raw
	}
}
</script>

<style>
.container {
	width: 100%;
	height: 100vh;
}
</style>
