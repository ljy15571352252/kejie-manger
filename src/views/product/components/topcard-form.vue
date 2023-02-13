<template>
    <div>
        <Form
            :model="myForm"
            ref="myForm"
            :rules="ruleValidate"
            class="member-detail-form"
        >
            <Row>
                <Col :span="24" style="text-align: center">
                    <FormItem prop="imgUrl">
                        <image-upload
                                @on-upload-success="
                                url => {
                                    $set(myForm, 'imgUrl', url);
                                }
                            "
                        >
                            <div
                                    class="upload-img-tem"
                                    style="border: 1px dashed"
                            >
                                <img
                                        :src="myForm.imgUrl"
                                        v-if="myForm.imgUrl"
                                />
                                <span v-if="!myForm.imgUrl">+</span>
                            </div>
                        </image-upload>
                    </FormItem>
                </Col>
            </Row>
            <div>
                <Divider/>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="置顶卡名称" prop="name">
                            <Input
                                v-model="myForm.name"
                                placeholder="请输入置顶卡名称"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="有效天数" prop="validDays">
                            <InputNumber
                                    style="width: 240px"
                                    v-model="myForm.validDays"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                            ></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="价格" prop="price">
                            <InputNumber
                                    style="width: 240px"
                                    v-model="myForm.price"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                            ></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="原价" prop="originPrice">
                            <InputNumber
                                    style="width: 240px"
                                    v-model="myForm.originPrice"
                                    :disabled="mode === PAGE_MODE.DETAIL"
                            ></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="排序" prop="sort">
                    <InputNumber
                            style="width: 240px"
                            v-model="myForm.sort"
                            :disabled="mode === PAGE_MODE.DETAIL"
                    ></InputNumber>
                </FormItem>
            </div>

            <div class="drawer-footer" v-show="mode !== PAGE_MODE.DETAIL">
                <Button type="primary" @click="onSubmit" :loading="btnLoading"
                    >提交</Button
                >
            </div>
        </Form>
    </div>
</template>

<script>
import { PAGE_MODE } from "@/common/constants";
import ImageUpload from "@/components/upload/fileUpload";
import {addTopCard, editTopCard} from "@/api/product/topcard";

export default {
    name: "validDayset-form",
    components: { ImageUpload },
    props: {
        topCardObj: {
            type: Object,
            required: false,
        },
        mode: {
            required: true,
        },
    },
    data() {
        return {
            span: 12,
            myForm: {},
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "置顶卡名称不能为空",
                        trigger: "blur",
                    },
                ],
                imgUrl: [
                    {
                        required: true,
                        message: "图片不能为空",
                        trigger: "change",
                    },
                ],
                validDays: [
                    {
                        required: true,
                        type:'number',
                        message: "有效天数不能为空",
                        trigger: "change",
                    },
                ],
                price: [
                    {
                        type:'number',
                        required: true,
                        message: "价格不能为空",
                        trigger: "change",
                    },
                ],
            },
            btnLoading: false,
        };
    },
    watch: {
        topCardObj() {
            this.onReset();
        },
        mode() {
            this.onReset();
        },
    },
    methods: {
        onReset() {
            this.myForm = {};
            if (this.mode !== PAGE_MODE.ADD) {
                this.myForm = this.topCardObj;
            }
        },
        async onSubmit() {
            const modeAction = new Map([
                [
                    PAGE_MODE.EDIT,
                    {
                        func: editTopCard,
                        emit: "on-edit-finish",
                        successTxt: "修改成功",
                    },
                ],
                [
                    PAGE_MODE.ADD,
                    {
                        func: addTopCard,
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
