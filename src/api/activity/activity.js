import {ajax, Method, ReqContentType} from "@/api/request";

export const getRegions = () => ajax("/store-back/activity/region/list");

export const getRegionPageList = data => ajax("/store-back/activity/region/pageList", data);

export const addRegion = data => ajax("/store-back/activity/region/add", data, Method.POST);

export const editRegion = data => ajax("/store-back/activity/region/edit", data, Method.POST);

export const delRegion = data => ajax("/store-back/activity/region/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const getCategories = () => ajax("/store-back/activity/category/list");
export const getCategoriesPageList = data => ajax("/store-back/activity/category/pageList", data);

export const addCategory = data => ajax("/store-back/activity/category/add", data, Method.POST);

export const editCategory = data => ajax("/store-back/activity/category/edit", data, Method.POST);

export const delCategory = data => ajax("/store-back/activity/category/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const getActivityList = data => ajax("/store-back/activity/list", data);

export const getActivityDetail = data => ajax("/store-back/activity/detail", data);

export const addActivity = data => ajax("/store-back/activity/add", data, Method.POST);

export const editActivity = data => ajax("/store-back/activity/edit", data, Method.POST);

export const delActivity = data => ajax("/store-back/activity/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const getActivityOrderList = data => ajax("/store-back/activity-order/list", data);

export const getActivityOrderDetail = data => ajax(`/store-back/activity-order/detail`,data);

export const getActivityOrderAftersalesList = data => ajax("/store-back/activity-order/aftersales-list", data);

export const getActivityOrderAftersalesDetail = data => ajax(`/store-back/activity-order/aftersales-detail`,data);

