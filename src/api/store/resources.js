import {ajax, Method} from "@/api/request";

export const getResources = () => ajax("/store-back/resource/list");
