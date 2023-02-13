<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
        <Row :gutter="16">
            <Col>
                <FormItem prop="inputTargetText" style="margin-left: 0"  :label-width="0">
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
                            <Option :value="1">商品名称</Option>
                            <Option :value="2">商品ID</Option>
                        </Select>
                    </Input>
                </FormItem>
            </Col>
          <Col>
            <FormItem label="状态" prop="state" :label-width="50">
              <Select
                  v-model="formItem.state"
                  clearable
              >
                <Option
                    v-for="item in upOrDownStatusOptions"
                    :value="item.value"
                    :key="item.value"
                >{{ item.label }}
                </Option>
              </Select>
            </FormItem>
          </Col>
            <Col>
                <FormItem prop="categoryCode" label="商品分类" >
                    <Select
                        v-model="formItem.categoryCode"
                        clearable
                    >
                        <Option
                            v-for="(item, key) in categoryList"
                            :key="key"
                            :value="item.code"
                            >{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <Col>
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
            <Col style="text-align: right">
                <search-button-group
                    @on-search="search"
                    @on-reset="reset"
                    :show-expand-btn="false"
                    class="productSearch"
                />
            </Col>
        </Row>
    </Form>
</template>

<script>
import {
  DatePickerOptions, upOrDownStatusOptions,
} from "@/common/utils/viewui-utils";
import { getProductCategories } from "@/api/product/product";
export default {
    name: "video-search-filter",
    data() {
        return {
          expandSearchFilter:false,
          upOrDownStatusOptions:upOrDownStatusOptions(),
            span: 4,
            dateOptions: DatePickerOptions,
            searchPlaceHolder: "请输入商品名称",
            formItem: {
                inputOptions: 1,
                inputTargetText: null,
                createTimeRange: null,
                categoryCode: null,
              state:null,
            },
            categoryList:[]
        };
    },
    async mounted(){
        
        this.categoryList = await getProductCategories();
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([
                [1, "请输入商品名称"],
                [2, "请输入商品ID"],
            ]);
            this.searchPlaceHolder = map.get(cur);
        },
    },
    methods: {
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
                [1, "promoteText"],
                [2, "code"],
            ]);
            json[map.get(json.inputOptions)] = json.inputTargetText;
            json.createTimeRange = createTimeRange;
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        },
    },
};
</script>

<style scoped lang="less">
.productSearch{
    /deep/.ivu-form-item-content{
        margin-left: 20px !important;
    }
}
.statusLabel{
    /deep/.ivu-form-item-label{
        width:50px !important;
    }
}
</style>
