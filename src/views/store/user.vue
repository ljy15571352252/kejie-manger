<template>
  <div class="flexC">
    <page-header
      title="用户"
      description="用户列表"
    />
    <div class="pageContent flexC">
      <search-option @on-search="onSearch" />
      <Table
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
      >
        <template
          slot-scope="{ row }"
          slot="action"
        >
          <a
            type="text"
            @click="
                            showDetail({code: row.code, storeCode:row.storeCode})
                        "
          >查看详情</a>
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
  </div>
</template>

<script>
import StoreForm from "./components/store-form";
import SearchOption from "./components/user-search-filter";
import { getStoreUserList } from "@/api/store/store";

export default {
    name: "index",
    components: { StoreForm, SearchOption },
    data() {
        return {
            showStoreForm: false,
            // 详情所需参数
            codeObj: {},

            formMode: null,
            searchCond: {
                options: {},
                sortByCreateTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "ID",
                    key: "code"
                },
                {
                    title: "头像",
                    key: "user",
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
                                        src: params.row.headUrl
                                    }
                                })
                            ]
                        );
                    }
                },
                {
                    title: "昵称",
                    key: "nickName"
                },
                {
                    title: "联系人手机",
                    key: "mobile"
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    sortable: true
                },
                {
                    title: "近期更新",
                    key: "createTime",
                    sortable: true
                },
                // {
                //     title: "注册来源",
                //     key: "registerSource",
                //     render: (h, params) => {
                //         return h(
                //             "span",
                //             {},
                //             params.row.registerSource == 1
                //                 ? "公众号/H5"
                //                 : params.row.registerSource == 2
                //                 ? "小程序"
                //                 : params.row.registerSource == 3
                //                 ? "商户后台添加"
                //                 : params.row.registerSource == 4
                //                 ? "总后台管理添加"
                //                 : params.row.registerSource == 5
                //                 ? "PC端注册"
                //                 : "暂无注册来源"
                //         );
                //     }
                // },
                {
                    title: "状态",
                    key: "status",
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters["storeState"](
                                        params.row.status,
                                        true
                                    ),
                                    text: this.$options.filters["storeState"](
                                        params.row.status
                                    )
                                }
                            })
                        ]);
                    }
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center"
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
        onFormOperateFinish() {
            this.getDataList(this.pageInfo.current);
            this.showStoreForm = false;
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
                sortByCreateTime: this.searchCond.sortByCreateTime
            };
            let { records, total, size, current } = await getStoreUserList(
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
        showDetail(codeObj) {
            this.$router.push({ path: "/user/detail", query: codeObj });
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
