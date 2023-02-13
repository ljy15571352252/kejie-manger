<template>
  <div class="flexC">
    <page-header
      :title="`退款编号：${detail.orderCode}`"
      no-margin
    >
      <Row>
        <Col span="18">
        <Row>
          <Col
            span="8"
            class="col-item"
          >
          <span>退款群组信息：</span>
          <div class="product-nr">
            <!-- <img :src="item.productImage" alt=""> -->
            <div class="product-info">
              <p>名称：{{detail.order.name}}</p>
              <!-- <p>规格：{{item.skuInfo}}</p>
                      <p>数量：{{item.count}}</p> -->
            </div>
          </div>
          </Col>
          <Col
            span="8"
            class="col-item"
          > 下单时间：{{ detail.createTime }} </Col>
          <Col
            span="8"
            class="col-item"
          > 订单原始支付金额：{{ detail.originAmount | price}} </Col>
          <!-- <Col span="8" class="col-item"> 售后类型：{{ detail.type | aftersalesType}} </Col> -->
          <Col
            span="8"
            class="col-item"
          > 退款金额：{{ detail.refundCash | price}} </Col>
          <Col
            span="8"
            class="col-item"
          > 退款类型：{{ detail.refundType | aftersalesRefundType }} </Col>
        </Row>
        </Col>
        <Col span="6">
        <div style="margin-left: 88px;">
          <p>状态</p>
          <div style="font-size: 20px">{{ detail.state | groupAftersalesState }}
            <Button
              v-if="detail.state === 1"
              size="small"
              type="primary"
              class="margin-left-10"
              @click="onAgreeAftersales"
              style="font-size: 13px"
            >同意</Button>
            <Button
              v-if="detail.state === 1"
              size="small"
              ghost
              type="primary"
              class="margin-left-10"
              @click="showRemarkModal = true"
              style="font-size: 13px"
            >拒绝</Button>
            <Button
              v-if="detail.type === 3 && detail.state === 4"
              size="small"
              type="primary"
              class="margin-left-10"
              @click="showExpressModal=true"
              style="font-size: 13px"
            >发货</Button>
          </div>
        </div>
        </Col>
      </Row>
      <Row>
        <Col
          span="6"
          class="col-item"
        > 商家同意退款时间：{{ detail.agreeTime }} </Col>
        <Col
          v-show="detail.type === 1 || detail.type === 3"
          span="6"
          class="col-item"
        > 买家发货时间：{{ detail.buyerSendTime }} </Col>
        <Col
          v-show="detail.type === 1 || detail.type === 3"
          span="6"
          class="col-item"
        > 卖家确认收货时间：{{ detail.sellerConfirmTime }} </Col>
        <Col
          v-show="detail.type === 3"
          span="6"
          class="col-item"
        > 卖家发货时间：{{ detail.sellerSendTime }} </Col>
        <Col
          v-show="detail.type === 3"
          span="6"
          class="col-item"
        > 买家确认收货时间：{{ detail.buyerConfirmTime }} </Col>
        <Col
          span="6"
          class="col-item"
        > 售后完成时间：{{ detail.finishTime }} </Col>
        <Col
          span="6"
          class="col-item"
        > 售后取消时间：{{ detail.cancelTime }} </Col>
        <Col
          span="6"
          class="col-item"
        > 买家备注：{{ detail.remark }} </Col>
      </Row>
    </page-header>

    <div class="pageContent flexC">
      <Card
        dis-hover
        class="margin-top-20"
        style="width: 500px"
        v-if="detail.type === 1 || detail.type === 3"
      >
        <p slot="title">卖家收货人信息</p>
        <Form :label-width="100">
          <FormItem label="收货人：">
            {{ detail.sellerRecvReceiver }}
          </FormItem>
          <FormItem label="手机号：">
            {{ detail.sellerRecvMobile }}
          </FormItem>
          <FormItem label="收货地址：">
            {{ detail.sellerRecvAddress }}
          </FormItem>
          <!-- <FormItem label="备注：" v-if="detail.remark">
              {{ detail.remark }}
            </FormItem> -->
        </Form>
      </Card>

      <!-- <Card dis-hover class="margin-top-20">
          <p slot="title">售后图片列表</p>
          <Table :columns="columns" :data="detail.imgList">
            <template slot-scope="{ row }" slot="imageUrl">
              <img style="width:80px;display: block;padding: 10px 0;" :src="row.imageUrl" alt="" />
            </template>
          </Table>
        </Card> -->
      <Card
        dis-hover
        class="margin-top-20"
        v-if="(detail.type === 1 || detail.type === 3) && detail.state > 2"
      >
        <p slot="title">买家退货物流</p>
        <p>快递单号：{{ detail.buyerTraces ? detail.buyerTraces.expressNumbe : '暂无' }}</p>
        <Timeline v-show="detail.buyerTraces">
          <TimelineItem
            v-for="(i, index) in detail.buyerTraces"
            :key="index"
          >
            <p class="time">{{ i.acceptTime }}</p>
            <p class="content">{{ i.trace }}</p>
          </TimelineItem>
        </Timeline>
      </Card>
      <Card
        dis-hover
        class="margin-top-20"
        v-if="detail.type === 3 && detail.state > 4"
      >
        <p slot="title">卖家换货物流</p>
        <p>快递单号：{{ detail.sellerTraces ? detail.sellerTraces.expressNumbe : '暂无' }}</p>
        <Timeline v-show="detail.sellerTraces">
          <TimelineItem
            v-for="(i, index) in detail.sellerTraces"
            :key="index"
          >
            <p class="time">{{ i.acceptTime }}</p>
            <p class="content">{{ i.trace }}</p>
          </TimelineItem>
        </Timeline>
      </Card>

    </div>

    <express-modal
      v-model="showExpressModal"
      @on-success="sendProductSuccess"
      :order-code="detail.orderCode"
    />
    <remark-modal
      v-model="showRemarkModal"
      @on-success="sendProductSuccess"
      :order-code="detail.orderCode"
    />
    <seller-modal
      v-model="showSellerModal"
      @on-success="sendProductSuccess"
      :order-code="detail.orderCode"
    />
  </div>
