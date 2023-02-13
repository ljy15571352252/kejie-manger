import {ajax, Method} from "@/api/request";
export const getMerchantList = data => ajax("/admin-back/merchant/list", data);

export const getMerchantDetail = data => ajax("/admin-back/merchant/detail", data);

export const addMerchant = data => ajax("/admin-back/merchant/add", data, Method.POST);

export const editMerchant = data => ajax("/admin-back/merchant/edit", data, Method.POST);

export const checkMerchant = data => ajax("/admin-back/merchant/check", data, Method.POST);



export const addDevice = data => ajax("/admin-back/device/add", data, Method.POST);
export const delDevice = data => ajax("/admin-back/device/del", data, Method.POST);
export const editDevice = data => ajax("/admin-back/device/edit", data, Method.POST);
export const deviceDetail = data => ajax("/admin-back/device/detail", data);
export const deviceList = data => ajax("/admin-back/device/list", data);

export const addDeviceService = data => ajax("/admin-back/device-service-acc/add", data, Method.POST);
export const delDeviceService = data => ajax("/admin-back/device-service-acc/del", data, Method.POST);
export const editDeviceService = data => ajax("/admin-back/device-service-acc/edit", data, Method.POST);
export const deviceServiceDetail = data => ajax("/admin-back/device-service-acc/detail", data);
export const deviceServiceList = data => ajax("/admin-back/device-service-acc/list", data);

export const addDeviceCode = data => ajax("/admin-back/device-code/add", data, Method.POST);
export const delDeviceCode = data => ajax("/admin-back/device-code/del", data, Method.POST);
export const editDeviceCode = data => ajax("/admin-back/device-code/edit", data, Method.POST);
export const deviceCodeDetail = data => ajax("/admin-back/device-code/detail", data);
export const deviceCodeList = data => ajax("/admin-back/device-code/list", data);

export const addDeviceAd = data => ajax("/admin-back/device-ad/add", data, Method.POST);
export const auditDeviceAd = data => ajax("/admin-back/device-ad/audit", data, Method.POST);
export const delDeviceAd = data => ajax("/admin-back/device-ad/del", data, Method.POST);
export const editDeviceAd = data => ajax("/admin-back/device-ad/edit", data, Method.POST);
export const deviceAdDetail = data => ajax("/admin-back/device-ad/detail", data);
export const deviceAdList = data => ajax("/admin-back/device-ad/list", data);