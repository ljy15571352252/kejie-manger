<template>
    <div class="flexC">
        <page-header
            title="平台开通价格"
            description="平台开通价格列表"
            no-margin
        />
        <div class="pageContent flexC">
            <table-tool @on-refresh="getDataList()">
                <Button type="primary" ghost icon="ios-add" @click="onAdd"
                    >添加平台开通价格
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
            >
                <template slot-scope="{ row }" slot="action">
                    <div>
                        <a type="text" @click="onEdit(row)">编辑</a>
                        <Divider type="vertical" />
                        <a type="text" @click="onDel(row.code)">删除</a>
                    </div>
                </template>
            </Table>
        </div>
        <price-modal
            v-model="showDomainModal"
            @on-edit-finish="getDataList(1)"
            @on-add-finish="getDataList(1)"
            :mode="formMode"
            :price-obj="priceObj"
        />
    </div>
</template>

<script>
import PriceModal from "./components/price-modal";
import { delStorePrice, openStorePrice } from "@/api/store/store";
import { PAGE_MODE } from "@/common/constants";
import ImageUpload from "@/components/upload/ImageUpload";


export default {
    name: "index",
    components: { PriceModal,ImageUpload },
    data() {
        return {
            formMode: null,
            showDomainModal: false,
            tableLoading: false,
            priceObj: null,
            columns: [
                {
                    title: "ID",
                    key: "code",
                },

                {
                    title: "标题",
                    key: "title",
                },
                {
                    title: "图片",
                    key: "imageUrl",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    padding: "10px 0",
                                },
                            },
                            [
                                h("Avatar", {
                                    props: {
                                        shape: "square",
                                        size: "54",
                                    },
                                    attrs: {
                                        src: params.row.imageUrl,
                                    },
                                })
                            ]
                        );
                    },
                },
                {
                    title:'描述',
                    key:'description',
                    tooltip:true
                },
                {
                    title: "平台",
                    key: "platform",
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                            },
                            this.$options.filters["storePricePlatform"](params.row.platform)
                        );
                    },
                },
                {
                  title:'价格',
                  key:'price',
                  sortable:true,
                  render: (h, params) => {
                        return h(
                            "span",
                            {},
                            this.$options.filters["price"](params.row.price)
                        );
                    },
                },
                {
                    title: "类型",
                    key: "type",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            this.$options.filters["storePriceType"](params.row.type)
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
                    width: 150
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
        onAdd() {
            this.priceObj = null;
            this.formMode = PAGE_MODE.ADD;
            this.showDomainModal = true;
        },
        onEdit(item) {
            this.priceObj = item;
            this.formMode = PAGE_MODE.EDIT;
            this.showDomainModal = true;
        },
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delStorePrice(code);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList();
                    }
                },
                onCancel: () => {},
            });
        },
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        // 发起请求
        async getDataList() {
            this.tableLoading = true;
            let data = await openStorePrice();
            this.tableData = data;
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
