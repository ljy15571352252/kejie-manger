import {ajax, Method} from "@/api/request";

export const getResources = () => ajax("/admin-back/resource/list");
