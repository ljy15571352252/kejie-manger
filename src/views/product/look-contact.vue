<template>
    <div class="flexC">
        <page-header title="查看联系人价格" description="查看联系人价格" />
        <div class="pageContent flexC form-content" >
            <Form
                    :model="myForm"
                    ref="myForm"
                    :rules="ruleValidate"
                    :label-width="180"
            >
                <FormItem label="价格" prop="price">
                    <InputNumber
                            style="width: 240px"
                            v-model="myForm.price"
                    ></InputNumber>
                </FormItem>
                <FormItem label="描述" prop="description">
                    <Input
                            v-model="myForm.description"
                            style="width: 300px"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 5 }"
                            placeholder="请输入描述"
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

    import {getLookContactConfig, updateLookContactConfig} from "@/api/product/lookcontact";

    export default {
        name: "index",
        data() {
            return {
                myForm: {},
                ruleValidate: {
                    price: [
                        {
                            required: true,
                            type:'number',
                            message: "请设置价格",
                            trigger: "blur",
                        },
                    ],
                },
                btnLoading: false,
            };
        },
        async created() {
            let res = await getLookContactConfig();
            this.myForm = res;
        },
        mounted() {},
        methods: {
            async onSubmit() {
                this.$refs["myForm"].validate(async valid => {
                    if (valid) {
                        this.btnLoading = true;
                        const formData = this.copyJson(this.myForm);
                        let res = await updateLookContactConfig(formData);
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
    }
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
