import {ajax, Method} from "@/api/request";

export const getLevels = () => ajax("/store-back/member/levels");

export const addLevels = data => ajax("/store-back/member/level/add", data, Method.POST);

export const editLevels = data => ajax("/store-back/member/level/update", data, Method.POST);

export const delLevels = data => ajax("/store-back/member/level/del", data, Method.POST);