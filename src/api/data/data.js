import {ajax, Method} from "@/api/request";

export const getTown = data => ajax("/data/getArea/town", data);

export const getTagCategories=()=>ajax("/data/tags-categories");

export const loadNations=()=>ajax("/data/loadNations");

export const loadJobs=()=>ajax("/data/loadJobs");

export const getIcons = data => ajax("/data/icons", data);
