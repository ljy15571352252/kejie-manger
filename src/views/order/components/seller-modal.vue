<template>
  <div>
    <Modal
        v-model="showModal"
        title="发货信息"
        :mask-closable="false"
        :loading="submitBtnLoading"
        @on-ok="onSubmit"
        ok-text="提交"
        @on-visible-change="onVisibleChange"
    >
      <Form :model="myForm" ref="myForm" :rules="ruleValidate" :label-width="150">
        <FormItem label="卖家收货人：" prop="sellerRecvReceiver">
          <Input
              v-model="myForm.sellerRecvReceiver"
              placeholder="请输入收件人名字"
          ></Input>
        </FormItem>
        <FormItem label="卖家收货电话：" prop="sellerRecvMobile">
          <Input
              v-model="myForm.sellerRecvMobile"
              placeholder="请输入手机号"
          ></Input>
        </FormItem>
        <FormItem label="地区：" prop="area">
            <area-cascader
                v-model="myForm.area"
                @on-change="changeArea"
                target="county"
            ></area-cascader>
        </FormItem>
        <FormItem
              label="详细地址："
              prop="address"
          >
            <Input
                v-model="myForm.address"
                placeholder="请输入详细地址"
            ></Input>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button
            type="primary"
            :loading="submitBtnLoading"
            @click="onSubmit"
        >提交</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {agreeAftersales} from "@/api/product/product";
import AreaCascader from "@/components/area/areaCascader";

export default {
  name: "express-modal",
  props: ["value","orderCode"],
  components:{ AreaCascader },
  data() {
    return {
      showModal: false,
      submitBtnLoading: false,
      expressCompanies:[],
      myForm: {
      },
      ruleValidate: {
        sellerRecvReceiver: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" },
        ],
        sellerRecvMobile: [
          { required: true, message: "请输入收货人手机", trigger: "change" },
        ],
        area: [
          {
            required: true,
            type:'array',
            message: "请选择地区",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    value(cur) {
      this.showModal = cur;
    },
  },
  methods: {
    finish() {
      this.submitBtnLoading = false;
      this.$emit("input", false);
    },
    onVisibleChange(val) {
      if (!val) {
        this.$emit("input", val);
      }
    },
    changeArea(arr){
        this.country = Array.from(new Set(arr)).join('')
    },
    onSubmit() {
      this.$refs["myForm"].validate(async valid => {
        if (valid) {
          this.submitBtnLoading = true;
          this.myForm.sellerRecvAddress = this.country + this.myForm.address
          const form = {
            'sellerRecvReceiver':this.myForm.sellerRecvReceiver,
            'sellerRecvMobile':this.myForm.sellerRecvMobile,
            'sellerRecvAddress':this.myForm.sellerRecvAddress
          }
          let fd=this.copyJson(form)
          fd.code=this.orderCode
          let res=await agreeAftersales(fd)
          this.submitBtnLoading = false;
          if (res ){
            this.$Message.success('操作成功')
            this.$emit("input", false);
            this.$emit("on-success");
          }
        }
      });
    },
  },
}
</script>

<style scoped>

</style>