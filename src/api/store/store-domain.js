import {ajax, Method} from "@/api/request";

export const getDomainList = params => 
    ajax("/admin-back/store-domain-manage/list", params);


export const addDomain = params => 
    ajax("/store-back/store-domain/add", params, Method.POST);

export const editDomain = params => 
    ajax("/store-back/store-domain/edit", params, Method.POST);

export const delDomain = (code,storeCode) => 
    ajax("/store-back/store-domain/del?code="+code+"&storeCode="+storeCode,null, Method.POST);
