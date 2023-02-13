<template>
    <div>
        <Modal
            v-model="showModal"
            title="选择小程序版本"
            :mask-closable="false"
            @on-ok="onSubmit"
            width="700"
            @on-visible-change="onVisibleChange"
        >
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
            >
                <template slot-scope="{ row, index }" slot="action">
                    <Button
                        v-if="selectedCode !== row.code"
                        type="primary"
                        @click="onSubmit(row)"
                    >
                        选择
                    </Button>
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
        </Modal>
    </div>
</template>

<script>
import { getMpProgramVersions } from "@/api/configset/wxconfig";

export default {
    name: "index",
    props: ["value", "type", "selectedCode"],
    data() {
        return {
            showModal: false,
            columns: [
                {
                    title: "版本号",
                    key: "version",
                },
                {
                    title: "描述",
                    key: "description",
                },
                {
                    title: "添加时间",
                    key: "createTime",
                    sortable: true,
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center",
                },
            ],
            tableData: [],
            pageInfo: {},
            tableLoading: false,
            searchCond: {
                options: {
                    templateType: null,
                },
                sortByCreateTime: null,
            },
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
    },
    methods: {
        onSortChange({ key, order }) {
            if (key === "createTime") {
                this.searchCond.sortByCreateTime =
                    order === "normal" ? null : order;
            }
            this.getDataList(1);
        },
        async getDataList(page) {
            this.tableLoading = true;
            this.searchCond.options.type = this.type;
            const searchQuery = {
                page: page,
                ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            let { records, total, size, current } = await getMpProgramVersions(
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
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit(item) {
            this.$emit("on-select", item);
            this.$emit("input", false);
        },
    },
    mounted() {
        this.getDataList(1);
    },
};
</script>

<style scoped></style>
