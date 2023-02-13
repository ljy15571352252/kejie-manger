<template>
  <div class="module-container">
    <div class="module-head flexC">
      <!-- <Button
        icon="md-arrow-round-back"
        ghost
        type="primary"
        @click="back"
      >返回</Button> -->

      <div>
        <Icon
          size="20"
          type="ios-document"
          @click="showEditName=!showEditName"
        />
        <Input
          v-if="showEditName"
          v-model="updateTem.name"
          placeholder="请输入模板名称"
          style="width: 180px"
        />
        <span
          v-else
          style="width: 180px"
        >{{updateTem.name}}</span>

      </div>

      <div class="btn-tools">
        <Button
          type="text"
          icon="md-bookmarks"
        >指南</Button>
        <Button
          type="text"
          icon="md-eye"
        >预览</Button>
        <Button
          type="text"
          icon="md-cloud-upload"
          @click="saveTemplate()"
        >备份</Button>
        <Button
          type="text"
          icon="md-download"
          :loading="saveloading"
          @click="saveTemplate()"
        >保存</Button>
        <Button
          type="primary"
          :loading="fabuloading"
          @click="fabuTemplate()"
        >发布</Button>
      </div>
    </div>
    <div class="module-main flexC">

      <div class="module-panel">
        <RadioGroup
          v-model="radioType"
          type="button"
          button-style="solid"
          size="default"
        >
          <Radio :label="1">
            <span>组件库</span>
          </Radio>
          <Radio :label="2">
            <span>我的备份</span>
          </Radio>
        </RadioGroup>
        <Scroll
          height="919"
          v-if="radioType == 1"
        >
          <Collapse v-model="value">
            <Panel name="1">
              基础组件
              <div slot="content">
                <draggable
                  class="ivu-row dragArea list-group"
                  :list="list1"
                  :group="{ name: 'people',pull:'clone', put: false }"
                  :clone="cloneList"
                >
                  <Col
                    :span="8"
                    v-for="item in list1"
                    :key="item.id"
                  >
                  <div @click="addList(item)">
                    <Icon
                      :type="item.icon"
                      size="36"
                    />
                    <p>{{item.text}}</p>
                  </div>
                  </Col>
                </draggable>
              </div>
            </Panel>
            <!-- <Panel name="2">
                        营销组件
                        <p slot="content">
                            <draggable 
                                class="ivu-row dragArea list-group"
                                :list="list2"
                                :group="{ name: 'people', pull: 'clone', put: false }"
                                :clone="cloneList"
                            >
                                <Col :span="8" v-for="item in list2" :key="item.id">
                                    <div @click="addList(item)">
                                        <Icon :type="item.icon" size="36" />
                                        <p>{{item.text}}</p>
                                    </div>
                                </Col>
                            </draggable>
                        </p>
                    </Panel> -->
          </Collapse>
        </Scroll>
        <!-- 我的备份 -->
        <div v-if="radioType == 2">
          <p style="margin:8px;">
            <span style="font-weight:600;">
              我的备份
            </span>
            <!-- <span>最多可备份10个模板</span> -->
          </p>
          <div style="margin-top:6px;">
            <CellGroup>
              <Cell
                v-for="(item , index) in custIndexList"
                :key="item.code"
                :title="item.name"
              >
                <template #icon>
                  <Icon type="ios-list-box" />
                </template>
                <template #extra>
                  <Poptip
                    trigger="hover"
                    placement="bottom"
                    transfer
                  >
                    <Icon type="ios-more" />
                    <template #content>
                      <Button
                        type="text"
                        @click="userTemplate(item.code)"
                      >使用</Button>
                      <Button
                        type="text"
                        @click="deleteTemplate(item.code,item.storeCode)"
                      >删除</Button>
                    </template>

                  </Poptip>
                </template>
              </Cell>
            </CellGroup>
          </div>
        </div>
      </div>
      <div class="module-body">
        <Scroll height="919">
          <div
            class="module-content"
            ref="imageWrapper"
          >
            <Tooltip
              content="页面设置"
              placement="bottom-start"
              theme="light"
            >
              <Button
                class="page-setting"
                icon="md-settings"
                shape="circle"
                @click="openSetting"
              ></Button>
            </Tooltip>
            <div class="component-page-setting">
              <div class="zoom-view">
                <div class="box">
                  <img
                    src="/static/images/mobile_topbar.png"
                    alt=""
                  >
                  <p class="wxChat-name">小程序名称</p>
                </div>
              </div>
            </div>
            <draggable
              class="dragArea list-group"
              v-model="list3"
              group="people"
              @end="onMove"
            >
              <div
                class="mobile-item"
                v-for="item in bodyList"
                :key="item.id"
                :class="isActive(item.id)"
                @click="updateActive(item.id)"
              >
                <module-body
                  :curItem="item"
                  @remove-module="removeModule"
                ></module-body>
              </div>
            </draggable>
          </div>
        </Scroll>
      </div>
      <module-setting></module-setting>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import ModuleBody from "./components/moduleBody";
