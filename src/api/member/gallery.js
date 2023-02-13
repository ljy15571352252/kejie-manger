import {ajax, Method,ReqContentType} from "@/api/request";

export const getGalleryList = data => ajax("/store-back/member-gallery/list", data);

export const delGalleries = data => ajax("/store-back/member-gallery/del", data, Method.POST);

export const getGroupList = () => ajax("/admin-back/store-source-manage/group-list");

export const addGroup = data => ajax("/store-back/store-source/add-group",data,Method.POST);

export const delGroupList = code => ajax(`/store-back/store-source/del-group?code=${code}`, null, Method.POST);

export const editGroup = data => ajax("/store-back/store-source/edit-group",data,Method.POST);

export const getAlbumList = data => ajax("/admin-back/store-source-manage/source-list",data);

export const delAlbumList = data => ajax("/store-back/store-source/batch-del-source",data,Method.POST);

export const transferAlbumList = data => ajax("/store-back/store-source/batch-transfer-source",data,Method.POST);

export  const addAlbumSource = data => ajax("/store-back/store-source/add-source",data,Method.POST);