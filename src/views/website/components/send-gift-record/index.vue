<template>
    <div>
        <Modal
            v-model="showModal"
            title="赠送的礼物"
            width="700"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
           <Table :columns="columns"  :loading="tableLoading"  :data="dataList"  @on-sort-change="onSortChange">
               <template slot-scope="{ row, index }" slot="gift">
                    <div>
                      赠送了  <img :src="row.giftImgUrl"/> x {{row.count}} 给 {{row.donee.nickName}}
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
        </Modal>
    </div>
</template>

<script>
import {getGiftSendRecords} from "@/api/product/gift";

export default {
    name: "gift-send-records",
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
                    title: "赠送的礼物",
                    slot: "gift",
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
        memberCode() {
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
                donerCode: this.memberCode,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            this.tableLoading=true
            let { records, total, size, current } =
                await getGiftSendRecords(searchQuery);
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
