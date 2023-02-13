import {ajax, Method, ReqContentType} from "@/api/request";

export const getRoleList = data => ajax("/admin-back/role/pageList", data);

export const getAllRoles=()=>ajax("/admin-back/role/list");

export const getRoleResources = data => ajax("/admin-back/role/role-resources", data);

export const addRole = data => ajax("/admin-back/role/add", data, Method.POST);

export const editRole = data => ajax("/admin-back/role/edit", data, Method.POST);

export const delRole = data => ajax("/admin-back/role/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const setRoleResources = data => ajax("/admin-back/role/role-resource-set", data, Method.POST);

export const setUserRoles = data => ajax("/admin-back/role/role-user-set", data, Method.POST);

export const getUserRoles = data => ajax("/admin-back/role/user-roles", data);
