<template>
    <div>
        <Alert type="warning">
            <p>
                可通过<a href="https://www.aliyun.com" target="_blank">阿里云</a
                >购买短信套餐，也可点此<a @click="showPriceChooseModal = true"
                    >购买系统短信</a
                >
            </p>
            <p>
                在阿里云购买短信后，根据下方模板名称在阿里云后台添加短信模板，并把相应的模板code录入表格，否则无法发送该短信；
            </p>
            <p>
                购买系统短信，签名默认是【嫁得好】不可更改，如需去掉签名，可在阿里云购买短信服务，配置自己的签名。
                <a @click="showBuyHistoryModal = true">购买记录</a>
            </p>
        </Alert>
        <Form
            :model="myForm"
            ref="myForm"
            :rules="ruleValidate"
            :label-width="180"
        >
            <FormItem label="短信类型" prop="type">
                <RadioGroup v-model="myForm.type">
                    <Radio
                        :label="i.value"
                        v-for="(i, index) in smsConfigOptions"
                        :key="index"
                        >{{ i.label }}</Radio
                    >
                </RadioGroup>
                <span class="gray-color margin-left-10"
                    >剩余短信数：{{ myForm.sysSmsCount  || 0}}</span
                >
            </FormItem>
            <template v-show="myForm.type === 2">
                <FormItem label="短信accessKey" prop="accessKey">
                    <Input
                        v-model="myForm.accessKey"
                        placeholder="请输入短信accessKey"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="短信accessKeySecret" prop="accessKeySecret">
                    <Input
                        v-model="myForm.accessKeySecret"
                        placeholder="请输入短信accessKeySecret"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
                <FormItem label="模板签名" prop="smsTemSign">
                    <Input
                        v-model="myForm.smsTemSign"
                        placeholder="请输入模板签名编号"
                        class="form-item-inp"
                    ></Input>
                </FormItem>
            </template>
            <FormItem>
                <Button type="primary" @click="onSubmit" :loading="btnLoading"
                    >提交</Button
                >
            </FormItem>
        </Form>
        <buy-history-modal v-model="showBuyHistoryModal" />
        <sms-price-choose v-model="showPriceChooseModal" />
    </div>
</template>

<script>
import { smsConfigOptions } from "@/common/utils/viewui-utils";
import {  updateSmsConfig } from "@/api/configset/smsconfig";
import BuyHistoryModal from "./sms-buy-history";
import SmsPriceChoose from "./sms-price-choose";
export default {
    name: "sms-config",
    props:['sms-config-obj'],
    components: { BuyHistoryModal, SmsPriceChoose },
    data() {
        return {
            showBuyHistoryModal: false,
            showPriceChooseModal: false,
            smsConfigOptions: smsConfigOptions(),
            myForm: {},
            ruleValidate: {
                type: [
                    {
                        required: true,
                        type: "number",
                        message: "请选择短信类型",
                        trigger: "blur",
                    },
                ],
                accessKey: [
                    {
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (
                                this.myForm.type === 2 &&
                                this.isBlank(this.myForm.accessKey)
                            )
                                callback(new Error("accessKey不能为空"));
                            callback();
                        },
                    },
                ],
                accessKeySecret: [
                    {
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (
                                this.myForm.type === 2 &&
                                this.isBlank(this.myForm.accessKeySecret)
                            )
                                callback(new Error("accessKeySecret不能为空"));
                            callback();
                        },
                    },
                ],
                smsTemSign: [
                    {
                        trigger: "blur",
                        validator: (rule, value, callback) => {
                            if (
                                this.myForm.type === 2 &&
                                this.isBlank(this.myForm.smsTemSign)
                            )
                                callback(new Error("模板签名不能为空"));
                            callback();
                        },
                    },
                ],
            },
            btnLoading: false,
        };
    },
    watch:{
        smsConfigObj(cur){
            this.myForm=this.copyJson(cur)
        }
    },
    mounted() {},
    methods: {
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await updateSmsConfig(formData);
                    this.btnLoading = false;
                    if (res ) {
                        this.$Message.success("提交成功");
                        this.$emit('on-update',formData)
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
