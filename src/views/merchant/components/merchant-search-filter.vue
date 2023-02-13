<template>
  <Form
    ref="searchForm"
    :model="formItem"
    :label-width="80"
  >
    <Row>
      <Col :span="span2">
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
          style="width: 120px"
        >
          <Option :value="1">加盟商名称</Option>
          <Option :value="2">联系人</Option>
          <Option :value="3">联系人手机</Option>
        </Select>
        </Input>
      </FormItem>
      </Col>
      <Col :span="span">
      <FormItem
        label="状态"
        prop="status"
      >
        <Select
          v-model="formItem.status"
          style="width: 160px"
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
      <FormItem
        label="所属商户"
        prop="storeCode"
      >
        <Select
          v-model="formItem.storeCode"
          style="width:160px"
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
          style="width: 160px"
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
        :span="span"
      >
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
    checkStateOptions
} from "@/common/utils/viewui-utils";
import { getStoreList } from "@/api/store/store";
export default {
    name: "member-search-filter",
    data() {
        return {
            storeList: [],
            checkStateOptions: checkStateOptions(),
            searchPlaceHolder: "请输入加盟商名称",
            span: 4,
            span2: 6,
            dateOptions: DatePickerOptions,
            accountStatusOptions: accountStatusOptions(),
            expandSearchFilter: false,
            formItem: {
                checkState: 2,
                inputOptions: 1,
                inputTargetText: null,
                status: null,
                createTimeRange: []
            }
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([
                [1, "请输入加盟商名称"],
                [2, "请输入联系人姓名"],
                [3, "请输入联系人手机"]
            ]);
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
            const map = new Map([
                [1, "name"],
                [2, "contact"],
                [3, "contactMobile"]
            ]);
            json[map.get(json.inputOptions)] = json.inputTargetText;

            delete json.inputOptions;
            delete json.inputTargetText;
            json.createTimeRange = createTimeRange;
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        }
    }
};
</script>

<style scoped lang="less"></style>
