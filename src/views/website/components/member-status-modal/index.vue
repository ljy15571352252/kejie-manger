<template>
    <div>
        <Modal
            v-model="showModal"
            title="封号处理"
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
                :label-width="120"
            >
                <!--                <FormItem label="状态：" prop="status" required>
                    <RadioGroup v-model="myForm.status">
                        <Radio label="1" >正常</Radio>
                        <Radio label="3" >封号</Radio>
                    </RadioGroup>
                </FormItem>-->
                <FormItem label="封号天数：" prop="disableDays">
                    <InputNumber
                        v-model="myForm.disableDays"
                        placeholder="封号天数"
                    ></InputNumber>
                </FormItem>
                <FormItem label="原因：" prop="disableReason">
                    <Input
                        v-model="myForm.disableReason"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 5 }"
                        placeholder="封号原因"
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
import { updateMemberStatus } from "@/api/member/member";
import { delTopCard } from "@/api/product/topcard";

export default {
    name: "index",
    props: ["value", "code"],
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                disableDays: null,
                disableReason: null,
            },
            ruleValidate: {
                disableDays: [
                    {
                        required: true,
                        message: "请输入封号天数",
                        type: "number",
                        trigger: "blur",
                    },
                ],
                disableReason: [
                    {
                        required: true,
                        message: "请输入封号原因",
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
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        recoveryAcc(code,cb) {
            this.$Modal.confirm({
                title: "解封账号",
                content: "<p>您确定要解封该账户吗？</p>",
                onOk: async () => {
                    let res = await updateMemberStatus({
                      code,
                        status: 1,
                    });
                    if (res ) {
                        this.$Message.success("解封成功");
                        if (cb) cb();
                    }
                },
                onCancel: () => {},
            });
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    let fd = this.copyJson(this.myForm);
                    fd.status = 3;
                    fd.code = this.code;
                    let res = await updateMemberStatus(fd);
                    this.submitBtnLoading = false;
                    if (res) {
                        this.onVisibleChange(false);
                        this.$emit('on-success')
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
