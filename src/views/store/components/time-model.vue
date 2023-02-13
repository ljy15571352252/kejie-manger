<template>
  <div>
    <Modal
      v-model="showModal"
      :title="title"
      :mask-closable="false"
      @on-visible-change="onVisibleChange"
    >
      <Form
        :model="formItem"
        ref="formItem"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          prop="createTimeRange"
          label="服务期"
        >
          <DatePicker
            v-model="formItem.createTimeRange"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :options="dateOptions"
            placeholder="选择到期时间"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="onVisibleChange(false)"
        >取消</Button>
        <Button
          type="primary"
          @click="onSubmit"
        >提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
    DatePickerOptions,
    checkStateOptions
} from "@/common/utils/viewui-utils";
export default {
    name: "group-modal",
    props: ["value", "timeForm"],
    data() {
        return {
            title: "编辑系统使用有效期",
            dateOptions: DatePickerOptions,
            showModal: false,
            formItem: {
                createTimeRange: ""
            },
            ruleValidate: {
                createTimeRange: [
                    {
                        required: true,
                        message: "请选择过期时间",
                         type: 'date',
                        trigger: "change"
                    }
                ]
            }
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
        timeForm(row) {
            this.formItem.createTimeRange = row;
        }
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            this.$refs["formItem"].validate(async valid => {
                if (valid) {
                    let createTimeRange = this.getStrDate(
                        this.formItem.createTimeRange
                    );
                    this.$emit("on-search", createTimeRange);
                    this.onVisibleChange(false)
                }
            });
        },
        getStrDate(date) {
            if (date && typeof date !== "string") {
                return date.Format("yyyy-MM-dd hh:mm:ss");
            }
            return "";
        }
    }
};
</script>

<style scoped></style>
