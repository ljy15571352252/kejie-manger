<template>
  <div>
    <Modal
      v-model="showModal"
      title="添加服务号"
      :mask-closable="false"
      :loading="submitBtnLoading"
      @on-visible-change="onVisibleChange"
    >
      <Form
        :model="addModelData"
        ref="myForm"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          label="开头字母"
          class="form-item-padding"
        >
          <Input
            v-model="addModelData.firstLetter"
            placeholder="请输入开头字母"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="服务号位号数"
          class="form-item-padding"
          prop="serviceAccNum"
        >
          <Input
            v-model="addModelData.serviceAccNum"
            placeholder="请输入服务号位号数"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label=" 生成数量"
          class="form-item-padding"
          prop="genCount"
        >
          <Input
            v-model="addModelData.genCount"
            placeholder="请输入 生成数量"
            style="width: 200px"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="onVisibleChange(false)"
        >取消</Button>
        <Button
          type="primary"
          :loading="submitBtnLoading"
          @click="onSubmit"
        >提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
    name: "sever-modal",
    props: ["value", "data"],
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            addModelData: {},
            ruleValidate: {
                firstLetter: [
                    {
                        required: true,
                        message: "开头字母不能为空",
                        trigger: "blur"
                    }
                ],
                genCount: [
                    {
                        required: true,
                        message: "生成数量不能为空",
                        trigger: "blur"
                    }
                ],
                serviceAccNum: [
                    {
                        required: true,
                        message: "服务号位数不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
            this.addModelData = {};
        },
        data(val) {
            if (val) {
                this.addModelData = val;
            } else {
                this.addModelData = {};
            }
        }
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    if (this.addModelData.code) {
                        this.addModelData.updateUserType = 4;
                        this.addModelData.updateBy = JSON.parse(
                            localStorage.getItem("userData")
                        ).code;
                        this.submitBtnLoading = false;
                        this.$emit("on-success",this.addModelData);
                        this.onVisibleChange(false);
                    } else {
                        this.addModelData.creatorUserType = 4;
                        this.addModelData.createBy = JSON.parse(
                            localStorage.getItem("userData")
                        ).code;
                        this.submitBtnLoading = false;
                        this.$emit("on-success",this.addModelData);
                        this.onVisibleChange(false);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
/deep/  .ivu-form-item-content {
    margin-left: 0 !important;
}

.form-item-padding {
    padding: 0px 16px 16px 5px;
}
/deep/ .ivu-form-item-error-tip {
    margin-left: 120px;
}
</style>
