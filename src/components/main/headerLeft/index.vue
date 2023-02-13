<template>
    <div class="header_left flexR">
        <span>
            <Icon
                @click.native="()=>{$emit('on-sider-toggle')}"
                :class="rotateIcon"
                type="md-menu"
                size="24"
            ></Icon>
        </span>
        <span @click="refresh">
            <Icon type="ios-refresh" size="24" />
        </span>
<!--        <span>
            <Breadcrumb>
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem v-for="(item,i) in $route.meta.fuTitle" :key="i">{{
                    item
                }}</BreadcrumbItem>
                <BreadcrumbItem>{{ $route.meta.title }}</BreadcrumbItem>
            </Breadcrumb>
        </span>-->
    </div>
</template>

<script>
export default {
    name: "index",
    computed: {
        rotateIcon() {
            return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
        },
    },
    methods: {
        refresh() {
            this.$emit('on-refresh')
        },
    },
};
</script>

<style scoped></style>
