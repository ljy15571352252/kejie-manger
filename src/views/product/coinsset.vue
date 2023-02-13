<template>
    <div class="flexC">
        <page-header title="金币套餐" description="金币套餐" />
        <div class="pageContent flexC">
            <table-tool @on-refresh="getDataList()">
                <Button
                    type="primary"
                    ghost
                    icon="ios-add"
                    @click="onShowAddModal"
                    >新增套餐
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
            >
            </Table>
        </div>
        <Drawer title="金币套餐" v-model="showDrawer" width="570">
            <coinsset-form
                :coinsset-obj="targetCoinsSetObj"
                :mode="formMode"
                @on-edit-finish="onFormOperateFinish"
                @on-add-finish="onFormOperateFinish"
            />
        </Drawer>
    </div>
</template>

<script>
import CoinssetForm from "./components/coinsset-form";
import { PAGE_MODE } from "@/common/constants";
import {getCoinsSetList,delCoinsSet} from "@/api/product/coinsset";

export default {
    name: "index",
    components: { CoinssetForm },
    data() {
        return {
            formMode: null,
            showDrawer: false,
            targetCoinsSetObj: null,
            tableLoading: false,
            columns: [
                {
                    title: "ID",
                    key: "code",
                },
                {
                    title: "名称",
                    key: "name",
                },
                {
                    title: "价格",
                    key: "price",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            this.$options.filters[
                                "price"
                                ](params.row.price)
                        );
                    },
                },
                {
                    title: "获得金币",
                    slot: "coins",
                },

                {
                    title: "创建时间",
                    key: "createTime",
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
                                                    let res = await delCoinsSet({
                                                        code: params.row.code,
                                                    });
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
        this.getDataList();
    },
    mounted() {},
    methods: {
        onFormOperateFinish() {
            this.getDataList();
            this.showDrawer = false;
        },
        async getDataList() {
            this.tableLoading = true;
            this.tableData = await getCoinsSetList();
            this.tableLoading = false;
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetCoinsSetObj = null;
        },
        onRowClick({ obj, mode = PAGE_MODE.ADD }) {
            this.targetCoinsSetObj = obj
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
