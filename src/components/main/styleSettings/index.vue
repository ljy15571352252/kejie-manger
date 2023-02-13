<template>
    <Drawer
        class="optionDrawer"
        v-model="showDrawer"
        @on-visible-change="
            flag => {
                $emit('input', flag);
            }
        "
    >
        <Divider slot="header" class="header">主题风格设置</Divider>
        <div class="flexR imgs">
            <Tooltip
                content="时尚酷黑"
                placement="top"
                transfer
                :class="themeType === 'dark' ? 'active' : ''"
            >
                <img
                    src="../../../../static/main/nav-theme-dark.svg"
                    alt=""
                    @click="themeSwitch(0)"
                />
            </Tooltip>
            <Tooltip
                content="极简雅白"
                placement="top"
                transfer
                :class="themeType === 'light' ? 'active' : ''"
            >
                <img
                    src="../../../../static/main/nav-theme-light.svg"
                    alt=""
                    @click="themeSwitch(1)"
                />
            </Tooltip>
        </div>
        <Divider class="otherDiv">其他设置</Divider>
        <div class="kaiguan flexR">
            <span>开启多页签</span>
            <i-switch v-model="isTabsShow" size="small" />
        </div>
        <div class="kaiguan flexR">
            <span>顶栏通顶</span>
            <i-switch v-model="headMaxWidth" size="small" />
        </div>
    </Drawer>
</template>

<script>
export default {
    name: "index",
    props: ["isTabsShow", "headMaxWidth", "themeType", "value"],
    data() {
        return {
            showDrawer: false,
        };
    },
    watch: {
        value(val) {
            this.showDrawer = val;
        },
    },
    methods: {
        themeSwitch(val) {
            this.$emit("on-theme-switch", val);
        },
    },
    mounted() {
        this.showDrawer = this.value;
    },
};
</script>

<style scoped></style>
