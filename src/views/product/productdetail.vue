<template>
    <div class="flexC">
        <page-header title="商品详情" description="商品详情" no-margin />
        <div class="pageContent flexC">
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="100"
            >
                <Divider orientation="left">商品基本信息</Divider>
                <FormItem prop="categoryCode" label="分类：">
                    <Select
                        v-model="myForm.categoryCode"
                        style="width: 150px"
                        placeholder="请选择分类"
                    >
                        <Option
                            v-for="(item, key) in categories"
                            :key="key"
                            :value="item.code"
                            >{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>

                <FormItem prop="promoteText" label="商品名称：">
                    <Input
                        v-model="myForm.promoteText"
                        style="width: 500px"
                        placeholder="请输入商品名称"
                    />
                </FormItem>
                <FormItem
                    label="商品图片"
                    prop="imgList"
                    style="margin-top: 15px"
                >
                    <div>
                        <div
                            class="demo-upload-list"
                            v-for="(item, index) in uploadList"
                            :key="index"
                        >
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url" />
                                <div class="demo-upload-list-cover">
                                    <Icon
                                        type="ios-eye-outline"
                                        @click.native="onImagePreview(item.url)"
                                    ></Icon>
                                    <Icon
                                        type="ios-trash-outline"
                                        @click.native="handleRemove(index)"
                                    ></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress
                                    v-if="item.showProgress"
                                    :percent="item.percentage"
                                    hide-info
                                ></Progress>
                            </template>
                        </div>
                        <image-upload
                            :multiple="true"
                            :limit-count="5"
                            @on-upload-success="
                                url => {
                                    myForm.imgList.push({ imageUrl: url });
                                }
                            "
                            @on-mounted="
                                fileList => {
                                    this.uploadList = fileList;
                                }
                            "
                        >
                            <div
                                class="upload-img-tem"
                                style="border: 1px dashed #ccc"
                            >
                                +
                            </div>
                        </image-upload>
                    </div>
                </FormItem>
                <FormItem label="商品简介" prop="introduce">
                    <Input
                        v-model="myForm.introduce"
                        style="width: 300px"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 5 }"
                        placeholder="请输入简介"
                    ></Input>
                </FormItem>
                <FormItem label="商品规格" prop="skuList">
                    <div class="margin-bottom-10">
                        <Button @click="addSku" type="primary">增加规格</Button>
                    </div>
                    <Table
                        :columns="columns"
                        :data="myForm.skuList"
                        width="850"
                        border
                    >
                        <div
                            slot-scope="{ row, index }"
                            slot="imageUrl"
                            style="padding: 10px 0"
                        >
                            <image-upload
                                @on-upload-success="
                                    url => {
                                        $set(myForm.skuList[index], 'imageUrl', url);
                                    }
                                "
                            >
                                <div
                                    class="upload-img-tem sku-image"
                                    style="border: 1px dashed"
                                >
                                    <img
                                        :src="myForm.skuList[index].imageUrl"
                                        v-if="myForm.skuList[index].imageUrl"
                                    />
                                    <span v-if="!myForm.skuList[index].imageUrl">+</span>
                                </div>
                            </image-upload>
                        </div>
                        <template slot-scope="{ row, index }" slot="specValue">
                            <Input placeholder="请输入规格值" v-model="myForm.skuList[index].specValue"></Input>
                        </template>
                        <template slot-scope="{ row, index }" slot="price">
                            <InputNumber
                                v-model="myForm.skuList[index].price"
                                :min="0"
                                :formatter="amountFormat"
                                :parser="amountParser"
                            ></InputNumber>
                        </template>
                        <template slot-scope="{ row, index }" slot="count">
                            <InputNumber :min="0"   v-model="myForm.skuList[index].count"></InputNumber>
                        </template>
                        <template slot-scope="{ row, index }" slot="points">
                            <InputNumber :min="0" v-model="myForm.skuList[index].points"></InputNumber>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <a @click="delSku(index)">删除</a>
                        </template>
                    </Table>
                </FormItem>
                <FormItem label="带货佣金：" prop="commissionAmount">
                    <InputNumber
                        v-model="myForm.commissionAmount"
                        :min="0"
                        :formatter="amountFormat"
                        :parser="amountParser"
                    ></InputNumber>
                </FormItem>
                <FormItem label="详情：" prop="detail" style="width: 900px">
                    <script type="text/plain" id="editor"></script>
                </FormItem>

                <Divider orientation="left">商品销售属性</Divider>
                <Divider orientation="left">运费信息</Divider>
                <Divider orientation="left">其他</Divider>
                <FormItem label="状态" prop="state" class="form-item-padding">
                    <RadioGroup v-model="myForm.state">
                        <Radio
                            :label="item.value"
                            v-for="(item, index) in upOrDownStatusOptions"
                            :key="index"
                            >{{ item.label }}</Radio
                        >
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        @click="onSubmit"
                        :loading="btnLoading"
                        >提交</Button
                    >
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import ImageUpload from "@/components/upload/fileUpload";
import {
    addProduct,
    editProduct,
    getProductCategories,
    getProductDetail,
} from "@/api/product/product";
import { PAGE_MODE } from "@/common/constants";
import {
    amountFormat,
    amountParser,
    upOrDownStatusOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "productdetail",
    components: { ImageUpload },
    data() {
        return {
            upOrDownStatusOptions: upOrDownStatusOptions(),
            amountFormat: amountFormat,
            amountParser: amountParser,
            columns: [
                {
                    title: "图片",
                    slot: "imageUrl",
                    width: 120,
                },
                {
                    title: "规格名",
                    slot: "specValue",
                },
                {
                    title: "价格",
                    slot: "price",
                },
                {
                    title: "库存",
                    slot: "count",
                },
                {
                    title: "赠送积分",
                    slot: "points",
                },
                {
                    title: "操作",
                    slot: "action",
                },
            ],
            uploadList: [],
            mode: null,
            preview: false,
            previewUrl: null,
            myForm: {
                imgList: [],
                skuList: [],
              commissionAmount:1
            },
            categories: [],
            ruleValidate: {
                categoryCode: [
                    {
                        required: true,
                        message: "请选择分类",
                        trigger: "change",
                    },
                ],
                promoteText: [
                    {
                        required: true,
                        message: "请输入商品名称",
                        trigger: "blur",
                    },
                ],
                imgList: [
                    {
                        required: true,
                        type: "array",
                        message: "请上传图片",
                        trigger: "change",
                    },
                ],
                skuList: [
                    {
                        required: true,
                        type: "array",
                        message: "请设置规格",
                        trigger: "change",
                    },
                ],
                state: [
                    {
                        required: true,
                        type: "number",
                        message: "请选择上下架状态",
                        trigger: "blur",
                    },
                ],
              // commissionAmount:[
              //   {
              //     required: true,
              //     type: "number",
              //     message: "请输入带货佣金",
              //     trigger: "blur",
              //   },
              // ],
                detail: [
                    {
                        validator: (rule, value, callback) => {
                            this.myForm.detail = this.$ueditor.getContent();
                            if (this.isBlank(this.myForm.detail))
                                callback(new Error("请填写详情"));
                            callback();
                        },
                        message: "请填写详情",
                        trigger: "blur",
                        required: true,
                    },
                ],
            },
            btnLoading: false,
        };
    },
    created() {
        const action = this.$route.params.action;
        this.mode = action === "edit" ? PAGE_MODE.EDIT : PAGE_MODE.ADD;
    },
    async mounted() {
        this.$ueditor.init("editor");
        this.$ueditor.setInitContent("");
        this.categories = await getProductCategories();
        if (this.mode === PAGE_MODE.EDIT) {
            let res = await getProductDetail({
                code: this.$route.query.code,
            });
            this.uploadList = res.imgList.map(item => {
                return { url: item.imageUrl, status: "finished" };
            });
            this.$ueditor.setContent(res.detail);
            this.myForm = res;
        }
    },
    methods: {
        addSku() {
            if (this.myForm.skuList.length > 9) {
                this.$Message.error("不能超过10个规格");
                return;
            }
            this.myForm.skuList.push({});
        },
        delSku(index) {
            this.$Modal.confirm({
                title: `删除第${index + 1}个规格`,
                content: "<p>您确定要删除该规格吗？</p>",
                onOk: () => {
                    this.myForm.skuList.splice(index, 1);
                },
                onCancel: () => {},
            });
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        handleRemove(index) {
            this.$Modal.confirm({
                title: "删除图片",
                content: "<p>您确定要删除该图片吗？</p>",
                onOk: () => {
                    this.uploadList.splice(index, 1);
                    this.myForm.imgList.splice(index, 1);
                },
                onCancel: () => {},
            });
        },
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    const modeAction = new Map([
                        [
                            PAGE_MODE.EDIT,
                            {
                                func: editProduct,
                                emit: "on-edit-finish",
                                successTxt: "修改成功",
                            },
                        ],
                        [
                            PAGE_MODE.ADD,
                            {
                                func: addProduct,
                                emit: "on-add-finish",
                                successTxt: "添加成功",
                            },
                        ],
                    ]);
                    const targetAction = modeAction.get(this.mode);
                    const formData = this.copyJson(this.myForm);
                    let err=false
                    for (let i in formData.skuList){
                      let item=formData.skuList[i]
                      if (!item.price || !item.specValue || !item.count){
                        err=true
                        this.$Message.error('请补充商品规格信息')
                        return
                      }
                    }
                    this.btnLoading = true;
                    let res = await targetAction.func(formData);
                    this.btnLoading = false;
                    if (res ) {
                        this.$Message.success(targetAction.successTxt);
                        this.$router.go(-1)
                    }
                }
            });
        },
    },
};
</script>

<style scoped lang="less">
.upload-img-tem {
    line-height: 175px;
}
.sku-image {
    line-height: 80px;
    width: 80px;
    height: 80px;
}
.ivu-form-item{
    /deep/.ivu-form-item-label{
        text-align: left;
    }
    .ivu-form-item-content{}
}
</style>
