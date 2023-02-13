<template>
    <div class="flexC">
        <page-header title="商户" description="商户操作" no-margin />
        
        <div class="pageContent flexC">
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                class="member-detail-form"
            >
                <!-- 详情页才展示的信息 -->
                <Row v-if="mode === PAGE_MODE.DETAIL">
                    <Col>
                        <div>
                            <Avatar
                                :src="myForm.logo"
                                size="64"
                                shape="square"
                                style="position: relative; cursor: pointer"
                                @click.native="onImagePreview(myForm.logo)"
                            >
                            </Avatar>
                        </div>
                    </Col>
                    <Col span="14" class="top-info">
                        <div>商户 ID：{{ myForm.code }}</div>
                        <div>创建时间：{{ myForm.createTime }}</div>
                    </Col>
                </Row>
                <Row v-if="mode !== PAGE_MODE.DETAIL">
                    <Col
                        :span="24"
                        style="text-align: center"
                    >
                        <FormItem prop="logo">
                            <image-upload
                                @on-upload-success="
                                    url => {
                                        $set(myForm, 'logo', url);
                                    }
                                "
                            >
                                <div
                                    class="upload-img-tem"
                                    style="border: 1px dashed"
                                >
                                    <img :src="myForm.logo" v-if="myForm.logo" />
                                    <span v-if="!myForm.logo">+</span>
                                </div>
                            </image-upload>
                        </FormItem>
                    </Col>
                </Row>
                <div>
                    <Divider orientation="left">基本信息</Divider>
                    <Row>
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="名称" prop="nickName">
                                <Input
                                    v-model="myForm.name"
                                    placeholder="请输入名称"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                                ></Input>
                            </FormItem>
                        </Col>
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="联系人" prop="contact">
                                <Input
                                    v-model="myForm.contact"
                                    placeholder="请输入联系人"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                                ></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="联系人手机" prop="mobile">
                                <Input
                                    v-model="myForm.mobile"
                                    placeholder="请输入联系人手机"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                                ></Input>
                            </FormItem>
                        </Col>
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="状态" prop="status">
                                <Select
                                    v-model="myForm.status"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                                >
                                    <Option
                                        v-for="item in storeStateOptions"
                                        :value="item.value"
                                        :key="item.value"
                                        >{{ item.label }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="地区" prop="area">
                        <area-cascader
                            :value="myForm.area"
                            @input="input"
                            @on-change="changeArea"
                            target="county"
                            :disabled="mode === PAGE_MODE.DETAIL"
                        ></area-cascader>
                    </FormItem>
                    <FormItem label="详细地址" prop="address">
                        <Input
                            v-model="myForm.address"
                            placeholder="请输入详细地址"
                            :disabled="mode === PAGE_MODE.DETAIL"
                        ></Input>
                    </FormItem>
                </div>
                <div v-if="mode === PAGE_MODE.ADD">
                    <Divider orientation="left">账号信息</Divider>
                    <Row>
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="用户名" prop="acc.username">
                                <Input
                                    v-model="myForm.acc.username"
                                    placeholder="请输入用户名"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                                ></Input>
                            </FormItem>
                        </Col>
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="手机号" prop="acc.mobile">
                                <Input
                                    v-model="myForm.acc.mobile"
                                    placeholder="请输入手机号"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                                    number
                                ></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <br />
                    <Row v-if="mode === PAGE_MODE.ADD">
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="密码" prop="acc.password">
                                <Input
                                    type="password"
                                    v-model="myForm.acc.password"
                                    placeholder="请输入登录密码"
                                ></Input>
                            </FormItem>
                        </Col>
                        <Col :span="12" class="form-item-padding">
                            <FormItem label="确认密码" prop="acc.confirmPassword">
                                <Input
                                    type="password"
                                    v-model="myForm.acc.confirmPassword"
                                    placeholder="请确认密码"
                                ></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                <div
                    style="margin-top: 20px"
                    v-show="mode !== PAGE_MODE.DETAIL"
                >
                    <Button
                        type="primary"
                        @click="submit('myForm')"
                        :loading="btnLoading"
                        >提交</Button
                    >
                </div>
            </Form>
            <Modal title="图片预览" v-model="preview">
                <img :src="previewUrl" v-if="preview" style="width: 100%" />
            </Modal>
        </div>
    </div>
</template>

<script>
import AreaCascader from "@/components/area/areaCascader";
import ImageUpload from "@/components/upload/ImageUpload";
import { storeStateOptions } from "@/common/utils/viewui-utils";
import { PAGE_MODE } from "@/common/constants";
import { getStoreUserDetail } from "@/api/store/store";

export default {
    nickName: "store-form",
    components: { ImageUpload,AreaCascader },
    data() {
            // 密码验证
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空！'));
                } else{
                    // if(this.myForm.acc.confirmPassword !== ''){
                    //     // 对第二个密码框单独验证
                    //     this.$refs.myForm.validateField('confirmPassword');
                    // }
                    callback();
                }
            };
            // 第二次密码验证
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.myForm.acc.password) {
                    callback(new Error('两次输入的密码不匹配！'));
                } else {
                    callback();
                }
            };
            // 手机号验证
            const validateMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }
                setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        return callback(new Error('请输入数字'));
                    } else {
                        if (!/^1[34578]\d{9}$/.test(value)) {
                            return callback(new Error('请输入正确的手机格式'));
                        } else {
                            callback();
                        }
                        callback();
                    }
                }, 1000);
            };
        return {
            // 状态
            storeStateOptions: storeStateOptions(),
            // 预览限时隐藏
            preview: false,
            // 预览Url
            previewUrl: null,
            span: 12,
            // 商户数据
            myForm: {
                // 账号信息
                acc:{
                    username:'',
                    mobile:'',
                    password:'',
                    confirmPassword:''
                }
            },
            // 验证规则
            ruleValidate: {
                "acc.username": [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                "acc.mobile": [
                    { required: true, validator: validateMobile, trigger: 'blur' }
                ],
                "acc.password": [
                    { required: true,validator: validatePass, trigger: 'blur' }
                ],
                "acc.confirmPassword": [
                    { required: true,validator: validatePassCheck, trigger: 'blur' }
                ],
            },
            btnLoading: false,
            mode:null,
            codeObj:{},
        };
    },
    watch: {
        // 监听商户用户id
        codeObj:{
            deep:true,
            handler(){
                this.onReset();
            }
        },
        // 监听操作模式
        mode(cur) {
            this.onReset();
        }
    },
    methods: {
        input(cur){
            [this.myForm.provinceCode,this.myForm.cityCode,this.myForm.countyCode] = cur.map(item => item.toString());
        },
        // 重置数据
        onReset() {
            this.myForm = {
                acc:{
                    username:'',
                    mobile:'',
                    password:'',
                    confirmPassword:''
                }
            };
            // 不为添加模式，则重新获取数据
            if (this.mode !== PAGE_MODE.ADD) this.fillData();
        },
        // 大图预览
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        // 请求数据
        async fillData() {
            this.myForm = await getStoreUserDetail(this.codeObj);
            if (this.myForm.provinceCode) {
                this.myForm.area = [
                    parseInt(this.myForm.provinceCode),
                    parseInt(this.myForm.cityCode),
                    parseInt(this.myForm.countyCode),
                ];
            }
        },
        // 修改地址
        changeArea(arr){
            
            [this.myForm.provinceName,this.myForm.cityName,this.myForm.countyName] = arr;
        },
        // 提交
        submit(name) {
            const _this = this
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    this.addOrEdit();
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        // 新增/修改
        async addOrEdit(){
            // json拷贝
            const formData = this.copyJson(this.myForm)
            const modeAction = new Map([
                [
                    PAGE_MODE.EDIT,
                    {
                        func: editStore,
                        emit: "on-edit-finish",
                        successTxt: "修改成功",
                    },
                ],
                [
                    PAGE_MODE.ADD,
                    {
                        func: addStore,
                        emit: "on-add-finish",
                        successTxt: "添加成功",
                    },
                ],
            ]);
            const targetAction = modeAction.get(this.mode);
            this.btnLoading = true;
            let res = await targetAction.func(formData);
            this.btnLoading = false;
            if (res ) {
                this.$Message.success(targetAction.successTxt);
                this.$router.go(-1)
            }
        }
    },
    mounted() {
    },
    created() {
        // 获取当前商户id
        this.codeObj = {...this.$route.query};
        const map = new Map([
            ["add", PAGE_MODE.ADD],
            ["edit", PAGE_MODE.EDIT],
            ["detail", PAGE_MODE.DETAIL],
        ]);
        // 获取当前操作模式并匹配对应的值
        this.mode = map.get(this.$route.params.action);
        
    }
};
</script>

<style scoped lang="less">
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
    padding: 0 16px 0 5px;
}

.drawer-footer {
    margin-top: 10px;
    width: 100%;
    position: relative;
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
.upload-img-tem {
    width: 80px;
    height: 80px;
    line-height: 80px;
}
</style>