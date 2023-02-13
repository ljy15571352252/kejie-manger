import {ajax, Method} from "@/api/request";

export const getSysSmsPriceList = ()  => ajax("/store-back/config-set/sms/price-list");
export const createSysSmsOrder = (data)  => ajax("/store-back/config-set/sms/create-sys-sms-order",data,Method.POST);
export const getBuySysOrderHistory=(data)=>ajax("/store-back/config-set/sms/sms-order-history",data);
export const getSmsConfig = ()  => ajax("/store-back/config-set/sms/config");

export const updateSmsConfig = data => ajax("/store-back/config-set/sms/update-config", data, Method.POST);

export const getSmsTemList = (data)  => ajax("/store-back/config-set/sms/tem-list",data);

export const updateSmsTem = data => ajax("/store-back/config-set/sms/update-tem", data, Method.POST);