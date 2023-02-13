export function formatTime(value, type) {
    if (value == null || value === "") {
        return null;
    }

    let dataTime = "";
    let data = new Date();
    data.setTime(value);
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate();
    let hour = data.getHours();
    let minute = data.getMinutes();
    let second = data.getSeconds();

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    if (second < 10) {
        second = "0" + second;
    }

    if (type === "YMD") {
        dataTime = year + "-" + month + "-" + day;
    } else if (type === "YMDHMS") {
        dataTime =
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hour +
            ":" +
            minute +
            ":" +
            second;
    } else if (type === "HMS") {
        dataTime = hour + ":" + minute + ":" + second;
    } else if (type === "YM") {
        dataTime = year + "-" + month;
    } else if (type === "MD") {
        dataTime = month + "-" + day;
    }
    return dataTime;
}

/**
 * 价格保持2位数字
 * @param value
 * @returns {string}
 */
export function price(value) {
    value = parseFloat(value);
    if (isNaN(value)) return "";
    return value.toFixed(2) + "元";
}

export function sex(val) {
    if (typeof val === "undefined") return "未知";
    return val ? "男" : "女";
}
export function sexTag(val) {
    if (typeof val === "undefined") return "default";
    return val ? "primary" : "#FFA2D3";
}
/**
 * 过滤掉空字符串
 */
export function escapeEmpty(val, str) {
    if (typeof val == "undefined" || val == null) return str;
    return val;
}

/**
 * 支付方式
 */
export function payType(val, str) {
    let result = new Map([
        [1, "微信支付"],
        [2, "支付宝支付"],
    ]);
    return result.get(parseInt(val));
}

export function accountStatus(val, color) {
    const strMap = new Map([
        [1, "正常"],
        [2, "禁用"],
    ]);
    const colorMap = new Map([
        [1, "green"],
        [2, "red"],
    ]);
    return color?colorMap.get(parseInt(val)):strMap.get(parseInt(val));
}

export function showHideStatus(val, str) {
    let result = new Map([
        [1, "显示"],
        [2, "隐藏"],
    ]);
    return result.get(parseInt(val));
}

export function statusColorType(val, str) {
    let result = new Map([
        [1, "green"],
        [2, "red"],
    ]);
    return result.get(parseInt(val));
}
export function checkStateColorType(val, str) {
    let result = new Map([
        [1, "blue"],
        [2, "green"],
        [3, "red"],
    ]);
    return result.get(parseInt(val));
}

export function activityStatusColorType(val, str) {
    let result = new Map([
        [1, "blue"],
        [2, "green"],
        [3, "red"],
    ]);
    return result.get(parseInt(val));
}

export function activityStatus(val, str) {
    let result = new Map([
        [1, "未开始"],
        [2, "进行中"],
        [3, "已结束"],
    ]);
    return result.get(parseInt(val));
}

export function displayStyle(val, str) {
    let result = new Map([
        [true, str],
        [false, "none"],
    ]);
    return result.get(val);
}
export function checkState(val, color) {
    let strMap = new Map([
        [1, "待审核"],
        [2, "通过审核"],
        [3, "已驳回"],
    ]);
    let colorMap = new Map([
        [1, "blue"],
        [2, "green"],
        [3, "red"],
    ]);
    return color?colorMap.get(parseInt(val)):strMap.get(parseInt(val));
}


export function monthlySalary(val, str) {
    let result = new Map([
        [1, "3000以下"],
        [2, "3000-9000"],
        [3, "9000-15000"],
        [4, "15000-20000"],
        [5, "20000-50000"],
        [6, "50000以上"],
    ]);
    return result.get(parseInt(val));
}

export function marriageStatus(val, str) {
    let result = new Map([
        [1, "未婚"],
        [2, "已婚"],
        [3, "丧偶"],
        [4, "离异"],
        [5, "有小孩（归自己）"],
        [6, "有小孩（归他人）"],
        [7, "其他"],
    ]);
    return result.get(parseInt(val));
}

export function marriageTimeType(val, str) {
    let result = new Map([
        [1, "不限"],
        [2, "认同闪婚"],
        [3, "半年内"],
        [4, "一年内"],
        [5, "两年内"],
        [6, "三年内"],
        [7, "认同时机成熟"],
    ]);
    return result.get(parseInt(val));
}
export function buyCarCond(val, str) {
    let result = new Map([
        [1, "暂无购车"],
        [2, "已购（经济型）"],
        [3, "已购（中档型）"],
        [4, "已购（豪华型）"],
        [5, "单位用车"],
    ]);
    return result.get(parseInt(val));
}
export function education(val, str) {
    let result = new Map([
        [1, "高中"],
        [2, "本科"],
        [3, "大专"],
        [4, "研究生"],
        [5, "博士"],
        [6, "博士后"],
        [7, "其他"],
    ]);
    return result.get(parseInt(val));
}
export function houseCond(val, str) {
    let result = new Map([
        [1, "暂无"],
        [2, "已购房（按揭）"],
        [3, "已购（全款）"],
        [4, "与人合租"],
        [5, "独自租房"],
        [6, "与父母同住"],
        [7, "住亲戚家"],
        [8, "住单位房"],
        [9, "自建房"],
    ]);
    return result.get(parseInt(val));
}
export function ageRange(val, str) {
    let result = new Map([
        [1, "18-20岁"],
        [2, "23-25岁"],
        [3, "26-30岁"],
        [4, "31-35岁"],
        [5, "36-40岁"],
        [6, "41-45岁"],
        [7, "46-50岁"],
        [8, "50岁以上"],
    ]);
    return result.get(parseInt(val));
}
export function tallRange(val, str) {
    let result = new Map([
        [1, "155cm以下"],
        [2, "156-160cm"],
        [3, "161-165cm"],
        [4, "166-170cm"],
        [5, "171-175cm"],
        [6, "175-180cm"],
        [7, "180cm以上"],
    ]);
    return result.get(parseInt(val));
}
export function mateRequireCarCond(val, str) {
    let result = new Map([
        [1, "有"],
        [2, "无"],
    ]);
    return result.get(parseInt(val));
}
export function mateRequireHouseCond(val, str) {
    let result = new Map([
        [1, "有"],
        [2, "无"],
    ]);
    return result.get(parseInt(val));
}
export function commissionOrderType(val, str) {
    let result = new Map([
        [1, "会员卡订单"],
        [2, "联系方式购买"],
        [3, "线下牵线"],
        [4, "参加活动"],
        [5, "实名认证"],
    ]);
    return result.get(parseInt(val));
}

