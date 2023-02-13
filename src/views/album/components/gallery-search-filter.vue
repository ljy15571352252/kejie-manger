<template>
    <Form ref="searchForm" :model="formItem" >
        <Row :gutter="20">
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
                                style="width: 100px"
                        >
                            <Option :value="1">会员ID</Option>
<!--                            <Option :value="2">会员昵称</Option>-->
                        </Select>
                    </Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="发布时间" prop="createTimeRange" :label-width="80">
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
    DatePickerOptions,
    checkStateOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "member-search-filter",
    data() {
        return {
            span: 8,
            expandSearchFilter: false,
            searchPlaceHolder: "请输入会员ID",
            dateOptions: DatePickerOptions,
            formItem: {
                inputOptions: 1,
                inputTargetText: null,
                topicCode: null,
                checkState: null,
                content: null,
                createTimeRange:null
            },
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([
                [1, "请输入会员ID"],
                [2, "请输入会员昵称"],
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
                [1, "memberCode"],
                [2, "nickName"],
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
