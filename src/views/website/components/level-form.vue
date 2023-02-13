<template>
    <div>
        <Form
            :model="myForm"
            ref="myForm"
            :rules="ruleValidate"
            class="member-detail-form"
        >
            <div>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="等级名称" prop="name">
                            <Input
                                v-model="myForm.name"
                                placeholder="请输入等级名称"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="级别" prop="level">
                            <InputNumber
                                style="width: 240px"
                                v-model="myForm.level"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></InputNumber>
                        </FormItem>
                        <div class="notice-error margin-top-8">（数值越小，排名越靠前）</div>
                    </Col>
                </Row>

                <FormItem
                    label="等级描述"
                    prop="description"
                    class="form-item-padding"
                >
                    <Input
                        v-model="myForm.description"
                        placeholder="等级描述"
                        type="textarea"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></Input>
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
import { addLevels, editLevels } from "@/api/member/levels";

export default {
    name: "level-form",
    components: { ImageUpload },
    props: {
        levelObj: {
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
                        message: "等级名称不能为空",
                        trigger: "blur",
                    },
                ],
                level: [
                    {
                        required: true,
                        type: "number",
                        message: "级别不能为空",
                        trigger: "change",
                    },
                ],
            },
            btnLoading: false,
        };
    },
    watch: {
        levelObj() {
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
                this.myForm = this.levelObj;
            }
        },
        async onSubmit() {
            const modeAction = new Map([
                [
                    PAGE_MODE.EDIT,
                    {
                        func: editLevels,
                        emit: "on-edit-finish",
                        successTxt: "修改成功",
                    },
                ],
                [
                    PAGE_MODE.ADD,
                    {
                        func: addLevels,
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
