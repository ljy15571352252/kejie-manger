
import {getPermissions, login, refreshToken} from "@/api/user/user";

import {
    SET_PERMISSIONS,
    SET_USER_DATA,
    SET_USER_TOKEN,
} from "@/store/mutationTypes";
import {
    LOGIN,
    LOGOUT,
    GET_USER_INFO,
    SET_ROUTES_TAB,
    GET_USER_PERMISSIONS,
    REFRESH_USER_TOKEN,
    SAVE_USER_TOKEN,
} from "@/store/actionTypes";
import { USER_DATA, USER_TOKEN, ROUTER_TABS } from "@/common/storageKeys";
import { getLoginUserInfo } from "@/api/user/user";

let REFRESH_TIMEOUT_SCRIPT;

const state = {
    // 用户信息数据
    userData: localStorage.getItem(USER_DATA)
        ? JSON.parse(localStorage.getItem(USER_DATA))
        : {},
    // 是否登陆
    token: localStorage.getItem(USER_TOKEN)
        ? JSON.parse(localStorage.getItem(USER_TOKEN))
        : {},
    // 角色权限集合
    permissions: [],
};

const mutations = {
    // 设置角色
    [SET_PERMISSIONS]: (state, permissions) => {
        state.permissions = permissions;
    },
    // 设置用户数据
    [SET_USER_DATA](state, data) {
        state.userData = data;
    },
    // 修改登陆状态
    [SET_USER_TOKEN](state, token) {
        state.token = token;
    },
};

const actions = {
    async [REFRESH_USER_TOKEN]({ commit, dispatch }) {
        let tokenData = localStorage.getItem(USER_TOKEN);
        if (!tokenData) return;
        return new Promise((resolve, reject) => {
            tokenData = JSON.parse(tokenData);
            refreshToken(tokenData.refresh_token).then(res=>{
                dispatch(SAVE_USER_TOKEN, res.data);
                resolve()
            }).catch(err=>{
                reject(err)
            });
        })
    },
    // 登录
    [LOGIN]({ commit, dispatch }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({
                username: username.trim(),
                password: password,
                authSite: "admin",
            })
                .then(response => {
                    dispatch(SAVE_USER_TOKEN, response);
                    dispatch(GET_USER_INFO);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    [SAVE_USER_TOKEN]({ dispatch, commit }, data) {
        clearTimeout(REFRESH_TIMEOUT_SCRIPT);
        localStorage.setItem(USER_TOKEN, JSON.stringify(data));
        commit(SET_USER_TOKEN, data);
        //定时刷新token
        REFRESH_TIMEOUT_SCRIPT = setTimeout(() => {
            dispatch(REFRESH_USER_TOKEN);
        }, 6600000); //2小时-10分钟
    },
    // 获取用户信息
    [GET_USER_INFO]({ commit, state }) {
        return new Promise(async (resolve, reject) => {
            let result = await getLoginUserInfo();
            localStorage.setItem(USER_DATA, JSON.stringify(result));
            commit(SET_USER_DATA, result);
            resolve(result);
        });
    },
    [GET_USER_PERMISSIONS]({ commit, state }) {
        return new Promise(async (resolve, reject) => {
            let roles = [8];
           // let roles=await getPermissions()
            commit(SET_PERMISSIONS, roles);
            resolve({ roles });
        });
    },
    // 退出登录
    [LOGOUT]({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            clearTimeout(REFRESH_TIMEOUT_SCRIPT);
            // commit('setToken', '')
            // 清除用户数据
            commit(SET_USER_DATA, "");
            // 清楚用户权限集合
            commit(SET_PERMISSIONS, []);
            // 设置登录状态为false
            commit(SET_USER_TOKEN, null);
            // 清除缓存的用户数据
            localStorage.removeItem(USER_DATA);
            localStorage.removeItem(USER_TOKEN);
            // 清除缓存的多页签数据
            dispatch(SET_ROUTES_TAB, [], { root: true });
            localStorage.removeItem(ROUTER_TABS);
            resolve();
        });
    },
    // 设置用户数据
    [SET_USER_DATA](context, data) {
        context.commit(SET_USER_DATA, data);
    },
};

export default {
    state,
    mutations,
    actions,
};
