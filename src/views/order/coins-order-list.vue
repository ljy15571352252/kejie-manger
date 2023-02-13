<template>
    <div class="flexC">
        <page-header title="金币订单" description="金币订单列表" />
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
                <template slot-scope="{ row, index }" slot="action">
                    <a type="text" @click="lookDetail(row.code,row.storeCode)">详情</a>
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
        <Drawer title="订单详情" v-model="showDrawer" width="570">
            <coins-order-detail
                    :code="targetOrderCode"
                    :storeCode="storeCode"
            />
        </Drawer>

    </div>
</template>

<script>
import SearchOption from "./components/coins-order-search-filter";
import {getCoinsOrderList} from "@/api/product/coinsset";
import CoinsOrderDetail from './components/coins-order-detail'
export default {
    name: "index",
    components: { SearchOption, CoinsOrderDetail },
    data() {
        return {
            targetOrderCode: null,
            storeCode:'',
            searchCond: {
                options: {},
                sortByCreateTime: null,
            },
            pageInfo: {},
            showDrawer: false,
            tableLoading: false,
            columns: [
                {
                    title: "订单号",
                    key: "code",
                },

                {
                    title: "下单用户",
                    key: "user",
                    render: (h, params) => {
                        return h("div", [
                            h("Avatar", {
                                props: {
                                    shape: "square",
                                    size: "54",
                                },
                                attrs: {
                                    src: params.row.member.headUrl,
                                },
                            }),
                            h(
                                "span",
                                {
                                    style: {
                                        marginLeft: "5px",
                                    },
                                },
                                params.row.member.nickName
                            ),
                        ]);
                    },
                },
                {
                    title: "订单类型",
                    key: "type",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            this.$options.filters["coinsOrderType"](
                                params.row.type
                            )
                        );
                    },
                },
                {
                    title: "金币数量",
                    key: "coins",
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
                    title: "创建时间",
                    key: "createTime",
                    sortable: true,
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 150,
                },
            ],
            tableData: [],
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        lookDetail(code,storeCode) {
            this.targetOrderCode = code;
            this.storeCode = storeCode;
            this.showDrawer=true
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
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            let { records, total, size, current } = await getCoinsOrderList(
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
