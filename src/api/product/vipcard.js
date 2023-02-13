import {ajax, Method} from "@/api/request";

export const getVipCardList = data => ajax("/admin-back/vip-card/list", data);

export const addVipCard = data => ajax("/admin-back/vip-card/add", data, Method.POST);

export const editVipCard = data => ajax("/admin-back/vip-card/edit", data, Method.POST);

export const delVipCard = data => ajax("/admin-back/vip-card/del", data, Method.POST);

export const getVipCardOrderList = data => ajax("/admin-back/vip-card-order/list", data);

export const getVipCardOrderDetail = data => ajax("/admin-back/vip-card-order/detail", data);
