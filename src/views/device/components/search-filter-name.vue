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
export default {
    name: "search-filter-name",
    data() {
        return {
            formItem: {
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