import ModuleSetting from "./components/moduleSetting";
import { mapState, mapMutations } from "vuex";
import {
    addCustTemplate,
    getCustTemplateDetail,
    editCustTemplate,
    fabuStorePlatforms,
    getCustTemplateList,
    delCustTemplate
} from "@/api/store/store";
import { uploadImgForAli } from "@/api/video/video";
import { dataURLtoFile } from "@/common/utils/dateToFile";
import axios from "axios";
// 随机id
import { nanoid } from "nanoid";
import html2canvas from "html2canvas";
export default {
    name: "diyModule",
    components: { draggable, ModuleBody, ModuleSetting },
    data() {
        return {
            saveloading: false,
            fabuloading: false,
            addTempCode: "",
            showEditName: false,
            temCode: "",
            radioType: 1,
            value: [1, 2],
            list1: [
                {
                    text: "顶部红娘",
                    id: 1,
                    icon: "ios-contacts",
                    name: "matchmarker"
                },
                {
                    text: "轮播图",
                    id: 2,
                    icon: "ios-images",
                    name: "banner",
                    set: {
                        marginleft: "no",
                        margintop: "no",
                        marginbottom: "no",
                        autoplayspeed: 3000,
                        height: 180,
                        radiusdot: "no",
                         imgnum:'1'
                    }
                },
                {
                    text: "相亲分类",
                    id: 3,
                    icon: "ios-pricetags",
                    name: "tabs",
                    type: "line",
                    items: [
                        //  "推荐",
                        // "同城",
                        // "呼啦圈",
                        // "商品分类",
                        // "活动",
                        // "视频"
                        {
                            name: "推荐",
                            subName: ""
                        },
                        {
                            name: "同城",
                            subName: ""
                        },
                        {
                            name: "恋爱圈",
                            subName: ""
                        },
                        {
                            name: "商品分类",
                            subName: ""
                        }
                    ]
                },
                // {
                //     text: "悬浮窗",
                //     id: 4,
                //     icon: "ios-navigate",
                //     name: "navigate",
                //     items: [
                //         {
                //             link: {
                //                 name: "聊天"
                //             }
                //         },
                //         {
                //             link: {
                //                 name: "申请牵线"
                //             }
                //         }
                //     ]
                // },
                // {
                //     text: "商品分类",
                //     id: 5,
                //     icon: "ios-list",
                //     name: "product-tabs",
                //     type: "line",
                //     items: [
                //         { name: "分类一" },
                //         { name: "分类二" },
                //         { name: "分类三" }
                //     ]
                // },
                {
                    text: "商品分类",
                    id: 5,
                    icon: "ios-list",
                    name: "product-tabs",
                    type: "line",
                    items: [
                        {
                            name: "商品分类",
                            subName: ""
                        }
                    ]
                },
                {
                    text: "共享模板",
                    id: 6,
                    icon: "ios-cube",
                    name: "shared-model",
                    items: []
                }
            ],
            list2: [
                { text: "顶部红娘", id: 5, icon: "ios-contacts" },
                { text: "轮播图", id: 6, icon: "ios-contacts" },
                { text: "商品分类", id: 7, icon: "ios-contacts" },
                { text: "公告", id: 8, icon: "ios-contacts" }
            ],
            updateTem: {
                name: "自定义首页模板"
            },
            custIndexList: []
        };
    },
    watch: {
        // 监听bodyList，并改变当前高亮
        bodyList(newVal, oldVal) {
            if (newVal.length !== oldVal.length && newVal.length > 0) {
                const obj = newVal.find(item => {
                    return oldVal.indexOf(item) === -1;
                });
                this.updateActive(obj.id);
            }
        }
    },
    created() {
        this.getTemList();
        this.temCode = this.$route.query.code;
        if (this.temCode) {
            this.getTemDetail();
        } else {
            this.updateTem = {
                name: "自定义首页模板"
            };
            this.userDefaultTem([]);
        }
    },
    methods: {
        ...mapMutations("diyModule", [
            "dragBodyList",
            "pushBodyList",
            "delBodyList",
            "updateCurr",
            "delCurr",
            "userDefaultTem"
        ]),
        userTemplate(code) {
            this.temCode = code;
            this.getTemDetail();
        },
        deleteTemplate(code,storeCode) {
            this.$Modal.confirm({
                title: "删除自定义板块？",
                content: "<p>删除之后无法恢复，确定要删除吗？</p>",
                onOk: () => {
                    delCustTemplate({
                        code,
                        storeCode
                    }).then(res => {
                        if (res ) {
                            this.$Message.success("删除成功");
                            this.getTemList();
                        } else {
                            this.$Message.error("删除失败");
                        }
                    });
                },
                onCancel: () => {}
            });
        },
        async getTemDetail() {
            const res = await getCustTemplateDetail({
                code: this.temCode
            });
            this.updateTem = {
                code: res.code,
                name: res.name,
                storeCode: res.storeCode,
                templateJson: res.templateJson,
                type: res.type,
                imgUrl: res.imgUrl
            };
            let templateList = JSON.parse(res.templateJson);
            this.userDefaultTem(templateList);
        },
        async getTemList() {
            const { records, total } = await getCustTemplateList({
                enable: false
            });
            this.custIndexList = records;
        },
        async fabuTemplate() {
            //    fabuStorePlatforms
            this.fabuloading = true;
            if (this.updateTem.imgUrl) {
                // let jsonAddTem = this.copyJson(this.updateTem);
                if (this.temCode) {
                    fabuStorePlatforms({
                        code: this.temCode
                    }).then(res => {
                        if (res ) {
                            this.$Message.success("发布成功");
                            this.fabuloading = false;
                        }
                    });
                } else {
                    fabuStorePlatforms(this.addTempCode).then(res => {
                        if (res ) {
                            this.$Message.success("发布成功");
                            this.fabuloading = false;
                        }
                    });
                }
            } else {
                this.$Message.error("请先保存模板再发布！");
            }
        },
        async saveTemplate() {
            this.delCurr();
            this.saveloading = true;
            setTimeout(() => {
                html2canvas(this.$refs.imageWrapper, {
                    allowTaint: true, //开启跨域
                    useCORS: true,
                    scrollY: 0,
                    scrollX: 0
                }).then(canvas => {
                    let dataURL = canvas.toDataURL("image/png");
                    // 把 64位图片转成正常格式图片文件
                    let imgData = dataURLtoFile(dataURL, this.updateTem.name);
                    this.uploadTemplateImg(imgData).then(res => {
                        this.updateTem.imgUrl = res;
                        this.updateTem.templateJson = JSON.stringify(
                            this.list3
                        );

                        let jsonAddTem = this.copyJson(this.updateTem);
                        if (this.temCode) {
                            editCustTemplate(jsonAddTem).then(res => {
                                if (res ) {
                                    this.$Message.success("编辑成功");
                                    this.getTemList();
                                    this.saveloading = false;
                                }
                            });
                            // let res = await editCustTemplate(jsonAddTem);
                        } else {
                            addCustTemplate(jsonAddTem).then(res => {
                                if (res.code == true) {
                                    this.$Message.success("保存成功");
                                    this.addTempCode = res.code;
                                    this.saveloading = false;
                                    this.getTemList();
                                }
                            });
                            // let res = await addCustTemplate(jsonAddTem);
                        }
                    });
                });
            }, 1000);
            // 生成图片
        },

        async uploadTemplateImg(file) {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("file", file, this.updateTem.name + ".png");
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                };
                axios
                    .post(
                        process.env.VUE_APP_BASE_API + "/upload/img",
                        formData,
                        config
                    )
                    .then(response => {
                        if (response.data.code == 200) {
                            // this.updateTem.imgUrl = response.data.data;
                            resolve(response.data.data);
                        }
                    })
                    .catch(error => {
                        this.$Message.error("生成图片失败！");
                        reject();
                        // this.updateTem.imgUrl = "";
                    });
            });
        },
        // 拖拽添加、点击添加
        cloneList({ id, text, name, items, type, set }) {
            return {
                id: nanoid(),
                compId: id,
                text: text,
                name: name,

                formDynamic: {
                    items: items ? items : [],
                    type: type ? type : "",
                    set: set ? set : {},
                    locStatus: true
                }
            };
        },
        cloneTabList() {
            let addList = [
                {
                    id: nanoid(),
                    compId: 3,
                    text: "相亲分类",
                    name: "tabs",
                    formDynamic: {
                        items: [
                            {
                                name: "推荐",
                                subName: ""
                            },
                            {
                                name: "同城",
                                subName: ""
                            },
                            {
                                name: "恋爱圈",
                                subName: ""
                            },
                            {
                                name: "商品分类",
                                subName: ""
                            }
                          
                        ],
                        type: "line"
                    }
                },
                {
                    id: nanoid(),
                    compId: 4,
                    text: "悬浮窗",
                    name: "navigate",
                    formDynamic: {
                        items: [
                            {
                                link: {
                                    name: "聊天"
                                }
                            },
                            {
                                link: {
                                    name: "申请牵线"
                                }
                            }
                        ]
                    }
                }
            ];

            return addList;
        },
        // 点击添加模块
        addList(item) {
            let getNavigateExist = this.list3.some(v => {
                return v.compId == item.id;
            });
            let haveCate = this.list3.some(v => {
                return v.compId == 3;
            });
            let haveGoodsCate = this.list3.some(v => {
                return v.compId == 5;
            });
            let haveShareModel = this.list3.some(v => {
                return v.compId == 6;
            });
            if (item.id == 4 && getNavigateExist) {
                this.$Message.error("悬浮窗只能添加一个");
            } else if (item.id == 3 && getNavigateExist) {
                this.$Message.error("相亲分类只能添加一个");
            } else if (item.id == 5 && getNavigateExist) {
                this.$Message.error("商品分类只能添加一个");
            } else if (item.id == 6 && getNavigateExist) {
                this.$Message.error("共享模板只能添加一个");
            } else if (item.id == 5 && haveCate || haveShareModel) {
                this.$Message.error("共享模板,商品分类和相亲分类只能添加一个");
            } else if (item.id == 3 && haveGoodsCate || haveShareModel) {
                this.$Message.error("共享模板,商品分类和相亲分类只能添加一个");
            } else if (item.id == 6 && haveCate || haveGoodsCate) {
                this.$Message.error("共享模板,商品分类和相亲分类只能添加一个");
            } else {
                if (item.id == 3) {
                    const formItem = this.cloneTabList();
                    this.pushBodyList(formItem[0]);
                    this.pushBodyList(formItem[1]);
                    this.updateActive(formItem[0].id);
                } else {
                    const formItem = this.cloneList(item);
                    this.pushBodyList(formItem);
                    this.updateActive(formItem.id);
                }
                // const formItem = this.cloneList(item);
                // this.pushBodyList(formItem);
                // this.updateActive(formItem.id);
            }
        },
        // 模块移动
        onMove({ newIndex }) {
            const curId = this.bodyList[newIndex].id;
            this.updateActive(curId);
        },
        // 去除模块
        removeModule(id, navId) {
            if (navId) {
                this.delBodyList(navId);
            }
            this.delBodyList(id);
            this.openSetting();
        },
        // 页面设置
        openSetting() {
            this.delCurr();
        },
        // 封装高亮修改方式
        updateActive(curId) {
            this.updateCurr(curId);
            // this.formItem = this.bodyList.find(item => item.id === curId)
        },
        back() {
            this.$router.back();
        }
    },
    computed: {
        ...mapState("diyModule", ["bodyList", "active"]),
        list3: {
            get: function() {
                return this.bodyList;
            },
            set: function(newList) {
                this.dragBodyList(newList);
            }
        },
        // 判断高亮id
        isActive() {
            return id => {
                if (id === this.active) {
                    return "active";
                }
            };
        }
    }
};
</script>

