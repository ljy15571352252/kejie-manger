const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = {
    publicPath: "./", // ./相对路径
    css: {
        loaderOptions: {
            less: {
                // 这里的选项会传递给 css-loader
                javascriptEnabled: true
            }
        }
    },
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([{
                from: "./static",
                to: 'static'
            }])
        ]
    },
    productionSourceMap: false,// 打包时不生成.map文件
    // 这里写你调用接口的基础路径，来解决跨域
    devServer: {
        open: true,
        proxy: {
            '/dev-api/auth': {
                target: 'http://localhost:8081',
                pathRewrite: { '^/dev-api/auth': '' }
            },
            '/dev-api': {
                target: 'http://dev.95175.com/api',
                pathRewrite: { '^/dev-api': '' }
            },
        }
    }
}
