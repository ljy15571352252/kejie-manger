<template>
    <div>
        <div
            class="pageContent flexC form-content"
            style="margin-top: 0; width: 100%"
        >
            <h2>基本设置</h2>

            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                style="margin-top: 20px"
            >
                <Row :gutter="20">
                    <Col :span="12">
                        <FormItem label="昵称" prop="nickName">
                            <Input
                                v-model="myForm.nickName"
                                placeholder="请输入昵称"
                            ></Input>
                        </FormItem>
                        <FormItem label="手机号码" prop="mobile">
                            <Input v-model="myForm.mobile" disabled></Input>
                        </FormItem>

                        <FormItem label="角色">
                            <Tag :key="key" v-for="(i, key) in myForm.roles">{{
                                i.name
                            }}</Tag>
                        </FormItem>
                    </Col>
                    <Col :span="12" style="padding-left: 50px">
                        <FormItem label="头像" prop="headUrl">
                            <Avatar
                                :src="myForm.headUrl"
                                size="100"
                                shape="square"
                                style="position: relative; cursor: pointer"
                            />
                            <image-upload
                                @on-upload-success="
                                    url => {
                                        $set(myForm, 'headUrl', url);
                                    }
                                "
                                style="margin-top: 20px"
                            >
                                <Button icon="ios-reverse-camera"
                                    >更改头像</Button
                                >
                            </image-upload>
                        </FormItem>
                    </Col>
                </Row>

                <div class="drawer-footer">
                    <Button
                        type="primary"
                        @click="onSubmit"
                        :loading="btnLoading"
                        >更新基本信息</Button
                    >
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
import ImageUpload from "@/components/upload/ImageUpload";
import { getLoginUserInfo, updateCurrentUserInfo } from "@/api/user/user";

export default {
    name: "personal-form",
    components: { ImageUpload },
    data() {
        return {
            btnLoading: false,
            myForm: {},
            ruleValidate: {
                nickName: [
                    {
                        required: true,
                        message: "昵称不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    delete formData.roles;
                    let res = await updateCurrentUserInfo(formData);
                    this.btnLoading = false;
                    if (res ) {
                        this.$Message.success("修改成功");
                    }
                }
            });
        },
    },
    async created() {
        this.myForm = await getLoginUserInfo();
    },
    mounted() {},
};
</script>

<style scoped lang="less">
.upload-img-tem {
    width: 80px;
    height: 80px;
    line-height: 80px;
}
/deep/.ivu-form-item-label {
    float: none;
    display: inline-block;
    padding: 0 0 10px 0;
}
</style>
