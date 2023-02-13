import {ajax, Method} from "@/api/request";


export const getShareConfig = ()  => ajax("/store-back/config-set/share-config");

export const updateShareConfig = data => ajax("/store-back/config-set/update-share-config", data, Method.POST);



export const getBasicConfig = ()  => ajax("/store-back/config-set/basic-config");

export const updateBasicConfig = data => ajax("/store-back/config-set/update-basic-config", data, Method.POST);


export const getPostalConfig=()=>ajax("/store-back/config-set/postal-config");


export const updatePostalConfig = data => ajax("/store-back/config-set/update-postal-config", data,Method.POST);

export const getMemberCommissionConfig=()=>ajax("/store-back/config-set/member-commission-config");

export const updateMemberCommissionConfig = data => ajax("/store-back/config-set/update-member-commission-config", data,Method.POST);

export const getKuaidiConfig = () => ajax('/store-back/config-set/express/kuaidi100-config')

export const updateKuaidiConfig = data => ajax('/store-back/config-set/express/update-kuaidi100-config', data,Method.POST)