<template>
  <div class="flexC">
    <page-header title="订单售后列表" description="订单售后列表" no-margin />
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
        <template slot-scope="{ row }" slot="order">
          <div class="x-f table-padding">
            <!-- <img 
              :src="i.productImage"
              style="width:100px;"
            /> -->
            <div class="margin-left-10">
              <div >名称：{{row.order.name}}</div>
              <!-- <div>规格：{{i.skuInfo}}</div>
              <div>数量：{{i.count}}</div> -->
            </div>
          </div>
        </template>
        <!-- <div slot-scope="{ row, index }" slot="user" class="table-padding">
          <Avatar :src="row.member.headUrl" shape="square" size="54"/>
          <span class="margin-left-10">{{row.member.nickName}}</span>
        </div> -->
        <template slot-scope="{ row }" slot="action">
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
  </div>
</template>

<script>
import SearchOption from "@/views/order/components/order-aftersales-search-filter";
import {getGroupOrderAftersalesList, getGroupOrderAftersalesDetail} from "@/api/group/group";

export default {
  name: "product-order-list",
  components: { SearchOption },
  data() {
    return {
      searchCond: {
        options: {},
        sortByCreateTime: null,
      },
      pageInfo: {},
      showDrawer: false,
      tableLoading: false,
      columns: [
        {
          title: "退款编号",
          key: "orderCode",
        },
        {
          title: "退款群组信息",
          slot: "order",
          width:250
        },
        {
          title: "订单原始支付金额",
          key: "originAmount",
          render: (h, params) => {
            return h(
                "span",
                {},
                this.$options.filters["price"](
                    params.row.originAmount
                )
            );
          },
        },
        // {
        //   title:'售后类型',
        //   key: "state",
        //   render: (h, params) => {
        //     return h("span", {}, this.$options.filters["groupAftersalesType"](params.row.state));
        //   },
        // },
        {
          title: "订单状态",
          key: "state",
          render: (h, params) => {
            return h("span", {}, this.$options.filters["groupAftersalesState"](params.row.state));
          },
        },
        {
          title: "退款金额",
          key: "refundCash",
          render: (h, params) => {
            return h(
                "span",
                {},
                this.$options.filters["price"](
                    params.row.refundCash
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
    lookDetail(orderCode,storeCode) {
      this.$router.push('/group-order-aftersales-detail/'+orderCode+'/'+storeCode)
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
      let { records, total, size, current } = await getGroupOrderAftersalesList(
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

<style scoped>

</style>