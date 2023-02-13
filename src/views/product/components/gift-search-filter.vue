<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
        <Row>
            <Col :span="span">
                <FormItem prop="name" label="礼物名称">
                    <Input
                        placeholder="请输入礼物名称"
                        clearable
                        v-model="formItem.name"
                    >
                    </Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="创建时间" prop="createTimeRange">
                    <DatePicker
                        v-model="formItem.createTimeRange"
                        type="daterange"
                        format="yyyy-MM-dd"
                        :options="dateOptions"
                        placeholder="选择时间范围"
                        style="width: 200px"
                    ></DatePicker>
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
        <slot></slot>
    </Form>
</template>

<script>
import {
    DatePickerOptions,
    showHideStatusOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "member-search-filter",
    data() {
        return {
            span: 8,
            dateOptions: DatePickerOptions,
            showHideStatusOptions: showHideStatusOptions(),
            formItem: {
                name: null,
                status: null,
                content: null,
            },
        };
    },
    watch: {},
    methods: {
        search() {
            let createTimeRange = null;
            if (this.formItem.createTimeRange[0]) {
                createTimeRange = this.formItem.createTimeRange.map(i => {
                    if (!i) return i;
                    return i.Format("yyyy-MM-dd");
                });
            }
            let json = this.copyJson(this.formItem);
            json.createTimeRange = createTimeRange;
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        },
    },
};
</script>

<style scoped lang="less"></style>
