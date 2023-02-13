import {ajax, Method, ReqContentType} from "@/api/request";

export const getCoinsSetList = data => ajax("/admin-back/coinssets/list", data);

export const addCoinsSet = data => ajax("/admin-back/coinssets/add", data, Method.POST);

export const editCoinsSet = data => ajax("/admin-back/coinssets/edit", data, Method.POST);

export const delCoinsSet = data => ajax("/admin-back/coinssets/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const getCoinsOrderList = data => ajax("/admin-back/coins-order/list", data);

export const getCoinsOrderDetail = data => ajax("/admin-back/coins-order/detail", data);
