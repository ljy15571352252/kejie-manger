<template>
    <div>
        <Modal
            v-model="showModal"
            title="编辑短信模板"
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
                <FormItem label="模板Code：" prop="aliyunTemplate">
                    <Input
                        v-model="myForm.aliyunTemplate"
                        placeholder="请输入阿里云模板Code"
                    ></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import { updateSmsTem } from "@/api/configset/smsconfig";

export default {
    name: "index",
    props: ["value", "obj"],
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                aliyunTemplate: "",
            },
            ruleValidate: {
                checkState: [
                    {
                        required: true,
                        message: "请输入阿里云模板Code",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    watch: {
        obj() {
            this.onReset();
        },
        value(cur) {
            this.showModal = cur;
        },
    },
    methods: {
        onReset() {
            this.myForm = {
                aliyunTemplate:this.obj.aliyunTemplate,
                code:this.obj.code
            };
        },
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
                    let res = await updateSmsTem(fd);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.$Message.success("编辑成功");
                        this.onVisibleChange(false);
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
