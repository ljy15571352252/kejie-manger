<template>
    <FormItem>
        <Button type="primary" @click="onSearch">查询</Button>
        <Button class="reset" @click="onReset">重置</Button>
        <a class="expand" @click="onExpand" v-if="showExpandBtn"
            >{{ expand ? "收起" : "展开" }}
            <Icon :type="expand ? 'ios-arrow-up' : 'ios-arrow-down'" />
        </a>
    </FormItem>
</template>

<script>
export default {
    name: "index",
    props: {
        showExpandBtn: {
            type: Boolean,
            required: false,
            default:true
        },
    },
    data() {
        return {
            expand: false,
        };
    },
    methods: {
        onSearch() {
            this.$emit("on-search");
        },
        onReset() {
            this.$emit("on-reset");
        },
        onExpand() {
            this.expand = !this.expand;
            this.$emit("on-expand", this.expand);
        },
    },
};
</script>

<style scoped lang="less">
.reset {
    margin-left: 8px;
}

.expand {
    margin-left: 8px;
    color: #3399ff;

    i {
        margin-left: 5px;
    }
}
</style>
