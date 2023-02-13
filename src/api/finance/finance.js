import {ajax, Method,ReqContentType} from "@/api/request";

export const getFinanceList = data => ajax("/admin-back/finance/list", data);

export const getMatchMarkerPostalApplyList = data => ajax("/admin-back/finance/matchmarker-postal-applylist", data);

export const getMemberPostalApplyList = data => ajax("/admin-back/finance/member-postal-applylist", data);

export const checkMemberPostalApply = data => ajax("/admin-back/finance/member-postal/check", data, Method.POST);

export const checkMatchMarkerPostalApply = data => ajax("/admin-back/finance/matchmarker-postal/check", data, Method.POST);

// 其他费用
export const saveChargeConfig = data => ajax("/admin-back/store-charge-conf/save", data, Method.POST,ReqContentType.APPLICATION_JSON);
export const ChargeConfigDetail = data => ajax("/admin-back/store-charge-conf/config", data);
export const ChargeConfigList = data => ajax("/admin-back/store-charge-conf/list", data);
