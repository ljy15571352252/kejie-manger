<template>
    <div class="flexC">
        <page-header title="商品类目" description="商品类目" />
        <div class="pageContent flexC">
            <table-tool @on-refresh="getDataList(pageInfo.current)">
                <Button
                    type="primary"
                    ghost
                    icon="ios-add"
                    @click="onShowAddModal"
                    >新增商品类目
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
                border
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

        <Drawer title="商品类目" v-model="showDrawer" width="570">
            <category-form
                :category-obj="targetCategoryObj"
                :mode="formMode"
                @on-edit-finish="onFormOperateFinish"
                @on-add-finish="onFormOperateFinish"
            />
        </Drawer>
    </div>
</template>

<script>
import CategoryForm from "./components/product-category-form";
import { PAGE_MODE } from "@/common/constants";
import {
    delProductCategory,
    getProductCategoryPageList,
} from "@/api/product/product";

export default {
    name: "index",
    components: { CategoryForm },
    data() {
        return {
            formMode: null,
            showDrawer: false,
            targetCategoryObj: null,
            searchCond: {
                options: {},
                sortByCreateTime: null,
                sortBySort: null,
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "类目ID",
                    key: "code",
                    width:300,
                    align: "center",
                },
                {
                    title: "类目名称",
                    key: "name",
                    align: "center",
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: "right",
                    align: "center",
                    width: 300,
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
                                                obj: this.copyJson(params.row),
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
                                                    let res =
                                                        await delProductCategory(
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
                sortBySort: this.searchCond.sortBySort,
            };
            let { records, total, size, current } =
                await getProductCategoryPageList(searchQuery);
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
            if (key === "sort") {
                this.searchCond.sortBySort = order === "normal" ? null : order;
            }
            this.getDataList(1);
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetCategoryObj = null;
        },
        onRowClick({ obj, mode = PAGE_MODE.ADD }) {
            this.targetCategoryObj = obj;
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
