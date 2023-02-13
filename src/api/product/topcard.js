import {ajax, Method} from "@/api/request";

export const getTopCardList = data => ajax("/admin-back/top-card/list", data);

export const addTopCard = data => ajax("/admin-back/top-card/add", data, Method.POST);

export const editTopCard = data => ajax("/admin-back/top-card/edit", data, Method.POST);

export const delTopCard = data => ajax("/admin-back/top-card/del", data, Method.POST);



export const getTopCardOrderList = data => ajax("/admin-back/top-card-order/list", data);

export const getTopCardOrderDetail = data => ajax("/admin-back/top-card-order/detail", data);
