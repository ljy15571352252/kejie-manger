<template>
  <div class="flexC">
    <page-header
      title="设备列表"
      description="设备列表"
      no-margin
    />
    <div class="pageContent flexC">
      <search-option @on-search="onSearch" />
      <table-tool @on-refresh="getDataList(pageInfo.current)">
        <Button
          icon="md-add"
          type="primary"
          @click="addDevices"
        >添加设备
        </Button>
        <!-- <Button
          type="error"
          icon="md-trash"
          @click="deleteDevice"
        >删除设备
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
          slot="timerange"
        >
          <div>
            {{JSON.parse(row.rentConfig)[0].timerange}}
          </div>
        </template>

        <div
          slot-scope="{ row, index }"
          slot="action"
          class="x-f flex-wrap"
        >

          <a
            v-if=" advSelect == 0"
            type="text"
            @click="updateDevices(row.code,row.storeCode)"
          >编辑</a>
          <Divider type="vertical" />
          <a
            v-if=" advSelect == 0"
            type="text"
            @click="deleteDevice(row.code)"
          >删除</a>
          <a
            v-else-if=" advSelect == 1"
            type="text"
            class="break-word"
            @click="selectMember(row)"
          >选择</a>
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

  </div>
</template>

<script>
import SearchOption from "./components/search-filter-name";
import { workOptions } from "@/common/utils/viewui-utils";
import { delDevice, deviceList } from "@/api/merchant/merchant";
export default {
    name: "index",
    components: {
        SearchOption
    },
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null
            },
            pageInfo: {},
            workOptions: workOptions(),
            tableLoading: false,
            columns: [
                {
                    title: "设备名称",
                    slot: "name",
                    width: 150,
                    fixed: "left"
                },
                {
                    title: "产权人",
                    slot: "contact",
                    width: 100
                },
                {
                    title: "设备码",
                    key: "deviceCode",
                    width: 100
                },
                {
                    title: "详细地址",
                    key: "area",
                    width: 200,
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            `${params.row.provinceName}${params.row.cityName}${
                                params.row.countyName
                            }${params.row.townName}${params.row.address}`
                        );
                    }
                },
                // {
                //     title: "地址",
                //     key: "address",
                //     width: 150
                // },
                {
                    title: "行业",
                    key: "trade",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            filterTrandeName(params.row.trade)
                        );
                    }
                },
                {
                    title: "状态",
                    key: "status",
                    width: 100,
                    render: (h, params) => {
                        return h("div", [
                            h("Badge", {
                                props: {
                                    color: this.$options.filters[
                                        "statusColorType"
                                    ](params.row.status),
                                    text: this.$options.filters[
                                        "accountStatus"
                                    ](params.row.status)
                                }
                            })
                        ]);
                    }
                },
                {
                    title: "闲置时间",
                    slot: "timerange"
                },
                {
                    title: "来源",
                    key: "source",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.source == 1
                                ? "后台"
                                : params.row.source == 2
                                ? "小程序"
                                : "暂无"
                        );
                    }
                },
                {
                    title: "播放次数",
                    key: "playCount"
                },
                {
                    title: "创建时间",
                    sortable: true,
                    key: "createTime"
                },
                {
                    title: "备注",
                    key: "remark"
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 150
                }
            ],
            tableData: [],
            advSelect: 0
        };
    },
    created() {
        this.getDataList(1);
        if (this.$route.params.advselect) {
            this.advSelect = 1;
        } else {
            this.advSelect = 0;
        }
    },
    mounted() {},
    methods: {
        filterTrandeName(code) {
            let name = "";
            this.workOptions.filters(v => {
                if (v.value == code) {
                    name = v.label;
                }
            });
            return name;
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
            let { records, total, size, current } = await deviceList(
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
        deleteDevice(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delDevice(code);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {}
            });
        },
        updateDevices(code,storeCode) {
            this.$router.push({ path: "/device/detail", query: { code,storeCode} });
        },
        addDevices() {
            this.$router.push({ path: "/device/detail" });
        },
        selectMember(row) {
            sessionStorage.setItem("deviceInfo", JSON.stringify(row));
            this.$router.go(-1);
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
