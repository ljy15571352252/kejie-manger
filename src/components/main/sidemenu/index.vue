<template>
    <Menu
        :active-name="activeName"
        :theme="themeType"
        width="auto"
        :class="menuitemClasses"
        :open-names="openNames"
        accordion
        ref="side_menu"
        @on-select="menuNav"
    >
        <!--如果只有一个子路由-->
        <MenuItem
            v-if="!isCollapsed && !it.meta.hide"
            v-for="(it, index) in routersArr"
            :key="index"
            class="ivu-menu-submenu"
            :class="{ liActive: activeName === it.name }"
            style="padding: 0 !important"
            :name="it.name"
        >
            <div class="ivu-menu-submenu-title">
                <Icon :type="it.meta.icon" />
                <span style="margin-left: 10px">{{ it.meta.title }}</span>
            </div>
        </MenuItem>

        <Tooltip
            placement="right"
            :content="item.meta.title"
            v-for="(item, ind) in routersArr"
            :key="ind"
            v-if="isCollapsed && !item.meta.hide"
            class="menuSmall"

        >
            <span :class="item.name === $route.meta.fuName[0] ? 'active' : ''"   @click="menuNav(item.name)" style="cursor: pointer">
                <Icon :type="item.meta.icon" />
            </span>
        </Tooltip>
    </Menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "index",
    props: {
        isCollapsed: Boolean,
        themeType: String,
    },
    data() {
        return {
            routersArr: [],
            activeName: "",
            openNames: [],
        };
    },
    watch: {
        isCollapsed() {
            this.$nextTick(() => {
                this.$refs.side_menu.updateActiveName();
            });
        },
        $route() {
          this.updateSelectedMenu()
        },
    },
    computed: {
        ...mapGetters(["routes"]),
        // 导航收缩
        menuitemClasses() {
            return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
        },
    },
    methods: {
      updateSelectedMenu(){
        this.activeName = this.$route.meta.fuName?  this.$route.meta.fuName[0]:"";
        this.onMenuActive({name:this.activeName,targetName:this.$route.name})
        this.$nextTick(() => {
          if (this.$refs.side_menu) {
            this.$refs.side_menu.updateActiveName()
          }
        });
      },
        // 下拉菜单跳转
        dropdownNav(name) {
            this.$router.push({
                name: name,
            });
        },
        // 导航跳转
        menuNav(name) {
          this.onMenuActive({name})
        },
        onMenuActive({name,targetName}) {
          this.$emit('on-menu-active',{name,targetName})
        },
      setRouterArr() {
            // 获取用户数据
            this.routersArr = JSON.parse(JSON.stringify(this.routes));
        },

    },
    mounted() {
      this.updateSelectedMenu()
    },
    created() {
        this.setRouterArr();
    },
};
</script>

<style scoped lang="less">
</style>
