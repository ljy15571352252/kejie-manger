import {ajax, Method} from "@/api/request";

export const getServiceCardList = () => ajax("/admin-back/service-card/list");

export const addServiceCard = data => ajax("/admin-back/service-card/add", data, Method.POST);

export const editServiceCard = data => ajax("/admin-back/service-card/edit", data, Method.POST);

export const delServiceCard = data => ajax("/admin-back/service-card/del", data, Method.POST);

export const getServiceCardOrderList = data => ajax("/admin-back/service-card-order/list", data);

export const getServiceCardOrderDetail = data => ajax("/admin-back/service-card-order/detail", data);
