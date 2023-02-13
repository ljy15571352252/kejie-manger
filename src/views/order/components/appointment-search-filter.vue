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
                            <Option :value="1">发约者ID</Option>
                            <Option :value="2">被约者ID</Option>
                        </Select>
                    </Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="约会状态" prop="state">
                    <Select
                        v-model="formItem.state"
                        style="width: 200px"
                        clearable
                    >
                        <Option
                            v-for="item in appointmentStateOptions"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col :span="span" v-show="expandSearchFilter">
                <FormItem prop="address" label="约会地点">
                    <Input
                        placeholder="请输入约会地点"
                        clearable
                        v-model="formItem.address"
                    >
                    </Input>
                </FormItem>
            </Col>

            <Col :span="span" v-show="expandSearchFilter">
                <FormItem label="约会时间" prop="appointmentDateRange">
                    <DatePicker
                        v-model="formItem.appointmentDateRange"
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
    appointmentStateOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "member-search-filter",
    data() {
        return {
            searchPlaceHolder: "请输入发约者ID",
            span: 6,
            dateOptions: DatePickerOptions,
            appointmentStateOptions: appointmentStateOptions(),
            expandSearchFilter: false,
            formItem: {
                inputOptions: 1,
                inputTargetText: null,
                state: null,
                address: null,
                appointmentDateRange: null,
            },
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([
                [1, "请输入发约者ID"],
                [2, "请输入被约者ID"],
            ]);
            this.searchPlaceHolder = map.get(cur);
        },
    },
    methods: {
        onExpand(val) {
            this.expandSearchFilter = val;
        },
        search() {
            let appointmentDateRange = null;
            if (this.formItem.appointmentDateRange[0]) {
                appointmentDateRange = this.formItem.appointmentDateRange.map(
                    i => {
                        if (!i) return i;
                        return i.Format("yyyy-MM-dd");
                    }
                );
            }

            let json = this.copyJson(this.formItem);
            const map = new Map([
                [1, "signerCode"],
                [2, "promiseeCode"],
            ]);
            json[map.get(json.inputOptions)] = json.inputTargetText;

            delete json.inputOptions;
            delete json.inputTargetText;
            json.appointmentDateRange = appointmentDateRange;
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        },
    },
};
</script>

<style scoped lang="less"></style>
