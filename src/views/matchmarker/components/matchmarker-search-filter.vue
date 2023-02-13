<template>
  <Form
    ref="searchForm"
    :model="formItem"
    :label-width="80"
  >
    <Row>
      <Col :span="span">
      <FormItem
        prop="nickOrCodeTxt"
        style="margin-left: 0"
        :label-width="0"
      >
        <Input
          :placeholder="searchPlaceHolder"
          clearable
          v-model="formItem.nickOrCodeTxt"
        >
        <Select
          v-model="formItem.nickOrCode"
          slot="prepend"
          style="width: 120px"
        >
          <Option :value="1">红娘ID</Option>
          <Option :value="2">红娘昵称</Option>
        </Select>
        </Input>
      </FormItem>
      </Col>

      <Col :span="span">
      <FormItem label="地区">
        <area-cascader
          style="width: 200px"
          v-model="areaSelect"
          target="town"
          change-on-select
          clearable
        ></area-cascader>
      </FormItem>
      </Col>
         <Col :span="span">
      <FormItem
        label="所属商户"
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
      <Col :span="span">
      <FormItem
        label="审核状态"
        prop="checkState"
      >
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

      <Col
        :span="span"
        v-show="expandSearchFilter"
      >
      <FormItem
        label="账号状态"
        prop="status"
      >
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
      <Col
        :span="span"
        v-show="expandSearchFilter"
      >
      <FormItem
        label="创建时间"
        prop="createTimeRange"
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

      <Col
        style="text-align: right"
        :span="expandSearchFilter ? 24 : span"
      >
      <search-button-group
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
    DatePickerOptions,
    accountStatusOptions,
    checkStateOptions
} from "@/common/utils/viewui-utils";
import AreaCascader from "@/components/area/areaCascader";
import { getStoreList } from "@/api/store/store";
export default {
    name: "matchmarker-search-filter",
    components: { AreaCascader },
    props: ["showCheck"],
    data() {
        return {
            areaSelect: null,
            searchPlaceHolder: "请输入红娘ID",
            span: 6,
            dateOptions: DatePickerOptions,
            checkStateOptions: checkStateOptions(),
            accountStatusOptions: accountStatusOptions(),
            expandSearchFilter: false,
            formItem: {
                checkState: 2,
                nickOrCode: 1,
                nickOrCodeTxt: null,
                status: null,
                createTimeRange: []
            },
            storeList:[]
        };
    },
    watch: {
        areaSelect(val) {
            this.formItem.provinceCode = val[0] ? val[0] : null;
            this.formItem.cityCode = val[1] ? val[1] : null;
            this.formItem.countyCode = val[2] ? val[2] : null;
            this.formItem.townCode = val[3] ? val[3] : null;
        },
        "formItem.nickOrCode"(cur) {
            this.searchPlaceHolder =
                cur === 1 ? "请输入红娘ID" : "请输入红娘昵称";
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
            const map = new Map([[1, "code"], [2, "nickName"]]);
            json[map.get(json.nickOrCode)] = json.nickOrCodeTxt;
            delete json.nickOrCode;
            delete json.nickOrCodeTxt;
            json.createTimeRange = createTimeRange;
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
            this.areaSelect = [];
        }
    }
};
</script>

<style scoped lang="less"></style>
