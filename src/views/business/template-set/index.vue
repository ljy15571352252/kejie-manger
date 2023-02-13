<template>
  <div class="flexC">
    <page-header title="模板管理" />
    <div class="pageContent flexC">
      <Select
        v-model="storeCode"
        style="width:160px"
        filterable
        filter-by-label
        placeholder="请选择商户"
      >
        <Option
          v-for="item in storeList"
          :value="item.code"
          :key="item.code"
        >{{ item.name }}</Option>
      </Select>
      <Tabs v-model="curTab">

        <!-- <TabPane label="个人中心菜单设置" name="productCategory">
                    <personal-menu-set />
                </TabPane> -->
        <TabPane
          label="模板"
          name="homeModule"
        >
          <product-category />
        </TabPane>
        <!-- <TabPane
          label="商品分类"
          name="goodscate"
        >
          <goods-cate />
        </TabPane> -->
        <!-- <TabPane label="首页模板" name="matchmarkerModule">
                    <template v-if="curTab === 'matchmarkerModule'">
                        <product-category />
                    </template>
                </TabPane> -->
        <!-- <TabPane label="红娘模板" name="matchmarkerModule">
                    <template v-if="curTab === 'matchmarkerModule'">
                        <product-category />
                    </template>
                </TabPane> -->
        <TabPane
          label="用户中心"
          name="personalMenuSet"
        >
          <template v-if="curTab === 'personalMenuSet'">
            <personal-menu-set :storeCode="storeCode"/>
          </template>
        </TabPane>
        <TabPane
          label="底部设置"
          name="memberPlatformTabSet"
        >
          <template v-if="curTab === 'memberPlatformTabSet'">
            <tabbar-set :storeCode="storeCode"/>
          </template>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import TabbarSet from "./components/tabbar-set";
import PersonalMenuSet from "./components/personal-menu-set";
import ProductCategory from "./components/product-category";
import goodsCate from "./components/goodsCate/goodsCate";
import { getStoreList } from "@/api/store/store";
export default {
    name: "index",
    components: { TabbarSet, PersonalMenuSet, ProductCategory, goodsCate },
    data() {
        return {
            curTab: "homeModule",
            storeList: [],
            storeCode: ""
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        async getDataList(page) {
            const searchQuery = {
                page: page
            };
            let { records, total, size, current } = await getStoreList(
                searchQuery
            );
            this.storeList = records;
            this.storeCode = records ? records[0].code : "";
            // this.pageInfo = {
            //     total,
            //     size,
            //     current
            // };
        }
    },
    watch: {},
    filters: {}
};
</script>

<style scoped lang="less">
.form-item-inp {
    width: 300px;
}

.form-content {
    padding-top: 30px;
    padding-left: 30px;
}
</style>
