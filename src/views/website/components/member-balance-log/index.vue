<template>
    <div>
        <Modal
            v-model="showModal"
            title="余额明细"
            width="700"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
            <div class="margin-bottom-10">
                <RadioGroup v-model="followerType">
                    <Radio :label="1">收入</Radio>
                    <Radio :label="2">支出</Radio>
                </RadioGroup>
            </div>
            <Table
                :columns="columns"
                :loading="tableLoading"
                :data="dataList"
                @on-sort-change="onSortChange"
            >
                <template
                    slot-scope="{ row, index }"
                    slot="type"
                >
                    <span v-if="row.type===1" style="color: #48f858">+ ￥{{row.amount}}</span>
                    <span v-if="row.type===2" style="color: #e73350">- ￥{{row.amount}}</span>
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
        </Modal>
    </div>
</template>

<script>
import { getMemberBalanceLogs } from "@/api/member/member";

export default {
    name: "balance-logs",
    props: ["value", "memberCode"],
    data() {
        return {
            followerType: null,
            searchCond: {
                options: {},
                sortByCreateTime: null,
            },
            pageInfo: {},
            showModal: false,
            dataList: [],
            tableLoading: false,
            columns: [
                {
                    title: "时间",
                    key: "createTime",
                    sortable: true,
                },
                {
                    title: "获得/支出金额",
                    slot: "type",
                },
                {
                    title: "当前余额",
                    key: "balance",
                    render: (h, params) => {
                        return h("span", {}, `￥${params.row.balance}`);
                    },
                },
                {
                    title: "描述",
                    key: "description",
                },
            ],
        };
    },
    watch: {
        followerType() {
            this.dataList = [];
            this.getDataList(1);
        },
        value(cur) {
            this.showModal = cur;
        },
        memberCode(cur) {
            this.dataList = [];
            this.getDataList(1);
        },
    },
    methods: {
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        async getDataList(page) {

            const searchQuery = {
                page: page,
                memberCode: this.memberCode ,
                type:this.followerType,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            this.tableLoading = true;
            let { records, total, size, current } = await getMemberBalanceLogs(
                searchQuery
            );
            this.tableLoading = false;
            this.dataList = records;
            this.pageInfo = {
                total,
                size,
                current,
            };
        },
        onSortChange({ key, order }) {
            if (key === "createTime") {
                this.searchCond.sortByCreateTime =
                    order === "normal" ? null : order;
            }
            this.getDataList(1);
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
    },
};
</script>

<style scoped lang="less">
/deep/.ivu-modal-footer {
    display: none;
}
</style>
