<template>
    <div>
        <Modal
            v-model="showModal"
            title="积分明细"
            width="700"
            @on-visible-change="onVisibleChange"
        >
            <search-option @on-search="onSearch" />
            <table-tool @on-refresh="getDataList(pageInfo.current)">
            </table-tool>
           <Table :columns="columns"  :loading="tableLoading"  :data="dataList"  @on-sort-change="onSortChange">
               <template slot-scope="{ row, index }" slot="points">
                   <Badge v-if="row.type===1" color="green" :text="`+${row.points}`"></Badge>
                   <Badge v-if="row.type===2" color="red" :text="`-${row.points}`"></Badge>
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
import { getMemberPointsRecords } from "@/api/member/member";
import SearchOption from "./search-filter";
export default {
    name: "points-records",
    props: ["value", "code"],
    components:{SearchOption},
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
                    title: "积分",
                    slot: "points",
                },
                {
                    title: "积分余额",
                    key: "updateCoins",
                    width:100,
                    align:'center'
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
        code(cur) {
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
                memberCode: this.code,
                ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            this.tableLoading=true
            let { records, total, size, current } =
                await getMemberPointsRecords(searchQuery);
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
