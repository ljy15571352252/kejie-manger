import { asyncRoutes, constantRoutes } from "@/router";
import { SET_ROUTES } from "@/store/mutationTypes";
import {
    GENERATE_ROUTES,
    SET_ROUTES_TAB,
    PUSH_ROUTES_TAB,
    DEL_ROUTES_TAB,
    CLEAR_ROUTES_TAB,
} from "@/store/actionTypes";
import { indexPage } from "@/config";
import { ROUTER_TABS } from "@/common/storageKeys";

const state = {
    // 所有有权限的路由
    routes: [],
    // 异步路由
    asyncRoutes: [],
    // 已打开的路由数据
    routerTabs: localStorage.getItem(ROUTER_TABS)
        ? JSON.parse(localStorage.getItem(ROUTER_TABS))
        : [],
};

// 处理路由数据 添加父级name
const routersArr = routers => {
    for (let v of routers) {
        if (v.children) {
            setFuName(v.children, v);
        }

        function setFuName(chid, v) {
            // 开始处理子级
            for (let k of chid) {
                k.meta.fuName = v.meta.fuName
                    ? v.meta.fuName.concat(v.name)
                    : [v.name];
                k.meta.fuTitle = v.meta.fuTitle
                    ? v.meta.fuTitle.concat(v.meta.title)
                    : [v.meta.title];
                if (k.children) {
                    setFuName(k.children, k);
                }
            }
        }
    }
    return routers;
};

/**
 * 使用meta.roleId确定当前用户是否具有权限
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
    if (route.meta && route.meta.access) {
        return permissions.includes(route.meta.access);
    } else {
        // 如果存在子路由 子路由有一个有权限就返回true 否则false
        if (route.children) {
            const tmp = route.children;
            let flag = false;
            for (const v of tmp) {
                flag = hasPermission(permissions, v);
                if (flag) {
                    break;
                }
            }
            return flag;
        } else {
            return true;
        }
    }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param permissions
 */
export function filterAsyncRoutes(routes, permissions) {
    const res = [];
    routes.forEach(route => {
        const tmp = { ...route };
        if (hasPermission(permissions, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, permissions);
            }
            res.push(tmp);
        }
    });
    return res;
}

const mutations = {
    [SET_ROUTES]: (state, routes) => {
        state.asyncRoutes = routes;
        state.routes = routersArr(constantRoutes.concat(routes));
    },
    [SET_ROUTES_TAB](state, data) {
        // 设置路由
        state.routerTabs = data;
    },
    [PUSH_ROUTES_TAB](state, data) {
        // 增加路由
        const flag = state.routerTabs.some(r => r.path === data.path);
        if (!flag) {
            // 如果是默认主页 就放到第一个
            if (data.name === indexPage) {
                state.routerTabs.unshift(data);
            } else {
                state.routerTabs.push(data);
            }
        }
    },
    [DEL_ROUTES_TAB](state, range) {
        if (typeof range === "number") {
            // 删除路由
            state.routerTabs.splice(range, 1);
        } else if (typeof range === "object") {
            const { from, to } = range;
            state.routerTabs.splice(from, to);
        }
    },
};

const actions = {
    [GENERATE_ROUTES]({ commit }, permissions) {
        return new Promise(resolve => {
            const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions);
            commit(SET_ROUTES, accessedRoutes);
            resolve(accessedRoutes);
        });
    },
    [SET_ROUTES_TAB](context, data) {
        // 设置路由
        context.commit(SET_ROUTES_TAB, data);
    },
    [PUSH_ROUTES_TAB](context, data) {
        // 增加路由
        context.commit(PUSH_ROUTES_TAB, data);
    },
    [DEL_ROUTES_TAB](context, range) {
        // 删除路由
        context.commit(DEL_ROUTES_TAB, range);
    },
    [CLEAR_ROUTES_TAB](context) {
        localStorage.removeItem(ROUTER_TABS);
        context.commit(SET_ROUTES_TAB, []);
    },
};
export default {
    state,
    mutations,
    actions,
};
