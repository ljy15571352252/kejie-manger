<template>
  <div class="flexC">
    <page-header
      title="设备ID管理"
      description="设备ID管理"
      no-margin
    />
    <div class="pageContent flexC">
      <table-tool @on-refresh="getDataList(pageInfo.current)">
        <Button
          icon="md-add"
          type="primary"
          @click="addDevices"
        >添加设备ID
        </Button>
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
            @click="updateDevices(row.code,row.storeCode)"
          >编辑</a>
          <Divider type="vertical" />
          <a
            type="text"
            @click="deleteDevice(row.code)"
          >删除</a>
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
    <addModel
      v-model="showModel"
      :data="formData"
      @on-success="addSuccess"
    ></addModel>
  </div>
</template>

<script>
import {
    delDeviceCode,
    deviceCodeList,
    editDeviceCode,
    addDeviceCode,
    deviceCodeDetail
} from "@/api/merchant/merchant";
import addModel from "./components/addDeviceidModel";
export default {
    name: "index",
    components: {
        addModel
    },
    data() {
        return {
            formData: {},
            code: "",
            showModel: false,
            searchCond: {
                options: {},
                sortByCreateTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "设备id",
                    key: "code",
                    fixed: "left"
                },
                {
                    title: "产品类型",
                    key: "productType"
                },
                {
                    title: "绑定地区",
                    key: "mapSearch",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            `${params.row.provinceName}${params.row.cityName}${
                                params.row.countyName
                            }${params.row.townName}`
                        );
                    }
                },
                {
                    title: "设备所有人ID",
                    key: "deviceCode"
                },
                {
                    title: "是否绑定",
                    key: "isBind",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.isBind == 1
                                ? "绑定"
                                : params.row.isBind == 2
                                ? "未绑定"
                                : "暂无"
                        );
                    }
                },
                {
                    title: "绑定时间",
                    key: "bindTime"
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
        // onSearch(params) {
        //     this.searchCond.options = params;
        //     this.getDataList(1);
        // },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                // ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime
            };
            let { records, total, size, current } = await deviceCodeList(
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
                    let res = await delDeviceCode(code);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {}
            });
        },
        async updateDevices(code, storeCode) {
            this.showModel = true;
            this.code = code;
            this.storeCode = storeCode;
            let res = await deviceCodeDetail({
                code: code,
                storeCode: storeCode
            });
            this.formData = res;
        },
        addDevices() {
            this.showModel = true;
        },
        async addSuccess(data) {
            if (this.code) {
                let res = await editDeviceCode(data);
                if (res ) {
                    this.$Message.success("修改成功！");
                    this.getDataList(this.pageInfo.current);
                } else {
                    this.$Message.error("修改失败！");
                }
            } else {
                let res = await addDeviceCode(data);
                if (res ) {
                    this.$Message.success("添加成功！");
                    this.getDataList(this.pageInfo.current);
                } else {
                    this.$Message.error("添加失败！");
                }
            }
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
