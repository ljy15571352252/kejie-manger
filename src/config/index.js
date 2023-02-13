let isDev = process.env.NODE_ENV === 'development'

let apiHost = process.env.VUE_APP_BASE_API

export const profile = {
    isDev: isDev,
    apiHost: apiHost,
    uploadImgAction: apiHost + '/upload/img',
    cdnDomain: isDev ? '' : 'http://carpartner-file.yqs.com',
    GW_PAGE_SITE:process.env.VUE_APP_GW_SITE
}
// 默认系统名称
export const siteTitle = '婚恋总管理后台系统'
// 默认首页
export const indexPage = 'workplace'
// 默认登录页
export const loginPage = 'login'

// 主题风格
export const themeData = {
    themeType: 'light', // 主题风格配置 dark(经典酷黑) 或者 light(极简雅白) 默认dark经典酷黑
    isTabsShow: true, // 是否显示多页签 默认true
    headMaxWidth: false // 栏目头部是否通顶（最大宽度） 默认false
}
