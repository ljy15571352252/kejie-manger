<template>
    <div class="flexC">
        <page-header title="资讯分类" description="资讯分类" no-margin />
        <div class="pageContent flexC">
            <table-tool @on-refresh="getDataList(pageInfo.current)">
                <Button type="primary" ghost icon="ios-add" @click="onAdd"
                    >添加资讯分类
                </Button>
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
            >
                <template slot-scope="{ row, index }" slot="action">
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
        <!-- <domain-modal
            v-model="showDomainModal"
            @on-edit-finish="getDataList(1)"
            @on-add-finish="getDataList(1)"
            :mode="formMode"
            :domain-obj="domainObj"
        /> -->
    </div>
</template>

<script>
// import DomainModal from "./components/domain-modal";
import { delDomain, getDomainList } from "@/api/store/store-domain";
import { PAGE_MODE } from "@/common/constants";

export default {
    name: "index",
    // components: { DomainModal },
    data() {
        return {
            formMode: null,
            searchCond: {
                options: {},
                sortByCreateTime: "desc",
            },
            pageInfo: {},
            showDomainModal: false,
            tableLoading: false,
            domainObj: null,
            columns: [
                {
                    title: "ID",
                    key: "code"
                },
                {
                    title: "名称",
                    key: "name"
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 150,
                },
            ],
            tableData: [
                {
                    code:1,
                    name:'活动资讯',

                }
            ],
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        onAdd() {
            this.domainObj = null;
            this.formMode = PAGE_MODE.ADD;
            this.showDomainModal = true;
        },
        onEdit(item) {
            this.domainObj = item;
            this.formMode = PAGE_MODE.EDIT;
            this.showDomainModal = true;
        },
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delDomain(code);
                    if (res) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {},
            });
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
            let { records, total, size, current } = await getDomainList(
                searchQuery
            );
            // this.tableData = records;
            console.log(this.tableData)
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
    },
    watch: {},
    filters: {},
};
</script>

<style lang="less">
.main-page {
}
</style>
