<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
        <Row>
            <Col :span="span">
                <FormItem label="功能名称" prop="name">
                    <Input
                        placeholder="请输入功能名称"
                        clearable
                        v-model="formItem.name"
                    ></Input>
                </FormItem>
            </Col>

            <Col :span="span" >
                <FormItem label="状态" prop="state">
                    <Select
                        v-model="formItem.state"
                        style="width: 200px"
                        clearable
                    >
                        <Option
                            v-for="item in functionsStatusOptions"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>

            <Col
                style="text-align: right"
                :span="span"
            >
                <search-button-group
                    :showExpandBtn="false"
                    @on-search="search"
                    @on-reset="reset"
                    @on-expand="onExpand"
                />
            </Col>
        </Row>
    </Form>
</template>

<script>
import {
    functionsStatusOptions,
} from "@/common/utils/viewui-utils";

export default {
    name: "member-search-filter",
    data() {
        return {
            span: 8,
          functionsStatusOptions: functionsStatusOptions(),
            expandSearchFilter: false,
            formItem: {
                state: null,
                name: null,
            },
        };
    },
    methods: {
        onExpand(val) {
            this.expandSearchFilter = val;
        },
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

<style scoped></style>
