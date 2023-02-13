<template>
  <div class="flexC">
    <page-header
      title="商户"
      description="商户列表"
    />
    <div class="pageContent flexC">
      <search-option @on-search="onSearch" />
      <table-tool @on-refresh="getDataList(pageInfo.current)">
        <Button
          type="primary"
          ghost
          icon="ios-add"
          @click="addStore"
        >新增商户
        </Button>
      </table-tool>
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
            @click="timeSet(row)"
          >服务期</a>
          <Divider type="vertical" />
          <a
            type="text"
            @click="lookStoreDetail(row.code)"
          >详情</a>
          <Divider type="vertical" />
          <a
            type="text"
            @click="editStore(row.code)"
          >编辑</a>

          <!-- 域名信息 -->
          <!-- <Divider type="vertical" />
                    <a type="text" @click="onShowMemberBalanceLog(row.code)"
                        >余额明细</a> -->
          <!-- 用户列表 -->
          <!-- <Divider type="vertical" />
                    <a type="text" @click="onShowMemberBalanceLog(row.code)"
                        >用户列表</a> -->
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
    <Drawer
      title="商户"
      v-model="showStoreForm"
      width="570"
    >
      <store-form
        :code="selectStoreCode"
        @on-edit-finish="onFormOperateFinish"
        @on-add-finish="onFormOperateFinish"
        :mode="formMode"
      />
    </Drawer>
    <timeModel
      v-model="showModel"
      :timeForm="timeForm"
      @on-search="addTime"
    ></timeModel>
  </div>
</template>

<script>
import StoreForm from "./components/store-form";
import SearchOption from "./components/store-search-filter";
import { PAGE_MODE } from "@/common/constants";
import { getStoreList, editStoreTime } from "@/api/store/store";
import timeModel from "./components/time-model";
export default {
    name: "index",
    components: { StoreForm, SearchOption, timeModel },
    data() {
        return {
            showStoreForm: false,
            selectStoreCode: null,
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
                    title: "商户",
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
                                // h("Avatar", {
                                //     props: {
                                //         shape: "square",
                                //         size: "54"
                                //     },
                                //     attrs: {
                                //         src: params.row.logo
                                //     }
                                // }),
                                h(
                                    "p",
                                    {
                                        style: {
                                            marginLeft: "5px"
                                        }
                                    },
                                    params.row.name
                                )
                            ]
                        );
                    }
                },
                {
                    title: "联系人",
                    key: "contact"
                },
                {
                    title: "联系人手机",
                    key: "mobile"
                },
                {
                    title: "地址",
                    key: "area",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.provinceName
                                ? `${params.row.provinceName}${
                                      params.row.cityName
                                  }${params.row.countyName}${
                                      params.row.address
                                  }`
                                : ""
                        );
                    }
                },
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
                    title: "创建时间/服务期",
                    key: "createTime",
                    sortable: true,
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    padding: "10px 0"
                                }
                            },
                            [
                                h(
                                    "p",
                                    {
                                        style: {
                                            marginLeft: "5px"
                                        }
                                    },
                                    params.row.createTime
                                ),
                                h(
                                    "p",
                                    {
                                        style: {
                                            marginLeft: "5px"
                                        }
                                    },
                                    params.row.expiredDate
                                )
                            ]
                        );
                    }
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 200
                }
            ],
            tableData: [],
            showModel: false,
            timeForm: "",
            timeCode: ""
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
            let { records, total, size, current } = await getStoreList(
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
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showStoreForm = true;
            this.selectStoreCode = null;
        },
        // 有效期
        timeSet(row) {
            this.showModel = true;
            this.timeForm = row.expiredDate;
            this.timeCode = row.code;
        },
        async addTime(time) {
            let res = await editStoreTime({
                expiredDate: time,
                code: this.timeCode
            });
            if (res ) {
                this.$Message.success("修改成功");
                this.getDataList(1);
                this.showModel = false;
            } else {
                this.$Message.error("修改失败");
            }
        },
        // 编辑
        editStore(code) {
            this.$router.push({ path: "/store/edit", query: { code } });
        },
        // 详情
        lookStoreDetail(code) {
            this.$router.push({ path: "/store/detail", query: { code } });
        },
        // 添加
        addStore() {
            this.$router.push({ path: "/store/add" });
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
