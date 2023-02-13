<template>
    <div class="flexC">
        <page-header title="公众号设置" description="公众号设置" />
        <div class="pageContent flexC form-content" >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="180"
                class="form"
            >

                <FormItem label="公众号名称：" prop="name">
                    <Input
                        v-model="myForm.name"
                        placeholder="请输入公众号名称"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="原始ID：" prop="id">
                    <Input
                        v-model="myForm.id"
                        placeholder="请输入原始ID"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="级别：" prop="levels">
                    <Input
                        v-model="myForm.keywords"
                        placeholder="请输入级别"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="AppID：" prop="appid">
                    <Input
                        v-model="myForm.appid"
                        placeholder="请输入AppID："
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="Appsecret：" prop="appSecret">
                    <Input
                        v-model="myForm.appSecret"
                        placeholder="请输入Appsecret"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="商户编号：" prop="payMerchantCode">
                    <Input
                        v-model="myForm.payMerchantCode"
                        placeholder="请输入商户的支付编号"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="商户密钥：" prop="payMerchantSecret">
                    <Input
                        v-model="myForm.payMerchantSecret"
                        placeholder="请输入商户的支付密钥"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="验证码场景：" prop="qq">
                    <Button>获取二维码</Button>
                </FormItem>
                <Alert class="info" type="info">图片格式为 JPG/JPEG/PNG/GIF 大小在2MB内</Alert>
                <FormItem
                    label="二维码："
                    prop="wechatCode"
                    style="margin-top: 15px"
                >
                    <image-upload
                        @on-upload-success="
                            url => {
                                $set(myForm, 'wechatCode', url);
                            }
                        "
                    >
                        <div
                            class="upload-img-tem"
                            style="border: 1px dashed"
                        >
                            <img
                                :src="myForm.wechatCode"
                                v-if="myForm.wechatCode"
                            />
                            <span v-if="!myForm.wechatCode">+</span>
                        </div>
                    </image-upload>
                </FormItem>
                <FormItem label="体验账号：" prop="contactList1">
                    <Input
                        v-model="myForm.contactList1"
                        placeholder="请输入体验账号："
                        class="form-item-inp"
                    ></Input>
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
import { getWxPublicConfig, updateWxPublicConfig } from "@/api/configset/wxconfig";
import ImageUpload from '@/components/upload/fileUpload'

export default {
    name: "index",
    components:{ ImageUpload },
    data() {
        return {
            myForm: {},
            ruleValidate: {
            },
            btnLoading: false,
        };
    },
    async created() {
        let res = await getWxPublicConfig();
        this.myForm = res;
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await updateWxPublicConfig(formData);
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
