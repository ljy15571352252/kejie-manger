import { ajax,Method, ReqContentType } from "@/api/request";

// 会员列表
export const getMemberList = params =>
    ajax("/admin-back/member-manage/list", params);

// 会员详情
export const getMemberDetail = params =>
    ajax("/admin-back/member-manage/detail",params)

// 会员余额
export const getBalanceLogs = params =>
    ajax("/admin-back/member-manage/balance-logs",params)

// 会员消费明细
export const getConsumeRecords = params =>
    ajax('/admin-back/member-manage/consume-records',params)

export const getHeaderCheckList = data => ajax("/store-back/header-check/list", data);

export const checkHeader = data => ajax("/store-back/header-check/check", data, Method.POST);




export const addMember = data => ajax("/store-back/member/add", data, Method.POST);
export const updateMemberDetail = data => ajax("/store-back/member/update", data, Method.POST);

export const updateMemberStatus = data => ajax("/store-back/member/update-member-status", data, Method.POST);

export const setMemberLevel = data => ajax("/store-back/member/set-member-level", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const getMemberPointsRecords = data => ajax("/store-back/member/points-records", data);

export const getMemberLookRecords = data => ajax("/store-back/member/look-records", data);
export const getMemberFollowers = data => ajax("/store-back/member/follower-list", data);

export const getMemberBalanceLogs = data => ajax("/store-back/member/balance-logs", data);

export const getMemberConsumeRecords = data => ajax("/store-back/member/consume-records", data);

export const getMemberShareRecords = data => ajax("/store-back/member/share-records", data);
// 设置推荐人
export const setMemberRecommender = data => ajax("/store-back/member/set-member-recommender",data,Method.POST)