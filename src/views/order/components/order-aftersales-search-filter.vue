<template>
    <Form ref="searchForm" :model="formItem" >
        <Row :gutter="20">
            <Col>
                <FormItem prop="inputTargetText" style="margin-left: 0">
                    <Input
                        :placeholder="searchPlaceHolder"
                        clearable
                        v-model="formItem.inputTargetText"
                    >
                        <Select
                            v-model="formItem.inputOptions"
                            slot="prepend"
                            style="width: 100px"
                        >
                            <Option :value="1">退款编号</Option>
                            <Option :value="2">订单编号</Option>
                        </Select>
                    </Input>
                </FormItem>
            </Col>
            <Col>
                <FormItem label="售后类型" prop="type" :label-width="80">
                    <Select
                        v-model="formItem.state"
                        clearable
                    >
                        <Option
                            v-for="item in productOrderStateOptions"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            
            <Col>
                <FormItem label="订单状态" prop="state" :label-width="80">
                    <Select
                        v-model="formItem.state"
                        clearable
                    >
                        <Option
                            v-for="item in productOrderStateOptions"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col>
                <FormItem label="下单时间" prop="createTimeRange" :label-width="80">
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
            <Col
                style="text-align: right"
            >
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
    DatePickerOptions,
    productOrderStateOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "product-order-search-filter",
    data() {
        return {
            searchPlaceHolder: "请输入订单号",
            dateOptions: DatePickerOptions,
            productOrderStateOptions: productOrderStateOptions(),
            expandSearchFilter: false,
            formItem: {
                inputOptions: 1,
                inputTargetText: null,
            },
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([
                [1, "请输入订单号"],
                [2, "请输入下单用户ID"],
            ]);
            this.searchPlaceHolder = map.get(cur);
        },
    },
    methods: {
        onExpand(val) {
            this.expandSearchFilter = val;
        },
        search() {
            let createTimeRange = null;
            if (this.formItem.createTimeRange[0]) {
                createTimeRange = this.formItem.createTimeRange.map(
                    i => {
                        if (!i) return i;
                        return i.Format("yyyy-MM-dd");
                    }
                );
            }

            let json = this.copyJson(this.formItem);
            const map = new Map([
                [1, "code"],
                [2, "productOrderCode"],
            ]);
            json[map.get(json.inputOptions)] = json.inputTargetText;

            delete json.inputOptions;
            delete json.inputTargetText;
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
