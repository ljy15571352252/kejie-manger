import {ajax, Method, ReqContentType} from "@/api/request";

export const getWeChatConfig = () => ajax("/store-back/config-set/wechat/wechat-config");

export const updateWeChatConfig = data => ajax("/store-back/config-set/wechat/update-wechat-config", data, Method.POST);

export const saveWeixinAuthInfo=(data)=> ajax("/store-back/config-set/wechat/save-wx-auth-info", data);

export const getWeixinAuthInfo=(data)=> ajax("/store-back/config-set/wechat/wx-auth-info", data);

export const getMpProgramVersions=(data)=> ajax("/store-back/config-set/wechat/mp-code-versions", data);

export const getMpProgramOperateLogs=(data)=> ajax("/store-back/config-set/wechat/mp-oper-logs", data);

export const submitMpProgramAudit=(data)=> ajax("/store-back/config-set/wechat/mp-audit", data,Method.POST,ReqContentType.APPLICATION_FORM);
export const getLatestAuditMpProgram=(data)=> ajax("/store-back/config-set/wechat/latest-mp-audit", data);


export const getMpProgramAuditStatus=(data)=> ajax("/store-back/config-set/wechat/mp-audit-status", data);

export const releaseMpProgram=(data)=> ajax("/store-back/config-set/wechat/mp-release", data,Method.POST,ReqContentType.APPLICATION_FORM);

export const bindMpProgramExperiencer=(data)=> ajax("/store-back/config-set/wechat/mp-experiencer-bind", data,Method.POST,ReqContentType.APPLICATION_FORM);

export const unbindMpProgramExperiencer=(data)=> ajax("/store-back/config-set/wechat/mp-experiencer-unbind", data,Method.POST,ReqContentType.APPLICATION_FORM);

export const getMpProgramExperienceCode=(data)=> ajax("/store-back/config-set/wechat/mp-experience-qrcode", data);

export const getMpProgramCode=(data)=> ajax("/store-back/config-set/wechat/mp-code", data);

// 获取微信小程序配置
export const getMpWeChatConfig = () => ajax("/store-back/config-set/wechat/mpwechat-config");
// 更新微信小程序配置
export const updateMpWeChatConfig = data => ajax("/store-back/config-set/wechat/update-mpwechat-config", data, Method.POST);
// 获取微信公众号配置
export const getWxPublicConfig = () => ajax("/store-back/config-set/wechat/wxpublic-config");
// 更新公众号配置
export const updateWxPublicConfig = data => ajax("/store-back/config-set/wechat/update-wxpublic-config", data, Method.POST);

export const getMatchmmakerConfig = data => ajax("/admin-back/matchmmaker-wechat-config/config",data);
export const updateMatchmmakertConfig = data => ajax("/admin-back/matchmmaker-wechat-config/save", data, Method.POST);

