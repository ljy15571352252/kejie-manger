<template>
  <div class="flexC">
    <page-header
      title="红娘列表"
      description="平台的红娘列表"
    />
    <div class="pageContent flexC">
      <search-option
        @on-search="onSearch"
        :showCheck="true"
      />
      <table-tool @on-refresh="getDataList(pageInfo.current)">
        <!-- <Button
          type="primary"
          ghost
          icon="ios-add"
          @click="addMatchmarker"
        >添加红娘
        </Button> -->
      </table-tool>
      <Table
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
        @on-sort-change="onSortChange"
      >
        <template
          slot-scope="{ row }"
          slot="user_info"
        >
          <div class="x-f">
            <Avatar
              :src="row.headUrl"
              shape="square"
              size="54"
            />
            <div class="margin-left-10">
              <div>昵称：{{row.nickName}}</div>
              <div>ID: {{ row.code }}</div>
              <div>手机：{{ row.mobile }}</div>
            </div>
          </div>
        </template>
        <template
          slot-scope="{ row }"
          slot="realname_sex"
        >
          <div>姓名: {{ row.realName }}</div>
          <div>性别：{{ row.sex | sex }}</div>
        </template>
        <template
          slot-scope="{ row }"
          slot="commissionConfig"
        >
          <div>
            vip套装下单提成：{{
            row.commissionConfig.vipCardCommissionPercentage
            }}%
          </div>
          <div>
            查看联系人提成：￥{{
            row.commissionConfig.contactCommissionAmount | price
            }}
          </div>
          <div>
            线下牵线提成：￥{{
            row.commissionConfig.offlinePullCommissionAmount
            | price
            }}
          </div>
          <div>
            实名认证提成：￥{{
            row.commissionConfig.identificationCommissionAmount
            | price
            }}
          </div>
          <div>
            活动下单提成：{{
            row.commissionConfig.activityCommissionPercentage
            }}%
          </div>
        </template>
        <template
          slot-scope="{ row }"
          slot="balance"
        >
          <div style="padding: 8px 0">
            <div>可提现：{{ row.balance.balance | price }}</div>
            <div>
              已提现：{{ row.balance.postaledBalance | price }}
            </div>
            <div>
              总收入：{{
              (row.balance.balance +
              row.balance.postaledBalance)
              | price
              }}
            </div>
          </div>
        </template>
        <template
          slot-scope="{ row }"
          slot="fans"
        >
          <div>男粉丝：{{ row.maleCount }}</div>
          <div>女粉丝：{{ row.femailCount }}</div>
        </template>
        <template
          slot-scope="{ row }"
          slot="groupCount"
        >
          <a
            type="text"
            @click="onShowGroupModal(row)"
          >{{row.groupCount}}</a>
        </template>
        <div
          slot-scope="{ row }"
          slot="action"
          class="x-f flex-wrap"
        >
          <a
            type="text"
            @click="lookMatchmarkerDetail(row.code)"
          >详情</a>
          <template>
            <Divider type="vertical" />
            <a
              type="text"
              v-if="row.checkState === CHECK_STATE.WAIT_FOR_CHECK || row.checkState === CHECK_STATE.REJECT"
              @click="onCheck(row.code)"
            >审核</a>
            <a
              type="text"
              v-else
              @click="overRule(row.code)"
            >驳回</a>
          </template>
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

    <check-modal
      ref="checkModal"
      v-model="showCheckModal"
      title="红娘审核"
      @on-submit="onCheckFinish"
    />
    <commission-records
      :code="visitCommissionRecordMatchMarkerCode"
      v-model="showCommissionRecordModal"
    />
    <matchmarker-status-modal
      ref="statusModal"
      @on-success="getDataList(pageInfo.current)"
      v-model="showMatchmarkerStatusModal"
      :code="selectMatchmarkerStatusCode"
    />

    <mactchmarker-commission-config
      v-model="showCommissionConfigModal"
      :matchmarker="selectMatchmarker"
      @on-success="getDataList(1)"
    />
    <matchmarker-group-modal
      v-model="showGroupModal"
      :matchmarker-code="selectMatchmarker.code"
    />
    <matchmarker-serveaddr
      v-model="showServeAddrModal"
      :matchmarker="selectMatchmarker"
    />
  </div>
</template>

<script>
import SearchOption from "./components/matchmarker-search-filter";
import CheckModal from "@/components/check";
import CommissionRecords from "./components/comission-records";
import MatchmarkerStatusModal from "./components/matchmarker-status-modal";
import {
    checkMatchMarker,
    getMatchMarkerList
} from "@/api/matchmarker/matchmarker";
import MactchmarkerCommissionConfig from "@/views/matchmarker/components/matchmarker-commission-config";
import MatchmarkerGroupModal from "@/views/matchmarker/components/matchmarker-group-modal";
import MatchmarkerServeaddr from "@/views/matchmarker/components/matchmarker-serveaddr-config";

