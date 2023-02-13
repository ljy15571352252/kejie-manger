import router from "@/router";
import store from "@/store";
// 权限校验
/**
 * @returns {Boolean}
 * @example v-if="checkPermission([1])"
 * @param permissions
 */
export const checkPermission = permissions => {
    if (permissions && permissions instanceof Array && permissions.length > 0) {
        const userPermissions = store.getters && store.getters.permissions;
        let flag = false;
        permissions.map(r => {
            flag = userPermissions.includes(r);
        });
        return flag;
    } else {
        // 如果是挂在到vue全局使用  v-if="$checkPermission([1])"
        console.error(`需要按照这个格式来设置 v-if="checkPermission([1])"`);
        return false;
    }
};

// 判断是否为空 不为空返回数据 为空返回--
export const isNotNull = (data, str) => {
    if (isBlank(str)) {
        str = "--";
    }
    if (
        data == null ||
        data === "null" ||
        data === "" ||
        data === undefined ||
        data === "undefined" ||
        data === "unknown"
    ) {
        return str;
    } else {
        return data;
    }
};

// 判断是否为空 返回true/false
export const isBlank = data => {
    if (
        data == null ||
        data === "null" ||
        data === "" ||
        data === undefined ||
        data === "undefined" ||
        data === "unknown"
    ) {
        return true;
    } else {
        return false;
    }
};

// 返回上一页
export const backPage = () => {
    router.go(-1);
};

/**
 * 判断是否空对象
 * @param data
 * @returns {boolean}
 */
export function isEmptyObject(data) {
    if (typeof data === "number") {
        //数字都不为空
        return false;
    }
    if (data === undefined || data === null || data === "") {
        return true;
    }
    if (data.__proto__.constructor === Array) {
        //如果是数组
        return data.length === 0;
    }
    if (typeof data === "object") {
        //如果是json对象
        for (let i in data) {
            return !1;
        }
        return !0;
    }
    return false;
}

/**
 * json转formdata
 * @param json
 * @returns {string}
 */
export function jsonToFormData(json) {
    let str = "";
    for (let key in json) {
        let value = json[key];
        if (value != null && typeof value !== "undefined" && value !== "null") {
            if (value.__proto__.constructor === Array) {
                for (let index in value) {
                    if (typeof value[index] !== "function") {
                        str += "&" + key + "=" + value[index];
                    }
                }
                continue;
            }
            str += "&" + key + "=" + value;
        }
    }
    return str === "" ? str : str.substr(1);
}

/**
 *
 * @param json
 */
export function escapeEmptyValue(json) {
    let data = {};
    for (let key in json) {
        let value = json[key];
        // if (value !== null && typeof value !== 'undefined') {
        if (!!value) {
            data[key] = value;
        }
    }
    return data;
}

/**
 * 重置json
 * @param json
 */
export function resetToNullValue(json) {
    for (let key in json) {
        json[key] = null;
    }
}

export function copyJson(json) {
    //return Object.assign({},json);
    return JSON.parse(JSON.stringify(json))
}

export function getLocationPathQuery() {
    let query = window.location.search;
    let json = {};
    if (query) {
        query = query.substr(1);
        let arr = query.split("&");
        for (let index in arr) {
            let str = arr[index];
            json[str.split("=")[0]] = str.split("=")[1];
        }
    }
    return json;
}

export function checkValidImageFile(file) {
    let exp = /\/jpg$|\/jpeg$|\/png$/i;
    let isJPG = exp.test(file.type);
    //console.log(file.type,exp.test(file.type));
    let isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG) {
        this.$Message.error("上传图片只能是 JPG或png 格式!");
    }
    if (!isLt2M) {
        this.$Message.error("上传图片大小不能超过 2MB!");
    }
    return isJPG && isLt2M;
}
export function promiseResult(promise) {
    return promise
        .then(data => {
            return [data, null];
        })
        .catch(err => [null,err]);
}