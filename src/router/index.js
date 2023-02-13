import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
import Main from "@/components/main/main";
import Center from "@/components/thirdLevelMenu";

/**
 meta: {
    hide: false, 是否在左侧菜单显示 不显示请设为 true
    title: "列表页面", 菜单标题
    icon: "md-grid", 图标
    roleId: 1 菜单权限id 不填写等同于不需要权限校验
    singlePage: true 单页 非嵌套栏目显示
}
 */

// 不需要权限校验的静态路由
export const constantRoutes = [{
        path: "/login",
        name: "login",
        meta: {
            hide: true,
            title: "登录",
        },
        component: () => import("@/views/login/login"),
    },
    {
        path: "/forget-password",
        name: "forgot",
        meta: {
            hide: true,
            title: "重置密码",
        },
        component: () => import("@/views/login/forgot"),
    },
    {
        path: "/register",
        name: "register",
        meta: {
            hide: true,
            title: "用户注册",
        },
        component: () => import("@/views/login/register"),
    },
    {
        path: "/",
        name: "首页",
        redirect: "/workplace",
        component: Main,
        meta: {
            hide: false,
            title: "Dashboard",
            icon: "md-speedometer",
            singlePage: true,
        },
        children: [{
                path: "/workplace",
                name: "workplace",
                meta: {
                    hide: false,
                    title: "首页",
                    access: ["admin"],
                },
                component: () => import("@/views/Dashboard/master_workplace"),
            },

        ],
    },
];