</template>

<script>
import { getGroupOrderAftersalesDetail } from "@/api/group/group";
import ExpressModal from "./components/express-modal";
import RemarkModal from "./components/remark-modal";
import SellerModal from "./components/seller-modal";
export default {
    name: "group-order-aftersales-detail",
    components: { ExpressModal, RemarkModal, SellerModal },
    data() {
        return {
            showExpressModal: false,
            showRemarkModal: false,
            showSellerModal: false,
            columns: [
                {
                    title: "编号",
                    key: "orderCode"
                },
                {
                    title: "图片",
                    slot: "imageUrl"
                },
                {
                    title: "创建时间",
                    key: "createTime"
                }
            ],
            detail: {}
        };
    },
    methods: {
        async getDetail(orderCode, storeCode) {
            this.detail = await getGroupOrderAftersalesDetail({
                code: orderCode,
                storeCode: storeCode
            });
        },
        sendProductSuccess() {
            this.getDetail(this.detail.orderCode, this.detail.storeCode);
        },
        async onAgreeAftersales() {
            if (this.detail.type === 1 || this.detail.type === 3) {
                this.showSellerModal = true;
            } else {
                let res = await agreeAftersales({
                    orderCode: this.detail.orderCode
                });
                if (res ) {
                    this.$Message.success("操作成功");
                    this.sendProductSuccess();
                }
            }
        }
    },
    mounted() {},
    created() {
        const orderCode = this.$route.params.orderCode;
        const storeCode = this.$route.params.storeCode;
        this.getDetail(orderCode, storeCode);
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
.product-nr {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 0;
    img {
        width: 80px;
        margin-right: 15px;
    }
    .product-info {
    }
}
</style>