<style lang="less">
.module-head {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #f8f9fa;
    border-bottom: 1px solid #e9e7ec;
    box-shadow: 2px 6px 6px #eee;
    height: 50px;
    padding: 10px;
    width: 100%;
}
.module-main {
    width: 100%;
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 50px;
    flex-direction: row;
    .module-panel {
        background-color: #f8f9fa;
        height: 100%;
        position: relative;
        width: 320px;
        .ivu-scroll-container {
            .ivu-collapse-content {
                background-color: #f8f9fa;
                .ivu-row {
                    .ivu-col {
                        padding: 12px 0;
                        text-align: center;
                        color: #595961;
                        font-size: 12px;
                        line-height: 20px;
                        &:hover {
                            background-color: #fff;
                        }
                    }
                }
            }
        }
    }
    .module-body {
        position: absolute;
        left: 320px;
        min-width: 686px;
        right: 360px;

        .ivu-scroll-container {
            .module-content {
                background-color: #f2f2f2;
                box-shadow: 0 0 28px 0 #ccc;
                margin: 60px auto;
                max-width: 375px;
                min-height: 667px;
                position: relative;
                width: 375px;
                .ivu-tooltip {
                    position: fixed;
                    top: 120px;
                    left: calc(50% - 268.5px);
                    z-index: 999;
                    .page-setting {
                        width: 40px;
                        height: 40px;
                        font-size: 24px;
                        background: #fff;
                        line-height: 40px;
                    }
                }
                .component-page-setting {
                    .box {
                        position: relative;
                        background-position: 50%;
                        background-repeat: no-repeat;
                        background-size: 100% auto;
                        width: 100%;
                        img {
                            width: 100%;
                            display: block;
                        }
                        .wxChat-name {
                            bottom: 0;
                            font-size: 16px;
                            font-weight: bold;
                            line-height: 44px;
                            position: absolute;
                            text-align: center;
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
}
</style>