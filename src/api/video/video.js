import {ajax, Method, ReqContentType} from "@/api/request";

export const getVideoList = data => ajax("/store-back/video/list", data);
export const getVideoDetail = data => ajax("/store-back/video/detail", data);

export const addVideo = data => ajax("/store-back/video/add", data, Method.POST);

export const editVideo = data => ajax("/store-back/video/edit", data, Method.POST);

export const delVideo = data => ajax("/store-back/video/del", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const getVideoCategories = data => ajax("/store-back/video/category/list", data);

export const getVideoCategoryPageList = data => ajax("/store-back/video/category/pageList", data);

export const addVideoCategory = data => ajax("/store-back/video/category/add", data, Method.POST);

export const editVideoCategory = data => ajax("/store-back/video/category/edit", data, Method.POST);

export const delVideoCategory = data => ajax("/store-back/video/category/del", data, Method.POST,ReqContentType.APPLICATION_FORM);
// 上传图片
export const uploadImgForAli = data => ajax("/upload/img", data, Method.POST,ReqContentType.APPLICATION_FILE);
