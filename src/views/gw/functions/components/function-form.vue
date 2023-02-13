<template>
    <div>
        <Form
            :model="myForm"
            ref="myForm"
            :rules="ruleValidate"
            class="member-detail-form"
            :label-width="100"
        >
            <div>
                <FormItem
                    label="功能图片"
                    prop="imageUrl"
                    class="form-item-padding"
                >
                    <image-upload
                        @on-upload-success="
                            url => {
                                $set(myForm, 'imageUrl', url);
                            }
                        "
                    >
                        <div class="upload-img-tem" style="border: 1px dashed">
                            <img
                                :src="myForm.imageUrl"
                                v-if="myForm.imageUrl"
                            />
                            <span v-if="!myForm.imageUrl">+</span>
                        </div>
                    </image-upload>
                </FormItem>

                <FormItem
                    label="功能名称"
                    prop="name"
                    class="form-item-padding"
                >
                    <Input
                        v-model="myForm.name"
                        placeholder="请输入功能名称"
                        style="width: 240px"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></Input>
                </FormItem>

                <FormItem
                    label="描述"
                    prop="description"
                    class="form-item-padding"
                >
                    <Input
                        v-model="myForm.description"
                        type="textarea"
                        placeholder="请输入描述"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></Input>
                </FormItem>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="排序" prop="sort">
                            <InputNumber
                                v-model="myForm.sort"
                                style="width: 240px"
                            ></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="状态" prop="status">
                            <Select
                                v-model="myForm.state"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in functionsStatusOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>

                <FormItem label="详情：" prop="content" style="width: 920px">
                    <script type="text/plain" id="editor"></script>
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
import { PAGE_MODE } from "@/common/constants";
import { functionsStatusOptions } from "@/common/utils/viewui-utils";
import { addFunction, editFunction, getFunctionDetail } from "@/api/gw/gw";

export default {
    name: "function-form",
    props: ["code", "mode"],
    components: { ImageUpload },
    data() {
        return {
            functionsStatusOptions: functionsStatusOptions(),
            preview: false,
            previewUrl: null,
            span: 12,
            myForm: {},
            ruleValidate: {
                state: [
                    {
                        required: true,
                        message: "请选择状态",
                        type: "number",
                        trigger: "change",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "请输入标题",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "请输入描述",
                        trigger: "blur",
                    },
                ],
                content: [
                    {
                        validator: (rule, value, callback) => {
                            this.myForm.content = this.$ueditor.getContent();
                            if (this.isBlank(this.myForm.content))
                                callback(new Error("请填写详情"));
                            callback();
                        },
                        message: "请输入详情",
                        trigger: "blur",
                        required: true,
                    },
                ],
                imageUrl: [
                    {
                        required: true,
                        message: "请上传图片",
                        trigger: "change",
                    },
                ],
            },
            btnLoading: false,
        };
    },
    watch: {
        code() {
            this.onReset();
        },
        mode() {
            this.onReset();
            this.$ueditor.init("editor");
            this.$ueditor.setInitContent("");
        },
    },
    methods: {
        onReset() {
            this.myForm = {};
            if (this.mode !== PAGE_MODE.ADD) {
                this.fillData();
            }
        },

        async onSubmit() {
            const modeAction = new Map([
                [
                    PAGE_MODE.EDIT,
                    {
                        func: editFunction,
                        emit: "on-edit-finish",
                        successTxt: "修改成功",
                    },
                ],
                [
                    PAGE_MODE.ADD,
                    {
                        func: addFunction,
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
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        async fillData() {
            let result = await getFunctionDetail(this.code);
            this.myForm = result;

            this.$ueditor.setContent(result.content);
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
    padding: 0 16px 30px 5px;
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
