<template>
    <div>
        <Modal v-model="showModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" >重置密码</h3>
            <Form ref="myForm" :model="myForm" :label-width="100" label-position="right"
                  :rules="ruleValidate">
                <FormItem label="新密码" prop="newPassword">
                    <Input v-model="myForm.newPassword" placeholder="请输入新密码，至少6位字符" type="password"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="myForm.rePass" placeholder="请再次输入新密码" type="password"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="onVisibleChange(false)">取消</Button>
                <Button type="primary" :loading="submitBtnLoading" @click="onSubmit">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { PAGE_MODE } from "@/common/constants";
import {resetPassword} from "@/api/user/user";

export default {
    name: "index",
    props:['code','value'],
    data() {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.myForm.newPassword) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            showModal: false,
            submitBtnLoading: false,
            myForm: {
            },
            ruleValidate: {
                newPassword: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {min: 6, message: '请至少输入6个字符', trigger: 'blur'},
                    {max: 32, message: '最多输入32个字符', trigger: 'blur'}
                ],
                rePass: [
                    {required: true, message: '请再次输入新密码', trigger: 'blur'},
                    {validator: valideRePassword, trigger: 'blur'}
                ]
            },
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
            this.onReset()
        },code(){
            this.onReset()
        }
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onReset() {
            this.myForm ={}
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    let res = await resetPassword(formData)
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.$Message.success("修改成功");
                        if (this.mode === PAGE_MODE.ADD) this.onReset();
                        this.$emit('on-finish');
                    }
                    this.$emit("input", false);
                }
            });
        },
    },
};
</script>

<style scoped></style>
