<template>
  <div class="flexC">
    <page-header
      title="置顶卡"
      description="置顶卡"
    />
    <div class="pageContent flexC">
      <Button
        type="primary"
        icon="ios-add"
        @click="onShowAddModal"
        style="width: 150px"
      >新增置顶卡
      </Button>

      <Row :gutter="10">
        <Col
          v-for="(item, index) in dataList"
          :span="8"
          :key="index"
        >
        <Card class="list-goods-list-item">
          <img :src="item.imgUrl" />
          <div class="list-goods-list-item-title">
            {{ item.name }}
          </div>
          <div class="list-goods-list-item-desc">有效天数：{{item.validDays}}天</div>
          <div class="list-goods-list-item-price">
            <span>¥ {{ item.price | price }}</span>
            <s v-if="item.originPrice">¥ {{ item.originPrice | price }}</s>
          </div>
          <div>
            <Button
              type="primary"
              @click="onEdit(item)"
            >编辑</Button>
            <Divider type="vertical" />
            <Button
              type="error"
              @click="onDel(item.code)"
            >删除</Button>
          </div>
        </Card>
        </Col>
      </Row>
    </div>
    <Drawer
      title="置顶卡"
      v-model="showDrawer"
      width="570"
    >
      <top-card-form
        :top-card-obj="targetTopCardObj"
        :mode="formMode"
        @on-edit-finish="onFormOperateFinish"
        @on-add-finish="onFormOperateFinish"
      />
    </Drawer>
  </div>
</template>

<script>
import TopCardForm from "./components/topcard-form";
import { delTopCard, getTopCardList } from "@/api/product/topcard";
import { PAGE_MODE } from "@/common/constants";

export default {
    name: "index",
    components: { TopCardForm },
    data() {
        return {
            formMode: null,
            showDrawer: false,
            targetTopCardObj: null,
            dataList: []
        };
    },
    created() {
        this.getDataList();
    },
    mounted() {},
    methods: {
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delTopCard({
                        code: code
                    });
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {}
            });
        },
        onFormOperateFinish() {
            this.getDataList();
            this.showDrawer = false;
        },
        async getDataList() {
            let {records} = await getTopCardList();
            this.dataList = records
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetTopCardObj = null;
        },
        onEdit(obj) {
            this.targetTopCardObj = this.copyJson(obj);
            this.showDrawer = true;
            this.formMode = PAGE_MODE.EDIT;
            event.stopPropagation();
        }
    },
    watch: {},
    filters: {}
};
</script>

<style scoped lang="less">
.list-goods-list-item {
    margin-top: 10px;
    text-align: center;
    position: relative;
    height: 260px;
    width: 200px;
    img {
        width: 60%;
    }
}
.list-goods-list-item-title {
    font-size: 16px;
    font-weight: 700;
    margin: 8px 0;
}
.list-goods-list-item-desc {
    font-size: 14px;
    color: #808695;
}
.list-goods-list-item-price {
    font-size: 14px;
    color: #ff6700;
    margin: 8px 0;
    s {
        margin-left: 8px;
        color: #808695;
    }
}
</style>
