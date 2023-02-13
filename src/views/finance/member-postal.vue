<template>
    <div class="flexC">
        <page-header
            title="会员提现申请"
            description="会员提现申请列表"
            no-margin
        />
        <div class="pageContent flexC">
            <search-option @on-search="onSearch" />
            <table-tool @on-refresh="getDataList(pageInfo.current)">
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
            >
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

                <template slot-scope="{ row, index }" slot="action">
                    <template
                        v-if="row.checkState === CHECK_STATE.WAIT_FOR_CHECK"
                    >
                        <a type="text" @click="onCheck(row.id)">审核</a>
                        <!--<Divider type="vertical" />-->
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
        </div>
        <check-modal
            ref="checkModal"
            v-model="showCheckModal"
            title="提现审核"
            @on-submit="onCheckFinish"
        />
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
    </div>
</template>

<script>
import SearchOption from "./components/member-postal-search-filter";
import CheckModal from "@/components/check/index";
import {
    getMemberPostalApplyList,
    checkMemberPostalApply,
} from "@/api/finance/finance";

export default {
    name: "index",
    components: { SearchOption, CheckModal },
    data() {
        return {
            preview: false,
            previewUrl: null,
            showCheckModal: false,
            checkMemberCode: null,
            searchCond: {
                options: {},
                sortByCreateTime: null,
            },
            pageInfo: {},
            showDrawer: false,
            tableLoading: false,
            columns: [
                {
                    title: "提现编号",
                    key: "code",
                },

                {
                    title: "会员",
                    key: "user",
                    render: (h, params) => {
                        return h("div", [
                            h("Avatar", {
                                props: {
                                    shape: "square",
                                    size: "54",
                                },
                                attrs: {
                                    src: params.row.member.headUrl,
                                },
                            }),
                            h(
                                "span",
                                {
                                    style: {
                                        marginLeft: "5px",
                                    },
                                },
                                params.row.member.nickName
                            ),
                        ]);
                    },
                },
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
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 150,
                },
            ],
            tableData: [],
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        onCheck(code) {
            this.checkMemberCode = code;
            this.showCheckModal = true;
            event.stopPropagation();
        },
        async onCheckFinish(data) {
            let json = {
                ...data,
                code: this.checkMemberCode,
            };
            let ok = await checkMemberPostalApply(json);
            if (ok == true) {
                   this.$refs.checkModal.finish();this.$Message.success('审核成功');
                this.getDataList(this.pageInfo.current);
            }
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
            let {
                records,
                total,
                size,
                current,
            } = await getMemberPostalApplyList(searchQuery);
            this.tableData = records;
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
