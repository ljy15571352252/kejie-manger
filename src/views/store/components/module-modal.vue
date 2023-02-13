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
                <FormItem label="名称" prop="name">
                    <Input
                        v-model="myForm.name"
                        placeholder="请输入名称"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></Input>
                </FormItem>
                <FormItem label="路径" prop="path">
                    <Input
                        v-model="myForm.path"
                        placeholder="请输入路径"
                        :disabled="mode === PAGE_MODE.DETAIL"
                        number
                    ></Input>
                </FormItem>
                <FormItem label="类型：" prop="type">
                    <Select
                        style="width:194px"
                        v-model="myForm.type"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    >
                        <Option
                            v-for="item in moduleModalTypeOptions"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="parentCode">
                    <Select
                        style="width:194px"
                        v-model="myForm.parentCode"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    >
                        <Option
                            v-for="item in parentList"
                            :value="item.code"
                            :key="item.code"
                            >{{ item.name }}
                        </Option>
                    </Select>
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
import { addStoreModule, editStoreModule } from "@/api/store/store";
import { moduleModalTypeOptions } from '@/common/utils/viewui-utils';

export default {
    name: "domain-modal",
    props: ["value", "moduleObj", "mode","tableData"],
    components:{ImageUpload},
    data() {
        return {
            title: "新增平台",
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                sort:1,
                parentCode:0,
                type:0

            },
            parentList:[],
            ruleValidate: {
                    // title: [
                    //     { required: true, message: "请输入标题", trigger: "blur" },
                    // ],
                    // price: [
                    //     { type:'number',required: true, message: "请输入价格", trigger: "blur" },
                    // ],
                    // platform: [
                    //     { type:'number',required: true, message: "请选择平台", trigger: "blur" },
                    // ],
            },
            moduleModalTypeOptions:moduleModalTypeOptions()
        };
    },
    watch: {
        mode() {
            this.onReset();
        },
        moduleObj() {
            this.onReset();
        },
        value(cur) {
            this.showModal = cur;
        },
        "myForm.type":{
            immediate:true,
            handler(val){
                this.parentList = []
                const top = {
                    name:'顶部',
                    code:0
                }
                this.parentList = [...this.forTableData(this.tableData,val,this.parentList)]
                this.parentList.unshift(top)
            }
        }
    },
    methods: {
        onReset() {
            this.myForm = {
                sort:1,
                parentCode:0,
                type:0
            };
            if (this.mode !== PAGE_MODE.ADD) {
                this.myForm = this.moduleObj;
                console.log(this.moduleObj)
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
                                func: editStoreModule,
                                emit: "on-edit-finish",
                                successTxt: "修改成功",
                            },
                        ],
                        [
                            PAGE_MODE.ADD,
                            {
                                func: addStoreModule,
                                emit: "on-add-finish",
                                successTxt: "添加成功",
                            },
                        ],
                    ]);
                    this.submitBtnLoading = true;
                    const targetAction = modeAction.get(this.mode);
                    this.$delete(this.myForm,'parentCode')
                    const formData = this.copyJson(this.myForm);
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
        forTableData(data,value,res){
            data.map(item => {
                if(item.type + 1 === value){
                    res.push(item)
                }
                if(item.children){
                    this.forTableData(item.children,value,res)
                }
            })
            return res
        }
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
