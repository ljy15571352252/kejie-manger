<template>
    <div>
        <Modal
            v-model="showModal"
            title="角色"
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
                <FormItem label="角色名称：" prop="name">
                    <Input
                        v-model="myForm.name"
                        placeholder="请输入角色名称"
                        style="width: 240px"
                    ></Input>
                </FormItem>
                <FormItem label="描述：" prop="remark">
                    <Input
                            v-model="myForm.remark"
                            placeholder="请输入描述"
                            style="width: 240px"
                    ></Input>
                </FormItem>
                <FormItem label="排序：" prop="sort">
                    <InputNumber v-model="myForm.sort"></InputNumber>
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
import { PAGE_MODE } from "@/common/constants";
import {addRole, editRole} from "@/api/user/role";

export default {
    name: "index",
    props: {
        value: {
            type: Boolean,
        },
        roleObj: {
            type: Object,
        },
        mode: {
            type: Number,
        },
    },
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            myForm: {
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "请输入角色名称",
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
        roleObj() {
           this.onReset();
        },
        mode() {
            this.onReset();
        },
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onReset() {
            this.myForm =
                this.mode === PAGE_MODE.ADD ? {  } : this.roleObj;
        },
        onSubmit() {
            const modeAction = new Map([
                [
                    PAGE_MODE.EDIT,
                    {
                        func: editRole,
                        emit: "on-edit-finish",
                        successTxt: "修改成功",
                    },
                ],
                [
                    PAGE_MODE.ADD,
                    {
                        func: addRole,
                        emit: "on-add-finish",
                        successTxt: "添加成功",
                    },
                ],
            ]);
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    const targetAction = modeAction.get(this.mode);
                    this.submitBtnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await targetAction.func(formData);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.$Message.success(targetAction.successTxt);
                        if (this.mode === PAGE_MODE.ADD) this.onReset();
                        this.$emit(targetAction.emit);
                        this.$emit("input", false);
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
