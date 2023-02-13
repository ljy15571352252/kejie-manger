<template>
    <div>
        <Modal
            v-model="showModal"
            title="关注列表"
            width="700"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
            <div class="margin-bottom-10">
                <RadioGroup v-model="followerType">
                    <Radio :label="0">Ta关注的</Radio>
                    <Radio :label="1">关注Ta的</Radio>
                    <Radio :label="2">互相关注</Radio>
                </RadioGroup>
            </div>
            <Table
                :columns="columns"
                :loading="tableLoading"
                :data="dataList"
                @on-sort-change="onSortChange"
            >
                <div
                    slot-scope="{ row, index }"
                    slot="user"
                    class="table-padding"
                >
                    <Avatar
                        :src="row.follower.headUrl"
                        shape="square"
                        size="54"
                    />
                    <span class="margin-left-10">{{
                        row.follower.nickName
                    }}</span>
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
import { getMemberFollowers } from "@/api/member/member";

export default {
    name: "look-records",
    props: ["value", "memberCode"],
    data() {
        return {
            followerType: 0,
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
                    title: "用户ID",
                    key: "code",
                    render: (h, params) => {
                        return h("span", {}, `${params.row.follower.code}`);
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
                memberCode: this.followerType === 1 || this.followerType === 3? this.memberCode : null,
                followerCode: this.followerType === 0 || this.followerType === 3? this.memberCode : null,
                eachFollow: this.followerType === 3,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            this.tableLoading = true;
            let { records, total, size, current } = await getMemberFollowers(
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
