import {ajax, Method, ReqContentType} from "@/api/request";

export const getMPAuthUrl = data => ajax("/wechat/mpauth", data);

