<template>
    <div class="layout-page">
        <Layout class="layout-div">
            <Sider
                ref="side1"
                hide-trigger
                collapsible
                :collapsed-width="78"
                :width="150"
                v-model="isCollapsed"
                :class="themeType === 'light' ? 'themeLight' : 'themeDark'"
            >
                <!--:class="isCollapsed?'collapsed_left':''"-->
                <div class="logo" :class="headMaxWidth ? 'headMaxWidth' : ''">
                    <img
                        v-if="!isCollapsed && headMaxWidth"
                        :src="headMaxWidthLogoImg"
                        alt=""
                    />
                    <img
                        v-if="!isCollapsed && !headMaxWidth"
                        :src="logoImg"
                        alt=""
                    />
                    <img
                        v-if="isCollapsed"
                        src="../../../static/main/logo-small.png"
                        alt=""
                    />
                </div>
                <side-menu
                    :is-collapsed="isCollapsed"
                    :theme-type="themeType"
                    @on-menu-active="onFirstMenuActive"
                />
            </Sider>
            <Layout>
                <!--头部-->
                <Header class="header flexR">
                    <header-left
                        @on-refresh="refresh"
                        @on-sider-toggle="collapsedSider"
                    />
                    <!--头部右边-->
                    <header-right @on-drawer-open="optionDrawer = true" />
                </Header>
                <Layout>
                    <Sider
                        v-show="!isEmptyObject(curSecondMenus)"
                        :width="160"
                        style="z-index: 50"
                    >
                        <second-menu
                            :theme-type="themeType"
                            :routers-arr="curSecondMenus"
                    /></Sider>

                    <!--内容区-->
                    <Content
                        id="main_content"
                        :style="{
                            height: !isTabsShow
                                ? 'calc(100vh - 64px)'
                                : 'calc(100vh - 100px)',
                            margin: !isTabsShow
                                ? '24px 0 24px 24px'
                                : '16px 0 24px 16px',
                        }"
                        class="main_content flexC"
                    >
                        <!--                        <mutiple-tabs
                            :is-tabs-show="isTabsShow"
                            :active-name="activeName"
                        />-->
                        <router-view v-if="isRouterViewShow"></router-view>
                    </Content>
                </Layout>
                <Footer></Footer>
                <style-settings
                    v-model="optionDrawer"
                    :is-tabs-show="isTabsShow"
                    :head-max-width="headMaxWidth"
                    :theme-type="themeType"
                    @on-theme-switch="themeSwitch"
                />
            </Layout>
        </Layout>
    </div>
</template>

<script>
import darkImg from "/static/main/logo-dark.png";
import lightImg from "/static/main/logo-light.png";
import { themeData } from "@/config";
import Footer from "@/components/footer/footer";
import SideMenu from "./sidemenu";
import SecondMenu from "./second-menu";
import HeaderLeft from "./headerLeft";
import HeaderRight from "./headerRight";
import MutipleTabs from "./mutipleTabs";
import StyleSettings from "./styleSettings";
import { mapGetters } from "vuex";

export default {
    name: "main-page",
    components: {
        Footer,
        SideMenu,
        HeaderLeft,
        HeaderRight,
        StyleSettings,
        MutipleTabs,
        SecondMenu
    },
    computed: {
        ...mapGetters(["userData", "routes"]),
    },
    data() {
        return {
            curSecondMenus: [],
            activeName: "", // 子导航选中的name
            isCollapsed: false, // 是否收缩
            optionDrawer: false, // 是否显示配置抽屉
            themeType: themeData.themeType ? themeData.themeType : "dark", // 主题风格
            logoImg: themeData.themeType === "dark" ? lightImg : darkImg, // 主题logo图片
            isTabsShow: themeData.isTabsShow, // 是否显示多页签
            headMaxWidthLogoImg: darkImg, // 栏目是否通顶logo图片
            headMaxWidth: themeData.headMaxWidth, // 栏目是否通顶（最大宽度）
            isRouterViewShow: true, // 控制router-view的隐藏与展示
        };
    },
    watch: {
        $route() {
            this.activeName = this.$route.name;
        },
    },
    created() {},
    mounted() {
        // 如果没有权限 回到默认首页 防止错误地址程序崩溃 跳转非法路由
        if (this.$route.meta.hide) {
            this.$router.push({
                name: this.$indexPage,
            });
        }
    },
    methods: {
        onFirstMenuActive({ name, targetName }) {
            let secondMenu = this.routes.filter(i => i.name === name)[0];
            if (!secondMenu) {
                return;
            }
            let targetRouteName;
            let targetSecondMenus = [];
            if (this.isEmptyObject(secondMenu.children)) {
                targetRouteName = name;
            } else if (secondMenu.children.length === 1 && !secondMenu.children[0].children) {
                targetRouteName = secondMenu.children[0].name;
            } else {
                let thirdMenu = secondMenu.children[0];
                if (!this.isEmptyObject(thirdMenu.children)) {
                    targetRouteName = thirdMenu.children[0].name;
                } else {
                    targetRouteName = thirdMenu.name;
                }
                targetSecondMenus = secondMenu.children;
            }
            if (targetName) targetRouteName = targetName;
            this.$router.push({
                name: targetRouteName,
            });
            this.curSecondMenus = targetSecondMenus;
            this.onMenuActive(targetRouteName);
        },
        onMenuActive(name) {
            this.activeName = name;
        },
        // 收缩切换
        collapsedSider() {
            this.$refs.side1.toggleCollapse();
        },
        // 主题切换
        themeSwitch(type) {
            if (type === 0) {
                this.themeType = "dark";
                this.logoImg = lightImg;
            } else {
                this.themeType = "light";
                this.logoImg = darkImg;
            }
        },
        // 页面刷新
        refresh() {
            // 先隐藏
            this.isRouterViewShow = false;
            // $nextTick() 将回调延迟到下次 DOM 更新循环之后执行
            this.$nextTick(() => {
                this.isRouterViewShow = true;
            });
        },
    },
};
</script>

<style lang="less">
@import "main";
</style>
