<template>
  <div class="flexC">
    <page-header
      title="单次费用设置"
      description="单次费用设置"
      no-margin
    />
    <div class="pageContent flexC form-content">
      <Form
        :model="myForm"
        ref="myForm"
        :label-width="180"
      >
        <FormItem label="单次交换电话费用">
          <InputNumber
            class="form-item-inp"
            v-model="myForm.exchangePhoneCost"
            :formatter="amountFormat"
            :parser="amountParser"
          ></InputNumber>
        </FormItem>
        <FormItem label="单次交换微信费用">
          <InputNumber
            class="form-item-inp"
            v-model="myForm.exchangeWxCost"
            :formatter="amountFormat"
            :parser="amountParser"
          ></InputNumber>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="onSubmit"
            :loading="btnLoading"
          >提交</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { ChargeConfigDetail, saveChargeConfig } from "@/api/finance/finance";
import { amountFormat, amountParser } from "@/common/utils/viewui-utils";
export default {
    name: "index",
    data() {
        return {
            amountFormat: amountFormat,
            amountParser: amountParser,
            myForm: {
               
            },
            ruleValidate: {
                exchangePhoneCost: [
                    {
                        required: true,
                        message: "请填写单次交换电话费用",
                        trigger: "blur"
                    }
                ],
                exchangeWxCost: [
                    {
                        required: true,
                        message: "请填写单次交换微信费用",
                        trigger: "blur"
                    }
                ]
            },
            btnLoading: false
        };
    },
    async created() {
        let res = await ChargeConfigDetail();
        if (res.conf) {
            this.myForm = JSON.parse(res.conf);
        } else {
            this.myForm = {
                exchangePhoneCost:1,
                exchangeWxCost:1
            }
        }
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    let stringForm = JSON.stringify(this.myForm);
                    let res = await saveChargeConfig({
                        conf:stringForm
                    });
                    this.btnLoading = false;
                    if (res == true) {
                        this.$Message.success("提交成功");
                    }
                }
            });
        }
    },
    watch: {},
    filters: {}
};
</script>

<style scoped lang="less">
.upload-img-tem {
    width: 120px;
    height: 120px;
    line-height: 120px;
}
.form-item-inp {
    width: 300px;
}
.form-content {
    padding-top: 30px;
    padding-left: 30px;
}
</style>
