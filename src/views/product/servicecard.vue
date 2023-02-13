<template>
    <div class="flexC">
        <page-header title="服务卡" description="服务卡" />
        <div class="pageContent flexC">
            <Button
                type="primary"
                icon="ios-add"
                @click="onShowAddModal"
                style="width: 150px; margin-bottom: 20px"
                >新增服务卡
            </Button>
            <Table :columns="columns" :data="dataList">
                <template slot-scope="{ row, index }" slot="serviceCardInfo">
                    {{ row.count }} 次 / ￥{{ row.price }}
                </template>
            </Table>
        </div>
        <Drawer title="服务卡" v-model="showDrawer" width="570">
            <service-card-form
                :service-card-obj="targetServiceCardObj"
                :mode="formMode"
                @on-edit-finish="onFormOperateFinish"
                @on-add-finish="onFormOperateFinish"
            />
        </Drawer>
    </div>
</template>

<script>
import ServiceCardForm from "./components/servicecard-form";

import { PAGE_MODE } from "@/common/constants";
import { delServiceCard, getServiceCardList } from "@/api/product/servicecard";

export default {
    name: "index",
    components: { ServiceCardForm },
    data() {
        return {
            formMode: null,
            showDrawer: false,
            targetServiceCardObj: null,
            dataList: [],
            columns: [
                {
                    title: "ID",
                    key: "code",
                },
                {
                    title: "服务卡",
                    slot: "serviceCardInfo",
                },
                {
                    title: "有效天数",
                    key: "validNum",
                },
                {
                    title: "状态",
                    key: "state",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "productUpState"
                                    ](params.row.state, true),
                                    text: this.$options.filters[
                                        "productUpState"
                                    ](params.row.state),
                                },
                            }),
                        ]);
                    },
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
                                            this.onEdit(params.row);
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
                                            this.onDel(params.row.code);
                                        },
                                    },
                                },
                                "删除"
                            ),
                        ]);
                    },
                },
            ],
        };
    },
    created() {
        this.getDataList();
    },
    mounted() {},
    methods: {
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delServiceCard({
                        code: code,
                    });
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {},
            });
        },
        onFormOperateFinish() {
            this.getDataList();
            this.showDrawer = false;
        },
        async getDataList() {
            this.dataList = await getServiceCardList();
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetServiceCardObj = null;
        },
        onEdit(obj) {
            this.targetServiceCardObj = this.copyJson(obj);
            this.showDrawer = true;
            this.formMode = PAGE_MODE.EDIT;
            event.stopPropagation();
        },
    },
    watch: {},
    filters: {},
};
</script>

<style scoped lang="less">
.list-goods-list-item {
    margin-top: 10px;
    text-align: center;
    position: relative;
    img {
        width: 60%;
    }
}
.list-goods-list-item-title {
    font-size: 16px;
    font-weight: 700;
    margin: 8px 0;
}
.list-goods-list-item-desc {
    font-size: 14px;
    color: #808695;
}
.list-goods-list-item-price {
    font-size: 14px;
    color: #ff6700;
    margin: 8px 0;
    s {
        margin-left: 8px;
        color: #808695;
    }
}
</style>
