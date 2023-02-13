<template>
    <Form ref="searchForm" :model="formItem" :label-width="80">
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
                            style="width: 100px"
                        >
                            <Option :value="1">会员ID</Option>
                            <Option :value="2">姓名</Option>
                        </Select>
                    </Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="手机号" prop="mobileNumber">
                    <Input
                        placeholder="请输入手机号"
                        clearable
                        v-model="formItem.mobileNumber"
                    ></Input>
                </FormItem>
            </Col>
            <Col :span="span">
                <FormItem label="性别" prop="sex">
                    <Select v-model="formItem.sex" clearable>
                        <Option
                            v-for="item in sexItem"
                            :value="item.value"
                            :key="item.value"
                            >{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Col>
            <template v-if="expandSearchFilter">
                <Col :span="span">
                    <FormItem label="年龄范围" prop="ageRange">
                        <Select v-model="formItem.ageRange" clearable>
                            <Option
                                v-for="item in ageRangeOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col :span="span">
                    <FormItem label="身高范围" prop="tallRange">
                        <Select v-model="formItem.tallRange" clearable>
                            <Option
                                v-for="item in tallRangeOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col :span="span">
                    <FormItem label="车产条件" prop="carCond">
                        <Select v-model="formItem.carCond" clearable>
                            <Option
                                v-for="item in mateRequireCarCondOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col :span="span">
                    <FormItem label="房产条件" prop="houseCond">
                        <Select v-model="formItem.houseCond" clearable>
                            <Option
                                v-for="item in mateRequireHouseCondOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col :span="span">
                    <FormItem label="结婚状态" prop="marriageStatus">
                        <Select v-model="formItem.marriageStatus" clearable>
                            <Option
                                v-for="item in marriageStatusOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col :span="span">
                    <FormItem label="月入条件" prop="monthlySalary">
                        <Select v-model="formItem.monthlySalary" clearable>
                            <Option
                                v-for="item in monthlySalaryOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col :span="span">
                    <FormItem label="最低学历" prop="minEducation">
                        <Select v-model="formItem.minEducation" clearable>
                            <Option
                                v-for="item in educationOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="span"> </Col>
            </template>

            <Col
                style="text-align: right"
                :span="!expandSearchFilter ? span : 6"
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
    ageRangeOptions,
    BooleanTransfer,
    educationOptions,
    marriageStatusOptions,
    mateRequireCarCondOptions,
    mateRequireHouseCondOptions,
    monthlySalaryOptions,
    sexOptions,
    tallRangeOptions,
} from "@/common/utils/viewui-utils";
const ageRangeMap = new Map([
    [1, [18, 20]],
    [2, [23, 25]],
    [3, [26, 30]],
    [4, [31, 35]],
    [5, [36, 40]],
    [6, [41, 45]],
    [7, [46, 50]],
    [8, [50]],
]);
const tallRangeMap = new Map([
    [1, [0, 155]],
    [2, [156, 160]],
    [3, [161, 165]],
    [4, [166, 170]],
    [5, [171, 175]],
    [6, [175, 180]],
    [7, [180]],
]);
export default {
    name: "push-search-filter",
    props: ["initMateRequire"],
    data() {
        return {
            searchPlaceHolder: "请输入会员ID",
            span: 6,
            sexItem: sexOptions(),
            ageRangeOptions: ageRangeOptions(),
            tallRangeOptions: tallRangeOptions(),
            mateRequireCarCondOptions: mateRequireCarCondOptions(),
            mateRequireHouseCondOptions: mateRequireHouseCondOptions(),
            monthlySalaryOptions: monthlySalaryOptions(),
            marriageStatusOptions: marriageStatusOptions(),
            educationOptions: educationOptions(),
            expandSearchFilter: false,
            formItem: {
                sex: null,
                mobileNumber: null,
                inputOptions: 1,
                inputTargetText: null,
                minEducation: null,
                monthlySalary: null,
                marriageStatus: null,
                houseCond: null,
                carCond: null,
                tallRange: null,
                ageRange: null,
            },
        };
    },
    watch: {
        "formItem.inputOptions"(cur) {
            const map = new Map([
                [1, "请输入会员ID"],
                [2, "请输入姓名"],
            ]);
            this.searchPlaceHolder = map.get(cur);
        },
        initMateRequire(cur) {
            this.initMateRequireQuery(this.isEmptyObject(cur) ? {} : cur);
        },
    },
    async created() {},
    methods: {
        initMateRequireQuery(obj) {
            this.formItem = {
                ...this.formItem,
                ...obj,
            };
        },
        onExpand(val) {
            this.expandSearchFilter = val;
        },
        search() {
            let json = this.copyJson(this.formItem);
            if (json.ageRange) json.ageRange = ageRangeMap.get(json.ageRange);
            if (json.tallRange)
                json.tallRange = tallRangeMap.get(json.tallRange);
            const map = new Map([
                [1, "code"],
                [2, "realName"],
            ]);
            json[map.get(json.inputOptions)] = json.inputTargetText;
            json.sex = BooleanTransfer(json.sex);
            this.$emit("on-search", json);
        },
        reset() {
            this.$refs["searchForm"].resetFields();
        },
    },
};
</script>

<style scoped></style>
