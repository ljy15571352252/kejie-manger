<template>
    <div>
        <Modal
            v-model="showModal"
            title="消费记录"
            width="700"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
           <Table :columns="columns"  :loading="tableLoading"  :data="dataList"  @on-sort-change="onSortChange">
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
import { getMemberConsumeRecords } from "@/api/member/member";

export default {
    name: "look-records",
    props: ["value", "memberCode"],
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null,
            },
            pageInfo: {},
            showModal: false,
            dataList: [],
            tableLoading:false,
            columns: [
                {
                    title: "时间",
                    key: "createTime",
                    sortable:true
                },
                {
                    title: "消费金额",
                    key: "amount",
                },
                {
                    title: "描述",
                    key: "description",
                },
            ],
        };
    },
    watch: {
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
                memberCode: this.memberCode,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            this.tableLoading=true
            let { records, total, size, current } =
                await getMemberConsumeRecords(searchQuery);
            this.tableLoading=false
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