export const inOut = (val, color=false) => {
    const strMap = new Map([
        [1, "进账"],
        [2, "出账"],
    ]);
    const colorMap = new Map([
        [1, "green"],
        [2, "blue"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};

export const postalType = (val, color) => {
    const strMap = new Map([
        [1, "支付宝"],
        [2, "微信"],
    ]);
    const colorMap = new Map([
        [1, "blue"],
        [2, "green"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};

export const complainType = (val, color) => {
    const strMap = new Map([
        [1, "涉黄"],
        [2, "涉嫌欺诈"],
        [3, "其他"],
    ]);
    const colorMap = new Map([
        [1, "blue"],
        [2, "green"],
        [3, "red"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};
export const appointmentState = (val, color) => {
    const strMap = new Map([
        [1, "待约会"],
        [2, "已赴约"],
        [3, "已取消"],
    ]);
    const colorMap = new Map([
        [1, "blue"],
        [2, "green"],
        [3, "red"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};
export const commonOrderState = (val, color) => {
    const strMap = new Map([
        [1, "待付款"],
        [2, "已付款"],
        [3, "付款失败"],
        [4, "订单取消"],
        [5, "交易成功"],
    ]);
    const colorMap = new Map([
        [1, "blue"],
        [2, "green"],
        [3, "red"],
        [4, "red"],
        [5, "green"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};

export const coinsOrderType = (val, color) => {
    const strMap = new Map([
        [1, "按套餐购买"],
        [2, "自定义金币"],
    ]);
    const colorMap = new Map([
        [1, "blue"],
        [2, "green"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};
export const functionState = (val, color) => {
    const strMap = new Map([
        [1, "展示"],
        [2, "隐藏"],
    ]);
    const colorMap = new Map([
        [1, "green"],
        [2, "red"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};
export const storeState = (val, color) => {
    const strMap = new Map([
        [1, "正常"],
        [2, "隐藏"],
        [3, "已过期"],
    ]);
    const colorMap = new Map([
        [1, "green"],
        [2, "red"],
        [3, "gray"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};
export const mobileVerify = (val, color) => {
    const strMap = new Map([
        [1, "已验证"],
        [2, "未验证"],
        [3, "未填写手机号"],
    ]);
    const colorMap = new Map([
        [1, "green"],
        [2, "gold"],
        [3, "red"],
    ]);
    return color ? colorMap.get(parseInt(val)) : strMap.get(parseInt(val));
};

// 域名类型
export const domainType = (val) => {
    const strMap = new Map([
        [1, "商户后台"],
        [2, "加盟商后台"],
        [3, "红娘"],
    ]);
    return strMap.get(parseInt(val));
}
// 平台开通价格_平台
export const storePricePlatform = (val) => {
    const strMap = new Map([
        [1, "小程序"],
        [2, "公众号"],
        [3, "APP"],
    ]);
    return strMap.get(parseInt(val));
}
// 平台开通价格类型
export const storePriceType = (val) => {
    const strMap = new Map([
        [1, "按天收费"],
        [2, "按月收费"],
        [3, "按年收费"],
    ]);
    return strMap.get(parseInt(val));
}

// 菜单资源类型
export const storeModuleType = (val) => {
    const strMap = new Map([
        [0,"顶部目录"],
        [1,"左侧目录"],
        [2,"左侧菜单"],
        [3,"页面按钮"]
    ])
    return strMap.get(parseInt(val))
}

// 前台页面模板类型
export const storePageModuleType = (val) => {
    const strMap = new Map([
        [1,"会员端小程序"],
        [2,"公众号模块页面"]
    ])
    return strMap.get(parseInt(val))
}

export const aftersalesType = (val) =>{

    const strMap = new Map([
        [1, "退货退款"],
        [2, "仅退货"],
        [3, "换货"]
    ]);
    return  strMap.get(parseInt(val));
}

export const aftersalesState = (val) =>{

    const strMap = new Map([
        [1, "待商家同意"],
        [2, "等待买家发货(退货)"],
        [3, "等待商家确认收货(退货)"],
        [4, "待商家发货(换货)"],
        [5, "待买家收货(换货)"],
        [6, "售后完成"],
        [7, "售后取消"],
    ]);
    return  strMap.get(parseInt(val));
}

export const aftersalesRefundType = (val) =>{

    const strMap = new Map([
        [1, "原路返回"],
    ]);
    return  strMap.get(parseInt(val));
}

export const groupAftersalesState = (val) =>{

    const strMap = new Map([
        [1, "待商家同意"],
        [2, "售后完成"],
        [3, "售后取消"]
    ]);
    return  strMap.get(parseInt(val));
}