import {
    nanoid
} from "nanoid";

const diyModule = {
    namespaced: true,
    state: {
        // 当前高亮的id
        active: 0,
        // 当前高亮的下标值
        index: null,
        // 当前配置项
        activeOption: {},
        // 当前表单
        formDynamic: {},
        // 显示数据
        bodyList: [{
                text: "顶部红娘",
                id: nanoid(),
                compId: 1,
                name: 'matchmarker',
                formDynamic: {
                    locStatus: true
                }
            },
            {
                text: "轮播图",
                id: nanoid(),
                compId: 2,
                name: 'banner',
                formDynamic: {
                    items: [],
                    set: {
                        marginleft: 'no',
                        margintop: 'no',
                        marginbottom: 'no',
                        autoplayspeed: 3000,
                        height: 180,
                        radiusdot: 'no',
                        imgnum:'1'
                    }
                }
            },
            {
                text: "相亲分类",
                id: nanoid(),
                compId: 3,
                name: 'tabs',
                formDynamic: {
                    type: 'line',
                    items: ["推荐", "同城", "恋爱圈", "商品分类"]
                }
            },
            // {
            //     text: "悬浮窗",
            //     id: nanoid(),
            //     compId: 4,
            //     name: 'navigate',
            //     formDynamic: {
            //         items: [{
            //                 link: {
            //                     name: '聊天'
            //                 }
            //             },
            //             {
            //                 link: {
            //                     name: '申请牵线'
            //                 }
            //             }
            //         ]
            //     }
            // },
            {
                text: "商品分类",
                id: nanoid(),
                compId: 5,
                name: "product-tabs",
                type: "line",
                formDynamic: {
                    type: 'line',
                    items: ['商品分类']
                }

            },
            {
                text: "共享模板",
                id: nanoid(),
                compId: 6,
                name: "shared-model",
                formDynamic: {

                }
            }
            // {
            //     text: "商品分类",
            //     id: nanoid(),
            //     compId: 5,
            //     name: "product-tabs",
            //     formDynamic: {
            //         type: 'line',
            //         items: [{name:"分类一"}, {name:"分类二"}, {name:"分类三"}]
            //     }
            // }
        ],
    },
    mutations: {
        // 使用默认模板
        userDefaultTem(state, temp) {
            state.bodyList = temp;
        },
        // 拖拽添加展示列表
        dragBodyList(state, newList) {
            state.bodyList = newList
        },
        // 点击添加
        pushBodyList(state, item) {
            state.bodyList.push(item)
        },
        // 删除模块
        delBodyList(state, id) {
            for (const index in state.bodyList) {
                if (state.bodyList[index].id === id) {
                    state.bodyList.splice(index, 1)
                }
            }
        },
        // 更新当前选中项
        updateCurr(state, id) {
            state.active = id
            for (const index in state.bodyList) {
                if (state.bodyList[index].id === id) {
                    state.index = index
                }
            }
            state.formDynamic = state.bodyList[state.index].formDynamic
            state.activeOption = state.bodyList[state.index]
        },
        // 清空选中项
        delCurr(state) {
            state.active = 0,
                state.activeOption = {}
        },
        // 动态添加轮播图
        changeFormDynamic(state, index) {
            state.formDynamic.curIndex = 0
            state.formDynamic.items.push({
                index: index,
                status: 1
            });
            state.bodyList[state.index].formDynamic = state.formDynamic
        },
        //是否显示定位
        isSwitch(state, status) {
            state.formDynamic.locStatus = status
            state.bodyList[state.index].formDynamic = state.formDynamic
        },
        // 删除分类标签
        cateTabRemove(state, idx) {
            state.formDynamic.items.splice(idx, 1);
            state.bodyList[state.index].formDynamic = state.formDynamic
        },

    },
    actions: {}

}

export default diyModule