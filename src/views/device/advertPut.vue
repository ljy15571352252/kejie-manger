<template>
  <div class="flexC">
    <page-header
      title="广告列表"
      description="广告列表"
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
        <div
          slot-scope="{ row, index }"
          slot="action"
          class="x-f flex-wrap"
        >
          <a
            type="text"
            @click="updateDevices(row.code)"
          >查看</a>
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
      title="活动审核"
      @on-submit="onCheckFinish"
    />
  </div>
</template>

<script>
import SearchOption from "./components/search-filter-name";
import CheckModal from "@/components/check";
import {
    addDeviceAd,
    auditDeviceAd,
    delDeviceAd,
    editDeviceAd,
    deviceAdDetail,
    deviceAdList
} from "@/api/merchant/merchant";
export default {
    name: "index",
    components: {
        SearchOption,
        CheckModal
    },
    data() {
        return {
            showCheckModal: false,
            checkMarkerCode: "",
            searchCond: {
                options: {},
                sortByCreateTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "广告编号",
                    key: "code",
                    width: 150,
                    fixed: "left"
                },
                {
                    title: "广告名称",
                    key: "name",
                    width: 100
                },
                {
                    title: "广告类型",
                    key: "mediaType",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.mediaType == 1
                                ? "图片"
                                : params.row.mediaType == 2
                                ? "视频"
                                : "暂无"
                        );
                    }
                },
                {
                    title: "设备ID",
                    key: "deviceCode"
                    //  render: (h, params) => {
                    //     return h(
                    //         "span",
                    //         {},
                    //         params.row.device.name
                    //     );
                    // }
                },
                {
                    title: "平台扣点%",
                    key: "discountRate",
                    width: 150
                },
                {
                    title: "推广时间",
                    key: "timeSet"
                },
                {
                    title: "上传时间",
                    key: "createTime"
                },
                {
                    title: "发布人",
                    key: "createBy"
                },
                {
                    title: "状态",
                    key: "state",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.state == 1
                                ? "投放中"
                                : params.row.state == 2
                                ? "已结束"
                                : "暂无"
                        );
                    }
                },
                {
                    title: "审核状态",
                    key: "auditState",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.auditState == 1
                                ? "待审核"
                                : params.row.auditState == 2
                                ? "审核通过"
                                : params.row.auditState == 3
                                ? "审核拒绝"
                                : "暂无"
                        );
                    }
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
        async onCheckFinish(data) {
            let json = {
                ...data,
                code: this.checkMarkerCode
            };
            let ok = await auditDeviceAd(json);
            if (ok == true) {
                   this.$refs.checkModal.finish();this.$Message.success('审核成功');
                this.getDataList(this.pageInfo.current);
            }
        },
        onCheck(code) {
            this.checkMarkerCode = code;
            this.showCheckModal = true;
            event.stopPropagation();
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
                state: 1,
                sortByCreateTime: this.searchCond.sortByCreateTime
            };
            let { records, total, size, current } = await deviceAdList(
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
        lookMatchmarkerDetail(code) {
            this.$router.push({ path: "/matchmarker/detail", query: { code } });
        },
        deleteDevice(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delDeviceAd(code);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {}
            });
        },
        updateDevices(code) {
            this.$router.push({
                path: "/advert/detail",
                query: { code, detail: false }
            });
        },
        addDevices() {
            this.$router.push({ path: "/advert/detail" });
        }
    }
};
</script>

<style lang="less">
.main-page {
}
</style>
