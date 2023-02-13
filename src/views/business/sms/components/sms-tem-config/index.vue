<template>
    <div>
        <!--        <search-options @on-search="onSearch" />-->
        <!--        <table-tool @on-refresh="getDataList(pageInfo.current)"> </table-tool>-->
        <Alert type="warning">
            当前短信类型：{{ smsConfigObj.type | smsConfigType }}
        </Alert>
        <Table :loading="tableLoading" :columns="columns" :data="tableData">
            <div slot-scope="{ row, index }" slot="aliyunTemplate">
                <span v-if="smsConfigObj.type === 2">
                    {{ row.aliyunTemplate }}</span
                >
                <span v-else> {{ row.template.aliyunTemcode }}</span>
            </div>
            <div
                slot-scope="{ row, index }"
                slot="action"
                v-show="smsConfigObj.type === 2"
            >
                <a
                    @click="
                        onRowClick({
                            obj: this.copyJson(row),
                        })
                    "
                    >编辑</a
                >
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
        <tem-config-form v-model="showEditModal" :obj="targetObj" />
    </div>
</template>

<script>
import SearchOptions from "./search-filter";
import { getSmsTemList } from "@/api/configset/smsconfig";
import TemConfigForm from "./tem-config-form";
export default {
    name: "sms-tem-config",
    props: ["smsConfigObj"],
    components: { SearchOptions, TemConfigForm },
    data() {
        return {
            showEditModal: false,
            targetObj: null,
            searchCond: {
                options: {},
            },
            pageInfo: {},
            tableLoading: false,
            columns: [],
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
            };
            let { records, total, size, current } = await getSmsTemList(
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
        onRowClick({ obj }) {
            this.targetObj = obj;
            this.showEditModal = true;
            event.stopPropagation();
        },
    },
    watch: {
        smsConfigObj(cur) {
            this.columns = [
                {
                    title: "模板名称",
                    key: "name",
                    render: (h, params) => {
                        return h("span", {}, params.row.template.name);
                    },
                },
                {
                    title: "模板Code",
                    slot: "aliyunTemplate",
                },

                {
                    title: "模板分类",
                    key: "categoryName",
                    render: (h, params) => {
                        return h("span", {}, params.row.template.categoryName);
                    },
                },
                {
                    title: "模板内容",
                    key: "content",
                    render: (h, params) => {
                        return h("span", {}, params.row.template.content);
                    },
                },
            ];
            if (cur === 2) {
                this.columns = this.columns.concat({
                    title: "操作",
                    slot: "action",
                    align: "center",
                    width: 150,
                });
            }
        },
    },
    filters: {},
};
</script>

<style scoped lang="less"></style>
