<template>
    <div>
        <Modal
            v-model="showModal"
            title="群组信息"
            width="900"
            @on-visible-change="onVisibleChange"
        >
            <search-option @on-search="onSearch" />
            <table-tool @on-refresh="getDataList(pageInfo.current)">
            </table-tool>
           <Table :columns="columns"  :loading="tableLoading"  :data="dataList"  @on-sort-change="onSortChange">
               <div
                   slot-scope="{ row, index }"
                   slot="countMember"
                   class="table-padding"
               >
                   <div>总会员数：{{ row.countMember.total }}</div>
                   <div>男会员数：{{ row.countMember.maleCount }}</div>
                   <div>女会员数：{{ row.countMember.femaleCount }}</div>
               </div>
               <template slot-scope="{ row, index }" slot="tags">
                   <Tag
                       v-if="row.tags"
                       :key="i"
                       v-for="(tag, i) in row.tags.split(',')"
                   >{{ tag }}
                   </Tag>
               </template>
               <template slot-scope="{ row, index }" slot="imageUrl">
                   <Avatar
                       :src="row.imageUrl"
                       size="64"
                       shape="square"
                       style="
                            position: relative;
                            cursor: pointer;
                            margin: 8px 0;
                        "
                       @click.native="onImagePreview(row.headUrl)"
                   >
                   </Avatar>
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
import SearchOption from "./search-filter";
import { getGroupList } from "@/api/group/group";
export default {
    name: "matchmarker-group-modal",
    props: ["value", "matchmarkerCode"],
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
                    title: "ID",
                    key: "code",
                },
                {
                    title: "名称",
                    key: "name",
                },
                {
                    title: "会员数量",
                    slot: "countMember",
                  width:150,
                },
                {
                    title: "标签",
                    slot: "tags",
                },
                {
                    title: "封面",
                    slot: "imageUrl",
                },
                {
                    title: "价格",
                    key: "price",
                },
                {
                    title: "状态",
                    key: "status",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "productUpState"
                                        ](params.row.status, true),
                                    text: this.$options.filters[
                                        "productUpState"
                                        ](params.row.status),
                                },
                            }),
                        ]);
                    },
                },
                {
                    title: "创建时间",
                    key: "createTime",
                  width:150,
                    sortable: true,
                },

            ],
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
        matchmarkerCode(cur) {
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
                matchmarkerCode: this.matchmarkerCode,
                ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            this.tableLoading=true
            let { records, total, size, current } =
                await getGroupList(searchQuery);
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
