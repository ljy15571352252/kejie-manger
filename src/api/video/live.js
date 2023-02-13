import {ajax, Method, ReqContentType} from "@/api/request";

export const getLiveList = data => ajax("/store-back/live/list", data);

export const addLive = data => ajax("/store-back/live/add", data, Method.POST);

export const editLive = data => ajax("/store-back/live/edit", data, Method.POST);

export const delLive = data => ajax("/store-back/live/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

