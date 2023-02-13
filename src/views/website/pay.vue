<template>
    <div class="flexC">
        <page-header title="支付宝设置" description="支付宝设置" />
        <div class="pageContent flexC form-content" >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="180"
                class="form"
            >
                <FormItem label="APPID：" prop="appId">
                    <Input
                        v-model="myForm.appid"
                        placeholder="请输入APPID"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="APPSECRET：" prop="appSecret">
                    <Input
                        v-model="myForm.appsecret"
                        placeholder="请输入APPSECRET"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="商户号：" prop="shopId">
                    <Input
                        v-model="myForm.shopId"
                        placeholder="请输入商户号"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="密钥：" prop="secret">
                    <Input
                        v-model="myForm.secret"
                        placeholder="请输入密钥"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem
                    label="证书"
                    prop="certificate"
                    style="margin-top: 15px"
                >
                    <Upload action="" @on-success="uploadSuccess">
                        <Button icon="ios-cloud-upload-outline">上传证书文件</Button>
                    </Upload>
                </FormItem>
                <FormItem label="相关说明：" prop="explain">
                    <Input
                        v-model="myForm.explain"
                        placeholder="请输入相关说明"
                        class="form-item-inp"
                    ></Input>
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
import { getWeChatConfig, updateWeChatConfig } from "@/api/configset/wxconfig";

export default {
    name: "index",
    data() {
        return {
            myForm: {},
            ruleValidate: {
            },
            btnLoading: false,
        };
    },
    async created() {
        let res = await getWeChatConfig();
        this.myForm = res;
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await updateWeChatConfig(formData);
                    this.btnLoading = false;
                    if (res) {
                        this.$Message.success("提交成功");
                    }
                }
            });
        },
        uploadSuccess(response, file, fileList){
            console.log(response, file, fileList)
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
.upload-img-tem{
    width: 80px;
    height: 80px;
    line-height: 80px;
}

.form{
    .info{
        width:430px;
    }
    /deep/.ivu-form-item{
        .ivu-form-item-label{
            width:130px !important;
            text-align: left;
        }
        .ivu-form-item-content{
            margin-left: 130px !important;
        }
    }
}
</style>
