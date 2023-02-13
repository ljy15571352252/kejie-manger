<template>
  <div class="flexC">
    <page-header
      title="加盟商"
      description="加盟商列表"
    />
    <div class="pageContent flexC">
      <search-option @on-search="onSearch" />
      <table-tool @on-refresh="getDataList(pageInfo.current)">
        <!-- <Button
          type="primary"
          ghost
          icon="ios-add"
          @click="addMerchant"
        >添加加盟商
        </Button> -->
      </table-tool>
      <Table
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
        @on-sort-change="onSortChange"
      >
        <template
          slot-scope="{ row, index }"
          slot="fans"
        >
          <div>男会员：{{ row.malesCount }}</div>
          <div>女会员：{{ row.femalesCount }}</div>
        </template>
        <div
          slot-scope="{ row }"
          slot="action"
          class="x-f flex-wrap"
        >
          <a
            type="text"
            @click="lookMerchantDetail(row.code,row.storeCode)"
          >详情</a>
          <!--                    <template>-->
          <!--                        <Divider type="vertical" />-->
          <!--                        <a-->
          <!--                            v-if="row.status === 1"-->
          <!--                            type="text"-->
          <!--                            class="break-word"-->
          <!--                            >封号</a-->
          <!--                        >-->
          <!--                        <a v-else type="text" class="break-word">解封</a>-->
          <!--                    </template>-->
          <!-- <Divider type="vertical" />
          <a
            type="text"
            @click="editMerchant(row.code)"
          >编辑</a> -->
          <template>
            <Divider type="vertical" />
            <a
              v-if="row.checkState === CHECK_STATE.WAIT_FOR_CHECK || row.checkState === CHECK_STATE.REJECT"
              type="text"
              @click="onCheck(row.code)"
            >审核</a>
            <a
              type="text"
              v-else
              @click="onCheck(row.code)"
            >驳回</a>
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
    </div>
    <check-modal
      ref="checkModal"
      v-model="showCheckModal"
      title="加盟商审核"
      @on-submit="onCheckFinish"
    />
  </div>
</template>

<script>
import SearchOption from "./components/merchant-search-filter";
import CheckModal from "@/components/check/index";
import { checkMerchant, getMerchantList } from "@/api/merchant/merchant";

export default {
    name: "index",
    components: { SearchOption, CheckModal },
    data() {
        return {
            showCheckModal: false,
            checkMerchantCode: null,
            searchCond: {
                options: {
                    checkState: 2
                },
                sortByCreateTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "ID",
                    key: "code",
                    width: 100
                },
                {
                    title: "加盟商",
                    key: "user",
                    width: 200,
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    padding: "10px 0"
                                }
                            },
                            [
                                h("Avatar", {
                                    props: {
                                        shape: "square",
                                        size: "54"
                                    },
                                    attrs: {
                                        src: params.row.logoUrl
                                    }
                                }),
                                h(
                                    "p",
                                    {
                                        style: {
                                            // marginLeft: "5px"
                                            marginTop: "5px"
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        );
                    }
                },
                {
                    title: "服务点",
                    key: "servePointsCount",
                    width: 100
                },
                {
                    title: "服务城市",
                    key: "area",
                    width: 150,
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            `${params.row.provinceName}${params.row.cityName}`
                        );
                    }
                },
                {
                    title: "联系人",
                    key: "contact",
                    width: 100
                },
                {
                    title: "联系人手机",
                    key: "contactMobile",
                    width: 150
                },
                {
                    title: "男会员/女会员",
                    slot: "fans",
                    width: 150
                },
                {
                    title: "销售金额",
                    key: "salesAmount",
                    width: 100
                },
                {
                    title: "注册来源",
                    key: "registerSource",
                    width: 160,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {},
                                params.row.store.name
                                    ? params.row.store.name
                                    : "暂无"
                            )
                        ]);
                    }
                },
                {
                    title: "状态",
                    key: "checkState",
                    width: 120,
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "checkStateColorType"
                                    ](params.row.checkState),
                                    text: this.$options.filters["checkState"](
                                        params.row.checkState
                                    )
                                }
                            })
                        ]);
                    }
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    width: 200,
                    sortable: true
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 150
                }
            ],
            tableData: []
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        onCheck(code) {
            this.checkMerchantCode = code;
            this.showCheckModal = true;
            event.stopPropagation();
        },
        async onCheckFinish(data) {
            let json = {
                ...data,
                code: this.checkMerchantCode
            };
            let ok = await checkMerchant(json);
            if (ok == true) {
                this.$refs.checkModal.finish(); 
                this.getDataList(this.pageInfo.current);
                this.$Message.success('审核成功');
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
                ...this.searchCond.options
            };
            let { records, total, size, current } = await getMerchantList(
                searchQuery
            );
            this.tableData = records;
            this.pageInfo = {
                total,
                size,
                current
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
        editMerchant(code) {
            this.$router.push({ path: "/merchant/edit", query: { code } });
        },
        lookMerchantDetail(code,storeCode) {
            this.$router.push({ path: "/merchant/detail", query: { code,storeCode } });
            event.stopPropagation();
        },
        addMerchant() {
            this.$router.push({ path: "/merchant/add" });
        }
    },
    watch: {},
    filters: {}
};
</script>

<style lang="less">
.main-page {
}
</style>
