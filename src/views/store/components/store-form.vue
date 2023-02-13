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
                <Col span="14" class="top-info" v-if="mode !== PAGE_MODE.ADD">
                    <div>商户 ID：{{ myForm.code }}</div>
                    <div>创建时间：{{ myForm.createTime }}</div>
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
                        v-model="myForm.area"
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
        </Form>
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
    </div>
</template>

<script>
import AreaCascader from "@/components/area/areaCascader";
import ImageUpload from "@/components/upload/ImageUpload";
import { storeStateOptions } from "@/common/utils/viewui-utils";
import { PAGE_MODE } from "@/common/constants";
import { getStoreDetail } from "@/api/store/store";

export default {
    nickName: "store-form",
    props: ["codeObj", "mode"],
    components: { ImageUpload,AreaCascader },
    data() {
        return {
            storeStateOptions: storeStateOptions(),
            preview: false,
            previewUrl: null,
            span: 12,
            myForm: {},
            ruleValidate: {},
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
            this.myForm = {};
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        async fillData() {
            this.myForm = await getStoreDetail({ code: this.code });
            if (this.myForm.provinceCode) {
                this.myForm.area = [
                    parseInt(this.myForm.provinceCode),
                    parseInt(this.myForm.cityCode),
                    parseInt(this.myForm.countyCode),
                ];
            }
        },
    },
    mounted() {},
    async created() {},
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
