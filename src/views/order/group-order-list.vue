<template>
  <div class="flexC">
    <page-header title="群组订单列表" description="群组订单列表" no-margin />
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
        <div slot-scope="{ row, index }" slot="user" class="table-padding">
          <Avatar :src="row.member.headUrl" shape="square" size="54"/>
          <span class="margin-left-10">{{row.member.nickName}}</span>
        </div>
        <div slot-scope="{ row, index }" slot="group" class="table-padding">
<!--          <Avatar :src="row.group.imageUrl" shape="square" size="54"/>-->
          <span>{{row.group.name}}</span>
        </div>
        <template slot-scope="{ row, index }" slot="action">
          <a type="text" @click="lookDetail(row.code,row.storeCode)">详情</a>
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
    <Drawer title="订单详情" v-model="showDrawer" width="570">
      <group-order-detail
          :code="targetOrderCode"
          :storeCode="storeCode"
      />
    </Drawer>
  </div>
</template>

<script>
import SearchOption from "@/views/order/components/group-order-search-filter";
import GroupOrderDetail from "@/views/order/components/group-order-detail";
import {getGroupOrderList} from "@/api/group/group";

export default {
  name: "group-order-list",
  components: { SearchOption, GroupOrderDetail },
  data() {
    return {
      storeCode:'',
      targetOrderCode: null,
      searchCond: {
        options: {},
        sortByCreateTime: null,
      },
      pageInfo: {},
      showDrawer: false,
      tableLoading: false,
      columns: [
        {
          title: "订单号",
          key: "code",
        },
        {
          title: "下单用户",
          slot: "user",
        },
        {
          title: "群组名称",
          slot: "group",
        },

        {
          title: "订单状态",
          key: "state",
          render: (h, params) => {
            return h("div", [
              h("Badge", {
                props: {
                  color: this.$options.filters["commonOrderState"](
                      params.row.state,
                      true
                  ),
                  text: this.$options.filters["commonOrderState"](
                      params.row.state
                  ),
                },
              }),
            ]);
          },
        },
        {
          title: "订单金额",
          key: "totalAmount",
          render: (h, params) => {
            return h(
                "span",
                {},
                this.$options.filters["price"](
                    params.row.totalAmount
                )
            );
          },
        },
        {
          title: "创建时间",
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
    lookDetail(code,storeCode) {
      this.storeCode = storeCode;
      this.targetOrderCode = code;
      this.showDrawer=true
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
      let { records, total, size, current } = await getGroupOrderList(
          searchQuery
      );
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
}
</script>

<style scoped lang="less">

</style>