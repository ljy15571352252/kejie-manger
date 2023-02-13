import {ajax, Method, ReqContentType} from "@/api/request";

export const verifySmsCode = (data) => ajax("/code/sms-verify/mobileVerify",data);

export const sendMobileSmsCode = data => ajax("/code/sms/mobileVerify", data, Method.POST,ReqContentType.APPLICATION_FORM);
/** 商户自己的短信 **/
export const sendStoreSmsCode = data => ajax("/store-back/sms/send", data, Method.POST,ReqContentType.APPLICATION_FORM);

export const verifyStoreSmsCode = (data) => ajax("/store-back/sms/verify-code/mobileVerify",data);