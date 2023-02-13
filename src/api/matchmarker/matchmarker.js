import {ajax, Method} from "@/api/request";

export const getMatchMarkerList = data => ajax("/admin-back/matchmarker-manage/list", data);

export const getMatchMarkerDetail = data => ajax("/admin-back/matchmarker-manage/detail", data);

export const getMatchMarkerCommissionRecords = data => ajax("/admin-back/matchmarker-manage/commission-records", data);

export const addMatchMarker = data => ajax("/admin-back/matchmarker-manage/add", data, Method.POST);

export const editMatchMarker = data => ajax("/admin-back/matchmarker-manage/edit", data, Method.POST);

export const checkMatchMarker = data => ajax("/admin-back/matchmarker-manage/audit", data, Method.POST);
export const updateMatchmarkerStatus = data => ajax("/admin-back/matchmarker-manage/update-status", data, Method.POST);


export const getQianxianList = data => ajax("/admin-back/qianxian/list", data);