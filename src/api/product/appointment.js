import { ajax, Method } from "@/api/request";

export const getAppointmentList = data => ajax("/admin-back/appointment/list", data);

export const getAppointmentConfig = data => ajax("/admin-back/appointment/config", data);

export const updateAppointmentConfig = data =>
    ajax("/admin-back/appointment/update-config", data, Method.POST);
export const addAppointment = data =>
    ajax("/admin-back/appointment/add", data, Method.POST);

export const editAppointment = data =>
    ajax("/admin-back/appointment/edit", data, Method.POST);

export const delAppointment = data =>
    ajax("/admin-back/appointment/del", data, Method.POST);
