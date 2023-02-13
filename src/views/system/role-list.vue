<template>
    <div class="flexC">
        <page-header title="后台角色" description="后台角色列表" />
        <div class="pageContent flexC">
            <table-tool @on-refresh="getDataList(pageInfo.current)">
                <Button
                    type="primary"
                    ghost
                    icon="ios-add"
                    @click="onShowAddModal"
                    >新增角色
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
            >
                <template slot-scope="{ row, index }" slot="action">
                    <a type="text" @click="onSetResource(row.code)">设置权限</a>
                    <Divider type="vertical"></Divider>
                    <a type="text" @click="onEdit(row)">编辑</a>
                    <Divider type="vertical"></Divider>
                    <a type="text" @click="onDel(row.code)">删除</a>
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

        <role-form
            :role-obj="targetRoleObj"
            @on-edit-finish="onFormOperateFinish"
            @on-add-finish="onFormOperateFinish"
            v-model="showRoleForm"
            :mode="formMode"
        />
        <role-resource
            :code="targetRoleCodeForPermission"
            v-model="showRoleResource"
            @on-set-finish="onResourceSetFinish"
        />
    </div>
</template>

<script>
import RoleForm from "./components/roles-form";
import RoleResource from "./components/roles-resource";
import { PAGE_MODE } from "@/common/constants";
import { delRole, getRoleList } from "@/api/user/role";

export default {
    name: "index",
    components: { RoleForm, RoleResource },
    data() {
        return {
            showRoleForm: false,
            showRoleResource: false,
            targetRoleObj: null,
            targetRoleCodeForPermission: null,
            formMode: null,
            searchCond: {
                options: {},
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "ID",
                    key: "code",
                },
                {
                    title: "角色名称",
                    key: "name",
                },
                {
                    title: "描述",
                    key: "remark",
                },
                {
                    title: "排序",
                    key: "sort",
                },
                {
                    title: "创建时间",
                    key: "createTime",
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 300,
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
        onSetResource(code) {
            this.targetRoleCodeForPermission = code;
            this.showRoleResource = true;
        },
        onResourceSetFinish() {
            this.showRoleResource = false;
        },
        onFormOperateFinish() {
            this.getDataList(this.pageInfo.current);
            this.showRoleForm = false;
        },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                ...this.searchCond.options,
            };
            let { records, total, size, current } = await getRoleList(
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
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showRoleForm = true;
            this.targetRoleObj = null;
        },
        onEdit(obj) {
            this.targetRoleObj = obj;
            this.showRoleForm = true;
            this.formMode = PAGE_MODE.EDIT;
            event.stopPropagation();
        },
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delRole({
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
    },
    watch: {},
    filters: {},
};
</script>

<style lang="less">
.main-page {
}
</style>
