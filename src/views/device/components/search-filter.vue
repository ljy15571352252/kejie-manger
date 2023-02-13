<template>
  <Form
    ref="searchForm"
    :model="formItem"
    inline
  >
    <FormItem>
      <Input
        v-model="formItem.name"
        placeholder="请输入名称"
      ></Input>
    </FormItem>
    <FormItem prop="checkState">
      <Select
        v-model="formItem.auditState"
        style="width: 200px"
        clearable
        placeholder="请选择审核状态"
      >
        <Option
          v-for="item in checkStateOptions"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}
        </Option>
      </Select>
    </FormItem>

    <FormItem>
      <search-button-group
        :show-expand-btn="false"
        @on-search="search"
        @on-reset="reset"
      />
    </FormItem>
  </Form>
</template>

<script>
import { checkStateOptions } from "@/common/utils/viewui-utils";
export default {
    name: "search-filter",
    data() {
        return {
            checkStateOptions: checkStateOptions(),
            formItem: {
                auditState: 1,
                name: ""
            }
        };
    },

    methods: {
        search() {
            this.$emit("on-search", this.formItem);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        }
    }
};
</script>

<style scoped lang="less"></style>
