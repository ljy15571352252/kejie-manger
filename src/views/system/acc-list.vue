<template>
    <div class="flexC">
        <page-header title="后台用户" description="后台用户列表" />
        <div class="pageContent flexC">
            <search-option @on-search="onSearch" />
            <table-tool @on-refresh="getDataList(pageInfo.current)">
                <Button
                    type="primary"
                    ghost
                    icon="ios-add"
                    @click="onShowAddModal"
                    >新增用户
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-row-click="onRowClick"
            >
                <template slot-scope="{ row, index }" slot="action">
                    <a type="text" @click="onResetPassword(row.code)"
                        >重置密码</a
                    >
                    <Divider type="vertical"></Divider>
                    <a
                        type="text"
                        @click="
                            onRowClick({ code: row.code, mode: PAGE_MODE.EDIT })
                        "
                        >编辑</a
                    >
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
        <Drawer title="后台用户" v-model="showAccForm" width="570">
            <acc-form
                :code="selectUserCode"
                @on-edit-finish="onFormOperateFinish"
                @on-add-finish="onFormOperateFinish"
                :mode="formMode"
            />
        </Drawer>
        <reset-password-form
            :code="resetPasswordUserCode"
            v-model="showResetPasswordForm"
        />
    </div>
</template>

<script>
import AccForm from "./components/acc-form";
import SearchOption from "./components/acc-search-filter";
import ResetPasswordForm from "./components/reset-password-form";
import { PAGE_MODE } from "@/common/constants";
import { delUser, getUserList } from "@/api/user/user";

export default {
    name: "index",
    components: { AccForm, SearchOption, ResetPasswordForm },
    data() {
        return {
            showResetPasswordForm: false,
            resetPasswordUserCode: null,
            showAccForm: false,
            showRoleResource: false,
            selectUserCode: null,
            targetRoleCodeForPermission: null,
            formMode: null,
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
                    title: "用户名",
                    key: "username",
                },
                {
                    title: "用户",
                    key: "user",
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
                                        src: params.row.headUrl,
                                    },
                                }),
                                h(
                                    "span",
                                    {
                                        style: {
                                            marginLeft: "5px",
                                        },
                                    },
                                    params.row.nickName
                                ),
                            ]
                        );
                    },
                },
                {
                    title: "手机",
                    key: "mobile",
                },
                {
                    title: "状态",
                    key: "status",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "accountStatus"
                                    ](params.row.status, true),
                                    text: this.$options.filters["accountStatus"](
                                        params.row.status
                                    ),
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
        onResetPassword(code) {
            this.resetPasswordUserCode = code;
            this.showResetPasswordForm = true;
        },
        onFormOperateFinish() {
            this.getDataList(this.pageInfo.current);
            this.showAccForm = false;
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
            let { records, total, size, current } = await getUserList(
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
        onRowClick({ code, mode = PAGE_MODE.DETAIL }) {
            this.selectUserCode = code;
            this.showDrawer = true;
            this.formMode = mode;
            event.stopPropagation();
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showAccForm = true;
            this.selectUserCode = null;
        },
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delUser({
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
