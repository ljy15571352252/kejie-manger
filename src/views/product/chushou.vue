<template>
  <div class="flexC">
    <page-header title="商品列表" description="出售中" no-margin />
    <div class="pageContent flexC">
      <search-option @on-search="onSearch" />

      <table-tool class="tableTool" @on-refresh="getDataList(pageInfo.current)">
        <Button
            type="primary"
            ghost
            icon="md-add"
            @click="addProduct"
        >发布商品
        </Button>
        <Button icon="md-cog">全部调价</Button>
        <Button icon="md-cog">部分调价</Button>
        <Button icon="md-cog">批量设置库存</Button>
        <Button icon="md-cog">批量设置佣金</Button>
        <Button icon="md-add-circle">加入产品库</Button>
        <Button :icon="icon">{{text}}</Button>
        <Button icon="ios-transh-outline">删除</Button>
      </table-tool>
      <Table
          :loading="tableLoading"
          :columns="columns"
          :data="tableData"
          @on-sort-change="onSortChange"
      >
        <template slot-scope="{ row }" slot="productImg">
          <div class="x-f" style="padding: 10px 0">
            <img :src="findMainImage(row)" style="width: 55px"/>
          </div>
        </template>
        <template slot-scope="{ row }" slot="product">
            <span style="margin-left: 5px">{{row.promoteText}}</span>
        </template>
        <template slot-scope="{ row }" slot="price">
          {{priceRange(row)}}
        </template>
        <template slot-scope="{ row }" slot="stock">
          {{totalStock(row)}}
        </template>
        <template slot-scope="{ row }" slot="action">
          <a type="text" @click="onSwitchUpState(row)">{{
              row.state | upOrDownActionText
            }}</a>
          <Divider type="vertical" />
          <a
              type="text"
              @click="editProduct(row.code)"
          >编辑</a>
          <Divider type="vertical" />
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
            type: 'selection',
            width: 60,
            align: 'center'
        },
        {
          title: "商品名称",
          slot: "product",
        },
        {
          title: "商品图",
          slot: "productImg",
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
          title: "显示销量",
          slot: "stock",
        },
        {
          title: "真实销量",
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
          width:170
        },
        {
          title: "操作",
          slot: "action",
          fixed: "right",
          align: "center",
          width: 250,
        },
      ],
      tableData: [],
      mode:null,
      icon:'',
      text:''
    };
  },
  created() {
    // 初始化当前操作（出售/仓库/售罄/回收）
    const index = this.$route.path.indexOf('-')
    const path =  this.$route.path.substring(index+1,this.$route.path.length)
    this.changeAction(path);
    this.getDataList(1);
  },
  mounted() {},
  // 产品状态判断   
  computed:{
  },
  methods: {
    changeAction(path){
        const map = new Map([
            ["chushou", 1],
            ["cangku", 2],
            ["shouqing", 3],
            ["huishou", 4],
        ]);
        this.mode = map.get(path);
        console.log(this.mode);
        this.icon = this.$options.filters["productStatus"](this.mode,true),
        this.text = this.$options.filters["productStatus"](this.mode)
    },
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
  watch: {
    $route(to,from){
        const index = to.path.indexOf('-')
        const path =  to.path.substring(index+1,to.path.length)
        this.changeAction(path)
    }
  },
  filters: {},
}
</script>

<style scoped lang="less">
.tableTool{
    .ivu-btn{
        margin-right: 10px;
        /deep/.ivu-icon{
            font-size: 18px;
        }
    }
}
</style>