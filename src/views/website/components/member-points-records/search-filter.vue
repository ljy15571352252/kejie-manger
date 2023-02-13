<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
        <Row>
            <Col :span="span">
                <FormItem label="类型" prop="type">
                    <Select v-model="formItem.type" clearable>
                        <Option
                            v-for="item in inOutOptions"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="时间" prop="createTimeRange">
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
    BooleanTransfer,
    DatePickerOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "points-search-filter",
    data() {
        return {
            span: 8,
            dateOptions: DatePickerOptions,
            inOutOptions: [
                {
                    label: "收入",
                    value: 1,
                },
                {
                    label: "支出",
                    value: 2,
                },
            ],
            formItem: {
                type: null,
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
