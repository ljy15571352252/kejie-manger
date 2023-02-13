<template>
  <Card
    title="共享模板设置"
    icon="ios-options"
    shadow
  >
    <!-- <Form
      ref="formDynamic"
      :model="formDynamic"
    >
      <div class="m-add-btn">
        <Button
          type="dashed"
          long
          @click="handleAdd"
          icon="md-add"
        >添加悬浮窗</Button>
      </div>
      <FormItem>
        <div
          class="data-item"
          v-for="(item, index) in formDynamic.items"
          :key="index"
        >
          <div class="x-f">
            <div class="upload">
        
              <div
                class="upload-img-tem"
                style="border: 1px dashed"
                @click="openImgUpload(index)"
              >
                <img
                  :src="item.logoUrl"
                  v-if="item.logoUrl"
                />
                <span v-if="!item.logoUrl">+</span>
              </div>
            
            </div>
            <div class="data-link">
              <h4>链接</h4>
              <p
                :class="item.link?'red':'blue'"
                @click="onShowPageModuleSelector(item,index)"
              >{{item.link?item.link.name:'选择链接地址'}}</p>
            </div>
          </div>
          <div>
          </div>
         
          <div class="data-del">
            <Button
              @click="handleRemove(index)"
              shape="circle"
              icon="ios-trash"
            ></Button>
          </div>
        </div>
      </FormItem>
    </Form> -->
    <!-- 链接 -->
    <selectLink
      v-model="showPageModuleSelector"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :tableLoading="tableLoading"
      :columns="columns"
      :targetName="targetName"
      @tabClick="tabClick"
      @changeData="changeData"
      @selectCheck="selectCheck"
    />
    <!-- 图片 -->
    <uploadLink
      v-model="uploadModel"
      @selectImgCheck="selectImgCheck"
    />
  </Card>
