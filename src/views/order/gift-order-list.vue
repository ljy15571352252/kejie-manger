<template>
    <div class="flexC">
        <page-header title="礼物订单" description="礼物订单列表" />
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
              <template slot-scope="{ row, index }" slot="gift">
                <div class="x-f" style="padding: 10px 0">
                  <img :src="row.imgUrl" style="width: 100px"/>
                  <span style="margin-left: 5px">{{row.name}}</span>
                </div>
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
import SearchOption from "./components/gift-order-search-filter";
import {getGiftOrderList} from "@/api/product/gift";


export default {
    name: "index",
    components: { SearchOption },
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null,
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
                    title: "礼物",
                    slot: "gift",
                },
                {
                    title: "数量",
                    key: "count",
                },
                {
                    title: "单价",
                    key: "price",
                },
                {
                    title: "总价",
                    key: "totalAmount",
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
            };
            let { records, total, size, current } = await getGiftOrderList(
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
