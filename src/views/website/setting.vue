<template>
    <div class="flexC">
        <page-header title="网站配置" description="网站配置" />
        <div class="pageContent flexC form-content" >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="180"
                class="form"
            >
                <FormItem
                    label="网站LOGO"
                    prop="logo"
                    style="margin-top: 15px"
                >
                    <image-upload
                        @on-upload-success="
                            url => {
                                $set(myForm, 'logo', url);
                            }
                        "
                    >
                        <div
                            class="upload-img-tem"
                            style="border: 1px dashed"
                        >
                            <img
                                :src="myForm.logo"
                                v-if="myForm.logo"
                            />
                            <span v-if="!myForm.logo">+</span>
                        </div>
                    </image-upload>
                </FormItem>
                <FormItem label="网站名称：" prop="name">
                    <Input
                        v-model="myForm.name"
                        placeholder="请输入网站名称"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="标题：" prop="title">
                    <Input
                        v-model="myForm.title"
                        placeholder="请输入网站标题"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="关键词：" prop="keywords">
                    <Input
                        v-model="myForm.keywords"
                        placeholder="请输入网站关键词"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="描述：" prop="descrption">
                    <Input
                        v-model="myForm.descrption"
                        placeholder="请输入网站描述"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem
                    label="公众号二维码："
                    prop="gzhCode"
                    style="margin-top: 15px"
                >
                    <image-upload
                        @on-upload-success="
                            url => {
                                $set(myForm, 'gzhCode', url);
                            }
                        "
                    >
                        <div
                            class="upload-img-tem"
                            style="border: 1px dashed"
                        >
                            <img
                                :src="myForm.gzhCode"
                                v-if="myForm.gzhCode"
                            />
                            <span v-if="!myForm.gzhCode">+</span>
                        </div>
                    </image-upload>
                </FormItem>
                <FormItem
                    label="小程序二维码："
                    prop="xcxCode"
                    style="margin-top: 15px"
                >
                    <image-upload
                        @on-upload-success="
                            url => {
                                $set(myForm, 'xcxCode', url);
                            }
                        "
                    >
                        <div
                            class="upload-img-tem"
                            style="border: 1px dashed"
                        >
                            <img
                                :src="myForm.xcxCode"
                                v-if="myForm.xcxCode"
                            />
                            <span v-if="!myForm.xcxCode">+</span>
                        </div>
                    </image-upload>
                </FormItem>
                <FormItem label="底部企业名称：" prop="companyName">
                    <Input
                        v-model="myForm.companyName"
                        placeholder="请输入底部企业名称"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="联系电话：" prop="mobile">
                    <Input
                        v-model="myForm.mobile"
                        placeholder="请输入联系电话"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="联系人：" prop="people">
                    <Input
                        v-model="myForm.people"
                        placeholder="请输入联系人"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="客户qq：" prop="qq">
                    <Input
                        v-model="myForm.qq"
                        placeholder="请输入客户qq"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem
                    label="微信二维码："
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
                <Alert class="info" type="info">提示：一行结束按回车换行，最多显示5行</Alert>
                <FormItem label="联系一标题：" prop="contactTitle1">
                    <Input
                        v-model="myForm.contactTitle1"
                        placeholder="请输入标题"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="联系一列表" prop="contactList1">
                    <Input
                        type="textarea"
                        v-model="myForm.contactList1"
                        placeholder="请输入列表"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <Alert class="info" type="info">提示：一行结束按回车换行，最多显示5行</Alert>
                
                <FormItem label="联系二标题：" prop="contactTitle1">
                    <Input
                        v-model="myForm.contactTitle1"
                        placeholder="请输入标题"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="联系二列表" prop="contactList1">
                    <Input
                        type="textarea"
                        v-model="myForm.contactList1"
                        placeholder="请输入列表"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="备案信息：" prop="beian">
                    <Input
                        v-model="myForm.beian"
                        placeholder="请输入备案信息"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="脚本代码：" prop="html">
                    <Input
                        type="textarea"
                        v-model="myForm.html"
                        placeholder="请输入脚本代码"
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
import { getWeChatConfig, updateWeChatConfig } from "@/api/configset/wxconfig";
import ImageUpload from "@/components/upload/fileUpload";

export default {
    name: "index",
    components:{ImageUpload},
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
