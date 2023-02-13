<template>
    <div style="margin-bottom: 20px">
        <slot></slot>
        <Tooltip content="刷新" placement="top" style="float: right">
            <a class="refresh-btn" @click="$emit('on-refresh')"
                ><Icon type="ios-refresh" size="24"
            /></a>
        </Tooltip>
    </div>
</template>

<script>
export default {
    name: "index",
};
</script>

<style scoped>
.refresh-btn {
    color: #666666;
}
</style>
