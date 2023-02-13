<template>
  <div class="flexC">
    <page-header
      title="会员"
      description="会员列表"
    />
    <div class="pageContent flexC">
      <!-- 自定义组件（查询筛选） -->
      <search-option @on-search="onSearch" />
      <!-- <table-tool @on-refresh="getDataList(pageInfo.current)"> -->
      <!-- 自定义的全局组件（刷新按钮） -->
      <table-tool>
        <!-- <Button
          type="primary"
          ghost
          icon="ios-add"
          @click="onShowAddModal"
        >新增会员
        </Button> -->
      </table-tool>
      <Table
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
        height="585"
        @on-row-click="onRowClick"
      >
        <!-- 会员信息 -->
        <template
          slot-scope="{ row }"
          slot="member_info"
        >
          <div class="x-f">
            <Avatar
              :src="row.headUrl"
              shape="square"
              size="54"
            />
            <div class="margin-left-10">
              <p>昵称：{{ row.nickName }}</p>
              <p>手机：{{ row.mobileNumber }}</p>
            </div>
          </div>
          <!-- <div>ID: {{ row.code }}</div> -->
        </template>
        <!-- 基本资料 -->
        <div
          slot-scope="{ row }"
          slot="basic"
          class="x-f flex-wrap"
        >
          <Tag
            :key="i"
            v-for="(tag, i) in basicTags(row)"
          >{{
            tag
            }}</Tag>

          <!-- <view :key="i" v-for="(tag, i) in basicTags(row)">{{tag}}</view> -->
        </div>
        <!-- 经济状况 -->
        <div
          slot-scope="{ row }"
          slot="jingji"
          class="x-f flex-wrap"
        >
          <Tag
            :key="i"
            v-for="(tag, i) in jingjiTags(row)"
          >{{
            tag
            }}</Tag>
        </div>
        <!-- 推荐人 -->
        <template
          slot-scope="{ row }"
          slot="recommender"
        >
          <div v-if="row.recmMatchMarkerInfo">
            红娘：{{ row.recmMatchMarkerInfo.nickName }}
          </div>
          <div v-if="row.recmMemberInfo">
            会员：{{ row.recmMemberInfo.nickName }}
          </div>
        </template>
        <!-- 择偶要求 -->
        <div
          slot-scope="{ row }"
          slot="zeou"
          class="x-f flex-wrap"
        >
          <Tag
            :key="i"
            v-for="(tag, i) in zeouTags(row)"
          >{{
            tag
            }}</Tag>
        </div>
        <!-- 互相查看 -->
        <template
          slot-scope="{ row }"
          slot="each_look"
        >
          <div>
            <a
              type="text"
              class="break-word"
              @click="onShowLookRecord(row.code)"
            >Ta看过的</a>
          </div>
          <div>
            <a
              type="text"
              class="break-word"
              @click="onShowFollowerModal(row.code)"
            >Ta关注的</a>
          </div>
        </template>
        <!-- 会员等级 -->
        <template
          slot-scope="{ row }"
          slot="level"
        >
          <div v-if="!row.levelName">普通会员</div>
          <div v-else>
            <div>{{ row.levelName }}</div>
            <!--                        <div class="font-small gray-color">-->
            <!--                            （过期时间：{{ row.levelExpireDate }}）-->
            <!--                        </div>-->
          </div>
        </template>
        <!-- 消费记录 -->
        <template
          slot-scope="{ row }"
          slot="business_record"
        >
          <div>
            <a
              type="text"
              class="break-word"
              @click="onShowMemberConsumeRecord(row.code)"
            >购买记录</a>
          </div>
          <div>
            <a
              type="text"
              class="break-word"
              @click="onShowSendGift(row.code)"
            >赠送记录</a>
          </div>
          <div>
            <a
              type="text"
              class="break-word"
              @click="onShowReceiveGift(row.code)"
            >收到的礼物</a>
          </div>
          <div>
            <a
              type="text"
              class="break-word"
              @click="onShowPostal(row.code)"
            >提现记录</a>
          </div>
        </template>
        <!-- 推荐配对 -->
        <template
          slot-scope="{ row }"
          slot="push_member"
        >
          <a
            type="text"
            class="break-word"
            @click="onShowMemberPushModal(row)"
          >推送会员</a>
        </template>
        <!-- 分享记录 -->
        <template
          slot-scope="{ row }"
          slot="share_record"
        >
          <a
            type="text"
            class="break-word"
            @click="onShowMemberShareRecord(row.code)"
          >查看记录</a>
        </template>
        <div
          slot-scope="{ row, index }"
          slot="action"
          class="x-f flex-wrap"
          v-if=" advSelect == 0"
        >
          <a
            type="text"
            @click="onRowClick({code: row.code,storeCode:row.storeCode})"
          >会员详情</a>
          <Divider type="vertical" />
          <a
            type="text"
            @click="show(index)"
          >查看消费记录</a>
          <Divider type="vertical" />
          <a
            type="text"
            @click="show(index)"
          >查看余额</a>

        </div>
        <div
          slot-scope="{ row }"
          slot="action"
          class="x-f flex-wrap"
          v-else-if=" advSelect == 1"
        >
          <a
            type="text"
            class="break-word"
            @click="selectMember(row)"
          >选择</a>
        </div>
      </Table>
      <Page
        class-name="page"
        :total="pageInfo.total"
        :page-size="pageInfo.size"
        :current="pageInfo.current"
        show-elevator
        @on-change="getDataList"
      ></Page>
    </div>
    <Drawer
      title="会员"
      v-model="showMemberForm"
      width="570"
    >
      <member-form
        :codeObj="codeObj"
        @on-edit-finish="onFormOperateFinish"
        @on-add-finish="onFormOperateFinish"
        :mode="formMode"
      />
    </Drawer>

  </div>
