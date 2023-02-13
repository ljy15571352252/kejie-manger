<template>
    <div class="flexC">
        <page-header title="会员卡订单" description="会员卡订单列表" />
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
              <div slot-scope="{ row, index }" slot="user" class="table-padding">
                <Avatar :src="row.member.headUrl" shape="square" size="54"/>
                <span class="margin-left-10">{{row.member.nickName}}</span>
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

    </div>
</template>

<script>
import SearchOption from "./components/vipcard-order-search-filter";
import {getVipCardOrderList} from "@/api/product/vipcard";

export default {
    name: "index",
    components: { SearchOption },
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null,
                sortByFinishTime:null,
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "订单号",
                    key: "code",
                },

                {
                    title: "下单用户",
                    slot: "user",
                },
                {
                    title: "开通vip",
                    key: "levelName",
                },
                {
                    title: "售价",
                    key: "price",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            this.$options.filters["price"](
                                params.row.price
                            )
                        );
                    },
                },
                {
                    title: "有效天数",
                    key: "validDays",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                           `${params.row.validDays}天`
                        );
                    },
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
                    },
                },
                {
                    title: "订单状态",
                    key: "state",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters["commonOrderState"](
                                        params.row.state,
                                        true
                                    ),
                                    text: this.$options.filters["commonOrderState"](
                                        params.row.state
                                    ),
                                },
                            }),
                        ]);
                    },
                },
                {
                    title: "下单时间",
                    key: "createTime",
                    sortable: true,
                },
                {
                    title: "完成时间",
                    key: "finishTime",
                    sortable: true,
                },
                // {
                //     title: "操作",
                //     slot: "action",
                //     fixed: "right",
                //     align: "center",
                //     width: 150,
                // },
            ],
            tableData: [],
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
                sortByFinishTime:this.searchCond.sortByFinishTime
            };
            let { records, total, size, current } = await getVipCardOrderList(
                searchQuery
            );
            this.tableData = records;
            this.pageInfo = {
                total,
                size,
                current,
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
        },
    },
    watch: {},
    filters: {},
};
</script>

<style lang="less">
.main-page {
}
</style>
