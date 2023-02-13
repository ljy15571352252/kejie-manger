<template>
  <Form
    ref="searchForm"
    :model="formItem"
    :label-width="80"
  >
    <Row>
      <Col :span="span">
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
          <Option :value="2">姓名</Option>
        </Select>
        </Input>
      </FormItem>
      </Col>
      <Col :span="span">
      <FormItem
        label="手机号"
        prop="mobileNumber"
      >
        <Input
          placeholder="请输入手机号"
          clearable
          v-model="formItem.mobileNumber"
        ></Input>
      </FormItem>
      </Col>
      <Col :span="span">
      <FormItem
        label="性别"
        prop="sex"
      >
        <Select
          v-model="formItem.sex"
          style="width: 200px"
          clearable
        >
          <Option
            v-for="item in sexItem"
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
        :span="span"
        v-show="expandSearchFilter"
      >
      <FormItem label="地区">
        <area-cascader
          style="width: 200px"
          v-model="areaSelect"
          target="county"
          change-on-select
          clearable
        ></area-cascader>
      </FormItem>
      </Col>
      <Col
        :span="span"
        v-show="expandSearchFilter"
      >
      <FormItem
        label="已实名"
        prop="idCardVerify"
      >
        <Select
          style="width: 200px"
          clearable
          v-model="formItem.idCardVerify"
        >
          <Option
            v-for="item in realNameCertOptions"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col
        :span="span"
        v-show="expandSearchFilter && levels.length"
      >
      <FormItem
        label="会员等级"
        prop="levelCode"
      >
        <Select
          style="width: 200px"
          clearable
          v-model="formItem.levelCode"
        >
          <Option
            v-for="item in levels"
            :value="item.code"
            :key="item.code"
          >{{ item.name }}
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col
        :span="span"
        v-show="expandSearchFilter"
      >
      <FormItem
        label="注册时间"
        prop="registerTimeRange"
      >
        <DatePicker
          v-model="formItem.registerTimeRange"
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
import { getLevels } from "@/api/member/levels";
import AreaCascader from "@/components/area/areaCascader";
import { getStoreList } from "@/api/store/store";
export default {
    name: "member-search-filter",
    components: { AreaCascader },
    data() {
        return {
             storeList:[],
            areaSelect: null,
            levels: [],
            searchPlaceHolder: "请输入会员ID",
            span: 6,
            dateOptions: DatePickerOptions,
            realNameCertOptions: [
                {
                    label: "是",
                    value: 1
                },
                {
                    label: "否",
                    value: 0
                }
            ],
            sexItem: [
                {
                    label: "男",
                    value: 1
                },
                {
                    label: "女",
                    value: 0
                }
            ],
            expandSearchFilter: false,
            formItem: {
                sex: null,
                levelCode: null,
                mobileNumber: null,
                inputOptions: 1,
                inputTargetText: null,
                idCardVerify: null,
                registerTimeRange: []
            }
        };
    },
    watch: {
        areaSelect(val) {
            this.formItem.provinceCode = val[0] ? val[0] : null;
            this.formItem.cityCode = val[1] ? val[1] : null;
            this.formItem.countyCode = val[2] ? val[2] : null;
        },
        "formItem.inputOptions"(cur) {
            const map = new Map([[1, "请输入会员ID"], [2, "请输入姓名"]]);
            this.searchPlaceHolder = map.get(cur);
        }
    },
    async created() {
        this.levels = await getLevels();
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
            let registerTimeRange = null;
            if (this.formItem.registerTimeRange[0]) {
                registerTimeRange = this.formItem.registerTimeRange.map(i => {
                    if (!i) return i;
                    return i.Format("yyyy-MM-dd");
                });
            }

            let json = this.copyJson(this.formItem);
            const map = new Map([[1, "code"], [2, "realName"]]);
            json[map.get(json.inputOptions)] = json.inputTargetText;
            json.sex = BooleanTransfer(json.sex);
            json.idCardVerify = BooleanTransfer(json.idCardVerify);
            json.registerTimeRange = registerTimeRange;

            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
            this.areaSelect = [];
        }
    }
};
</script>

<style scoped></style>
