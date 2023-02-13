<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
        <Row>
            <Col :span="span">
                <FormItem label="群组名" prop="name">
                    <Input
                        placeholder="请输入群组名称"
                        clearable
                        v-model="formItem.name"
                        />
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="状态" prop="status">
                    <Select
                        v-model="formItem.status"
                        clearable
                    >
                        <Option
                            v-for="item in upOrDownStatusOptions"
                            :value="item.value"
                            :key="item.value"
                        >{{ item.label }}
                        </Option>
                    </Select>
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
            <Col style="text-align: right" :span="6">
                <search-button-group
                    @on-search="search"
                    @on-reset="reset"
                    :show-expand-btn="false"
                />
            </Col>
        </Row>
    </Form>
</template>

<script>
import {
    DatePickerOptions, upOrDownStatusOptions
} from "@/common/utils/viewui-utils";

export default {
    name: "group-search-filter",
    data() {
        return {
            span: 6,
            upOrDownStatusOptions:upOrDownStatusOptions(),
            dateOptions: DatePickerOptions,
            formItem: {
                name: null,
                createTimeRange: null,
            },
        };
    },
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

<style scoped></style>
