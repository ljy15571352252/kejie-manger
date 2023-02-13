<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
        <Row>
            <Col :span="span">
                <FormItem prop="inputTargetText" style="margin-left: 0">
                    <Input
                        :placeholder="searchPlaceHolder"
                        clearable
                        v-model="formItem.inputTargetText"
                    >
                        <Select
                            v-model="formItem.inputOptions"
                            slot="prepend"
                            style="width: 120px"
                        >
                            <Option :value="1">下单会员ID</Option>
                            <Option :value="2">金币套餐ID</Option>
                        </Select>
                    </Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="订单状态" prop="state">
                    <Select
                        v-model="formItem.state"
                        style="width: 200px"
                        clearable
                    >
                        <Option
                            v-for="item in coinsOrderStateOptions"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="订单类型" prop="type">
                    <Select
                            v-model="formItem.type"
                            style="width: 200px"
                            clearable
                    >
                        <Option
                                v-for="item in coinsOrderTypeOptions"
                                :value="item.value"
                                :key="item.value"
                        >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>

            <Col :span="span" v-show="expandSearchFilter">
                <FormItem label="下单时间" prop="createTimeRange">
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
                :span="!expandSearchFilter ? span : 24 - span"
            >
                <search-button-group
                    @on-expand="onExpand"
                    @on-search="search"
                    @on-reset="reset"
                />
            </Col>
        </Row>
    </Form>
</template>

<script>
import {
    DatePickerOptions,
    coinsOrderStateOptions,
    coinsOrderTypeOptions
} from "@/common/utils/viewui-utils";

export default {
    name: "member-search-filter",
    data() {
        return {
            searchPlaceHolder: "请输入下单用户ID",
            span: 6,
            dateOptions: DatePickerOptions,
            coinsOrderStateOptions: coinsOrderStateOptions(),
            coinsOrderTypeOptions:coinsOrderTypeOptions(),
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
                [1, "请输入下单用户ID"],
                [2, "金币套餐ID"],
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
                [1, "memberCode"],
                [2, "coinsSetCode"],
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
