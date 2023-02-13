<template>
    <Form ref="searchForm" :model="formItem" >
        <Row :gutter="20">
            <Col :span="span">
                <FormItem prop="categoryCode" style="margin-left: 0">
                    <Select
                        v-model="formItem.categoryCode"
                        slot="prepend"
                        style="width: 100px"
                    >

                    </Select>
                </FormItem>
            </Col>
            <Col style="text-align: right" :span="span">
                <search-button-group
                    :show-expand-btn="false"
                    @on-search="search"
                    @on-reset="reset"
                />
            </Col>
        </Row>
    </Form>
</template>

<script>
export default {
    name: "search-filter",
    data() {
        return {
            span: 12,
            formItem: {
                categoryCode: 1,
            },
        };
    },
    watch: {

    },
    methods: {
        search() {
            let json = this.copyJson(this.formItem);
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        },
    },
};
</script>

<style scoped lang="less"></style>
