<template>
    <div class="flexC">
        <page-header title="分享配置" description="分享配置" />
        <div class="pageContent flexC form-content">
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="130"
                class="form"
            >
                <FormItem prop="imgUrl" label="分享图片封面">
                    <image-upload
                        @on-upload-success="
                            url => {
                                $set(myForm, 'imgUrl', url);
                            }
                        "
                    >
                        <div class="upload-img-tem" style="border: 1px dashed">
                            <img :src="myForm.imgUrl" v-if="myForm.imgUrl" />
                            <span v-if="!myForm.imgUrl">+</span>
                        </div>
                    </image-upload>
                </FormItem>
                <FormItem label="分享标题" prop="title">
                    <Input
                        v-model="myForm.title"
                        placeholder="请输入分享标题"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="分享内容" prop="content">
                    <Input
                        v-model="myForm.content"
                        placeholder="请输入分享内容"
                        class="form-item-inp"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 5 }"
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
import { getShareConfig, updateShareConfig } from "@/api/configset/configset";
import ImageUpload from "@/components/upload/fileUpload";
export default {
    name: "index",
    components: { ImageUpload },
    data() {
        return {
            myForm: {},
            ruleValidate: {
                title: [
                    {
                        required: true,
                        message: "分享标题不能为空",
                        trigger: "blur",
                    },
                ],
                content: [
                    {
                        required: true,
                        message: "分享内容不能为空",
                        trigger: "blur",
                    },
                ],
            },
            btnLoading: false,
        };
    },
    async created() {
        this.myForm = await getShareConfig();
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await updateShareConfig(formData);
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
        height: auto;
        line-height: normal;
        img{
            display: block;
            height: auto;
        }
    }

    .form-item-inp {
        width: 300px;
    }
    .form-content{
        padding-top: 30px;
        padding-left: 30px;
    }
.form{
    .info{
        width:430px;
    }
    /deep/.ivu-form-item{
        .ivu-form-item-label{
            text-align: left;
        }
        .ivu-form-item-content{
        }
    }
}
</style>
