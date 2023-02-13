<template>
  <div class="flexC">
    <page-header
      :title="`订单号：${detail.code}`"
      no-margin
    >
    </page-header>
    <Card>
     
         
        <Row>
          <Col
            span="8"
            class="col-item"
          > 商户名称：
          {{ detail.storeName }}</Col>
          <Col
            span="8"
            class="col-item"
          > 下单时间：{{ detail.createTime }} </Col>
          <Col
            span="8"
            class="col-item"
          > 订单总金额：{{ detail.totalCash | price}} </Col>
          <Col
            span="8"
            class="col-item"
          > 支付状态：{{ detail.state | commonOrderState}} </Col>

          <Col
            span="8"
            class="col-item"
          > 支付方式：{{ detail.payType | payType}} </Col>
          <Col
            span="8"
            class="col-item"
          > 支付时间：{{ detail.payTime }} </Col>

          <Col
            span="8"
            class="col-item"
          > 订单完成时间：{{ detail.finishTime }} </Col>
        </Row>
     </Card>
  </div>
</template>

<script>
import { getStoreOpenOrderDetail } from "@/api/store/store";
import ExpressModal from "./components/express-modal";
export default {
    name: "product-order-detail",
    components: { ExpressModal },
    data() {
        return {
            showExpressModal: false,
            detail: {}
        };
    },
    methods: {
        async getDetail(code, storeCode) {
            this.detail = await getStoreOpenOrderDetail({
                orderCode: code,
                storeCode
            });
            
        }
    },
    mounted() {},
    created() {
        const code = this.$route.params.code;
        const storeCode = this.$route.params.storeCode;
        this.getDetail(code, storeCode);
    }
};
</script>

<style scoped lang="less">
/deep/.ivu-form-item {
    margin-bottom: 0 !important;
}
.col-item {
    line-height: 20px;
    padding-bottom: 16px;
}
.time {
    font-size: 14px;
    font-weight: bold;
}
.content {
    padding-left: 5px;
}
</style>
