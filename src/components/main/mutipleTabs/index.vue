<template>
    <div v-if="isTabsShow" class="tabsNav flexR">
        <div class="xiala pointer" v-if="tabSwitch" @click="tabLeft">
            <Icon type="ios-arrow-back" size="16" />
        </div>
        <div class="left flexR" id="tabsNav">
            <div class="flexR" id="tabsDiv" :style="{ transform: transform }">
                <div
                    class="pointer flexR"
                    v-for="(item, index) in routerTabs"
                    :key="item + index"
                >
                    <span
                        :class="activeName === item.name ? 'active' : ''"
                        @click="routerPush(item.name)"
                        >{{ item.meta.title }}</span
                    >
                    <Icon
                        v-if="item.name !== $indexPage"
                        type="ios-close"
                        size="24"
                        @click="tabNavClose(item, index)"
                    />
                </div>
            </div>
        </div>
        <div class="xiala pointer" v-if="tabSwitch" @click="tabRight">
            <Icon type="ios-arrow-forward" size="16" />
        </div>
        <div class="right">
            <Dropdown style="margin-left: 5px" @on-click="tabRightClick">
                <div class="xiala pointer">
                    <Icon type="ios-arrow-down" />
                </div>
                <DropdownMenu slot="list">
                    <DropdownItem name="qt">关闭其他</DropdownItem>
                    <DropdownItem name="ql">关闭左侧</DropdownItem>
                    <DropdownItem name="qr">关闭右侧</DropdownItem>
                    <DropdownItem name="qb">全部关闭</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>

<script>
import { DEL_ROUTES_TAB } from "@/store/actionTypes";
import { mapGetters } from "vuex";
export default {
    name: "index",
    props: ["activeName", "isTabsShow"],
    data() {
        return {
            transform: 0, // 导航左右方向移动距离
            tabSwitch: false,
        };
    },
  watch:{
    activeName(cur){
      console.log('变更',cur)
    }
  },
    computed: {
        ...mapGetters(["routerTabs"]),
    },
    methods: {
        // tab关闭
        tabNavClose(item, index) {
            let arr = this.$store.getters.routerTabs;
            // 判断是否是首页
            if (item.name !== this.$indexPage) {
                this.$store.dispatch(DEL_ROUTES_TAB, index);
                if (index !== 0) {
                    this.$router.push({
                        name: arr[index - 1].name,
                    });
                }
            }
            this.$nextTick(() => {
                let w = document.getElementById("tabsDiv").offsetWidth;
                let zw = document.getElementById("tabsNav").offsetWidth;
                if (w < zw) {
                    this.tabSwitch = false;
                }
            });
        },
        // tab最右侧下拉框右键选中
        tabRightClick(type) {
            let arr = this.$store.getters.routerTabs;
            this.tabSwitch = false;
            switch (type) {
                case "qt":
                    for (let i = arr.length - 1; i > -1; i--) {
                        if (
                            arr[i].name !== this.activeName &&
                            arr[i].name !== this.$indexPage
                        ) {
                            this.$store.dispatch(DEL_ROUTES_TAB, i);
                        }
                    }
                    break;
                case "ql": //关闭左边
                    const leftItemIndex = arr.findIndex(
                        i =>
                            i.name !== this.$indexPage &&
                            i.name === this.activeName
                    );
                    if (leftItemIndex === -1 || leftItemIndex === 0) return;
                    this.$store.dispatch(DEL_ROUTES_TAB, {
                        from: 1,
                        to: leftItemIndex - 1,
                    });
                    break;
                case "qr": //关闭右边
                    const rightItemIndex = arr.findIndex(
                        i =>
                            i.name !== this.$indexPage &&
                            i.name === this.activeName
                    );
                    if (rightItemIndex === -1 || rightItemIndex === arr.length)
                        return;
                    this.$store.dispatch(DEL_ROUTES_TAB, {
                        from: rightItemIndex + 1,
                        to: arr.length,
                    });
                    break;
                case "qb":
                    for (let i = arr.length - 1; i > -1; i--) {
                        if (arr[i].name !== this.$indexPage) {
                            this.$store.dispatch(DEL_ROUTES_TAB, i);
                        }
                    }
                    this.$router.push({ name: this.$indexPage });
                    break;
            }
        },
        // 路由跳转
        routerPush(name) {
            this.$router.push({
                name: name,
            });
            this.$nextTick(() => {
                let w = document.getElementById("tabsDiv").offsetWidth;
                let zw = document.getElementById("tabsNav").offsetWidth;
                if (w > zw) {
                    this.tabSwitch = true;
                }
            });
        },
        // 向右切换
        tabRight() {
            let w = document.getElementById("tabsDiv").offsetWidth;
            let zw = document.getElementById("tabsNav").offsetWidth;
            if (w > zw) {
                let s = -(w - zw);
                this.transform = "translateX(" + s + "px)";
            }
        },
        // 向左切换
        tabLeft() {
            this.transform = "translateX(0px)";
        },
    },
};
</script>

<style scoped></style>
