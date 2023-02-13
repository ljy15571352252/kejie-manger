<template>
    <div>
        <Modal
            v-model="showModal"
            title="设置会员等级"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-ok="onSubmit"
            ok-text="确认"
            @on-visible-change="onVisibleChange"
        >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="120"
            >
                <FormItem label="会员等级" prop="levelCode">
                    <Select
                        style="width: 200px"
                        clearable
                        placeholder="请选择会员等级"
                        v-model="myForm.levelCode"
                    >
                        <Option
                            v-for="item in levels"
                            :value="item.code"
                            :key="item.code"
                            >{{ item.name }}
                        </Option>
                    </Select>
                    <div>当前等级：{{ curLevelName || "普通会员" }}</div>
                </FormItem>
                <FormItem label="有效天数：" prop="days">
                  <InputNumber
                      v-model="myForm.days"
                      placeholder="有效天数"
                  ></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    :loading="submitBtnLoading"
                    @click="onSubmit"
                    >确认</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import { setMemberLevel } from "@/api/member/member";
import {getLevels} from "@/api/member/levels";

export default {
    name: "index",
    props: ["value", "code", "curLevelName"],
    data() {
        return {
            levels: [],
            showModal: false,
            submitBtnLoading: false,
            myForm: {
              levelCode:null,
                days: null,
            },
            ruleValidate: {
                levelCode: [
                    {
                        required: true,
                        message: "请选择等级",
                        trigger: "blur",
                    },
                ],
                days: [
                    {
                        required: true,
                        type: "number",
                        message: "请输入有效天数",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    let fd = this.copyJson(this.myForm);
                    fd.memberCode = this.code;
                    let res = await setMemberLevel(fd);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.onVisibleChange(false);
                    }
                }
            });
        },
    },async created() {
      this.levels=await getLevels()
  }
};
</script>

<style scoped></style>
