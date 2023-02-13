import {ajax, Method, ReqContentType} from "@/api/request";

export const getGroupList = data => ajax("/admin-back/group/list", data);

export const getGroupMemberList = data => ajax("/admin-back/group/members", data);

// export const addGroup = data => ajax("/admin-back/group/add", data, Method.POST);

// export const editGroup = data => ajax("/admin-back/group/edit", data, Method.POST);

export const delGroup = data => ajax("/admin-back/group/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const updateGroupStatus = data => ajax("/admin-back/group/update-status", data, Method.POST,ReqContentType.APPLICATION_FORM);


export const getGroupOrderList = data => ajax("/admin-back/group-order/list", data);

export const getGroupOrderDetail = data => ajax("/admin-back/group-order/detail", data);

export const getGroupOrderAftersalesList = data => ajax("/admin-back/group-order/aftersales-list", data);

export const getGroupOrderAftersalesDetail = data => ajax("/admin-back/group-order/aftersales-detail", data);

//新增分类
export const addGroup = data => ajax("/admin-back/group/category/add", data, Method.POST);
// 获取群组分类列表
export const getGroupCassifyList = data => ajax("/admin-back/group/category/pageList", data);
// 删除分类
export const GroupDelete = data => ajax("/admin-back/group/category/del", data, Method.POST,ReqContentType.APPLICATION_FORM);
// 编辑分类
export const editGroup = data => ajax("/admin-back/group/category/edit", data, Method.POST);
