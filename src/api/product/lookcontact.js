import {ajax, Method} from "@/api/request";

export const getLookContactConfig = data => ajax("/admin-back/look-contact/config", data);

export const updateLookContactConfig = data =>
    ajax("/store-back/look-contact/update-config", data, Method.POST);

export const getLookContactOrderList = data => ajax("/admin-back/look-contact-order/list", data);

export const getLookContactOrderDetail = data => ajax("/admin-back/look-contact-order/detail", data);
