<template>
    <div class="flexC">
        <page-header title="约会订单" description="约会订单列表" />
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
import SearchOption from "./components/appointment-search-filter";
import { getAppointmentList } from "@/api/product/appointment";

export default {
    name: "index",
    components: { SearchOption },
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null,
                sortByAppointmentDate: null,
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "约会ID",
                    key: "code",
                },

                {
                    title: "发约者",
                    key: "signer",
                    render: (h, params) => {
                        return h("div", [
                            h("Avatar", {
                                props: {
                                    shape: "square",
                                    size: "54",
                                },
                                attrs: {
                                    src: params.row.signer.headUrl,
                                },
                            }),
                            h(
                                "span",
                                {
                                    style: {
                                        marginLeft: "5px",
                                    },
                                },
                                params.row.signer.nickName
                            ),
                        ]);
                    },
                },
                {
                    title: "被约者",
                    key: "promisee",
                    render: (h, params) => {
                        return h("div", [
                            h("Avatar", {
                                props: {
                                    shape: "square",
                                    size: "54",
                                },
                                attrs: {
                                    src: params.row.promisee.headUrl,
                                },
                            }),
                            h(
                                "span",
                                {
                                    style: {
                                        marginLeft: "5px",
                                    },
                                },
                                params.row.promisee.nickName
                            ),
                        ]);
                    },
                },
                {
                    title: "约会地点",
                    key: "address",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            `${params.row.provinceName}${params.row.cityName}${params.row.countyName}${params.row.address}`
                        );
                    },
                },
                {
                    title: "约会时间",
                    key: "appointmentDate",
                    sortable: true,
                },
                     {
                    title: "服务人",
                    key: "",
                    
                },
                {
                    title: "状态",
                    key: "state",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "appointmentState"
                                    ](params.row.state, true),
                                    text: this.$options.filters[
                                        "appointmentState"
                                    ](params.row.state),
                                },
                            }),
                        ]);
                    },
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
                sortByAppointmentDate: this.searchCond.sortByAppointmentDate,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            let { records, total, size, current } = await getAppointmentList(
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
            if (key === "appointmentDate") {
                this.searchCond.sortByAppointmentDate =
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
