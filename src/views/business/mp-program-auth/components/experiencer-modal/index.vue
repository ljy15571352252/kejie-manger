<template>
    <div>
        <Modal
            v-model="showModal"
            :title="bind ? '绑定体验者' : '解绑体验者'"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-ok="onSubmit"
            ok-text="提交"
            @on-visible-change="onVisibleChange"
        >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="120"
            >
                <FormItem label="微信号：" prop="wechatid">
                    <Input
                        v-model="myForm.wechatid"
                        placeholder="请输入要微信号"
                    ></Input>
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
import {
    bindMpProgramExperiencer,
    unbindMpProgramExperiencer,
} from "@/api/configset/wxconfig";

export default {
    name: "index",
    props: ["value", "appid", "bind"],
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                wechatid: "",
            },
            ruleValidate: {
                wechatid: [
                    {
                        required: true,
                        message: "请输入微信号",
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
    },
    methods: {
        onReset() {
            this.myForm = {};
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            const modeAction = new Map([
                [
                    true,
                    {
                        func: bindMpProgramExperiencer,
                        successTxt: "绑定成功",
                    },
                ],
                [
                    false,
                    {
                        func: unbindMpProgramExperiencer,
                        successTxt: "解绑成功",
                    },
                ],
            ]);
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    const targetAction = modeAction.get(this.bind);
                    const formData = this.copyJson(this.myForm);
                    this.submitBtnLoading = true;
                    formData.appid = this.appid;
                    let res = await targetAction.func(formData);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.$Message.success(targetAction.successTxt);
                        this.onReset();
                        this.$emit("on-success");
                        this.onVisibleChange(false);
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
