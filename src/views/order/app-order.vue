<template>
  <div class="flexC">
    <page-header
      title="应用订单"
      description="应用订单列表"
    />
    <div class="pageContent flexC">
      <search-option @on-search="onSearch" />
      <table-tool @on-refresh="getDataList(pageInfo.current)">
      </table-tool>
      <Table
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
        @on-sort-change="onSortChange"
      >
        <template
          slot-scope="{ row }"
          slot="action"
        >
          <a
            type="text"
            @click="lookDetail(row.code,row.storeCode)"
          >详情</a>
        </template>
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
  </div>
</template>

<script>
import SearchOption from "./components/app-order-search";
import { getStoreOrderDetails } from "@/api/store/store";

export default {
    name: "index",
    components: { SearchOption },
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null,
                sortByAppointmentDate: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                // {
                //     title: "订单号",
                //     key: "code"
                // },
                {
                    title: "商户ID",
                    key: "storeCode"
                },
                {
                    title: "应用模块",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.details[0].platform == 0
                                ? "全部"
                                : params.row.details[0].platform == 1
                                ? "小程序"
                                : params.row.details[0].platform == 2
                                ? "公众号"
                                : params.row.details[0].platform == 3
                                ? "APP"
                                : params.row.details[0].platform == 4
                                ? "活动"
                                : params.row.details[0].platform == 5
                                ? "视频"
                                : params.row.details[0].platform == 6
                                ? "红娘"
                                : params.row.details[0].platform == 7
                                ? "网站"
                                : params.row.details[0].platform == 8
                                ? "加盟"
                                : params.row.details[0].platform == 9
                                ? "直播"
                                : "暂无"
                        );
                    }
                },
                {
                    title: "年/月/日",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.details[0].chargeType == 1
                                ? "天"
                                : params.row.details[0].chargeType == 2
                                ? "月"
                                : params.row.details[0].chargeType == 3
                                ? "年"
                                : "暂无"
                        );
                    }
                },
                {
                    title: "价格",
                    render: (h, params) => {
                        return h("span", {}, params.row.details[0].totalCash);
                    }
                },
                {
                    title: "数量",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.details[0].chargeType == 1
                                ? "1天"
                                : params.row.details[0].chargeType == 2
                                ? "1个月"
                                : params.row.details[0].chargeType == 3
                                ? "12个月"
                                : "暂无"
                            // params.row.details[0].count
                        );
                    }
                },
                {
                    title: "付款金额",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},

                            params.row.payCash
                        );
                    }
                },
                {
                    title: "有效时间",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    padding: "10px 0"
                                }
                            },
                            [
                                params.row.payTime
                                    ? h(
                                          "p",
                                          {
                                              style: {
                                                  marginLeft: "5px"
                                              }
                                          },
                                          params.row.payTime
                                      )
                                    : "暂未购买",
                                params.row.payTime
                                    ? h(
                                          "p",
                                          {
                                              style: {
                                                  marginLeft: "5px"
                                              }
                                          },
                                          params.row.details[0].chargeType == 1
                                              ? this.calcuDate(
                                                    params.row.payTime,
                                                    1
                                                )
                                              : params.row.details[0]
                                                    .chargeType == 2
                                              ? this.calcuDate(
                                                    params.row.payTime,
                                                    30
                                                )
                                              : params.row.details[0]
                                                    .chargeType == 3
                                              ? this.calcuDate(
                                                    params.row.payTime,
                                                    365
                                                )
                                              : "暂无"
                                      )
                                    : ""
                            ]
                        );
                    }
                },
                // {
                //     title: "支付类型",
                //     key: "payType",
                //     render: (h, params) => {
                //         return h(
                //             "span",
                //             {},

                //             params.row.payType == 1
                //                 ? "微信支付"
                //                 : params.row.payType == 2
                //                 ? "支付宝支付"
                //                 : params.row.payType == 3
                //                 ? "余额支付"
                //                 : "暂无"
                //         );
                //     }
                // },
                // {
                //     title: "付款金额",
                //     key: "payCash"
                // },
                // {
                //     title: "订单状态",
                //     key: "state",
                //     render: (h, params) => {
                //         return h(
                //             "span",
                //             {},
                //             params.row.state == 1
                //                 ? "待付款"
                //                 : params.row.state == 2
                //                 ? "已付款"
                //                 : params.row.state == 3
                //                 ? "付款失败"
                //                 : params.row.state == 4
                //                 ? "订单取消"
                //                 : params.row.state == 5
                //                 ? "交易成功"
                //                 : "暂无"
                //         );
                //     }
                // },
                // {
                //     title: "总金额",
                //     key: "totalCash"
                // },

                // {
                //     title: "创建时间",
                //     key: "createTime",
                //     sortable: true
                // },
                // {
                //     title: "支付时间",
                //     key: "payTime",
                //     sortable: true
                // },

                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 150
                }
            ],
            // columns: [
            //     {
            //         title: "订单号",
            //         key: "code"
            //     },
            //     {
            //         title: "商户ID",
            //         key: "storeCode"
            //     },

            //     {
            //         title: "支付类型",
            //         key: "payType",
            //         render: (h, params) => {
            //             return h(
            //                 "span",
            //                 {},

            //                 params.row.payType == 1
            //                     ? "微信支付"
            //                     : params.row.payType == 2
            //                     ? "支付宝支付"
            //                     : params.row.payType == 3
            //                     ? "余额支付"
            //                     : "暂无"
            //             );
            //         }
            //     },
            //     {
            //         title: "付款金额",
            //         key: "payCash"
            //     },
            //     {
            //         title: "订单状态",
            //         key: "state",
            //         render: (h, params) => {
            //             return h(
            //                 "span",
            //                 {},
            //                 params.row.state == 1
            //                     ? "待付款"
            //                     : params.row.state == 2
            //                     ? "已付款"
            //                     : params.row.state == 3
            //                     ? "付款失败"
            //                     : params.row.state == 4
            //                     ? "订单取消"
            //                     : params.row.state == 5
            //                     ? "交易成功"
            //                     : "暂无"
            //             );
            //         }
            //     },
            //     {
            //         title: "总金额",
            //         key: "totalCash"
            //     },

            //     {
            //         title: "创建时间",
            //         key: "createTime",
            //         sortable: true
            //     },
            //     {
            //         title: "支付时间",
            //         key: "payTime",
            //         sortable: true
            //     },

            //     {
            //         title: "操作",
            //         slot: "action",
            //         fixed: "right",
            //         align: "center",
            //         width: 150
            //     }
            // ],
            tableData: []
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        calcuDate(date, plusDays) {
            let newDate;
            let elseData;
            if (date.length > 10) {
                newDate = date.substring(0, 10);
                elseData = date.substring(10, 19);
            } else {
                newDate = date;
                elseData = "";
            }
            var dateArray = newDate.split("-");
            var year = +dateArray[0];
            var month = +dateArray[1];
            var day = +dateArray[2];
            var oriDay = day;
            var secondMonthDays =
                (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
                    ? 29
                    : 28;
            while (plusDays > 0) {
                oriDay = day;
                day += plusDays;
                switch (month) {
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        if (day > 30) {
                            plusDays -= 30 - oriDay + 1;
                            month++;
                            day = 1;
                        } else {
                            plusDays = 0;
                        }
                        break;
                    case 2:
                        if (day > secondMonthDays) {
                            plusDays -= secondMonthDays - oriDay + 1;
                            month++;
                            day = 1;
                        } else {
                            plusDays = 0;
                        }
                        break;
                    default:
                        if (day > 31) {
                            plusDays -= 31 - oriDay + 1;
                            day = 1;
                            month++;
                        } else {
                            plusDays = 0;
                        }
                }
                if (month > 12) {
                    month = 1;
                    year++;
                }
            }

            return year + "-" + month + "-" + day + elseData;
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
                sortByAppointmentDate: this.searchCond.sortByAppointmentDate,
                sortByCreateTime: this.searchCond.sortByCreateTime
            };
            let { records, total, size, current } = await getStoreOrderDetails(
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
            if (key === "appointmentDate") {
                this.searchCond.sortByAppointmentDate =
                    order === "normal" ? null : order;
            }
            this.getDataList(1);
        },
        lookDetail(code, storeCode) {
            this.$router.push("/app-order-detail/" + code + "/" + storeCode);
        }
    },
    watch: {},
    filters: {}
};
</script>

<style lang="less">
.main-page {
}
</style>
