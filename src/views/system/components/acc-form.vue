<template>
    <div>
        <Form
            :model="myForm"
            ref="myForm"
            :rules="ruleValidate"
            class="member-detail-form"
        >
            <Row>
                <Col
                    :span="mode !== PAGE_MODE.ADD ? 10 : 24"
                    style="text-align: center"
                >
                    <FormItem prop="headUrl">
                        <image-upload
                            @on-upload-success="
                                url => {
                                    $set(myForm, 'headUrl', url);
                                }
                            "
                        >
                            <div
                                class="upload-img-tem"
                                style="border: 1px dashed"
                            >
                                <img
                                    :src="myForm.headUrl"
                                    v-if="myForm.headUrl"
                                />
                                <span v-if="!myForm.headUrl">+</span>
                            </div>
                        </image-upload>
                    </FormItem>
                </Col>
                <Col span="14" class="top-info" v-if="mode !== PAGE_MODE.ADD">
                    <div>用户 ID：{{ myForm.code }}</div>
                    <div>创建时间：{{ myForm.createTime }}</div>
                </Col>
            </Row>
            <div>
                <Divider orientation="left">基本信息</Divider>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="昵称" prop="nickName">
                            <Input
                                v-model="myForm.nickName"
                                placeholder="请输入昵称"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="手机号码" prop="mobile">
                            <Input
                                v-model="myForm.mobile"
                                placeholder="请输入加盟商手机号码"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="角色" prop="roles.roleCodes">
                            <Select v-model="myForm.roles.roleCodes" multiple>
                                <Option
                                        v-for="item in roleList"
                                        :value="item.value"
                                        :key="item.value"
                                >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem
                                label="状态"
                                prop="status"
                        >
                            <Select
                                    v-model="myForm.status"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                                    style="width: 240px"
                            >
                                <Option
                                        v-for="item in accountStatusOptions"
                                        :value="item.value"
                                        :key="item.value"
                                >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </div>

            <div v-if="mode === PAGE_MODE.ADD">
                <Divider orientation="left">账号信息</Divider>
                <FormItem label="用户名" prop="acc.username"  class="form-item-padding">
                    <Input
                            v-model="myForm.acc.username"
                            placeholder="请输入登录用户名"
                    ></Input>
                </FormItem>
                <FormItem label="密码" prop="acc.password"  class="form-item-padding">
                    <Input
                            v-model="myForm.acc.password"
                            type="password"
                            placeholder="请输入登录密码"
                    ></Input>
                </FormItem>
                <FormItem label="确认密码" prop="acc.rePass"  class="form-item-padding">
                    <Input
                            v-model="myForm.acc.rePass"
                            type="password"
                            placeholder="请确认密码"
                    ></Input>
                </FormItem>
            </div>

            <div class="drawer-footer" v-show="mode !== PAGE_MODE.DETAIL">
                <Button type="primary" @click="onSubmit" :loading="btnLoading"
                    >提交</Button
                >
            </div>
        </Form>
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
    </div>
</template>

<script>
import ImageUpload from "@/components/upload/ImageUpload";
import { accountStatusOptions } from "@/common/utils/viewui-utils";
import { PAGE_MODE } from "@/common/constants";
import { addUser, editUser, getUserDetail } from "@/api/user/user";
import { getAllRoles } from "@/api/user/role";

export default {
    nickName: "acc-form",
    props: ["code", "mode"],
    components: { ImageUpload },
    data() {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.myForm.password) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            roleList: [],
            accountStatusOptions: accountStatusOptions(),
            preview: false,
            previewUrl: null,
            span: 12,
            myForm: {
                acc: {},
                roles: {},
            },
            ruleValidate: {
                status: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择状态",
                        trigger: "change",
                    },
                ],
                "acc.username": [
                    {
                        required: true,
                        message: "请输入用户登录账号",
                        trigger: "blur",
                    },
                ],
                "acc.password": [
                    {
                        required: true,
                        message: "请输入用户登录密码",
                        trigger: "blur",
                    },
                ],
                "acc.rePass":[
                    {required: true, message: '请确认密码', trigger: 'blur'},
                    {validator: valideRePassword, trigger: 'blur'}
                ]
            },
            btnLoading: false,
        };
    },
    watch: {
        code() {
            this.onReset();
            if (this.mode !== PAGE_MODE.ADD) this.fillData();
        },
        mode(cur) {
            this.onReset();
            if (cur !== PAGE_MODE.ADD) this.fillData();
        },
    },
    methods: {
        onReset() {
            this.myForm = { acc: {}, roles: {} };
        },
        async onSubmit() {
            const modeAction = new Map([
                [
                    PAGE_MODE.EDIT,
                    {
                        func: editUser,
                        emit: "on-edit-finish",
                        successTxt: "修改成功",
                    },
                ],
                [
                    PAGE_MODE.ADD,
                    {
                        func: addUser,
                        emit: "on-add-finish",
                        successTxt: "添加成功",
                    },
                ],
            ]);
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    const targetAction = modeAction.get(this.mode);
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    if (this.mode === PAGE_MODE.ADD) formData.acc.status = 1;
                    let res = await targetAction.func(formData);
                    this.btnLoading = false;
                    if (res ) {
                        this.$Message.success(targetAction.successTxt);
                        if (this.mode === PAGE_MODE.ADD) this.onReset();
                        this.$emit(targetAction.emit);
                    }
                }
            });
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        async fillData() {
            this.myForm = await getUserDetail({ code: this.code });
        },
    },
    mounted() {},
    async created() {
        let res = await getAllRoles();
        this.roleList = res.map(item => {
            return { value: item.code, label: item.name };
        });
    },
};
</script>

<style scoped lang="less">
.upload-img-tem {
    width: 80px;
    height: 80px;
    line-height: 80px;
}
.member-detail-form {
    .check-tip {
        background: #000;
        color: #fff;
        opacity: 0.6;
        font-size: 12px;
        display: inline-block;
        line-height: 18px;
        position: absolute;
        top: 47px;
        left: 80px;
        width: 64px;
    }
    /deep/.ivu-input[disabled],
    /deep/.ivu-select-disabled .ivu-select-selection,
    /deep/.ivu-input-number-disabled .ivu-input-number-input,
    /deep/.ivu-input-number-disabled {
        color: inherit !important;
        background-color: #fff !important;
    }
    /deep/.ivu-select-disabled .ivu-select-selection,
    /deep/.ivu-input-wrapper-disabled,
    /deep/.ivu-cascader-disabled,
    /deep/.ivu-input-number-disabled {
        /deep/i {
            display: none;
        }
    }
    /deep/.ivu-form-item {
        margin-bottom: 0 !important;
    }
    .tag-tab {
        margin-bottom: 10px;
        .tag-category {
            font-weight: 400;
            margin-bottom: 5px;
        }
    }
}

.form-item-padding {
    padding: 0 16px 16px 5px;
}

.drawer-footer {
    margin-top: 10px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
.top-info {
    padding: 0 16px;
    div {
        &:first-child {
            margin-top: 0;
        }
        margin-top: 8px;
    }
}
</style>
