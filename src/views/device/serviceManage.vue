<template>
  <div class="flexC">
    <page-header
      title="服务号管理"
      description="服务号管理"
      no-margin
    />
    <div class="pageContent flexC">
      <!-- <search-option @on-search="onSearch" /> -->
      <table-tool @on-refresh="getDataList(pageInfo.current)">
        <Button
          icon="md-add"
          type="primary"
          @click="addDevices"
        >添加服务号
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
import addModel from "./components/addServiceModel";
import {
    delDeviceService,
    deviceServiceList,
    editDeviceService,
    addDeviceService,
    deviceServiceDetail
} from "@/api/merchant/merchant";
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
                    title: "开头字母",
                    key: "firstLetter",
                    fixed: "left"
                },
                {
                    title: "服务号位号数",
                    key: "serviceAccNum"
                },
                {
                    title: "生成数量",
                    key: "genCount"
                },
                {
                    title: "操作员",
                    key: "operator"
                },
                {
                    title: "创建时间",
                    key: "createTime"
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
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                // ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime
            };
            let { records, total, size, current } = await deviceServiceList(
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
                    let res = await delDeviceService(code);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {}
            });
        },
        async updateDevices(code,storeCode) {
            this.showModel = true;
            this.code = code;
            this.storeCode = storeCode;
            let res = await deviceServiceDetail({code:code,storeCode:storeCode});
            this.formData = res;
        },
        addDevices() {
            this.showModel = true;
        },
        async addSuccess(data) {
            if (this.code) {
                let res = await editDeviceService(data);
                if (res ) {
                    this.$Message.success("修改成功！");
                    this.getDataList(this.pageInfo.current);
                } else {
                    this.$Message.error("修改失败！");
                }
            } else {
                let res = await addDeviceService(data);
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
