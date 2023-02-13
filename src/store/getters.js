import { isEmptyObject } from "@/common/vue-expand";

const getters = {
    token: state => state.user.token,
    // 是否登录
    isLogin: state => !isEmptyObject(state.user.token),
    // 权限id集合
    permissions: state => state.user.permissions,
    // 已打开的路由数据
    routerTabs: state => state.routes.routerTabs,
    // 用户信息
    userData: state => state.user.userData,
    // 所有有权限的路由
    routes: state => state.routes.routes,
    currentSecondRoutes:state => state.routes.secondRoutes,
    // 异步路由
    asyncRoutes: state => state.routes.asyncRoutes,
};
export default getters;
