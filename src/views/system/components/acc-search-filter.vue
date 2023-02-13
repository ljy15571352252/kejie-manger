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
                            <Option :value="1">用户ID</Option>
                            <Option :value="2">用户昵称</Option>
                            <Option :value="3">用户手机</Option>
                            <Option :value="4">用户名</Option>
                        </Select>
                    </Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="状态" prop="status">
                    <Select
                        v-model="formItem.status"
                        style="width: 200px"
                        clearable
                    >
                        <Option
                            v-for="item in accountStatusOptions"
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
import {
    DatePickerOptions,
    accountStatusOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "member-search-filter",
    data() {
        return {
            searchPlaceHolder: "请输入用户ID",
            span: 6,
            dateOptions: DatePickerOptions,
            accountStatusOptions: accountStatusOptions(),
            expandSearchFilter: false,
            formItem: {
                inputOptions: 1,
                inputTargetText: null,
                status: null,
                createTimeRange: null,
            },
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([
                [1, "请输入用户ID"],
                [2, "请输入用户昵称"],
                [3, "请输入用户手机"],
                [4, "请输入用户名"],
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
                createTimeRange = this.formItem.createTimeRange.map(i => {
                    if (!i) return i;
                    return i.Format("yyyy-MM-dd");
                });
            }

            let json = this.copyJson(this.formItem);
            const map = new Map([
                [1, "code"],
                [2, "nickName"],
                [3, "mobile"],
                [4,"username"]
            ]);
            json[map.get(json.inputOptions)] = json.inputTargetText;

            delete json.inputOptions;
            delete json.inputTargetText;
            json.createTimeRange=createTimeRange
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        },
    },
};
</script>

<style scoped lang="less"></style>
