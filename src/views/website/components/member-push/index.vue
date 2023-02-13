<template>
    <div>
        <Modal
            v-model="showModal"
            title="会员推送"
            width="1200"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
            <search-option @on-search="onSearch" :init-mate-require="mateRequire"/>
            <table-tool @on-refresh="getDataList(pageInfo.current)">
            </table-tool>
           <Table :columns="columns"  :loading="tableLoading"  :data="dataList"  @on-selection-change="onMultiSelectionChange">
               <div
                   slot-scope="{ row, index }"
                   slot="user"
                   class="table-padding"
               >
                   <Avatar :src="row.headUrl" shape="square" size="54" />
                   <span class="margin-left-10">{{ row.nickName }}</span>
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
          <div slot="footer">
            <Button
                type="primary"
                :loading="submitBtnLoading"
                @click="onPush"
            >推送</Button
            >
          </div>
        </Modal>
    </div>
</template>

<script>
import {getMemberList, getMemberPointsRecords} from "@/api/member/member";
import SearchOption from "./search-filter";
export default {
    name: "member-push",
    props: ["value", "code","mateRequire"],
    components:{SearchOption},
    data() {
        return {
            targetSelectArr:[],
            submitBtnLoading:false,
            searchCond: {
                options: {},
            },
            pageInfo: {},
            showModal: false,
            dataList: [],
            tableLoading:false,
            columns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center",
                },
                {
                    title: "用户",
                    slot: "user",
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
            this.targetSelectArr=[]
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
                ...this.searchCond.options,
            };
            this.tableLoading=true
            let { records, total, size, current } =
                await getMemberList(searchQuery);
            this.tableLoading=false
            this.dataList = records;
            this.pageInfo = {
                total,
                size,
                current,
            };
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onMultiSelectionChange(selection){
            this.dataList.map(i => {
                for (let index in this.targetSelectArr){
                    let code=this.targetSelectArr[index]
                    if (code === i.code) {
                        this.targetSelectArr.splice(index, 1)
                        break
                    }
                }
            })
            selection.map(i => {
                this.targetSelectArr.push(i.code)
            })
        },
        onPush(){
            this.submitBtnLoading=true
            /** **/
            this.submitBtnLoading=false
            if (true){
                this.$Message.success('推送成功')
                this.onVisibleChange(false)
            }
        }
    },
};
</script>

<style scoped lang="less">
</style>
