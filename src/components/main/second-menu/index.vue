<template>
  <Menu
      :active-name="activeName"
      :theme="themeType"
      width="auto"
      :class="menuitemClasses"
      style="height: 100vh"
      :open-names="openNames"
      ref="side_menu"
      @on-select="menuNav"
  >
    <Submenu
        v-for="(item, index) in routersArr"
        :key="index"
        v-if="item.children && item.children.length "
        :name="item.name"
    >
      <template slot="title" >
        <Icon :type="item.meta.icon" />
        <span class="titlespan font-weight-bold">{{ item.meta.title }}</span>
      </template>
      <MenuItem
          v-if="!it.children"
          v-for="it in item.children"
          :key="it.name"
          :name="it.name"
          class="second-menu-item"
          :class="{ active: $route.name === it.name }"
      >
        <div >{{ it.meta.title }}</div>
      </MenuItem>
    </Submenu>
    <!--如果只有一个子路由-->
    <MenuItem
        v-else
        class="ivu-menu-submenu"
        :class="{ liActive: $route.name === item.name }"
        style="padding: 0 !important"
        :name="item.name"
    >
      <div class="ivu-menu-submenu-title">
        <span class="font-weight-bold" style="margin-left: 18px">{{item.meta.title }}</span>
      </div>
    </MenuItem>
  </Menu>
</template>

<script>
import { mapGetters } from "vuex";
import {ROUTER_TABS} from "@/common/storageKeys";
export default {
  name: "index",
  props: {
    themeType: String,
    routersArr:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      activeName: "",
      openNames: [],
    };
  },
  watch: {
    routersArr(){
      this.updateMenuOpen()
    },
    $route(){
      this.activeName = this.$route.name;
    }
  },
  computed: {
    ...mapGetters(["routerTabs"]),
    // 导航收缩
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  methods: {
    updateMenuOpen(){
      this.activeName = this.$route.name;
      this.openNames = this.routersArr.map(item=>item.name);
      this.$nextTick(() => {
        this.$refs.side_menu.updateOpened();
        this.$refs.side_menu.updateActiveName();
        this.saveState();
      });
    },
    menuNav(name) {
      this.$router.push({
        name: name,
      });
    },
    // 页面刷新后 将vuex路由数据存储到本地
    saveState() {
      let arr = this.routerTabs;
      let arr1 = [];
      for (let v of arr) {
        let item = {
          fullPath: v.fullPath,
          meta: v.meta,
          name: v.name,
          path: v.path,
        };
        arr1.push(item);
      }
      localStorage.setItem(ROUTER_TABS, JSON.stringify(arr1));
    },
  },
  mounted() {
  },
  created() {
  },
}
</script>

<style scoped lang="less">
/deep/.ivu-menu-submenu-title{
  padding: 14px 0!important;
}
/deep/.ivu-menu-submenu-title-icon{
  right: 10px!important;
}
/deep/.ivu-menu-item{
  padding:0!important;
}
/deep/.ivu-menu-item{
  margin: 0 5px!important;
}
/deep/.ivu-menu-item-active{
  border-radius: 8px!important;
}
/deep/.ivu-menu-item-active:after{
  display: none!important;
}
</style>