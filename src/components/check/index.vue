<template>
    <div>
        <Modal
            v-model="showModal"
            :title="title"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-ok="onSubmit"
            ok-text="提交"
            @on-visible-change="onVisibleChange"
        >
            <Form :model="myForm" ref="myForm" :rules="ruleValidate" :label-width="120">
                <FormItem label="审核：" prop="checkState" required>
                    <RadioGroup v-model="myForm.checkState">
                        <Radio label="2">通过</Radio>
                        <Radio label="3">驳回</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="备注：" prop="checkResult">
                    <Input
                        v-model="myForm.checkResult"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 5 }"
                        placeholder="审核信息"
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
export default {
    name: "index",
    props: ["value", "title"],
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                checkState: "",
                checkResult: null,
            },
            ruleValidate: {
                checkState: [
                    { required: true, message: "请审核", trigger: "blur" },
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
        finish() {
            this.submitBtnLoading = false;
            this.$emit("input", false);
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            this.$refs["myForm"].validate(valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    this.$emit("on-submit", this.copyJson(this.myForm));
                }
            });
        },
    },
};
</script>

<style scoped></style>
