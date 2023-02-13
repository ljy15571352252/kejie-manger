<template>
  <div>
    <Modal
        v-model="showModal"
        title="拒绝售后"
        :mask-closable="false"
        :loading="submitBtnLoading"
        @on-ok="onSubmit"
        ok-text="提交"
        @on-visible-change="onVisibleChange"
    >
      <Form :model="myForm" ref="myForm" :rules="ruleValidate" :label-width="80">
        <FormItem label="备注：" prop="rejectAftersales">
          <Input
              type="textarea"
              v-model="myForm.rejectAftersales"
              placeholder="请输入拒绝原因"
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
import {rejectAftersales} from "@/api/product/product";

export default {
  name: "express-modal",
  props: ["value","orderCode"],
  data() {
    return {
      showModal: false,
      submitBtnLoading: false,
      expressCompanies:[],
      myForm: {},
      ruleValidate: {
        rejectAftersales: [
          { required: true, message: "请输入拒绝的原因", trigger: "blur" },
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
    onSubmit() {
      this.$refs["myForm"].validate(async valid => {
        if (valid) {
          this.submitBtnLoading = true;
          let fd=this.copyJson(this.myForm)
          fd.code=this.orderCode
          let res=await rejectAftersales(fd)
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