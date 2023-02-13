<template>
    <div class="flexC">
        <page-header title="小程序设置" description="小程序设置" />
        <div class="pageContent flexC form-content" >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="180"
            >
                <FormItem label="小程序名称" prop="name">
                    <Input
                        v-model="myForm.name"
                        placeholder="请输入小程序名称"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="小程序appid" prop="appid">
                    <Input
                        v-model="myForm.appid"
                        placeholder="请输入小程序appid"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="小程序密钥" prop="appSecret">
                    <Input
                        v-model="myForm.appSecret"
                        placeholder="请输入小程序密钥"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="微信支付商户号" prop="payMerchantCode">
                    <Input
                        v-model="myForm.payMerchantCode"
                        placeholder="请输入微信支付商户号"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="微信支付密钥" prop="payMerchantSecret">
                    <Input
                        v-model="myForm.payMerchantSecret"
                        placeholder="请输入微信支付密钥"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <!-- <FormItem
                    label="证书"
                    prop="payCertPath"
                    style="margin-top: 15px"
                >
                    <file-upload>
                        <Button icon="ios-cloud-upload-outline">上传证书文件</Button>
                    </file-upload>
                </FormItem> -->
                <FormItem

                  label="证书"
                  prop="payCertPath"
                  style="margin-top: 15px"
              >
                <file-upload
                    :showProgress="true"
                    @on-upload-success="
                        path => {
                            $set(myForm, 'payCertPath', path);
                        }
                    "
                >
                    <Button icon="ios-cloud-upload-outline">上传证书文件</Button>
                </file-upload>
              </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        @click="onSubmit"
                        :loading="btnLoading"
                        >保存</Button
                    >
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import { getMpWeChatConfig, updateMpWeChatConfig } from "@/api/configset/wxconfig";
import FileUpload from '@/components/upload/fileUpload'

export default {
    name: "index",
    components:{ FileUpload },
    data() {
        return {
            myForm: {},
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "小程序名称不能为空",
                        trigger: "blur",
                    },
                ],
                appid: [
                    {
                        required: true,
                        message: "小程序appid不能为空",
                        trigger: "blur",
                    },
                ],
                appSecret: [
                    {
                        required: true,
                        message: "小程序密钥不能为空",
                        trigger: "blur",
                    },
                ],
                payMerchantCode: [
                    {
                        required: true,
                        message: "微信支付商户号不能为空",
                        trigger: "blur",
                    },
                ],
                payMerchantSecret: [
                    {
                        required: true,
                        message: "微信支付密钥不能为空",
                        trigger: "blur",
                    },
                ],
            },
            btnLoading: false,
        };
    },
    async created() {
        let res = await getMpWeChatConfig();
        this.myForm = res;
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await updateMpWeChatConfig(formData);
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

    .form-item-inp {
        width: 300px;
    }
    .form-content{
        padding-top: 30px;
        padding-left: 30px;
    }

</style>