</template>
<script>
import ImageUpload from "@/components/upload/fileUpload";
import { mapState, mapMutations } from "vuex";
// import { getProductList } from "@/api/product/product";
// import { getActivityList } from "@/api/activity/activity";
// import { getVideoList } from "@/api/video/video";
// import { getMemberList } from "@/api/member/member";
// import { getMatchMarkerList } from "@/api/matchmarker/matchmarker";
import selectLink from "../selectLink";
import uploadLink from "../uploadLink";
export default {
    components: { ImageUpload, selectLink, uploadLink },
    data() {
        return {
            targetName: "",
            currentUpload: 0,
            uploadModel: false,
            currentSelect: 0,
            index: 1,
            showPageModuleSelector: false,
            tableData: [
                {
                    name: "交换手机"
                },
                {
                    name: "申请牵线"
                },
                {
                    name: "关注"
                },
                {
                    name: "聊天"
                }
            ],
            pageInfo: {
                total: 4,
                size: 1,
                current: 1
            },
            isBanner: false,
            tableLoading: false,
            page: 1,
            columns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },

                {
                    title: "链接名称",
                    key: "name",
                    align: "center"
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center"
                }
            ]
        };
    },
    created() {
        // this.getProductList();
    },
    methods: {
        ...mapMutations("diyModule", ["changeFormDynamic"]),
        // // 获取商品列表
        // async getProductList() {
        //     this.columns = [
        //         {
        //             type: "selection",
        //             width: 60,
        //             align: "center"
        //         },

        //         {
        //             title: "链接名称",
        //             key: "promoteText",
        //             align: "center"
        //         },
        //         {
        //             title: "操作",
        //             slot: "action",
        //             align: "center"
        //         }
        //     ];
        //     this.tableLoading = true;
        //     let { records, total, size, current } = await getProductList({
        //         page: this.page
        //     });
        //     this.tableData = records;
        //     this.pageInfo = {
        //         total,
        //         size,
        //         current
        //     };
        //     this.tableLoading = false;
        // },
        // // 获取活动列表
        // async getActivityData() {
        //     this.columns = [
        //         {
        //             type: "selection",
        //             width: 60,
        //             align: "center"
        //         },

        //         {
        //             title: "链接名称",
        //             key: "name",
        //             align: "center"
        //         },
        //         {
        //             title: "操作",
        //             slot: "action",
        //             align: "center"
        //         }
        //     ];
        //     this.tableLoading = true;

        //     let { records, total, size, current } = await getActivityList({
        //         page: this.page
        //     });
        //     this.tableData = records;
        //     this.pageInfo = {
        //         total,
        //         size,
        //         current
        //     };
        //     this.tableLoading = false;
        // },
        // // 获取视频列表
        // async getVideoData() {
        //     this.columns = [
        //         {
        //             type: "selection",
        //             width: 60,
        //             align: "center"
        //         },

        //         {
        //             title: "链接名称",
        //             key: "description",
        //             align: "center"
        //         },
        //         {
        //             title: "操作",
        //             slot: "action",
        //             align: "center"
        //         }
        //     ];
        //     this.tableLoading = true;

        //     let { records, total, size, current } = await getVideoList({
        //         page: this.page
        //     });
        //     this.tableData = records;
        //     this.pageInfo = {
        //         total,
        //         size,
        //         current
        //     };
        //     this.tableLoading = false;
        // },
        // // 会员列表
        // async getMemberData() {
        //     this.columns = [
        //         {
        //             type: "selection",
        //             width: 60,
        //             align: "center"
        //         },

        //         {
        //             title: "链接名称",
        //             key: "nickName",
        //             align: "center"
        //         },
        //         {
        //             title: "操作",
        //             slot: "action",
        //             align: "center"
        //         }
        //     ];
        //     this.tableLoading = true;
        //     let { records, total, size, current } = await getMemberList({
        //         page: this.page
        //     });
        //     this.tableData = records;
        //     this.pageInfo = {
        //         total,
        //         size,
        //         current
        //     };
        //     this.tableLoading = false;
        // },
        // // 获取红娘列表
        // async getMatchMarkerData() {
        //     this.columns = [
        //         {
        //             type: "selection",
        //             width: 60,
        //             align: "center"
        //         },

        //         {
        //             title: "链接名称",
        //             key: "nickName",
        //             align: "center"
        //         },
        //         {
        //             title: "操作",
        //             slot: "action",
        //             align: "center"
        //         }
        //     ];
        //     this.tableLoading = true;
        //     let { records, total, size, current } = await getMatchMarkerList({
        //         page: this.page
        //     });
        //     this.tableData = records;
        //     this.pageInfo = {
        //         total,
        //         size,
        //         current
        //     };
        //     this.tableLoading = false;
        // },
        tabClick(name) {
            //     if (name == "1") {
            //         this.getProductList();
            //     } else if (name == "2") {
            //         this.getMemberData();
            //     } else if (name == "3") {
            //         this.getMatchMarkerData();
            //     } else if (name == "4") {
            //         this.getActivityData();
            //     } else if (name == "5") {
            //         this.getVideoData();
            //     } else if (name == "6") {
            //         this.columns = [
            //             {
            //                 type: "selection",
            //                 width: 60,
            //                 align: "center"
            //             },
            //             {
            //                 title: "链接名称",
            //                 key: "name",
            //                 align: "center"
            //             },
            //             {
            //                 title: "操作",
            //                 slot: "action",
            //                 align: "center"
            //             }
            //         ];
            //         this.tableData = [
            //             {
            //                 name: "交换手机"
            //             },
            //             {
            //                 name: "申请牵线"
            //             },
            //             {
            //                 name: "关注"
            //             },
            //             {
            //                 name: "聊天"
            //             }
            //         ];
            //         this.pageInfo = {
            //             total: 4,
            //             size: 1,
            //             current: 1
            //         };
            //         this.tableLoading = false;
            //     }
        },
        changeData(page, name) {
            //     this.page = page;
            //     if (name == "1") {
            //         this.getProductList();
            //     } else if (name == "2") {
            //         this.getMemberData();
            //     } else if (name == "3") {
            //         this.getMatchMarkerData();
            //     } else if (name == "4") {
            //         this.getActivityData();
            //     } else if (name == "5") {
            //         this.getVideoData();
            //     }
        },
        // 链接
        onShowPageModuleSelector(item, index) {
            if (item.link) {
                this.targetName = item.link.name;
            } else {
                this.targetName = "";
            }
            this.currentSelect = index;
            this.showPageModuleSelector = true;
        },
        selectCheck(item, idx) {
            if (item) {
                console.log(item);
                this.formDynamic.items[this.currentSelect].link = item;
            }
        },
        // 图片
        openImgUpload(index) {
            this.currentUpload = index;
            this.uploadModel = true;
        },
        selectImgCheck(img) {
            this.formDynamic.items[this.currentUpload].logoUrl = img.url;
        },
        handleAdd() {
            if (this.formDynamic.items == 0) {
                this.index++;
                this.changeFormDynamic(this.index);
                this.changeFormDynamic(this.index);
                this.formDynamic.items[0].link = {
                    name: "聊天"
                };
                this.formDynamic.items[1].link = {
                    name: "申请牵线"
                };
            } else if (this.formDynamic.items.length < 4) {
                this.index++;
                this.changeFormDynamic(this.index);
            } else {
                this.$Message.error("悬浮窗最多只能添加四个");
            }
        },
        handleRemove(index) {
            this.formDynamic.items.splice(index, 1);
        }
    },
    computed: {
        ...mapState("diyModule", ["formDynamic", "active"])
    }
};
</script>
<style lang="less">
.data-item {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
    .upload {
        .upload-img-tem {
            width: 90px;
            height: 90px;
            line-height: 80px;
            margin-right: 8px;
            font-size: 50px;
        }
    }
    .data-link {
        h4 {
            font-size: 15px;
        }
        .blue {
            color: #3a99e0;
            cursor: pointer;
        }
        .red {
            color: red;
            cursor: pointer;
        }
    }
    .m-aux-text {
        color: #9797a1;
        font-size: 12px;
        line-height: 20px;
        padding: 8px 0;
    }
    .data-del {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 999;
        .ivu-btn {
            width: 36px;
            height: 36px;
            font-size: 18px;
            background: #fff;
            line-height: 36px;
            text-align: center;
        }
    }
}
</style>