<template>
  <Form
    ref="searchForm"
    :model="formItem"
    :label-width="80"
  >
    <Row>
      <Col :span="5">
      <FormItem
        prop="inputTargetText"
        style="margin-left: 0"
        :label-width="0"
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
          <Option :value="1">会员ID</Option>
          <Option :value="2">昵称</Option>
        </Select>
        </Input>
      </FormItem>
      </Col>
      <Col :span="5">
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
      <Col :span="5">
      <FormItem
        label="手机号"
        prop="mobile"
      >
        <Input
          placeholder="请输入手机号"
          clearable
          v-model="formItem.mobile"
        ></Input>
      </FormItem>
      </Col>
      <Col :span="5">
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
    BooleanTransfer,
    DatePickerOptions
} from "@/common/utils/viewui-utils";
import AreaCascader from "@/components/area/areaCascader";
import {
    getStoreList
} from "@/api/store/store";
export default {
    name: "member-search-filter",
    components: { AreaCascader },
    data() {
        return {
            searchPlaceHolder: "请输入会员ID",
            span: 4,
            dateOptions: DatePickerOptions,
            expandSearchFilter: false,
            formItem: {
                createTimeRange: [],
                mobile: null,
                inputOptions: 1,
                inputTargetText: null,
                status: null,
                username: null,
                storeCode:''
            },
             storeList:[]
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([[1, "请输入会员ID"], [2, "请输入昵称"]]);
            this.searchPlaceHolder = map.get(cur);
        }
    },
    created() {
        this.getDataList(1)
    },
    methods: {
          async getDataList(page) {
            const searchQuery = {
                page: page,
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
            const map = new Map([[1, "code"], [2, "realName"]]);
            json[map.get(json.inputOptions)] = json.inputTargetText;
            json.sex = BooleanTransfer(json.sex);
            json.idCardVerify = BooleanTransfer(json.idCardVerify);
            json.createTimeRange = createTimeRange ? createTimeRange : []; 

            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        }
    }
};
</script>

<style scoped></style>
