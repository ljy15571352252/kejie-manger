import Vue from "vue";
import App from "./App.vue";
import router from "./router"; // 路由
import "@/router/config"; // 加载路由权限控制
import store from "./store";
import "babel-polyfill"; // 解决ie兼容问题
import ViewUI from "view-design";
import "./common/css/theme.less";
import "@/common/utils/DateUtils";
import * as vueExpand from "./common/vue-expand";
import * as filters from "./common/filter/common-filter";
import * as constants from "./common/constants";
import { indexPage, loginPage } from "./config";
import PageHeader from "@/components/page-header";
import SearchButtonGroup from "@/components/search-button-group";
import TableTool from "@/components/table-tools";
import {UEditor} from "@/common/ueditor";

Vue.use(ViewUI);
Vue.component("PageHeader", PageHeader);
Vue.component("TableTool", TableTool);
Vue.component("SearchButtonGroup", SearchButtonGroup);

// 引入mock文件 目前登录使用的是在线mock
// require('./mock/index') // mock 方式，正式发布时，注释掉该处即可

/**
 * 生成 Vue 过滤器
 */
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
/**
 * 生成常用方法
 */
Object.keys(vueExpand).forEach(key => {
    Vue.prototype[`${key}`] = vueExpand[key];
});
Object.keys(constants).forEach(key => {
    Vue.prototype[`${key}`] = constants[key];
});

Vue.prototype.$indexPage = indexPage;
Vue.prototype.$loginPage = loginPage;
Vue.prototype.$ueditor = UEditor
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount("#app");
