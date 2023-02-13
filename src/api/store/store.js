import {
    ajax,
    Method,
    ReqContentType
} from "@/api/request";

// 商户管理api
export const getStoreList = params =>
    ajax("/admin-back/store-manage/list", params);

export const getStoreDetail = code =>
    ajax("/admin-back/store-manage/detail", code);

export const addStore = params =>
    ajax("/admin-back/store-manage/createStore", params, Method.POST);

export const editStore = params =>
    ajax("/admin-back/store-manage/update", params, Method.POST);

export const editStoreTime = params =>
    ajax("/admin-back/store-manage/set-store-expired-time", params, Method.POST);

// 商户用户api
export const getStoreUserList = params =>
    ajax('/admin-back/store-user-manage/list', params)

export const getStoreUserDetail = codeObj =>
    ajax('/admin-back/store-user-manage/detail', codeObj)

// 平台开通价格
export const openStorePrice = () =>
    ajax('/admin-back/store-price-manage/open-store-price')

export const addStorePrice = body =>
    ajax('/admin-back/store-price-manage/add-store-price', body, Method.POST)

export const editStorePrice = body =>
    ajax('/admin-back/store-price-manage/edit-store-price', body, Method.POST)

export const delStorePrice = code =>
    ajax('/admin-back/store-price-manage/del-store-price', code, Method.POST)

// 菜单资源
export const getStoreModuleList = () =>
    ajax('/admin-back/store-resource-manage/list')

export const addStoreModule = params =>
    ajax('/admin-back/store-resource-manage/add-resource', params, Method.POST)

export const editStoreModule = params =>
    ajax('/admin-back/store-resource-manage/edit-resource', params, Method.POST)

export const delStoreModule = code =>
    ajax('/admin-back/store-resource-manage/del-resource?code=' + code, null, Method.POST)

// 前台页面模板
export const getStorePageModuleList = page =>
    ajax('/admin-back/store-page-manage/list', page)

export const addStorePageModule = params =>
    ajax('/admin-back/store-page-manage/add-page-module', params, Method.POST)

export const editStorePageModule = params =>
    ajax('/admin-back/store-page-manage/edit-page-module', params, Method.POST)

export const delStorePageModule = code =>
    ajax('/admin-back/store-page-manage/del-page-module?code=' + code, null, Method.POST)

// 模板
export const getComplainList = data => ajax("/store-back/complain/list", data);

export const getComplainDetail = data => ajax("/store-back/complain/detail", data);

export const checkComplain = data => ajax("/store-back/complain/check", data, Method.POST);

// export const getStoreDetail = () => ajax("/store-back/store/detail");

export const updateStoreDetail = data => ajax("/store-back/store/update", data, Method.POST);

export const registerStore = data => ajax("/store-back/store/register", data, Method.POST);

export const createStoreOpenOrder = data => ajax("/store-back/store/create-store-open-order", data, Method.POST);

export const getStoreOpenPayConfig = data => ajax("/order/store_open_order/pay-config", data, Method.GET);
export const getStoreOpenOrderState = data => ajax("/order/store_open_order/state", data, Method.GET);

export const getStoreOpenOrderDetail = data => ajax("/admin-back/store-openorder-manage/store-open-order-detail", data);
export const getOpenStorePriceList = () => ajax("/store-back/store/open-store-price");
export const getStorePlatforms = () => ajax("/store-back/store/platform-info");
export const fabuStorePlatforms = data => ajax("/store-back/store-page/release-tem", data, Method.GET);

export const getStorePlatformPageModules = () => ajax("/admin-back/store-page-manage/list");

export const getStorePlatformTabbars = () => ajax("/admin-back/store-custommenu-manage/tabbars", data);

export const updateStorePlatformTabbars = data => ajax("/store-back/store-page/tabbars-update", data, Method.POST);

export const getStorePlatformMenus = data => ajax("/admin-back/store-custommenu-manage/store-platform-menus", data);


export const getPlatformMenus = data => ajax("/admin-back/store-page-manage/platform-menus", data);

export const updateStorePlatformMenu = data => ajax("/store-back/store-page/update-store-platform-menus", data, Method.POST);

export const getDoc = type => ajax("/store-back/store/getDoc", type);

export const updateDoc = data => ajax("/store-back/store/update-doc", data, Method.POST);
// 获取自定义模板列表 
export const getCustTemplateList = data => ajax("/admin-back/store-custompage-manage/tem-list", data);
// 保存自定义模板
export const addCustTemplate = data => ajax("/admin-back/store-custompage-manage/add-custom-tem", data, Method.POST);
// 编辑自定义模板 
export const editCustTemplate = data => ajax("/admin-back/store-custompage-manage/edit-custom-tem", data, Method.POST);
// 获取自定义模板详情
export const getCustTemplateDetail = data => ajax("/admin-back/store-custompage-manage/custom-tem", data);
// 启用自定义模板 
export const enableCustTemplate = data => ajax("/admin-back/store-custompage-manage/enable-custom-tem", data);
// 删除自定义模板
export const delCustTemplate = data => ajax("/admin-back/store-custompage-manage/del-custom-tem", data, Method.POST, ReqContentType.APPLICATION_FORM);

// 获取店铺平台开通订单列表
export const getStoreOrderDetails = (data) => ajax("/admin-back/store-openorder-manage/store-open-order-list", data);