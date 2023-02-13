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
        :label-width="120"
      >
        <FormItem
          label="分组名称："
          prop="name"
        >
          <Input
            v-model="myForm.name"
            placeholder="请输入分组名称"
          ></Input>
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
import { PAGE_MODE } from "@/common/constants";
import { addGroup, editGroup } from "@/api/member/gallery";

export default {
    name: "group-modal",
    props: ["value", "groupObj", "mode", "mediaType"],
    data() {
        return {
            title: "添加分组",
            showModal: false,
            submitBtnLoading: false,
            myForm: {},
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "分组名称不能为空",
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
        groupObj() {
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
                this.myForm = this.groupObj;
            } else if (this.mode == PAGE_MODE.ADD && this.groupObj) {
                this.myForm.parentCode = this.groupObj.code;
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
                                func: editGroup,
                                emit: "on-edit-finish",
                                successTxt: "修改成功"
                            }
                        ],
                        [
                            PAGE_MODE.ADD,
                            {
                                func: addGroup,
                                emit: "on-add-finish",
                                successTxt: "添加成功"
                            }
                        ]
                    ]);
                    this.submitBtnLoading = true;
                    this.myForm.mediaType = this.mediaType;
                    const targetAction = modeAction.get(this.mode);
                    const formData = this.copyJson(this.myForm);
                  
                    let res = await targetAction.func(formData);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.$Message.success(targetAction.successTxt);
                        if (this.mode === PAGE_MODE.ADD) this.onReset();
                        this.$emit("on-group-success");
                        this.onVisibleChange(false);
                    } else {
                        if (this.mode === PAGE_MODE.ADD) this.onReset();
                        this.onVisibleChange(false);
                    }
                }
            });
        }
    }
};
</script>

<style scoped></style>
