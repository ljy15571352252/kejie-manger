<template>
    <div>
        <Modal
            v-model="showModal"
            :title="title"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-visible-change="onVisibleChange"
        >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="120"
            >
                <FormItem label="域名：" prop="domain">
                    <Input
                        v-model="myForm.domain"
                        placeholder="请输入域名"
                    ></Input>
                </FormItem>
                <FormItem label="类型：" prop="type">
                    <RadioGroup v-model="myForm.type">
                        <Radio :label="1">商户后台</Radio>
                        <Radio :label="2">加盟商后台</Radio>
                        <Radio :label="3">红娘</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="onVisibleChange(false)"
                    >取消</Button
                >
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
import { addDomain, editDomain } from "@/api/store/store-domain";

export default {
    name: "domain-modal",
    props: ["value", "domainObj", "mode"],
    data() {
        return {
            title: "新增域名",
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                type: null,
                domain: null,
            },
            ruleValidate: {
                domain: [
                    { required: true, message: "请输入域名", trigger: "blur" },
                ],
                type: [
                    {
                        required: true,
                        message: "请选择类型",
                        trigger: "blur",
                        type: "number",
                    },
                ],
            },
        };
    },
    watch: {
        mode() {
            this.onReset();
        },
        domainObj() {
            this.onReset();
        },
        value(cur) {
            this.showModal = cur;
        },
    },
    methods: {
        onReset() {
            this.myForm = {};
            if (this.mode !== PAGE_MODE.ADD) {
                this.myForm = this.domainObj;
                this.title = "编辑域名";
            } else {
                this.title = "新增域名";
            }
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    const modeAction = new Map([
                        [
                            PAGE_MODE.EDIT,
                            {
                                func: editDomain,
                                emit: "on-edit-finish",
                                successTxt: "修改成功",
                            },
                        ],
                        [
                            PAGE_MODE.ADD,
                            {
                                func: addDomain,
                                emit: "on-add-finish",
                                successTxt: "添加成功",
                            },
                        ],
                    ]);
                    this.submitBtnLoading = true;
                    const targetAction = modeAction.get(this.mode);
                    const formData = this.copyJson(this.myForm);
                    let res = await targetAction.func(formData);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.$Message.success(targetAction.successTxt);
                        if (this.mode === PAGE_MODE.ADD) this.onReset();
                        this.$emit(targetAction.emit);
                        this.onVisibleChange(false);
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
