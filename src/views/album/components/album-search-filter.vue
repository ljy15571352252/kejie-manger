<template>
  <Form
    ref="searchForm"
    :model="formItem"
  >
    <Row :gutter="20">
      <!-- <Col :span="span">
      <FormItem
        prop="inputTargetText"
        style="margin-left: 0"
      >
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
          <Option :value="1">图片名称</Option>
          <Option :value="2">会员昵称</Option>
        </Select>
        </Input>
      </FormItem>
      </Col> -->
      <Col :span="span">
      <FormItem
        label="发布时间"
        prop="createTimeRange"
        :label-width="80"
      >
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
      <Col :span="span">
      <FormItem label="手机号">
        <Input
          v-model="formItem.userMobile"
          style="width: 160px"
          placeholder="请输入手机号"
        ></Input>
      </FormItem>
      </Col>
      <Col :span="span">
      <FormItem
        label="商户名称"
        prop="storeCode"
      >
        <Select
          v-model="formItem.storeCode"
          style="width:200px"
          filterable
          filter-by-label
        >
          <Option
            v-for="item in storeList"
            :value="item.code"
            :key="item.code"
          >{{ item.name }}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col
        style="text-align: right"
        :span="span"
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
    checkStateOptions
} from "@/common/utils/viewui-utils";
import { getStoreList } from "@/api/store/store";
export default {
    name: "member-search-filter",
    data() {
        return {
            span: 6,
            span1: 4,
            // span2:3,
            expandSearchFilter: false,
            searchPlaceHolder: "请输入图片名称",
            dateOptions: DatePickerOptions,
            formItem: {
                inputOptions: 1,
                inputTargetText: null,
                topicCode: null,
                checkState: null,
                content: null,
                createTimeRange: [],
                userMobile: "",
                storeCode: ""
            }
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([[1, "请输入图片名称"], [2, "请输入会员昵称"]]);
            this.searchPlaceHolder = map.get(cur);
        }
    },
    created() {
        this.getDataList(1);
    },
    methods: {
        async getDataList(page) {
            const searchQuery = {
                page: page
            };
            let { records, total, size, current } = await getStoreList(
                searchQuery
            );
            this.storeList = records;
            // this.pageInfo = {
            //     total,
            //     size,
            //     current
            // };
        },
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
            const map = new Map([[1, "nickName"], [2, "memberCode"]]);
            json[map.get(json.inputOptions)] = json.inputTargetText;

            delete json.inputOptions;
            delete json.inputTargetText;
            json.createTimeRange = createTimeRange ? createTimeRange : [];
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        }
    }
};
</script>

<style scoped lang="less"></style>
