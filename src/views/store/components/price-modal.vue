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
        <Row
          class="row"
          justify="space-between"
        >
          <Col
            :span="5"
            class="marign-none"
          >
          <FormItem prop="imageUrl">
            <image-upload @on-upload-success="
                                    url => {
                                        $set(myForm, 'imageUrl', url);
                                    }
                                ">
              <div
                class="upload-img-tem"
                style="border: 1px dashed"
              >
                <img
                  :src="myForm.imageUrl"
                  v-if="myForm.imageUrl"
                />
                <span v-if="!myForm.imageUrl">+</span>
              </div>
            </image-upload>
          </FormItem>
          </Col>
          <Col
            :span="19"
            class="form-item-padding"
          >
          <FormItem
            label="标题"
            prop="title"
          >
            <Input
              v-model="myForm.title"
              placeholder="请输入标题"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></Input>
          </FormItem>
          <FormItem
            label="价格"
            prop="price"
          >
            <Input
              v-model="myForm.price"
              placeholder="请输入价格"
              :disabled="mode === PAGE_MODE.DETAIL"
              number
            ></Input>
          </FormItem>
          </Col>
        </Row>
        <FormItem
          label="描述"
          prop="description"
        >
          <Input
            v-model="myForm.description"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入描述"
          ></Input>
        </FormItem>
        <FormItem
          label="类型："
          prop="type"
        >
          <RadioGroup v-model="myForm.type">
            <Radio :label="1">按天收费</Radio>
            <Radio :label="2">按月收费</Radio>
            <Radio :label="3">按年收费</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          label="平台："
          prop="platform"
        >
          <!-- <RadioGroup v-model="myForm.platform">
            <Radio :label="1">小程序</Radio>
            <Radio :label="2">公众号</Radio>
            <Radio :label="3">APP</Radio>
            <Radio :label="4">活动</Radio>
            <Radio :label="5">视频</Radio>
            <Radio :label="6">红娘</Radio>
            <Radio :label="7">网站</Radio>
            <Radio :label="8">加盟</Radio>
            <Radio :label="9">直播</Radio>

          </RadioGroup> -->
          <Select
            v-model="myForm.platform"
            style="width: 200px"
          >
            <Option
              v-for="item in platformOptions"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="onVisibleChange(false)"
        >取消</Button>
        <Button
          type="primary"
          :loading="submitBtnLoading"
          @click="onSubmit"
        >提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ImageUpload from "@/components/upload/ImageUpload";
import { PAGE_MODE } from "@/common/constants";
import { addStorePrice, editStorePrice } from "@/api/store/store";

export default {
    name: "domain-modal",
    props: ["value", "priceObj", "mode"],
    components: { ImageUpload },
    data() {
        return {
            platformOptions: [
                {
                    label: "全部",
                    value: 0
                },
                {
                    label: "小程序",
                    value: 1
                },
                {
                    label: "公众号",
                    value: 2
                },
                {
                    label: "APP",
                    value: 3
                },
                {
                    label: "活动",
                    value: 4
                },

                {
                    label: "视频",
                    value: 5
                },
                {
                    label: "红娘",
                    value: 6
                },
                {
                    label: "网站",
                    value: 7
                },
                {
                    label: "加盟",
                    value: 8
                },
                {
                    label: "直播",
                    value: 9
                }
            ],
            title: "新增平台",
            showModal: false,
            submitBtnLoading: false,
            myForm: {},
            ruleValidate: {
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" }
                ],
                price: [
                    {
                        type: "number",
                        required: true,
                        message: "请输入价格",
                        trigger: "blur"
                    }
                ],
                platform: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择平台",
                        trigger: "blur"
                    }
                ],
                type: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择类型",
                        trigger: "blur"
                    }
                ]
            }
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
        }
    },
    methods: {
        onReset() {
            this.myForm = {};
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
                                func: editStorePrice,
                                emit: "on-edit-finish",
                                successTxt: "修改成功"
                            }
                        ],
                        [
                            PAGE_MODE.ADD,
                            {
                                func: addStorePrice,
                                emit: "on-add-finish",
                                successTxt: "添加成功"
                            }
                        ]
                    ]);
                    this.submitBtnLoading = true;
                    const targetAction = modeAction.get(this.mode);
                    console.log(targetAction);
                    const formData = this.copyJson(this.myForm);
                    console.log(formData);
                    // let res = await targetAction.func(formData);
                    // this.submitBtnLoading = false;
                    // if (res) {
                    //     this.$Message.success(targetAction.successTxt);
                    //     if (this.mode === PAGE_MODE.ADD) this.onReset();
                    //     this.$emit(targetAction.emit);
                    //     this.onVisibleChange(false);
                    // }
                    let res = await targetAction.func(formData).then(
                        res => {
                            this.submitBtnLoading = false;
                            this.$Message.success(targetAction.successTxt);
                            if (this.mode === PAGE_MODE.ADD) this.onReset();
                            this.$emit(targetAction.emit);
                            this.onVisibleChange(false);
                        },
                        res => {
                            console.log(res);
                            this.submitBtnLoading = false;
                        }
                    );
                }
            });
        }
    }
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
    .ivu-form-item {
        margin-bottom: 20px;
        .ivu-input-number {
            width: 100%;
        }
    }
}
.marign-none {
    /deep/.ivu-form-item-content {
        margin-left: 30px !important;
    }
}
</style>
