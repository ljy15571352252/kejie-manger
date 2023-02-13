export const DatePickerOptions = {
    shortcuts: [{
            text: "今天",
            value() {
                const start = new Date();
                return [start, start];
            },
        },
        {
            text: "昨天",
            value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                return [start, end];
            },
        },
        {
            text: "本周",
            value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
            },
        },
        {
            text: "本月",
            value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
            },
        },
    ],
};
export const workOptions = () => {
    let map = new Map([
        [1, "交通运输"],
        [2, "环保"],
        [3, "能源"],
        [4, "冶金矿产"],
        [5, "化工"],
        [6, "数码、电脑"],
        [7, "家用电器"],
        [8, "电工电器"],
        [9, "纺织、皮革"],
        [10, "服装"],
        [11, "食品、饮料"],
        [12, "农业"],

    ]);
    return toSelectOptions(map);
};
export const groupOrderStateOptions = () => {
    let map = new Map([
        [1, "待付款"],
        [2, "已付款"],
        [3, "付款失败"],
        [4, "订单取消"],
        [5, "交易成功"],
    ]);
    return toSelectOptions(map);
};
export const productOrderStateOptions = () => {
    let map = new Map([
        [1, "待付款"],
        [2, "已付款"],
        [3, "付款失败"],
        [4, "订单取消"],
        [5, "交易成功"],
    ]);
    return toSelectOptions(map);
};
export const BooleanTransfer = val => {
    if (typeof val == "undefined" || val == null) return null;
    let map = new Map([
        [1, true],
        [0, false],
    ]);
    return map.get(parseInt(val));
};
export const TransferToBoolean = val => {
    if (typeof val == "undefined" || val == null) return null;
    let map = new Map([
        [true, 1],
        [false, 0],
    ]);
    return map.get(val);
};
export const OrderTransfer = val => {
    if (typeof val == "undefined" || val == null) return null;
    let map = new Map([
        [1, true],
        [0, false],
    ]);
    return map.get(parseInt(val));
};

function toSelectOptions(map) {
    let options = [];
    for (let item of map.entries()) {
        options.push({
            value: item[0],
            label: item[1],
        });
    }
    return options;
}
export const yesOrNoOptions = (yesTxt = "是", noTxt = "否") => {
    let map = new Map([
        [1, yesTxt],
        [0, noTxt],
    ]);
    return toSelectOptions(map);
};
export const showHideStatusOptions = () => {
    let map = new Map([
        [1, "显示"],
        [2, "隐藏"],
    ]);
    return toSelectOptions(map);
};
export const accountStatusOptions = () => {
    let map = new Map([
        [1, "正常"],
        [2, "禁用"],
    ]);
    return toSelectOptions(map);
};

