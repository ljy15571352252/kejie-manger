<template>
    <div>
        <Modal
            v-model="showModal"
            title="看过我的/我看过的"
            width="700"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
            <div class="margin-bottom-10">
                <RadioGroup v-model="lookType">
                    <Radio  :label="0">Ta看过的</Radio>
                    <Radio  :label="1">看过Ta的</Radio>
                </RadioGroup>
            </div>
           <Table :columns="columns"  :loading="tableLoading"  :data="dataList"  @on-sort-change="onSortChange">
               <div
                   slot-scope="{ row, index }"
                   slot="user"
                   class="table-padding"
               >
                   <template v-if="row.lookMember">
                       <Avatar :src="row.lookMember.headUrl" shape="square" size="54" />
                       <span class="margin-left-10">{{ row.lookMember.nickName }}</span>
                   </template>
                   <template v-if="row.lookMeMember">
                       <Avatar :src="row.lookMeMember.headUrl" shape="square" size="54" />
                       <span class="margin-left-10">{{ row.lookMeMember.nickName }}</span>
                   </template>
               </div>
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
import { getMemberLookRecords } from "@/api/member/member";

export default {
    name: "look-records",
    props: ["value", "memberCode"],
    data() {
        return {
            lookType:0,
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
                    title: "用户ID",
                    key: "code",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            `${params.row.lookMember.code || params.row.lookMeMember.code}`
                        );
                    },
                },
                {
                    title: "用户",
                    slot: "user",
                },
            ],
        };
    },
    watch: {
        lookType(){
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
                memberCode: this.lookType===0?this.memberCode:null,
                lookMemberCode: this.lookType===1?this.memberCode:null,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            this.tableLoading=true
            let { records, total, size, current } =
                await getMemberLookRecords(searchQuery);
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
