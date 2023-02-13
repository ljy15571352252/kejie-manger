<template>
    <div class="flexC">
        <page-header title="快递100配置" description="快递100配置" />
        <div class="pageContent flexC form-content" >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="180"
            >
                <FormItem label="customer" prop="customer">
                    <Input
                        v-model="myForm.customer"
                        placeholder="请输入customer"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="authKey" prop="authKey">
                    <Input
                        v-model="myForm.authKey"
                        placeholder="请输入authKey"
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
import { getKuaidiConfig, updateKuaidiConfig } from "@/api/configset/configset";
// import FileUpload from '@/components/upload/fileUpload'

export default {
    name: "index",
    data() {
        return {
            myForm: {
                customer:null,
                authKey:''
            },
            ruleValidate: {
                customer: [
                    {
                        required: true,
                        message: "customer不能为空",
                        trigger: "blur",
                    },
                ],
                authKey: [
                    {
                        required: true,
                        message: "authKey不能为空",
                        trigger: "blur",
                    },
                ]
            },
            btnLoading: false,
        };
    },
    async created() {
        let res = await getKuaidiConfig();
        this.myForm = res || {};
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await updateKuaidiConfig(formData);
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
