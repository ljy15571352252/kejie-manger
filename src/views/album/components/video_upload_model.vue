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
          label="视频名称："
          prop="name"
        >
          <Input
            v-model="myForm.name"
            placeholder="请输入视频名称"
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
// import { editAlbumSource } from "@/api/member/gallery";
export default {
    name: "group-modal",
    props: ["value", "groupCode"],
    data() {
        return {
            title: "编辑视频名称",
            showModal: false,
            submitBtnLoading: false,
            groupList: [],
            myForm: {},
            code: "",
            uploadType: "IMAGE",
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "视频名称不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
            this.onReset();
        },
        groupCode(cur) {
            // this.code = cur;
            this.onReset();
        }
    },

    methods: {
        onReset() {
            this.myForm = {};
            if (this.groupCode) {
                this.myForm = this.groupCode;
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
                    this.submitBtnLoading = true;
                    this.myForm.mediaType = 2;
                    const formData = this.copyJson(this.myForm);
                 
                    let res = await editAlbumSource(formData);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.$Message.success("修改成功");
                        this.$emit("on-upload-success");
                        this.onVisibleChange(false);
                    } else {
                        this.onVisibleChange(false);
                    }
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
</style>
