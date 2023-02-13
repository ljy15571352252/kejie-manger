<template>
    <div class="flexC">
        <page-header title="会员提成设置" description="会员提成设置" />
        <div class="pageContent flexC form-content">
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="180"
            >

                <FormItem label="推荐会员获得的金额" prop="levelOneRcAmount">
                  <InputNumber
                      style="width: 240px"
                      v-model="myForm.levelOneRcAmount"
                      :formatter="amountFormat"
                      :parser="amountParser"
                  ></InputNumber>
                </FormItem>

                <FormItem>
                    <Button
                        type="primary"
                        @click="onSubmit"
                        :loading="btnLoading"
                        >提交</Button
                    >
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import {
  getMemberCommissionConfig,
  updateMemberCommissionConfig,
} from "@/api/configset/configset";
import ImageUpload from "@/components/upload/fileUpload";
import {amountFormat, amountParser} from "@/common/utils/viewui-utils";

export default {
    name: "index",
    components: { ImageUpload },
    data() {
        return {
          amountFormat:amountFormat,
          amountParser:amountParser,
            myForm: {},
            ruleValidate: {
              levelOneRcAmount: [
                    {
                        required: true,
                      type:'number',
                        message: "请输入推荐会员获得的提成",
                        trigger: "blur",
                    },
                ],

            },
            btnLoading: false,
        };
    },
    async created() {
        this.myForm = await getMemberCommissionConfig();
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await updateMemberCommissionConfig(formData);
                    this.btnLoading = false;
                    if (res ) {
                        this.$Message.success("提交成功");
                    }
                }
            });
        },
    },
    watch: {},
    filters: {},
};
</script>

<style scoped lang="less">
    .upload-img-tem {
        line-height: 175px;
    }

    .form-item-inp {
        width: 300px;
    }
    .form-content{
        padding-top: 30px;
        padding-left: 30px;
    }

</style>
