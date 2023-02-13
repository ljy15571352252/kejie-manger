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
                :label-width="100"
            >
                <Row class="row" justify="space-between">
                    <Col :span="5" class="marign-none">
                        <FormItem prop="icon">
                            <image-upload
                                @on-upload-success="
                                    url => {
                                        $set(myForm, 'icon', url);
                                    }
                                "
                            >
                                <div
                                    class="upload-img-tem"
                                    style="border: 1px dashed"
                                >
                                    <img :src="myForm.icon" v-if="myForm.icon" />
                                    <span v-if="!myForm.icon">+</span>
                                </div>
                            </image-upload>
                        </FormItem>
                    </Col>
                    <Col :span="19" class="form-item-padding">
                        <FormItem label="模块名称" prop="name">
                            <Input
                                v-model="myForm.name"
                                placeholder="请输入模块名称"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                        <FormItem label="页面路径" prop="path">
                            <Input
                                v-model="myForm.path"
                                placeholder="请输入页面路径"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="类型：" prop="type">
                    <RadioGroup v-model="myForm.type">
                        <Radio :label="1">会员端小程序</Radio>
                        <!-- <Radio :label="2">公众号模块页面</Radio> -->
                    </RadioGroup>
                </FormItem>
                <FormItem label="排序" prop="sort">
                    <InputNumber
                        v-model="myForm.sort"
                        :min="1"
                        :max="9"
                    ></InputNumber>
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
import ImageUpload from "@/components/upload/ImageUpload";
import { PAGE_MODE } from "@/common/constants";
import { addStorePageModule, editStorePageModule } from "@/api/store/store";

export default {
    name: "domain-modal",
    props: ["value", "priceObj", "mode"],
    components:{ImageUpload},
    data() {
        return {
            title: "新增平台",
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                sort:1,
            },
            ruleValidate: {
                name: [
                    { required: true, message: "请输入模块名称", trigger: "blur" },
                ],
                path: [
                    {required: true, message: "请输入页面路径", trigger: "blur" },
                ],
                type: [
                    { type:'number',required: true, message: "请选择类型", trigger: "blur" },
                ],
            },
        };
    },
    watch: {
        mode() {
            this.onReset();
        },
        priceObj() {
            this.onReset();
        },
        value(cur) {
            this.showModal = cur;
        },
    },
    methods: {
        onReset() {
            this.myForm = {
                
                sort:1,
            };
            if (this.mode !== PAGE_MODE.ADD) {
                this.myForm = this.priceObj;
                this.title = "编辑平台";
            } else {
                this.title = "新增平台";
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
                                func: editStorePageModule,
                                emit: "on-edit-finish",
                                successTxt: "修改成功",
                            },
                        ],
                        [
                            PAGE_MODE.ADD,
                            {
                                func: addStorePageModule,
                                emit: "on-add-finish",
                                successTxt: "添加成功",
                            },
                        ],
                    ]);
                    this.submitBtnLoading = true;
                    const targetAction = modeAction.get(this.mode);
                    console.log(targetAction)
                    const formData = this.copyJson(this.myForm);
                    console.log(formData)
                    // let res = await targetAction.func(formData);
                    // this.submitBtnLoading = false;
                    // if (res) {
                    //     this.$Message.success(targetAction.successTxt);
                    //     if (this.mode === PAGE_MODE.ADD) this.onReset();
                    //     this.$emit(targetAction.emit);
                    //     this.onVisibleChange(false);
                    // }
                    let res = await targetAction.func(formData).then((res)=>{
                        this.submitBtnLoading = false;
                        this.$Message.success(targetAction.successTxt);
                        if (this.mode === PAGE_MODE.ADD) this.onReset();
                        this.$emit(targetAction.emit);
                        this.onVisibleChange(false);
                    },(res)=>{
                        console.log(res)
                        this.submitBtnLoading = false;
                    });
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
.upload-img-tem {
    width: 80px;
    height: 80px;
    line-height: 80px;
}
.form-item-padding {
//     padding: 0 16px 0 5px;
    .ivu-form-item{
        margin-bottom:20px;
        .ivu-input-number{
            width: 100%;
        }
    }
}
.marign-none{
    /deep/.ivu-form-item-content{
        margin-left: 30px !important;
    }
}
</style>