export default {
    name: "index",
    components: {
        MatchmarkerServeaddr,
        MatchmarkerGroupModal,
        MactchmarkerCommissionConfig,
        SearchOption,
        CheckModal,
        CommissionRecords,
        MatchmarkerStatusModal
    },
    data() {
        return {
            showServeAddrModal: false,

            showCommissionConfigModal: false,
            showGroupModal: false,
            showCommissionRecordModal: false,
            visitCommissionRecordMatchMarkerCode: null,
            showCheckModal: false,
            checkMarkerCode: null,
            showMatchmarkerStatusModal: false,
            selectMatchmarkerStatusCode: null,
            selectMatchmarker: {},
            searchCond: {
                options: {
                    checkState: 2
                },
                sortByCreateTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "基本信息",
                    slot: "user_info",
                    width: 240,
                    fixed: "left"
                },
                {
                    title: "姓名性别",
                    slot: "realname_sex",
                    width: 100
                },
                // {
                //     title: "服务社区",
                //     key: "mapSearch",
                //     width: 100,
                // },
                {
                    title: "服务社区",
                    key: "area",
                    width: 200,
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            `${params.row.provinceName}${params.row.cityName}${
                                params.row.countyName
                            }${params.row.townName}`
                        );
                    }
                },
                {
                    title: "二维码",
                    slot: "user_info",
                    width: 100,
                    render: (h, params) => {
                        return h("Avatar", {
                            props: {
                                shape: "square",
                                size: "80"
                            },
                            attrs: {
                                src: params.row.logo
                            }
                        });
                    }
                },
                {
                    title: "粉丝信息",
                    slot: "fans",
                    width: 150
                },
                {
                    title: "收入记录",
                    slot: "balance",
                    width: 150
                },
                {
                    title: "提成设置",
                    width: 260,
                    slot: "commissionConfig"
                },
                {
                    title: "注册来源",
                    key: "registerSource",
                    width: 160,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {},

                                params.row.store.name
                                    ? params.row.store.name
                                    : "暂无"
                            )
                            //  h(
                            //     "p",
                            //     {},
                            //     params.row.registerSource == 1
                            //         ? "公众号/H5注册:" +
                            //               `${
                            //                   params.row.store.name
                            //                       ? params.row.store.name
                            //                       : "暂无"
                            //               }`
                            //         : params.row.registerSource == 2
                            //         ? "小程序注册:" +
                            //           `${
                            //               params.row.store.name
                            //                   ? params.row.store.name
                            //                   : "暂无"
                            //           }`
                            //         : params.row.registerSource == 3
                            //         ? "商户后台添加"
                            //         : params.row.registerSource == 4
                            //         ? "总后台管理添加:"
                            //         : params.row.registerSource == 5
                            //         ? "PC端注册:"
                            //         : "暂无注册来源"
                            // )
                        ]);
                    }
                },
                // {
                //     title: "地区",
                //     key: "area",
                //     width: 200,
                //     render: (h, params) => {
                //         return h(
                //             "span",
                //             {},
                //             `${params.row.provinceName}${params.row.cityName}${params.row.countyName}${params.row.townName}`
                //         );
                //     },
                // },
                // {
                //     title: "群组数",
                //     slot: "groupCount",
                //     width: 80,
                // },
                {
                    title: "群名称",
                    key: "groupName",
                    width: 80
                },
                {
                    title: "状态",
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
                    title: "审核状态",
                    key: "checkState",
                    width: 150,
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters["checkState"](
                                        params.row.checkState,
                                        true
                                    ),
                                    text: this.$options.filters["checkState"](
                                        params.row.checkState
                                    )
                                }
                            })
                        ]);
                    }
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    sortable: true,
                    width: 180
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 200
                }
            ],
            tableData: []
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        onShowServeAddrConfig(item) {
            this.showServeAddrModal = true;
            this.selectMatchmarker = item;
        },
        onShowCommissionConfig(item) {
            this.showCommissionConfigModal = true;
            this.selectMatchmarker = item;
        },
        onShowGroupModal(item) {
            this.showGroupModal = true;
            this.selectMatchmarker = item;
        },
        recoveryMatchmarkerAcc(code) {
            event.stopPropagation();
            this.$refs.statusModal.recoveryAcc(code, () => {
                this.getDataList(this.pageInfo.current);
            });
        },
        onShowMatchmarkerStatus(code) {
            this.selectMatchmarkerStatusCode = code;
            this.showMatchmarkerStatusModal = true;
            event.stopPropagation();
        },
        onShowCommissionRecord(code) {
            this.visitCommissionRecordMatchMarkerCode = code;
            this.showCommissionRecordModal = true;
            event.stopPropagation();
        },
        onCheck(code) {
            this.checkMarkerCode = code;
            this.showCheckModal = true;
            event.stopPropagation();
        },
        overRule(code) {
            this.checkMarkerCode = code;
            this.showCheckModal = true;
            event.stopPropagation();
        },
        async onCheckFinish(data) {
            let json = {
                ...data,
                code: this.checkMarkerCode
            };
            let ok = await checkMatchMarker(json);
            if (ok == true) {
               this.$Message.success("审核成功");
                this.$refs.checkModal.finish();
                this.getDataList(this.pageInfo.current);
            }
        },
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime
            };
            let { records, total, size, current } = await getMatchMarkerList(
                searchQuery
            );
            this.tableData = records;
            this.pageInfo = {
                total,
                size,
                current
            };
            this.tableLoading = false;
        },
        onSortChange({ key, order }) {
            if (key === "createTime") {
                this.searchCond.sortByCreateTime =
                    order === "normal" ? null : order;
            }
            this.getDataList(1);
        },
        editMatchmarker(code) {
            this.$router.push({ path: "/matchmarker/edit", query: { code } });
        },
        lookMatchmarkerDetail(code) {
            this.$router.push({ path: "/matchmarker/detail", query: { code } });
        },
        addMatchmarker() {
            this.$router.push({ path: "/matchmarker/add" });
        }
    },
    watch: {},
    filters: {}
};
</script>

<style lang="less">
.ivu-table {
    td {
        padding: 10px 0;
    }
}
.flex-wrap {
    justify-content: center;
}
</style>
