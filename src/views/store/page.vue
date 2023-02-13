<template>
    <div class="flexC">
        <page-header title="前台页面模板" description="前台页面模板列表" />
        <div class="pageContent flexC">
            <table-tool @on-refresh="getDataList()">
                <Button type="primary" ghost icon="ios-add" @click="onAdd"
                    >添加页面
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
            >
                <template slot-scope="{ row }" slot="action">
                    <div>
                        <a type="text" @click="onEdit(row)">编辑</a>
                        <Divider type="vertical" />
                        <a type="text" @click="onDel(row.code)">删除</a>
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
import PriceModal from "./components/page-modal";
import {getStorePageModuleList, delStorePageModule} from "@/api/store/store";
import { PAGE_MODE } from "@/common/constants";
import ImageUpload from "@/components/upload/ImageUpload";

export default {
    name: "index",
    components: { PriceModal, ImageUpload },
    data() {
        return {
            priceObj:null,
            showDomainModal: false,
            // 详情所需参数
            codeObj: {},

            formMode: null,
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "ID",
                    key: "code",
                },
                {
                    title: "模板名称",
                    key: "name",
                },
                {
                    title: "图标",
                    key: "icon",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    padding: "10px 0",
                                },
                            },
                            [
                                h("i", {
                                    props: {
                                        shape: "square",
                                        size: "54",
                                    },
                                    attrs: {
                                        class:'iconfont '+ 'icon-'+params.row.icon,
                                    },
                                })
                            ]
                        );
                    },
                },
                {
                    title: "页面路径",
                    key: "path",
                },
                {
                    title: "类型",
                    key: "type",
                    render: (h, params) => {
                        return h(
                            "span", 
                            {},
                            this.$options.filters['storePageModuleType'](params.row.type)
                        );
                    },
                },
                {
                    title:'排序',
                    key:'sort',
                    sortable:true
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center"
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
                    let res = await delStorePageModule(code);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList();
                    }
                },
                onCancel: () => {},
            });
        },
        onFormOperateFinish() {
            this.getDataList(this.pageInfo.current);
        },
        async getDataList(page) {
            this.tableLoading = true;
            let { records, total, size, current } = await getStorePageModuleList(page);
            console.log(records)
            this.tableData = records;
            this.pageInfo = {
                total,
                size,
                current,
            };
            this.tableLoading = false;
        },
        onRowClick({ code, storeCode, mode = PAGE_MODE.DETAIL }) {
            this.codeObj.code = code;
            this.codeObj.storeCode = storeCode;
            this.formMode = mode;
            event.stopPropagation();
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.codeObj = {};
        },
    },
    watch: {},
    filters: {},
};
</script>

<style lang="less">
@import '../../common/iconfont/iconfont.css';
.main-page {
}
</style>
