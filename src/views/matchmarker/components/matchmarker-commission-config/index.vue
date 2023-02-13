<template>
    <div>
        <Modal
            v-model="showModal"
            title="提成设置"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-ok="onSubmit"
            ok-text="确认"
            @on-visible-change="onVisibleChange"
        >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="200"
            >
                <FormItem
                    label="vip套餐提成比例"
                    prop="commissionConfig.vipCardCommissionPercentage"
                >
                    <InputNumber
                        v-model="
                                    myForm.commissionConfig
                                        .vipCardCommissionPercentage
                                "
                        :min="0"
                        :max="100"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                    ></InputNumber>
                </FormItem>
                <FormItem
                    label="查看联系方式单次购买提成"
                    prop="commissionConfig.contactCommissionAmount"
                >
                    <InputNumber
                        v-model="
                                    myForm.commissionConfig
                                        .contactCommissionAmount
                                "
                        :min="0"
                        :formatter="amountFormat"
                        :parser="amountParser"
                    ></InputNumber>
                </FormItem>
                <FormItem
                    label="线下牵线单次提成"
                    prop="commissionConfig.offlinePullCommissionAmount"
                >
                    <InputNumber
                        v-model="
                                    myForm.commissionConfig
                                        .offlinePullCommissionAmount
                                "
                        :min="0"
                        :formatter="amountFormat"
                        :parser="amountParser"
                    ></InputNumber>
                </FormItem>
                <FormItem
                    label="实名认证提成"
                    prop="commissionConfig.identificationCommissionAmount"
                >
                    <InputNumber
                        v-model="
                                    myForm.commissionConfig
                                        .identificationCommissionAmount
                                "
                        :min="0"
                        :formatter="amountFormat"
                        :parser="amountParser"
                    ></InputNumber>
                </FormItem>
                <FormItem
                    label="参加活动提成比例"
                    prop="commissionConfig.activityCommissionPercentage"
                >
                    <InputNumber
                        v-model="
                                    myForm.commissionConfig
                                        .activityCommissionPercentage
                                "
                        :min="0"
                        :max="100"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                    ></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    :loading="submitBtnLoading"
                    @click="onSubmit"
                    >提交</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import { editMatchMarker } from "@/api/matchmarker/matchmarker";
import { amountFormat, amountParser } from "@/common/utils/viewui-utils";

export default {
    name: "mactchmarker-commission-config",
    props: ["value", "matchmarker"],
    data() {
        return {
            amountFormat:amountFormat,
            amountParser:amountParser,
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                commissionConfig: {},
            },
            ruleValidate: {
                "commissionConfig.vipCardCommissionPercentage": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置vip套餐提成",
                        trigger: "blur",
                    },
                ],
                "commissionConfig.contactCommissionAmount": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置查看联系人提成",
                        trigger: "blur",
                    },
                ],
                "commissionConfig.offlinePullCommissionAmount": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置线下牵线提成",
                        trigger: "blur",
                    },
                ],
                "commissionConfig.identificationCommissionAmount": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置实名认证提成",
                        trigger: "blur",
                    },
                ],
                "commissionConfig.activityCommissionPercentage": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置参加活动提成",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
        matchmarker(cur){
            if (cur){
                this.myForm.commissionConfig=cur.commissionConfig?cur.commissionConfig:{}
            }
        }
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    let fd = this.copyJson(this.myForm);
                    fd.code = this.matchmarker.code;
                    fd.commissionConfig.vipCardCommissionType = 1;
                    fd.commissionConfig.contactCommissionType = 2;
                    fd.commissionConfig.offlinePullCommissionType = 2;
                    fd.commissionConfig.identificationCommissionAmount = 2;
                    fd.commissionConfig.activityCommissionType = 1;
                    fd.commissionConfig.topCommissionType = 1;
                    let res = await editMatchMarker(fd);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.onVisibleChange(false);
                        this.$Message.success('操作成功')
                        this.$emit('on-success')
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
