import {ajax, Method} from "@/api/request";

export const getGiftList = data => ajax("/admin-back/gift/list", data);

export const getGiftSendRecords = data => ajax("/admin-back/gift/send-records", data);

export const addGiftSendRecord = data => ajax("/admin-back/gift/add-send-record", data, Method.POST);

export const delGiftSendRecord = data => ajax("/admin-back/gift/del-send-record", data, Method.POST);

export const addGift = data => ajax("/admin-back/gift/add", data, Method.POST);

export const editGift = data => ajax("/admin-back/gift/edit", data, Method.POST);

export const delGift = data => ajax("/admin-back/gift/del", data, Method.POST);

export const getGiftOrderList = data => ajax("/admin-back/gift-order/list", data);

export const getGiftOrderDetail = data => ajax("/admin-back/gift-order/detail", data);