</template>

<script>
// 查询组件
import searchOption from "./components/member-search-filter";
/** 操作模式
 * ADD添加：1
 * EDIT修改：2
 *  DETAIL详情：3
 */
import { PAGE_MODE } from "@/common/constants";
// 导入api
import { getMemberList } from "@/api/member/member";
// 导入抽屉表单
import memberForm from "./components/member-form";
export default {
    name: "index",
    components: { searchOption, memberForm },
    data() {
        return {
              advSelect: 0,
            // 表格数据
            tableData: [],
            // 表头信息
            columns: [
                {
                    title: "会员信息",
                    slot: "member_info",
                    width: 240,
                    fixed: "left"
                },
                {
                    title: "基本资料",
                    slot: "basic",
                    width: 150
                },
                {
                    title: "经济状况",
                    slot: "jingji",
                    width: 180
                },
                {
                    title: "注册时间",
                    key: "registerTime",
                    sortable: true,
                    width: 180
                },
                {
                    title: "推荐人",
                    slot: "recommender",
                    width: 150
                },
                {
                    title: "择偶要求",
                    slot: "zeou",
                    width: 150
                },
                {
                    title: "互相查看",
                    slot: "each_look",
                    width: 100
                },
                // {
                //     title: "会员收藏",
                //     slot: "collect",
                //     width: 100,
                // },
                // {
                //     title: "充值赠送",
                //     slot: "charge",
                //     width: 100,
                // },
                {
                    title: "会员等级",
                    slot: "level",
                    width: 100
                },

                // {
                //     title: "绑定微信",
                //     slot: "wechat",
                //     width: 100,
                // },
                {
                    title: "消费记录",
                    slot: "business_record",
                    width: 120
                },
                {
                    title: "推荐配对",
                    slot: "push_member",
                    width: 100
                },

                {
                    title: "注册来源",
                    key: "registerSource",
                    width: 200,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {},
                                params.row.store.name
                                    ? params.row.store.name
                                    : "暂无"
                            )
                        ]);
                    }
                },

                {
                    title: "分享记录",
                    slot: "share_record",
                    width: 100
                },
                {
                    title: "会员状态",
                    key: "status",
                    width: 100,
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "statusColorType"
                                    ](params.row.status),
                                    text: this.$options.filters[
                                        "accountStatus"
                                    ](params.row.status)
                                }
                            })
                        ]);
                    }
                },

                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    width: 150,
                    align: "center"
                    // render: (h, params) => {
                    //     return h("div", [
                    //         h(
                    //             "Tooltip",
                    //             {
                    //                 props: {
                    //                     content: "查看余额",
                    //                     theme: "light"
                    //                 }
                    //             },
                    //             [
                    //                 h("Button", {
                    //                     props: {
                    //                         icon: "ios-cash-outline"
                    //                     },
                    //                     style: {
                    //                         marginRight: "5px"
                    //                     },
                    //                     on: {
                    //                         click: () => {
                    //                             this.show(params.index);
                    //                         }
                    //                     }
                    //                 })
                    //             ]
                    //         ),
                    //         h(
                    //             "Tooltip",
                    //             {
                    //                 props: {
                    //                     content: "查看消费记录",
                    //                     theme: "light"
                    //                 }
                    //             },
                    //             [
                    //                 h("Button", {
                    //                     props: {
                    //                         icon: "ios-paper-outline"
                    //                     },
                    //                     style: {
                    //                         marginRight: "5px"
                    //                     },
                    //                     on: {
                    //                         click: () => {
                    //                             this.show(params.index);
                    //                         }
                    //                     }
                    //                 })
                    //             ]
                    //         ),
                    //         h(
                    //             "Tooltip",
                    //             {
                    //                 props: {
                    //                     content: "查看会员详情",
                    //                     theme: "light"
                    //                 }
                    //             },
                    //             [
                    //                 h("Button", {
                    //                     props: {
                    //                         icon: "ios-eye-outline"
                    //                     },
                    //                     on: {
                    //                         click: () => {
                    //                             this.onRowClick({
                    //                                 code: params.row.code,
                    //                                 storeCode:
                    //                                     params.row.storeCode,
                    //                                 mode: PAGE_MODE.DETAIL
                    //                             });
                    //                         }
                    //                     }
                    //                 })
                    //             ]
                    //         )
                    //     ]);
                    // }
                }
            ],
            // 表格是否加载
            tableLoading: false,
            // 分页信息
            pageInfo: {},
            // 查询信息
            searchCond: {
                // 查询项
                options: {},
                // 排序方式（按创建时间）
                sortByCreateTime: null
            },
            // 抽屉表单是否显示
            showMemberForm: false,
            // 会员详情需要参数
            codeObj: {
                code: null,
                storeCode: null
            },
            // 表单操作模式
            formMode: null
        };
    },
    created() {
        // 调用获取数据的方法
        this.getDataList(1);
         if (this.$route.params.advselect) {
            this.advSelect = 1;
        } else {
            this.advSelect = 0;
        }
    },
    methods: {
        zeouTags(item) {
            let arr = [];
            if (this.isEmptyObject(item.mateRequire)) return arr;
            arr.push(
                `年龄：${this.$options.filters["ageRange"](
                    item.mateRequire.ageRange
                )}`
            );
            arr.push(
                `身高：${this.$options.filters["tallRange"](
                    item.mateRequire.tallRange
                )}`
            );
            arr.push(
                `学历：${this.$options.filters["education"](
                    item.mateRequire.minEducation
                )}`
            );
            arr.push(
                `月入：${this.$options.filters["monthlySalary"](
                    item.mateRequire.monthlySalary
                )}`
            );
            arr.push(
                `婚姻状况：${this.$options.filters["marriageStatus"](
                    item.mateRequire.marriageStatus
                )}`
            );
            return arr;
        },
        basicTags(item) {
            let arr = [];
            if (this.isEmptyObject(item.basic)) return arr;
            arr.push(`年龄：${item.basic.age}岁`);
            arr.push(`身高：${item.basic.tall + "cm"}`);
            arr.push(
                `地区：${item.basic.provinceName}${item.basic.cityName}${
                    item.basic.countyName
                }`
            );
            let jiguan = item.basic.nativeProvinceName
                ? `${item.basic.nativeProvinceName}${
                      item.basic.nativeCityName
                  }${item.basic.nativeCountyName}`
                : "";
            arr.push(`籍贯：${jiguan}`);
            arr.push(
                `学历：${this.$options.filters["education"](
                    item.basic.education
                )}`
            );
            return arr;
        },
        jingjiTags(item) {
            let arr = [];
            if (this.isEmptyObject(item.basic)) return arr;
            arr.push(
                `车：` +
                    this.$options.filters["buyCarCond"](item.basic.buyCarCond)
            );
            arr.push(
                `房：` +
                    this.$options.filters["houseCond"](item.basic.houseCond)
            );
            arr.push(
                `月收入：` +
                    this.$options.filters["monthlySalary"](
                        item.basic.monthlySalary
                    )
            );
            return arr;
        },
        // 新增/修改
        onFormOperateFinish() {
            this.getDataList(this.pageInfo.current);
            this.showStoreForm = false;
        },
        // 查询
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        // 获取数据
        async getDataList(page) {
            // 表格显示加载
            this.tableLoading = true;
            // 查询对象
            const searchQuery = {
                page: page,
                ...this.searchCond.options
            };
            // 得到数据
            let { records, total, size, current } = await getMemberList(
                searchQuery
            );
            console.log(records);
            // 赋值
            // 会员列表数据
            this.tableData = records;
            // 分页数据
            this.pageInfo = {
                total,
                size,
                current
            };
            this.tableLoading = false;
        },
        // 查看详情
        onRowClick({ code, storeCode, mode = PAGE_MODE.DETAIL }) {
            this.codeObj.code = code;
            this.codeObj.storeCode = storeCode;
            this.formMode = mode;
            this.showMemberForm = true;
            event.stopPropagation();
        },
        // 新增会员
        onShowAddModal() {
            console.log("新增会员");
        },
        show(index) {
            this.$Modal.info({
                title: "User Info",
                content: `Name：${this.tableData[index].nickName}`
            });
        },
         selectMember(row) {
            sessionStorage.setItem("memberInfo", JSON.stringify(row));
            this.$router.go(-1);
        }
    }
};
</script>

<style>
</style>