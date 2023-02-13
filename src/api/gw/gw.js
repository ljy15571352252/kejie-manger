import { ajax, Method, ReqContentType } from "@/api/request";

export const getGwPageList = params =>
    ajax("/admin-back/gw/page-list", params);

export const getGwPageData = params =>
    ajax("/admin-back/gw/page-data", params);

export const updateGwPageData = data =>
    ajax("/admin-back/gw/page-data/update", data, Method.POST);

export const getFunctionList = params =>
    ajax("/admin-back/gw/functions/list", params);

export const getFunctionDetail = code =>
    ajax("/admin-back/gw/functions/detail/" + code);

export const addFunction = data =>
    ajax("/admin-back/gw/functions/add", data, Method.POST);

export const editFunction = data =>
    ajax("/admin-back/gw/functions/edit", data, Method.POST);

export const delFunction = data =>
    ajax(
        "/admin-back/gw/functions/del",
        data,
        Method.POST,
        ReqContentType.APPLICATION_FORM
    );
