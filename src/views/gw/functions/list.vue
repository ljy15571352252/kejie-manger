<template>
    <div class="flexC">
        <page-header title="功能表" description="功能表列表" />
        <div class="pageContent flexC">
            <search-option @on-search="onSearch" />
            <table-tool @on-refresh="getDataList(pageInfo.current)">
                <Button
                    type="primary"
                    ghost
                    icon="ios-add"
                    @click="onShowAddModal"
                    >新增功能表
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
            >
                <template slot-scope="{ row, index }" slot="imageUrl">
                    <div>
                        <img
                            :src="row.imageUrl"
                            style="
                                width: 100px;
                                padding: 10px 0;
                                cursor: pointer;
                            "
                            @click="onImagePreview(row.imageUrl)"
                        />
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
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
        <Drawer title="功能表" v-model="showDrawer" width="970">
            <function-form
                :code="targetFunctionCode"
                :mode="formMode"
                @on-edit-finish="onFormOperateFinish"
                @on-add-finish="onFormOperateFinish"
            />
        </Drawer>
    </div>
</template>

<script>
import SearchOption from "./components/function-search-filter";
import { PAGE_MODE } from "@/common/constants";
import { getFunctionList, delFunction } from "@/api/gw/gw";
import FunctionForm from "@/views/gw/functions/components/function-form";

export default {
    name: "index",
    components: { FunctionForm, SearchOption },
    data() {
        return {
            formMode: null,
            showDrawer: false,
            targetFunctionCode: null,
            preview: false,
            previewUrl: null,
            searchCond: {
                options: {},
                sortByCreateTime: null,
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "ID",
                    key: "code",
                },
                {
                    title: "功能表名称",
                    key: "name",
                },
                {
                    title: "功能表描述",
                    key: "description",
                },
                {
                    title: "功能表排序",
                    key: "sort",
                },
                {
                    title: "图片",
                    slot: "imageUrl",
                },
                {
                    title: "功能表状态",
                    key: "state",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "functionState"
                                    ](params.row.state, true),
                                    text: this.$options.filters[
                                        "functionState"
                                    ](params.row.state),
                                },
                            }),
                        ]);
                    },
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    sortable: true,
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: "right",
                    align: "center",
                    width: 150,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "a",
                                {
                                    props: {
                                        type: "text",
                                    },
                                    on: {
                                        click: () => {
                                            this.onRowClick({
                                                code: params.row.code,
                                                mode: PAGE_MODE.EDIT,
                                            });
                                        },
                                    },
                                },
                                "编辑"
                            ),
                            h("Divider", {
                                props: { type: "vertical" },
                            }),
                            h(
                                "a",
                                {
                                    props: {
                                        type: "text",
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: "删除",
                                                content:
                                                    "<p>您确定要删除吗？</p>",
                                                onOk: async () => {
                                                    let res = await delFunction(
                                                        {
                                                            code: params.row
                                                                .code,
                                                        }
                                                    );
                                                    if (res ) {
                                                        this.$Message.success(
                                                            "删除成功"
                                                        );
                                                        this.getDataList(
                                                            this.pageInfo
                                                                .current
                                                        );
                                                    }
                                                },
                                                onCancel: () => {},
                                            });
                                        },
                                    },
                                },
                                "删除"
                            ),
                        ]);
                    },
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
        onFormOperateFinish() {
            this.getDataList(this.pageInfo.current);
            this.showDrawer = false;
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
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
            let { records, total, size, current } = await getFunctionList(
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
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetFunctionCode = null;
        },
        onRowClick({ code, mode = PAGE_MODE.ADD }) {
            this.targetFunctionCode = code;
            this.showDrawer = true;
            this.formMode = mode;
            event.stopPropagation();
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
