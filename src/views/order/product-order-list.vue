<template>
  <div class="flexC">
    <page-header title="商品订单列表" description="商品订单列表" no-margin />
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
        <template slot-scope="{ row, index }" slot="detail">
          <div class="x-f table-padding" v-for="(i,k) in row.detailList" :key="k">
            <img 
              :src="i.productImage"
              style="width:100px;"
            />
            <div class="margin-left-10">
              <div >名称：{{i.productName}}</div>
              <div>规格：{{i.skuInfo}}</div>
              <div>数量：{{i.count}}</div>
            </div>
          </div>
        </template>
        <div slot-scope="{ row, index }" slot="user" class="table-padding">
          <Avatar :src="row.member.headUrl" shape="square" size="54"/>
          <span class="margin-left-10">{{row.member.nickName}}</span>
        </div>
        <template slot-scope="{ row, index }" slot="action">
          <a type="text" @click="lookDetail(row.code)">详情</a>
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
import SearchOption from "@/views/order/components/product-order-search-filter";
import {getProductOrderList} from "@/api/product/product";

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
          title: "订单号",
          key: "code",
          width:100
        },
        {
          title: "商品",
          slot: "detail",
        },
        {
          title: "下单用户",
          slot: "user",
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
          key: "totalCash",
          render: (h, params) => {
            return h(
                "span",
                {},
                this.$options.filters["price"](
                    params.row.totalCash
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
    lookDetail(code) {
      this.$router.push('/product-order-detail/'+code)
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
      let { records, total, size, current } = await getProductOrderList(
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