// 需要权限校验的异步路由
export const asyncRoutes = [{
        path: "/site-manage",
        name: "site-manage",
        meta: {
            hide: false,
            title: "网站管理",
            icon: "md-compass",
            access: 8,
        },
        component: Main,
        children: [
                {
                    path: "/page-manage",
                    name: "page-manage",
                    meta: {
                        hide: false,
                        title: "页面管理",
                        access: 8,
                    },
                    component: Center,
                    children:[
                        {
                            path: "/page-list",
                            name: "page-list",
                            meta: {
                                hide: false,
                                title: "官网页面列表",
                                access: 8,
                            },
                            component: () => import("@/views/gw/page/pcPageList"),
                        }
                    ]
                },
                {
                    path: "/function-manage",
                    name: "function-manage",
                    meta: {
                        hide: false,
                        title: "功能表管理",
                        access: 8,
                    },
                    component: Center,
                    children:[
                        {
                            path: "/function-list",
                            name: "function-list",
                            meta: {
                                hide: false,
                                title: "功能表",
                                access: 8,
                            },
                            component: () => import("@/views/gw/functions/list"),
                        }
                    ]
                },
            {
                path: "",
                name: "site-manage",
                meta: {
                    hide: false,
                    title: "网站设置",
                    access: 8,
                },
                component: Center,
                children: [{
                        path: "/site-website-setting",
                        name: "site-website-setting",
                        meta: {
                            hide: false,
                            title: "网站设置",
                            access: 8,
                        },
                        component: () => import("@/views/website/setting"),
                    },
                    {
                        path: "/site-domain-manage",
                        name: "site-domain-manage",
                        meta: {
                            hide: false,
                            title: "域名设置",
                            access: 8,
                        },
                        component: () => import("@/views/domain/list"),
                    },
                    {
                        path: "/site-websize-nav",
                        name: "site-websize-nav",
                        meta: {
                            hide: false,
                            title: "网站导航",
                            access: 8,
                        },
                        component: () => import("@/views/website/list"),
                    },
                    {
                        path: "/site-website-regOrLogin",
                        name: "site-website-regOrLogin",
                        meta: {
                            hide: false,
                            title: "注册登录",
                            access: 8,
                        },
                        component: () => import("@/views/website/regOrLogin"),
                    },
                    {
                        path: "/site-website-pay",
                        name: "site-website-pay",
                        meta: {
                            hide: false,
                            title: "支付设置",
                            access: 8,
                        },
                        component: () => import("@/views/website/pay"),
                    },
                    {
                        path: "/site-website-companyIntro",
                        name: "site-website-companyIntro",
                        meta: {
                            hide: false,
                            title: "公司介绍",
                            access: 8,
                        },
                        component: () => import("@/views/website/companyIntro"),
                    }
                ],
            },
            {
                path: "",
                name: "qianxian-manage",
                meta: {
                    hide: false,
                    title: "资讯",
                    access: 8,
                },
                component: Center,
                children: [{
                        path: "/site-news-list",
                        name: "site-news-list",
                        meta: {
                            hide: false,
                            title: "资讯列表",
                            access: 8,
                        },
                        component: () => import("@/views/website/news/list"),
                    },
                    {
                        path: "/site-news-category",
                        name: "site-news-category",
                        meta: {
                            hide: false,
                            title: "资讯分类",
                            access: 8,
                        },
                        component: () => import("@/views/website/news/category"),
                    },
                ]
            },
        ],
    },

    {
        path: "/business",
        name: "business",
        meta: {
            hide: false,
            title: "运营管理",
            icon: "md-stats",
            access: 8,
        },
        component: Main,
        children: [{
            path: "",
            name: "business-operate",
            meta: {
                hide: false,
                title: "运营管理",
                access: 8,
            },
            component: Center,
            children: [
                // {
                //     path: "/member-commission-setting",
                //     name: "member-commission-setting",
                //     meta: {
                //         hide: false,
                //         title: "提成设置",
                //         access: 8,
                //     },
                //     component: () =>
                //         import("@/views/business/member-commission-set"),
                // },
                // {
                //     path: "/postal-setting",
                //     name: "postal-setting",
                //     meta: {
                //         hide: false,
                //         title: "积分转换",
                //         access: 8,
                //     },
                //     component: () => import("@/views/business/postal-set"),
                // },
                {
                    path: "/mpweixin-setting",
                    name: "mpweixin-setting",
                    meta: {
                        hide: false,
                        title: "小程序设置",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/business/mp-weixin-config"),
                },
                {
                    path: "/sms-setting",
                    name: "sms-setting",
                    meta: {
                        hide: false,
                        title: "短信配置",
                        access: 8,
                    },
                    component: () => import("@/views/business/sms/sms-set"),
                },
                // {
                //     path: "/album-list",
                //     name: "album-list",
                //     meta: {
                //         hide: false,
                //         title: "相册管理",
                //         access: 8,
                //     },
                //     component: () => import("@/views/album"),
                // },
                {
                    path: "/mpweixin-auth",
                    name: "mpweixin-auth",
                    meta: {
                        hide: false,
                        title: "小程序授权",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/business/mp-program-auth"),
                },
                {
                    path: "/template-setting",
                    name: "template-setting",
                    meta: {
                        hide: false,
                        title: "模板管理",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/business/template-set"),
                },
                // {
                //     path: "/domain-manage",
                //     name: "domain-manage",
                //     meta: {
                //         hide: false,
                //         title: "域名管理",
                //         access: 8,
                //     },
                //     component: () => import("@/views/temp"),
                // },
                {
                    path: "/wx-public-set",
                    name: "wx-public-set",
                    meta: {
                        hide: false,
                        title: "公众号设置",
                        access: 8,
                    },
                    component: () => import("@/views/business/public-set"),
                },
                {
                    path: "/wx-matchmarker-set",
                    name: "wx-matchmarker-set",
                    meta: {
                        hide: false,
                        title: "红娘小程序配置",
                        access: 8,
                    },
                    component: () => import("@/views/business/matchmarker-set"),
                },
                {
                    path: "/public-matchmarker-set",
                    name: "public-matchmarker-set",
                    meta: {
                        hide: false,
                        title: "红娘公众号配置",
                        access: 8,
                    },
                    component: () => import("@/views/business/matchmarker-publicSet"),
                },
                {
                    path: "/share-setting",
                    name: "share-setting",
                    meta: {
                        hide: false,
                        title: "分享设置",
                        access: 8,
                    },
                    component: () => import("@/views/business/share-set"),
                },
                {
                    path: "/gift-list",
                    name: "gift-list",
                    meta: {
                        hide: false,
                        title: "礼物设置",
                        access: 8,
                    },
                    component: () => import("@/views/product/gift"),
                },

                {
                    path: "/express-setting",
                    name: "express-setting",
                    meta: {
                        hide: false,
                        title: "快递100配置",
                        access: 8,
                    },
                    component: () => import("@/views/business/express-set"),
                },
                {
                    path: "/base-set",
                    name: "base-set",
                    meta: {
                        hide: false,
                        title: "基本设置",
                        access: 8,
                    },
                    component: () => import("@/views/temp"),
                },
                {
                    path: "/app-set",
                    name: "app-set",
                    meta: {
                        hide: false,
                        title: "APP设置",
                        access: 8,
                    },
                    component: () => import("@/views/temp"),
                },
                // {
                //     path: "/app-setting",
                //     name: "app-setting",
                //     meta: {
                //         hide: false,
                //         title: "APP设置",
                //         access: 8,
                //     },
                //     component: () => import("@/views/temp"),
                // },
            ],
        }, ],
    },
    {
        path: "",
        name: "store",
        meta: {
            hide: false,
            title: "商户管理",
            icon: "md-contact",
            access: 8,
        },
        component: Main,
        children: [{
            path: "",
            name: "store-manage",
            meta: {
                hide: false,
                title: "商户管理",
                access: 8,
            },
            component: Center,
            children: [{
                    path: "/store-list",
                    name: "store-list",
                    meta: {
                        hide: false,
                        title: "商户列表",
                        access: 8,
                    },
                    component: () => import("@/views/store/list"),
                },

                {
                    path: "/store-module",
                    name: "store-module",
                    meta: {
                        hide: false,
                        title: "后台页面管理",
                        access: 8,
                    },
                    component: () => import("@/views/store/module"),
                },
                {
                    path: "/store-page",
                    name: "store-page",
                    meta: {
                        hide: false,
                        title: "小程序/公众号页面管理",
                        access: 8,
                    },
                    component: () => import("@/views/store/page"),
                },
                // {
                //     path: "/store-domain",
                //     name: "store-domain",
                //     meta: {
                //         hide: false,
                //         title: "域名信息",
                //         access: 8,
                //     },
                //     component: () => import("@/views/store/domain"),
                // },
            ]
        }]
    },
    {
        path: "/",
        name: "member",
        meta: {
            hide: false,
            title: "会员管理",
            icon: "ios-switch-outline",
            access: 8,
        },
        component: Main,
        children: [{
                path: "",
                name: "member-manage",
                meta: {
                    hide: false,
                    title: "会员管理",
                    access: 8,
                },
                component: Center,
                children: [
                    // {
                    //     path: "/store-user",
                    //     name: "store-user",
                    //     meta: {
                    //         hide: false,
                    //         title: "商户会员",
                    //         access: 8,
                    //     },
                    //     component: () => import("@/views/store/user"),
                    // },
                    {
                        path: "/member-list",
                        name: "member-list",
                        meta: {
                            hide: false,
                            title: "会员列表",
                            access: 8,
                        },
                        component: () => import("@/views/member/list"),
                    },
                ]
            },

            //         {
            //             path: "/suoshu12ji",
            //             name: "suoshu12ji",
            //             meta: {
            //                 hide: false,
            //                 title: "所属1/2级",
            //                 access: 8,
            //             },
            //             component: () => import("@/views/temp"),
            //         },
        ],
    },
    {
        path: "",
        name: "matchmarker",
        meta: {
            hide: false,
            title: "红娘管理",
            icon: "md-rose",
            access: 8,
        },
        component: Main,
        children: [{
                path: "",
                name: "matchmarker-manage",
                meta: {
                    hide: false,
                    title: "红娘管理",
                    access: 8,
                },
                component: Center,
                children: [{
                        path: "/matchmarker-list",
                        name: "matchmarker-list",
                        meta: {
                            hide: false,
                            title: "红娘列表",
                            access: 8,
                        },
                        component: () => import("@/views/matchmarker/list"),
                    },
                    // {
                    //     path: "/matchmarker-check",
                    //     name: "matchmarker-check",
                    //     meta: {
                    //         hide: false,
                    //         title: "红娘审核",
                    //         access: 8,
                    //     },
                    //     component: () => import("@/views/matchmarker/check-list"),
                    // },
                ],

            },

        ]
    },
    // {
    //     path: "/merchant",
    //     name: "merchant",
    //     meta: {
    //         hide: false,
    //         title: "加盟商",
    //         icon: "md-contacts",
    //         access: 8,
    //     },
    //     component: Main,
    //     children: [{
    //         path: "",
    //         name: "merchant-manage",
    //         meta: {
    //             hide: false,
    //             title: "加盟商管理",
    //             access: 8,
    //         },
    //         component: Center,
    //         children: [{
    //                 path: "/city-list",
    //                 name: "city-list",
    //                 meta: {
    //                     hide: false,
    //                     title: "城市列表",
    //                     access: 8,
    //                 },
    //                 component: () => import("@/views/temp"),
    //             },
    //             {
    //                 path: "/merchant-list",
    //                 name: "merchant-list",
    //                 meta: {
    //                     hide: false,
    //                     title: "加盟商列表",
    //                     access: 8,
    //                 },
    //                 component: () => import("@/views/merchant/list"),
    //             },
    //         ],
    //     }, ],
    // },
    // {
    //     path: "/orders",
    //     name: "orders",
    //     meta: {
    //         hide: false,
    //         title: "订单",
    //         icon: "ios-switch-outline",
    //         access: 8,
    //     },
    //     component: Main,
    //     children: [
    //         {
    //             path: "/order-list",
    //             name: "order-list",
    //             meta: {
    //                 hide: false,
    //                 title: "订单列表",
    //                 access: 8,
    //             },
    //             component: () => import("@/views/temp"),
    //         },
    //     ],
    // },

    // {
    //     path: "/product",
    //     name: "product",
    //     meta: {
    //         hide: false,
    //         title: "商品",
    //         icon: "ios-switch-outline",
    //         access: 8,
    //     },
    //     component: Main,
    //     children: [
    //         {
    //             path: "/product-list",
    //             name: "product-list",
    //             meta: {
    //                 hide: false,
    //                 title: "商品列表",
    //                 access: 8,
    //             },
    //             component: () => import("@/views/temp"),
    //         },
    //     ],
    // },
    {
        path: "/gongyinglian",
        name: "gongyinglian",
        meta: {
            hide: false,
            title: "加盟管理",
            icon: "md-git-network",
            access: 8,
        },
        component: Main,
        children: [{
                path: "",
                name: "gongyinglian-manage",
                meta: {
                    hide: false,
                    title: "加盟管理",
                    access: 8,
                },
                component: Center,
                children: [{
                    path: "/merchant-list",
                    name: "merchant-list",
                    meta: {
                        hide: false,
                        title: "加盟商列表",
                        access: 8,
                    },
                    component: () => import("@/views/merchant/list"),
                }, ]
            },
            {
                path: "",
                name: "device-manage",
                meta: {
                    hide: false,
                    title: "设备管理",
                    access: 8,
                },
                component: Center,
                children: [{
                        path: "/device-list",
                        name: "device-list",
                        meta: {
                            hide: false,
                            title: "设备列表",
                            access: 8,
                        },
                        component: () => import("@/views/device/deviceList"),
                    },
                    {
                        path: "/service-manage",
                        name: "service-manage",
                        meta: {
                            hide: false,
                            title: "服务号管理",
                            access: 8,
                        },
                        component: () => import("@/views/device/serviceManage"),
                    },
                    {
                        path: "/device-id",
                        name: "device-id",
                        meta: {
                            hide: false,
                            title: "设备ID管理",
                            access: 8,
                        },
                        component: () => import("@/views/device/deviceIdlist"),
                    },
                ],
            },
            {
                path: "",
                name: "advert-manage",
                meta: {
                    hide: false,
                    title: "广告管理",
                    access: 8,
                },
                component: Center,
                children: [{
                        path: "/advert-list",
                        name: "advert-list",
                        meta: {
                            hide: false,
                            title: "广告列表",
                            access: 8,
                        },
                        component: () => import("@/views/device/advertList"),
                    },
                    {
                        path: "/advert-audit",
                        name: "advert-audit",
                        meta: {
                            hide: false,
                            title: "审核记录",
                            access: 8,
                        },
                        component: () => import("@/views/device/advertAudit"),
                    },
                    {
                        path: "/advert-put",
                        name: "advert-put",
                        meta: {
                            hide: false,
                            title: "投放中",
                            access: 8,
                        },
                        component: () => import("@/views/device/advertPut"),
                    },
                    {
                        path: "/advert-end",
                        name: "advert-end",
                        meta: {
                            hide: false,
                            title: "已结束",
                            access: 8,
                        },
                        component: () => import("@/views/device/advertEnd"),
                    },
                    {
                        path: "/advert-material",
                        name: "advert-material",
                        meta: {
                            hide: false,
                            title: "素材库",
                            access: 8,
                        },
                        component: () => import("@/views/device/member-ad-list"),
                    },
                ],
            },
        ]
    },
    {
        path: "",
        name: "album",
        meta: {
            hide: false,
            title: "相册管理",
            icon: "md-images",
            access: 8,
        },
        component: Main,
        children: [{
            path: "",
            name: "album-manage",
            meta: {
                hide: false,
                title: "相册管理",
                access: 8,
            },
            component: Center,
            children: [{
                path: "/album-list",
                name: "album-list",
                meta: {
                    hide: false,
                    title: "相册列表",
                    access: 8,
                },
                component: () => import("@/views/album/index"),
            }, ],
        }, ],
    },
    {
        path: "",
        name: "appstore",
        meta: {
            hide: false,
            title: "应用商城",
            icon: "md-appstore",
            access: 8,
        },
        component: Main,
        children: [{
            path: "",
            name: "appstore-manage",
            meta: {
                hide: false,
                title: "应用商城管理",
                access: 8,
            },
            component: Center,
            children: [
                // {
                //     path: "/appstore-price",
                //     name: "appstore-price",
                //     meta: {
                //         hide: false,
                //         title: "平台价格管理",
                //         access: 8,
                //     },
                //     component: () => import("@/views/temp"),
                // }, 
                {
                    path: "/store-price",
                    name: "store-price",
                    meta: {
                        hide: false,
                        title: "平台价格管理",
                        access: 8,
                    },
                    component: () => import("@/views/store/price"),
                },
                {
                    path: "/appstore-buylist",
                    name: "appstore-buylist",
                    meta: {
                        hide: false,
                        title: "应用购买订单",
                        access: 8,
                    },
                    component: () => import("@/views/order/app-order"),
                },

            ],
        }, ],
    },
    {
        path: "",
        name: "live-manage",
        meta: {
            hide: false,
            title: "直播管理",
            icon: "md-appstore",
            access: 8,
        },
        component: Main,
        children: [{
            path: "/live-manage",
            name: "live-manage",
            meta: {
                hide: false,
                title: "直播管理",
                access: 8,
            },
            component: () => import("@/views/temp"),
        }, ],
    },
    {
        path: "",
        name: "order-manage",
        meta: {
            hide: false,
            title: "订单管理",
            icon: "md-appstore",
            access: 8,
        },
        component: Main,
        children: [{
            path: "/order-manage",
            name: "order-manage",
            meta: {
                hide: false,
                title: "订单管理",
                access: 8,
            },
            component: Center,
            children: [{
                    path: "/dingdan-shouye",
                    name: "dingdan-shouye",
                    meta: {
                        hide: false,
                        title: "应用订单",
                        access: 8,
                    },
                    component: () => import("@/views/order/app-order"),
                },
                // {
                //     path: "/dingdan-list",
                //     name: "dingdan-list",
                //     meta: {
                //         hide: false,
                //         title: "订单列表",
                //         access: 8,
                //     },
                //     component: () => import("@/views/temp"),
                // },
                {
                    path: "/lookcontact-order-list",
                    name: "lookcontact-order-list",
                    meta: {
                        hide: false,
                        title: "查看联系人订单",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/lookcontact-order-list"),
                },
                {
                    path: "/coins-order-list",
                    name: "coins-order-list",
                    meta: {
                        hide: false,
                        title: "金币订单",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/coins-order-list"),
                },
                {
                    path: "/gift-order-list",
                    name: "gift-order-list",
                    meta: {
                        hide: false,
                        title: "礼物订单",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/gift-order-list"),
                },
                {
                    path: "/topcard-order-list",
                    name: "topcard-order-list",
                    meta: {
                        hide: false,
                        title: "置顶卡订单",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/topcard-order-list"),
                },
                {
                    path: "/vipcard-order-list",
                    name: "vipcard-order-list",
                    meta: {
                        hide: false,
                        title: "vip开通订单",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/vipcard-order-list"),
                },
                {
                    path: "/servicecard-order-list",
                    name: "servicecard-order-list",
                    meta: {
                        hide: false,
                        title: "服务卡订单",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/servicecard-order-list"),
                },
                {
                    path: "/appointment-order-list",
                    name: "appointment-order-list",
                    meta: {
                        hide: false,
                        title: "约会订单",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/appointment-order-list"),
                },
                {
                    path: "/group-order-list",
                    name: "group-order-list",
                    meta: {
                        hide: false,
                        title: "群组订单列表",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/group-order-list"),
                },
                {
                    path: "/group-order-aftersales-list",
                    name: "group-order-aftersales-list",
                    meta: {
                        hide: false,
                        title: "群组订单售后列表",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/order/group-order-aftersales-list"),
                },
                {
                    path: "/mobile-order-list",
                    name: "mobile-order-list",
                    meta: {
                        hide: false,
                        title: "单次交换电话订单",
                        access: 8,
                    },
                    component: () => import("@/views/temp"),
                },
                {
                    path: "/wechat-order-list",
                    name: "wechat-order-list",
                    meta: {
                        hide: false,
                        title: "单次交换微信订单",
                        access: 8,
                    },
                    component: () => import("@/views/temp"),
                },
            ],
        }, ],
    },
    {
        path: "",
        name: "final-manage",
        meta: {
            hide: false,
            title: "财务管理",
            icon: "md-appstore",
            access: 8,
        },
        component: Main,
        children: [{
            path: "/final-manage",
            name: "final-manage",
            meta: {
                hide: false,
                title: "财务管理",
                access: 8,
            },
            component: Center,
            children: [{
                    path: "/amount-record",
                    name: "amount-record",
                    meta: {
                        hide: false,
                        title: "资金明细",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/finance/amount-records"),
                },
                {
                    path: "/member-postalapply",
                    name: "member-postalapply",
                    meta: {
                        hide: false,
                        title: "会员提现",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/finance/member-postal"),
                },
                /*{
                    path: "/merchant-postalapply",
                    name: "merchant-postalapply",
                    meta: {
                        hide: false,
                        title: "加盟商提现",
                        access: 8,
                    },
                    component: () => import("@/views/finance/merchat-postal"),
                },*/
                {
                    path: "/matchmarker-postalapply",
                    name: "matchmarker-postalapply",
                    meta: {
                        hide: false,
                        title: "红娘提现",
                        access: 8,
                    },
                    component: () =>
                        import("@/views/finance/matchmarker-postal"),
                },
                {
                    path: "/vipcard-list",
                    name: "vipcard-list",
                    meta: {
                        hide: false,
                        title: "VIP费用设置",
                        access: 8,
                    },
                    component: () => import("@/views/product/vipcard"),
                },

                {
                    path: "/servicecard-list",
                    name: "servicecard-list",
                    meta: {
                        hide: false,
                        title: "会员费用设置",
                        access: 8,
                    },
                    component: () => import("@/views/finance/member-cost"),
                },
                {
                    path: "/topcard-price-set",
                    name: "topcard-price-set",
                    meta: {
                        hide: false,
                        title: "置顶卡费用设置",
                        access: 8,
                    },
                    component: () => import("@/views/product/topcard"),
                },
                {
                    path: "/single-cost-set",
                    name: "single-cost-set",
                    meta: {
                        hide: false,
                        title: "其他费用设置",
                        access: 8,
                    },
                    component: () => import("@/views/setting/single-cost-set"),
                },
                // {
                //     path: "/mobile-price-set",
                //     name: "mobile-price-set",
                //     meta: {
                //         hide: false,
                //         title: "交换电话费用设置",
                //         access: 8,
                //     },
                //     component: () => import("@/views/finance/mobile-cost"),
                // },
                // {
                //     path: "/wechat-price-set",
                //     name: "wechat-price-set",
                //     meta: {
                //         hide: false,
                //         title: "交换微信费用设置",
                //         access: 8,
                //     },
                //     component: () => import("@/views/finance/wechat-cost"),
                // },
            ]

        }, ],
    },
    // {
    //     path: "/version-settings",
    //     name: "version-settings",
    //     meta: {
    //         hide: false,
    //         title: "版本配置",
    //         icon: "md-options",
    //         access: 8,
    //     },
    //     component: Main,
    //     children: [{
    //         path: "/version-settings-list",
    //         name: "version-settings-list",
    //         meta: {
    //             hide: false,
    //             title: "版本配置",
    //             access: 8,
    //         },
    //         component: () => import("@/views/temp"),
    //     }, ],
    // },
    // {
    //     path: "/plugins-settings",
    //     name: "plugins-settings",
    //     meta: {
    //         hide: false,
    //         title: "插件应用",
    //         icon: "md-apps",
    //         access: 8,
    //     },
    //     component: Main,
    //     children: [{
    //         path: "/plugins-settings-list",
    //         name: "plugins-settings-list",
    //         meta: {
    //             hide: false,
    //             title: "插件应用",
    //             access: 8,
    //         },
    //         component: () => import("@/views/temp"),
    //     }, ],
    // },
    {
        path: "/system",
        name: "system",
        meta: {
            hide: false,
            title: "系统设置",
            icon: "md-cog",
            access: 8,
        },
        component: Main,
        children: [{
                path: "/roles",
                name: "roles",
                meta: {
                    hide: false,
                    title: "角色管理",
                    access: 8,
                },
                component: () => import("@/views/system/role-list"),
            },
            {
                path: "/users",
                name: "users",
                meta: {
                    hide: false,
                    title: "后台用户",
                    access: 8,
                },
                component: () => import("@/views/system/acc-list"),
            },
            {
                path: "/version-settings-list",
                name: "version-settings-list",
                meta: {
                    hide: false,
                    title: "版本配置",
                    access: 8,
                },
                component: () => import("@/views/temp"),
            },
        ],
    },
    // {
    //     path: "",
    //     name: "settings",
    //     meta: {
    //         hide: false,
    //         title: "基本设置",
    //         icon: "md-settings",
    //         access: 8,
    //     },
    //     component: Main,
    //     children: [{
    //         path: "",
    //         name: "settings-manage",
    //         meta: {
    //             hide: false,
    //             title: "基本设置",
    //             access: 8,
    //         },
    //         component: Center,
    //         children: [

    //             {
    //                 path: "/denglu-records",
    //                 name: "denglu-records",
    //                 meta: {
    //                     hide: false,
    //                     title: "登录日志",
    //                     access: 8,
    //                 },
    //                 component: () => import("@/views/temp"),
    //             },
    //             {
    //                 path: "/operate-records",
    //                 name: "operate-records",
    //                 meta: {
    //                     hide: false,
    //                     title: "操作记录",
    //                     access: 8,
    //                 },
    //                 component: () => import("@/views/temp"),
    //             },
    //             {
    //                 path: "/menus-settings",
    //                 name: "menus-settings",
    //                 meta: {
    //                     hide: false,
    //                     title: "菜单",
    //                     icon: "ios-switch-outline",
    //                     access: 8,
    //                 },
    //                 component: Main,
    //                 children: [{
    //                     path: "/menus-settings-list",
    //                     name: "menus-settings-list",
    //                     meta: {
    //                         hide: false,
    //                         title: "菜单列表",
    //                         access: 8,
    //                     },
    //                     component: () => import("@/views/temp"),
    //                 }, ],
    //             },
    //             {
    //                 path: "/personal-setting",
    //                 name: "personal-setting",
    //                 meta: {
    //                     hide: false,
    //                     title: "个人设置",
    //                     access: 8,
    //                 },
    //                 component: () => import("@/views/setting/personal-set"),
    //             },
    //         ],
    //     }, ],
    // },

];

// 其他路由
export const otherRouters = [{
        path: "",
        component: Main,
        children: [{
                path: "/store/:action",
                name: "store-detail",
                meta: {
                    hide: false,
                    title: "商户",
                    access: 8,
                },
                component: () => import("@/views/store/addOrEdit"),
            },
            {
                path: "/member/:action",
                name: "member-detail",
                meta: {
                    hide: false,
                    title: "会员",
                    access: 8,
                },
                component: () => import("@/views/member/addOrEdit"),
            },
            {
                path: "/user/:action",
                name: "user-detail",
                meta: {
                    hide: false,
                    title: "用户",
                    access: 8,
                },
                component: () => import("@/views/store/userDetail"),
            },
            {
                path: "/app-order-detail/:code/:storeCode",
                name: "app-order-detail",
                meta: {
                    hide: false,
                    title: "应用订单详情",
                    access: 8,
                },
                component: () => import("@/views/order/app-order-detail"),
            },
            {
                path: "/matchmarker/:action",
                name: "matchmarker-detail",
                meta: {
                    hide: false,
                    title: "红娘",
                    access: 8,
                },
                component: () => import("@/views/matchmarker/addOrEdit"),
            },
            {
                path: "/merchant/:action",
                name: "merchant-detail",
                meta: {
                    hide: false,
                    title: "加盟商",
                    access: 8,
                },
                component: () => import("@/views/merchant/addOrEdit"),
            },
            {
                path: "/device/detail",
                name: "device-detail",
                meta: {
                    hide: false,
                    title: "设备详情",
                    access: 8,
                },
                component: () => import("@/views/device/detail"),
            },
            {
                path: "/advert/detail",
                name: "advert-detail",
                meta: {
                    hide: false,
                    title: "广告详情",
                    access: 8,
                },
                component: () => import("@/views/device/advert-detail"),
            },
            {
                path: "/matral-detail",
                name: "matral-detail",
                meta: {
                    hide: false,
                    title: "素材库详情",
                    access: 8,
                },
                component: () => import("@/views/device/components/showMaterial"),
            },
            {
                path: "/select-material",
                name: "select-material",
                meta: {
                    hide: false,
                    title: "选择素材库",
                    access: 8,
                },
                component: () => import("@/views/device/advertMaterial"),
            },
            {
                path: "/group-order-aftersales-detail/:orderCode/:storeCode",
                name: "group-order-aftersales-detail",
                meta: {
                    hide: false,
                    title: "群组订单售后详情",
                    access: 8,
                },
                component: () => import("@/views/order/group-order-aftersales-detail"),
            },
        ]
    },
    {
        path: "/diyModule/:action",
        name: "diy-module",
        meta: {
            hide: false,
            title: "自定义模板",
            access: 8,
        },
        component: () => import("@/views/diyModule"),
    },
]

let arr = constantRoutes.concat(otherRouters);
const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: arr,
    });

const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}
// 解决跳转同一个路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default router;