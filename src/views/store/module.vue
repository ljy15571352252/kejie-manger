<template>
    <div class="flexC">
        <page-header
            title="菜单资源"
            description="菜单资源列表"
            no-margin
        />
        <div class="pageContent flexC">
            <table-tool @on-refresh="getDataList()">
                <Button type="primary" ghost icon="ios-add" @click="onAdd"
                    >添加菜单资源
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                row-key="code"
                @on-sort-change="onSortChange"
            >
                <template slot-scope="{ row }" slot="action">
                    <div>
                        <a type="text" @click="onEdit(row)">编辑</a>
                        <Divider type="vertical" />
                        <a type="text" @click="onDel(row)">删除</a>
                    </div>
                </template>
            </Table>
        </div>
        <module-modal
            v-model="showModuleModal"
            @on-edit-finish="getDataList(1)"
            @on-add-finish="getDataList(1)"
            :mode="formMode"
            :module-obj="moduleObj"
            :tableData="tableData"
        />
    </div>
</template>

<script>
import ModuleModal from "./components/module-modal";
import { delStoreModule, getStoreModuleList } from "@/api/store/store";
import { PAGE_MODE } from "@/common/constants";

export default {
    name: "index",
    components: { ModuleModal },
    data() {
        return {
            formMode: null,
            showModuleModal: false,
            tableLoading: false,
            moduleObj: null,
            columns: [
                {
                    title: "ID",
                    key: "code",
                    tree:true
                },

                {
                    title: "名称",
                    key: "name",
                },
                {
                    title:'路径',
                    key:'path',
                    width:200
                },
                {
                    title: "类型",
                    key: "type",
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                            },
                            this.$options.filters["storeModuleType"](params.row.type)
                        );
                    },
                },
                {
                  title:'排序',
                  key:'sort',
                  sortable:true
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
        this.getDataList();
    },
    mounted() {},
    methods: {
        onAdd() {
            this.moduleObj = null;
            this.formMode = PAGE_MODE.ADD;
            this.showModuleModal = true;
        },
        onEdit(item) {
            this.moduleObj = item;
            this.formMode = PAGE_MODE.EDIT;
            this.showModuleModal = true;
        },
        onDel(row) {
            console.log(row.code)
            if(row.children){
                this.$Modal.error({
                    title:'删除错误',
                    content:'当前菜单无法删除'
                })
            }else{
                this.$Modal.confirm({
                    title: "删除",
                    content: "<p>您确定要删除吗？</p>",
                    onOk: async () => {
                        let res = await delStoreModule(row.code);
                        if (res ) {
                            this.$Message.success("删除成功");
                            this.getDataList();
                        }
                    },
                    onCancel: () => {},
                });

            }
        },
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        async getDataList() {
            this.tableLoading = true;
            let data = await getStoreModuleList();
            console.log(data)
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
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>
