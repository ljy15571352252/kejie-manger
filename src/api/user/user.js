import {
    ajax,
    Method,
    ReqContentType
} from "@/api/request";

export const login = data =>
    ajax(
        `${process.env.VUE_APP_AUTH_API}/login`,
        data,
        Method.POST,
        ReqContentType.APPLICATION_FORM, {
            Authorization: "Basic d2ViYXBwOndlYmFwcA==",
        }
    );

export const refreshToken = token =>
    ajax(
        `${process.env.VUE_APP_AUTH_API}/oauth/token?grant_type=refresh_token&refresh_token=${token}`,
        null,
        Method.POST,
        ReqContentType.APPLICATION_FORM, {
            Authorization: "Basic d2ViYXBwOndlYmFwcA==",
        }
    );

export const revokeAccessToken = token =>
    ajax(
        `${process.env.VUE_APP_AUTH_API}/oauth/token?access_token=${token}`,
        null,
        Method.DELETE,
        ReqContentType.APPLICATION_FORM, {
            Authorization: "Basic d2ViYXBwOndlYmFwcA==",
        }
    );

export const getLoginUserInfo = () => ajax("/admin-back/user-info");

export const updateCurrentUserInfo = data =>
    ajax("/admin-back/update-curuser-info", data, Method.POST);

export const getUserList = data => ajax("/admin-back/user/list", data);

export const getUserDetail = data => ajax("/admin-back/user/detail", data);
export const addUser = data => ajax("/admin-back/user/add", data, Method.POST);

export const editUser = data => ajax("/admin-back/user/edit", data, Method.POST);

export const delUser = data =>
    ajax(
        "/admin-back/user/del",
        data,
        Method.POST,
        ReqContentType.APPLICATION_FORM
    );

export const resetPassword = data =>
    ajax("/admin-back/user/reset-password", data, Method.POST);

export const modifyPassword = data =>
    ajax("/admin-back/user/edit-password", data, Method.POST);

export const registerAcc = data => ajax("/store-back/acc/registerAcc", data, Method.POST, ReqContentType.APPLICATION_FORM);
// 忘记密码 
export const forgetPasswordReset = data => ajax("/store-back/acc/forget-password-reset", data, Method.POST, ReqContentType.APPLICATION_JSON);