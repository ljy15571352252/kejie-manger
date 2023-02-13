<template>
  <div class="flexC">
    <page-header title="商品列表" description="商品列表" no-margin />
    <div class="pageContent flexC">
      <search-option @on-search="onSearch" />
      <table-tool @on-refresh="getDataList(pageInfo.current)">
        <Button
            type="primary"
            ghost
            icon="ios-add"
            @click="addProduct"
        >新增商品
        </Button>
      </table-tool>
      <Table
          :loading="tableLoading"
          :columns="columns"
          :data="tableData"
          @on-sort-change="onSortChange"
      >
        <template slot-scope="{ row, index }" slot="product">
          <div class="x-f" style="padding: 10px 0">
            <img :src="findMainImage(row)" style="width: 100px"/>
            <span style="margin-left: 5px">{{row.promoteText}}</span>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="price">
          {{priceRange(row)}}
        </template>
        <template slot-scope="{ row, index }" slot="stock">
          {{totalStock(row)}}
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Row>
            <Col :span="24">
          <a type="text" @click="onSwitchUpState(row)">{{
              row.state | upOrDownActionText
            }}</a>
          <Divider type="vertical" />
          <a
              type="text"
              @click="editProduct(row.code)"
          >编辑</a>
          </Col>
          <Col :span="24">
          <a
              type="text"
              @click="onDel(row.code)"
          >删除</a
          >
          <Divider type="vertical" />
          <a
              type="text"
              @click="onDel(row.code)"
          >审核</a
          >
          </Col>
          </Row>
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
    <Modal title="图片预览" v-model="preview">
      <img :src="previewUrl" v-if="preview" style="width: 100%" />
    </Modal>

  </div>
</template>

<script>
import SearchOption from "@/views/product/components/product-search-filter";
import {delProduct, getProductList, updateProductStatus} from "@/api/product/product";

export default {
  name: "productlist",
  components: {  SearchOption },
  data() {
    return {
      preview: false,
      previewUrl: null,
      searchCond: {
        options: {},
        sortByCreateTime: null,
      },
      pageInfo: {},
      tableLoading: false,
      columns: [
        {
          title: "ID",
          key: "code",
          width:100
        },
        {
          title: "商品",
          slot: "product",
        },
        {
          title: "分类",
          key: "categoryName",
        },
        {
          title: "价格",
          slot: "price",
        },
        {
          title: "总库存",
          slot: "stock",
        },
        {
          title: "状态",
          key: "state",
          render: (h, params) => {
            return h("div", [
              h("Badge", {
                props: {
                  color: this.$options.filters[
                      "productUpState"
                      ](params.row.state,true),
                  text: this.$options.filters[
                      "productUpState"
                      ](params.row.state),
                },
              }),
            ]);
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
    onSwitchUpState({ state, code }) {
      const statusAction = new Map([
        [
          2,
          {
            tit: "上架商品",
            confirmTxt: "您确定要上架该商品吗？",
            successTxt: "上架成功",
            updateStatus: 1,
          },
        ],
        [
          1,
          {
            tit: "下架商品",
            confirmTxt: "您确定要下架该商品吗？",
            successTxt: "下架成功",
            updateStatus: 2,
          },
        ],
      ]);
      const targetAction = statusAction.get(state);
      this.$Modal.confirm({
        title: targetAction.tit,
        content: "<p>" + targetAction.confirmTxt + "</p>",
        onOk: async () => {
          let res = await updateProductStatus({
            code: code,
            state: targetAction.updateStatus,
          });
          if (res ) {
            this.$Message.success(targetAction.successTxt);
            this.getDataList(this.pageInfo.current);
          }
        },
        onCancel: () => {},
      });
    },
    onDel(code) {
      this.$Modal.confirm({
        title: "删除",
        content:
            "<p>您确定要删除吗？</p>",
        onOk: async () => {
          let res = await delProduct({
            code: code,
          });
          if (res ) {
            this.$Message.success(
                "删除成功"
            );
            this.getDataList(
                this.pageInfo
                    .current
            );
          }
        },
        onCancel: () => {},
      });
    },
    totalStock({skuList}){
      if (skuList.length===1)
        return skuList[0].count
      return skuList.reduce((i,j)=>i.count+j.count)
    },
    priceRange({skuList}){
      let priceList=skuList.map(i=>i.price)
      let maxPrice=Math.max(...priceList)
      let minPrice=Math.min(...priceList)
      if (maxPrice===minPrice)
        return `￥${maxPrice}`
      return `￥${minPrice}~￥${maxPrice}`
    },
    findMainImage({imgList}){
      return imgList.filter(i=>i.isMain)[0].imageUrl
    },
    onImagePreview(url) {
      this.preview = true;
      this.previewUrl = url;
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
      let { records, total, size, current } = await getProductList(
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
    addProduct() {
      this.$router.push({
        name:'product-detail',
        params:{action:'add'},
      })
    },
    editProduct(code) {
      this.$router.push({
        path:'/product-detail/edit',
        query:{code}
      })
    },
  },
  watch: {},
  filters: {},
}
</script>

<style scoped lang="less">

</style>