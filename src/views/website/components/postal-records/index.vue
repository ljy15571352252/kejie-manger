<template>
    <div>
        <Modal
            v-model="showModal"
            title="提现记录"
            width="700"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
           <Table :columns="columns"  :loading="tableLoading"  :data="dataList"  @on-sort-change="onSortChange">
               <template slot-scope="{ row, index }" slot="postalTarget">
                   <template v-if="row.type === 1">
                       <div>支付宝账号：{{ row.alipayAcc }}</div>
                       <div>支付宝真实姓名：{{ row.alipayRealname }}</div>
                   </template>
                   <template v-if="row.type === 2">
                       <div>
                           <Avatar
                               :src="row.wechatReceiveQrcode"
                               size="64"
                               shape="square"
                               style="
                                    position: relative;
                                    cursor: pointer;
                                    margin: 8px 0;
                                "
                               @click.native="
                                    onImagePreview(row.wechatReceiveQrcode)
                                "
                           >
                           </Avatar>
                       </div>
                   </template>
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
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
    </div>
</template>

<script>
import {getMemberPostalApplyList} from "@/api/finance/finance";

export default {
    name: "postal-records",
    props: ["value", "memberCode"],
    data() {
        return {
            preview: false,
            previewUrl: null,
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
                    title: "提现金额",
                    key: "cash",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            this.$options.filters["price"](params.row.cash)
                        );
                    },
                },
                {
                    title: "提现类型",
                    key: "type",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters["postalType"](
                                        params.row.type,
                                        true
                                    ),
                                    text: this.$options.filters["postalType"](
                                        params.row.type
                                    ),
                                },
                            }),
                        ]);
                    },
                },
                {
                    title: "材料",
                    slot: "postalTarget",
                },
                {
                    title: "状态",
                    key: "checkState",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "checkStateColorType"
                                        ](params.row.checkState),
                                    text: this.$options.filters["checkState"](
                                        params.row.checkState
                                    ),
                                },
                            }),
                        ]);
                    },
                },
                {
                    title: "申请时间",
                    key: "createTime",
                    sortable: true,
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
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
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
                await getMemberPostalApplyList(searchQuery);
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
