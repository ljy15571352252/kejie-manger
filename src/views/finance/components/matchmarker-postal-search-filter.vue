<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
        <Row>
            <Col :span="span">
                <FormItem prop="matchMarkerCode" label="红娘ID">
                    <Input
                        placeholder="请输入红娘ID"
                        clearable
                        v-model="formItem.matchMarkerCode"
                    >
                    </Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="审核状态" prop="checkState">
                    <Select
                            v-model="formItem.checkState"
                            style="width: 200px"
                            clearable
                    >
                        <Option
                                v-for="item in checkStateOptions"
                                :value="item.value"
                                :key="item.value"
                        >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="类型" prop="type">
                    <Select
                            v-model="formItem.type"
                            style="width: 200px"
                            clearable
                    >
                        <Option
                                v-for="item in postalOptions"
                                :value="item.value"
                                :key="item.value"
                        >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col :span="span" v-show="expandSearchFilter">
                <FormItem label="申请时间" prop="createTimeRange">
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
            <Col style="text-align: right" :span="!expandSearchFilter ? span : 24 - span">
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
    checkStateOptions,
    postalOptions
} from "@/common/utils/viewui-utils";

export default {
    name: "matchmarker-postal-search-filter",
    data() {
        return {
            span: 6,
            expandSearchFilter: false,
            dateOptions: DatePickerOptions,
            checkStateOptions:checkStateOptions(),
            postalOptions:postalOptions(),
            formItem: {
                type:null,
                checkState:null,
                matchMarkerCode: null,
                createTimeRange: [],
            },
        };
    },
    watch: {
    },
    methods: {
        onExpand(val) {
            this.expandSearchFilter = val;
        },
        search() {
            let createTimeRange=null
            if (this.formItem.createTimeRange[0]) {
                createTimeRange = this.formItem.createTimeRange.map(i => {
                    if (!i) return i;
                    return i.Format("yyyy-MM-dd");
                });
            }
            let json = this.copyJson(this.formItem);
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