export const activityStatusOptions = () => {
    let map = new Map([
        [1, "未开始"],
        [2, "进行中"],
        [3, "已结束"],
    ]);
    return toSelectOptions(map);
};
export const sexOptions = () => {
    let map = new Map([
        [1, "男"],
        [0, "女"],
    ]);
    return toSelectOptions(map);
};
export const inOutOptions = () => {
    let map = new Map([
        [1, "进账"],
        [2, "出账"],
    ]);
    return toSelectOptions(map);
};
export const monthlySalaryOptions = () => {
    let map = new Map([
        [1, "3000以下"],
        [2, "3000-9000"],
        [3, "9000-15000"],
        [4, "15000-20000"],
        [5, "20000-50000"],
        [6, "50000以上"],
    ]);
    return toSelectOptions(map);
};
export const marriageStatusOptions = () => {
    let map = new Map([
        [1, "未婚"],
        [2, "已婚"],
        [3, "丧偶"],
        [4, "离异"],
        [5, "有小孩（归自己）"],
        [6, "有小孩（归他人）"],
        [7, "其他"],
    ]);
    return toSelectOptions(map);
};
export const marriageTimeTypeOptions = () => {
    let map = new Map([
        [1, "不限"],
        [2, "认同闪婚"],
        [3, "半年内"],
        [4, "一年内"],
        [5, "两年内"],
        [6, "三年内"],
        [7, "认同时机成熟"],
    ]);
    return toSelectOptions(map);
};
export const buyCarCondOptions = () => {
    let map = new Map([
        [1, "暂无购车"],
        [2, "已购（经济型）"],
        [3, "已购（中档型）"],
        [4, "已购（豪华型）"],
        [5, "单位用车"],
    ]);
    return toSelectOptions(map);
};
export const educationOptions = () => {
    let map = new Map([
        [1, "高中"],
        [2, "本科"],
        [3, "大专"],
        [4, "研究生"],
        [5, "博士"],
        [6, "博士后"],
        [7, "其他"],
    ]);
    return toSelectOptions(map);
};
export const houseCondOptions = () => {
    let map = new Map([
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
    return toSelectOptions(map);
};
export const ageRangeOptions = () => {
    let map = new Map([
        [1, "18-20岁"],
        [2, "23-25岁"],
        [3, "26-30岁"],
        [4, "31-35岁"],
        [5, "36-40岁"],
        [6, "41-45岁"],
        [7, "46-50岁"],
        [8, "50岁以上"],
    ]);
    return toSelectOptions(map);
};
export const tallRangeOptions = () => {
    let map = new Map([
        [1, "155cm以下"],
        [2, "156-160cm"],
        [3, "161-165cm"],
        [4, "166-170cm"],
        [5, "171-175cm"],
        [6, "175-180cm"],
        [7, "180cm以上"],
    ]);
    return toSelectOptions(map);
};
export const mateRequireCarCondOptions = () => {
    let map = new Map([
        [1, "有"],
        [2, "无"],
    ]);
    return toSelectOptions(map);
};
export const mateRequireHouseCondOptions = () => {
    let map = new Map([
        [1, "有"],
        [2, "无"],
    ]);
    return toSelectOptions(map);
};
export const checkStateOptions = () => {
    let map = new Map([
        [1, "待审核"],
        [2, "通过审核"],
        [3, "已驳回"],
    ]);
    return toSelectOptions(map);
};

export const storeStateOptions = () => {
    let map = new Map([
        [1, "正常"],
        [2, "禁用"],
        [3, "已过期"],
    ]);
    return toSelectOptions(map);
};
export const postalOptions = () => {
    let map = new Map([
        [1, "提现到支付宝"],
        [2, "提现到微信"],
    ]);
    return toSelectOptions(map);
};
export const matchMarkerShowTypeOptions = () => {
    let map = new Map([
        [1, "微信客服"],
        [2, "弹窗二维码"],
        [3, "关闭"],
    ]);
    return toSelectOptions(map);
};
export const memberDisplayTypeOptions = () => {
    let map = new Map([
        [1, "只展示异性"],
        [2, "都展示"],
    ]);
    return toSelectOptions(map);
};

export const complainTypeOptions = () => {
    let map = new Map([
        [1, "涉黄"],
        [2, "涉嫌欺诈"],
        [3, "其他"],
    ]);
    return toSelectOptions(map);
};

export const appointmentStateOptions = () => {
    let map = new Map([
        [1, "待约会"],
        [2, "已赴约"],
        [3, "已取消"],
    ]);
    return toSelectOptions(map);
};

export const coinsOrderStateOptions = () => {
    let map = new Map([
        [1, "待付款"],
        [2, "已付款"],
        [3, "付款失败"],
        [4, "订单取消"],
        [5, "交易成功"],
    ]);
    return toSelectOptions(map);
};
export const coinsOrderTypeOptions = () => {
    let map = new Map([
        [1, "按套餐购买"],
        [2, "自定义金币"],
    ]);
    return toSelectOptions(map);
};
export const amountFormat = value =>
    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const amountParser = value => value.replace(/\¥\s?|(,*)/g, '')
export const mpProgramOptions = () => {
    let map = new Map([
        [1, "会员端"],
    ]);
    return toSelectOptions(map);
};
export const smsConfigOptions = () => {
    let map = new Map([
        [1, "系统"],
        [2, "阿里云"],
    ]);
    return toSelectOptions(map);
};
export const upOrDownStatusOptions = () => {
    let map = new Map([
        [1, "上架"],
        [2, "下架"],

    ]);
    return toSelectOptions(map);
};
export const displayTypeOptions = () => {
    let map = new Map([
        /*[1, "列表式"],*/
        [2, "图标式"],
    ]);
    return toSelectOptions(map);
};
export const commonOrderStateOptions = () => {
    let map = new Map([
        [1, "待付款"],
        [2, "已付款"],
        [3, "付款失败"],
        [4, "订单取消"],
        [5, "交易成功"],
    ]);
    return toSelectOptions(map);
};
export const functionsStatusOptions = () => {
    let map = new Map([
        [1, "展示"],
        [2, "隐藏"],
    ]);
    return toSelectOptions(map);
};
export const moduleModalTypeOptions = () => {
    let map = new Map([
        [0, "顶部目录"],
        [1, "左侧目录"],
        [2, "左侧菜单"],
        [3, "页面按钮"],
    ]);
    return toSelectOptions(map);
};