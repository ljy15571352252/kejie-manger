import axios from "axios";
import {
  Message,
  Modal
} from "view-design";
import {
  jsonToFormData,
  isBlank
} from "@/common/vue-expand";
import router from "../router/index";
import {
  USER_TOKEN
} from "@/common/storageKeys";
import {
  LOGOUT
} from "@/store/actionTypes";
import store from "../store";
let ReqContentType = {
  APPLICATION_JSON: "application/json;charset=UTF-8",
  APPLICATION_FORM: "application/x-www-form-urlencoded;charset=UTF-8",
};

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 30000, // 请求超时时间 默认30秒
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest", //设置该请求头用于服务器判断是否Ajax请求
  },
});

/**
 * 请求前配置
 */
service.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem(USER_TOKEN);
    if (token && !config.headers["Authorization"]) {
      token = JSON.parse(token);
      config.headers[
        "Authorization"
      ] = `${token.token_type} ${token.access_token}`;
    }

    //请求操作
    if (config.method === "post") {
      if (config.data instanceof Object) {
        //如果传进来的是一个对象
        let params = "";
        for (let k in config.data) {
          params += `&${k}=${config.data[k]}`;
        }
        config.data = params;
      }
    }
    return config;
  },
  (error) => {
    console.log("错误的传参", "fail");
    return Promise.reject(error);
  }
);

/**
 * 响应配置
 */
service.interceptors.response.use(
  (response) => {
    const {
      data
    } = response;
    if (data.data) {
      return data.data;
    }
    let {
      errCode,
      errMsg
    } = data;
    if (errMsg) {
      Message.error(errMsg);
      throw data
      // return data;
    }
    return response;
  },
  (error) => {
    switch (error.response.status) {
      case 401:
        /** 无权限访问，去登录 **/

        let names = ["login", "forgot", "register"];
        let name = router.history.current.name;
        if (names.includes(name)) return;
        Modal.warning({
          title: "登录超时",
          content: "<p>登录信息已过期，请重新登录</p>",
          onOk: () => {
            store.dispatch(LOGOUT).then(() => {
              router.push({
                name: "login"
              });
            })
          },
        });
        break;
      case 500:
        // if (typeof error.response.data.code !== "undefined") {
        // Message.error(error.response.data.errMsg);
        // return error.response.data;
        // }
        break;
      case 415:
        // Message.error(error.response.data.errMsg);
        // return error.response.data;
      case 400:
        // Message.error(error.response.data.errMsg);
    }
  }
);

export default service;

export function ajax(
  url = "",
  data = {},
  method = "GET",
  contentType = ReqContentType.APPLICATION_JSON,
  headers = {}
) {
  return new Promise(function (resolve, reject) {
    let axiosRes;
    switch (method) {
      case "GET":
        let subffix = isBlank(data) ? "" : "?" + jsonToFormData(data);
        axiosRes = service.get(url + subffix, headers);
        break;
      case "POST":
        axiosRes = service({
          url: url,
          method: "post",
          headers: {
            "Content-Type": contentType,
            ...headers,
          },
          data: contentType === ReqContentType.APPLICATION_FORM ?
            jsonToFormData(data) : JSON.stringify(data),
        });
        break;
      case Method.DELETE:
        axiosRes = service({
          url: url,
          method: 'delete',
          headers: headers
        })
        break
    }
    axiosRes
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

let Method = {
  GET: "GET",
  POST: "POST",
  DELETE: 'delete'
};

export {
  Method,
  ReqContentType
};