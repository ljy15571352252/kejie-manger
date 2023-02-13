<template>
    <div class="flexC">
        <page-header
            :title="`订单号：${detail.code}`"
            no-margin
        >
          <Row >
            <Col flex="auto">
              <Row >
                <Col span="8" class="col-item"> 下单会员：<Avatar :src="detail.member.headUrl" />
                  <span class="margin-left-10">{{ detail.member.nickName }}</span> </Col>
                <Col span="8" class="col-item"> 下单时间：{{ detail.createTime }} </Col>
                <Col span="8" class="col-item"> 订单总金额：{{ detail.totalCash | price}} </Col>
                <Col span="8" class="col-item"> 支付方式：{{ detail.payType | payType}} </Col>
                <Col span="8" class="col-item"> 支付时间：{{ detail.payTime }} </Col>
                <Col span="8" class="col-item"> 发货时间：{{ detail.sendProductTime }} </Col>
                <Col span="8" class="col-item"> 订单完成时间：{{ detail.finishTime }} </Col>
              </Row>
              <Row v-if="detail.state === 4">
                <Col span="8" class="col-item"> 关闭时间：{{ detail.closeTime }} </Col>
                <Col span="8" class="col-item"> 关闭原因：{{ detail.closeReason }} </Col>
              </Row>
            </Col>
            <Col flex="240px">
              <div style="margin-left: 88px;">
                <p>状态</p>
                <div style="font-size: 20px">{{ detail.state | commonOrderState }} <Button v-if="detail.state===2" size="small" type="primary" class="margin-left-10"  @click="showExpressModal=true" style="font-size: 13px">发货</Button></div>
              </div>
            </Col>
          </Row>
        </page-header>

      <div class="pageContent flexC">
        <Card dis-hover class="margin-top-20" style="width: 500px">
          <p slot="title">收货人信息</p>
          <Form :label-width="100">
            <FormItem label="收货人：">
              {{ detail.receiver }}
            </FormItem>
            <FormItem label="手机号：">
              {{ detail.phone }}
            </FormItem>
            <FormItem label="收货地址：">
              {{ detail.address }}
            </FormItem>
            <FormItem label="备注：" v-if="detail.remark">
              {{ detail.remark }}
            </FormItem>
          </Form>
        </Card>


        <Card dis-hover class="margin-top-20">
          <p slot="title">物流信息</p>
          <p>快递单号：{{ detail.expressNumber }}</p>
          <Timeline>
            <TimelineItem v-for="(i, index) in detail.traces" :key="index">
              <p class="time">{{ i.acceptTime }}</p>
              <p class="content">{{ i.trace }}</p>
            </TimelineItem>
          </Timeline>
        </Card>
        <Card dis-hover class="margin-top-20">
          <p slot="title">商品信息</p>
          <Table :columns="columns" :data="detail.detailList">
            <template slot-scope="{ row, index }" slot="product">
              <div class="x-start table-padding" >
                <img :src="row.productImage"/>
                <div class="margin-left-10 margin-top-20">
                  <div >{{row.productName}}</div>
                  <div>规格：{{row.skuInfo}}</div>
                  <div>数量：{{row.count}}</div>
                </div>
              </div>
            </template>
            <template slot-scope="{ row, index }" slot="price">
              ￥{{ row.price | price }}
            </template>
            <template slot-scope="{ row, index }" slot="totalPrice">
              ￥{{ row.totalPrice | price }}
            </template>
            <template slot-scope="{ row, index }" slot="points">
              {{ row.points }}
            </template>
          </Table>
        </Card>
      </div>

        <express-modal
            v-model="showExpressModal"
            @on-success="sendProductSuccess"
            :order-code="detail.code"
        />
    </div>
</template>

<script>
import { getProductOrderDetail } from "@/api/product/product";
import ExpressModal from "./components/express-modal";
export default {
    name: "product-order-detail",
    components: { ExpressModal },
    data() {
        return {
            showExpressModal: false,
            columns: [
                {
                    title: "商品",
                    slot: "product",
                },
                {
                    title: "商品单价",
                    slot: "price",
                },
                {
                    title: "总价格",
                    slot: "totalPrice",
                },
                {
                    title: "赠送积分",
                    slot: "points",
                },
            ],
            detail: {
                member: {},
                detailList: [],
                traces: [],
            },
        };
    },
    methods: {
        async getDetail(code) {
            this.detail = await getProductOrderDetail({code});
        },
        sendProductSuccess() {
            this.getDetail(this.detail.code);
        },
    },
    mounted() {},
    created() {
        const code = this.$route.params.code;
        this.getDetail(code);
    },
};
</script>

<style scoped lang="less">
/deep/.ivu-form-item{
  margin-bottom: 0!important;
}
.col-item{
  line-height: 20px;padding-bottom: 16px
}
.time {
    font-size: 14px;
    font-weight: bold;
}
.content {
    padding-left: 5px;
}
</style>
