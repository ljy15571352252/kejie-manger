<template>
  <div class="flexC">
    <page-header
      title="查看联系人订单"
      description="查看联系人订单列表"
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
import SearchOption from "./components/lookcontact-order-search-filter";
import { getLookContactOrderList } from "@/api/product/lookcontact";
export default {
    name: "index",
    components: { SearchOption },
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null,
                sortByFinishTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "订单号",
                    key: "code"
                },

                {
                    title: "下单用户",
                    key: "user",
                    render: (h, params) => {
                        return h("div", [
                            h("Avatar", {
                                props: {
                                    shape: "square",
                                    size: "54"
                                },
                                attrs: {
                                    src: params.row.member.headUrl
                                }
                            }),
                            h(
                                "span",
                                {
                                    style: {
                                        marginLeft: "5px"
                                    }
                                },
                                params.row.member.nickName
                            )
                        ]);
                    }
                },
                {
                    title: "联系人用户",
                    key: "contactMember",
                    render: (h, params) => {
                        return h("div", [
                            h("Avatar", {
                                props: {
                                    shape: "square",
                                    size: "54"
                                },
                                attrs: {
                                    src: params.row.contactMember.headUrl
                                }
                            }),
                            h(
                                "span",
                                {
                                    style: {
                                        marginLeft: "5px"
                                    }
                                },
                                params.row.contactMember.nickName
                            )
                        ]);
                    }
                },
                {
                    title: "订单金额",
                    key: "totalAmount",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            this.$options.filters["price"](
                                params.row.totalAmount
                            )
                        );
                    }
                },
                // {
                //     title: "订单状态",
                //     key: "state",
                //     render: (h, params) => {
                //         return h("div", [
                //             h("Badge", {
                //                 props: {
                //                     color: this.$options.filters["commonOrderState"](
                //                         params.row.state,
                //                         true
                //                     ),
                //                     text: this.$options.filters["commonOrderState"](
                //                         params.row.state
                //                     ),
                //                 },
                //             }),
                //         ]);
                //     },
                // },
                {
                    title: "服务类型",
                    key: ""
                },
                {
                    title: "下单时间",
                    key: "createTime",
                    sortable: true
                },
                {
                    title: "完成时间",
                    key: "finishTime",
                    sortable: true
                }
                // {
                //     title: "操作",
                //     slot: "action",
                //     fixed: "right",
                //     align: "center",
                //     width: 150,
                // },
            ],
            tableData: []
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime,
                sortByFinishTime: this.searchCond.sortByFinishTime
            };
            let {
                records,
                total,
                size,
                current
            } = await getLookContactOrderList(searchQuery);
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
            if (key === "finishTime") {
                this.searchCond.sortByFinishTime =
                    order === "normal" ? null : order;
            }
            this.getDataList(1);
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
