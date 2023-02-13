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
      <Form :model="myForm" ref="myForm" :rules="ruleValidate" :label-width="120">
        <FormItem label="快递：" prop="expressCode" required>
          <Select
              v-model="myForm.expressCode"
              style="width: 150px"
              placeholder="请选择快递公司"
          >
            <Option
                v-for="(item, key) in expressCompanies"
                :key="key"
                :value="item.code"
            >{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="快递单号：" prop="expressNumber">
          <Input
              v-model="myForm.expressCode"
              placeholder="请输入快递单号"
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
import {updateSendProductState} from "@/api/product/product";

export default {
  name: "express-modal",
  props: ["value","orderCode"],
  data() {
    return {
      showModal: false,
      submitBtnLoading: false,
      expressCompanies:[],
      myForm: {
        expressNumber: "",
        expressCode: null,
      },
      ruleValidate: {
        expressNumber: [
          { required: true, message: "请输入快递单号", trigger: "blur" },
        ],
        expressCode: [
          { required: true, message: "请选择快递公司", trigger: "change" },
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
          let res=await updateSendProductState(fd)
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