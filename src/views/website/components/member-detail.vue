<template>
    <div>
        <Form :model="myForm" class="member-detail-form">
            <Row v-if="mode === PAGE_MODE.DETAIL">
                <Col span="10" style="text-align: center">
                    <div>
                        <Avatar
                            :src="myForm.headUrl"
                            size="64"
                            shape="square"
                            style="position: relative; cursor: pointer"
                            @click.native="onImagePreview(myForm.headUrl)"
                        >
                        </Avatar>
<!--                        <template v-if="headerCheck">
                            <span
                                class="check-tip"
                                v-show="
                                    headerCheck.checkState !==
                                    this.CHECK_STATE.PASS
                                "
                                >{{
                                    headerCheck.checkState | checkState
                                }}</span
                            >
                        </template>-->
                    </div>
<!--                    <Button
                        v-show="
                            headerCheck &&
                            headerCheck.checkState ===
                                this.CHECK_STATE.WAIT_FOR_CHECK
                        "
                        size="small"
                        style="margin-top: 8px"
                        @click="showHeaderCheckModal = true"
                        >审核 <Icon type="ios-exit-outline"
                    /></Button>-->
                    <div class="margin-top-8">
                        <div>等级：{{ myForm.levelName || '普通会员' }}</div>
                        <div class="font-small gray-color" v-if="myForm.levelExpireDate">
                            过期时间：{{ myForm.levelExpireDate }}
                        </div>
                    </div>
                </Col>
                <Col span="14" class="top-info">
                    <div>用户 ID：{{ myForm.code }}</div>
                    <div>手机号码：{{ myForm.mobileNumber }}</div>
                    <div>注册时间：{{ myForm.registerTime }}</div>
                </Col>
            </Row>
            <div>
                <Divider orientation="left">账号信息</Divider>
              <FormItem
                  v-if="mode !== PAGE_MODE.DETAIL"
                  label="头像"
                  prop="headUrl"
                  style="margin-top: 15px"
              >
                <image-upload
                    @on-upload-success="
                            url => {
                                $set(myForm, 'headUrl', url);
                            }
                        "
                >
                  <div class="upload-img-tem" style="border: 1px dashed">
                    <img
                        :src="myForm.headUrl"
                        v-if="myForm.headUrl"
                    />
                    <span v-if="!myForm.headUrl">+</span>
                  </div>
                </image-upload>
              </FormItem>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="用户昵称">
                            <Input
                                v-model="myForm.nickName"
                                :disabled="mode === PAGE_MODE.DETAIL"
                                placeholder="请输入用户昵称"
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="性别">
                            <Select v-model="myForm.sex" :disabled="mode === PAGE_MODE.DETAIL">
                                <Option
                                    v-for="item in sexOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="qq">
                            <Input
                                v-model="myForm.basic.qq"
                                :disabled="mode === PAGE_MODE.DETAIL"
                                placeholder="请输入qq"
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="微信">
                            <Input
                                v-model="myForm.basic.wechat"
                                :disabled="mode === PAGE_MODE.DETAIL"
                                placeholder="请输入微信"
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="mode === PAGE_MODE.DETAIL">
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="积分"  prop="points.points" >
                            <InputNumber
                                v-model="myForm.points.points"
                                style="width: 240px"
                                disabled
                            ></InputNumber>
                        </FormItem>
                        <div class="margin-top-8" v-if="mode === PAGE_MODE.DETAIL">
                            <a  @click="showPointsModal=true">明细</a>
                        </div>
                    </Col>
                    <Col :span="12" class="form-item-padding" >
                        <FormItem label="状态">
                            <Select
                                v-model="myForm.status"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in accountStatusOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <div class="notice-error margin-top-10" v-if="myForm.status!==1">
                          <div>{{myForm.status | accountStatus}}{{myForm.disableDays}}天（{{myForm.disableReason}}）</div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div v-if="mode === PAGE_MODE.DETAIL">
                <Divider orientation="left">实名信息</Divider>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="真实姓名">
                            <Input
                                v-model="identification.realName"
                                disabled
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="身份证">
                            <Input
                                v-model="identification.idCardNumber"
                                disabled
                            ></Input>
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <div>
                <Divider orientation="left">基本信息</Divider>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="生日">
                            <DatePicker
                                v-model="myForm.basic.birthDate"
                                :options="birthDateOptions"
                                type="date"
                                placeholder="生日"
                                style="width: 240px"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            />
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding" v-if="mode === PAGE_MODE.DETAIL">
                        <FormItem label="年龄">
                            <Input v-model="myForm.basic.age" disabled></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row >
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="身高">
                            <InputNumber
                                style="width: 240px"
                                v-model="myForm.basic.tall"
                                :formatter="value => `${value}cm`"
                                :parser="value => value.replace('cm', '')"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></InputNumber>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="体重">
                            <InputNumber
                                style="width: 240px"
                                v-model="myForm.basic.weight"
                                :disabled="mode === PAGE_MODE.DETAIL"
                                :formatter="value => `${value}kg`"
                                :parser="value => value.replace('kg', '')"
                            ></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="地区">
                    <area-cascader
                        v-model="myForm.basic.area"
                        target="town"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></area-cascader>
                </FormItem>
                <FormItem label="籍贯">
                    <area-cascader
                        v-model="myForm.basic.nativeArea"
                        target="town"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></area-cascader>
                </FormItem>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="月收入">
                            <Select
                                v-model="myForm.basic.monthlySalary"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in monthlySalaryOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="结婚状态">
                            <Select
                                v-model="myForm.basic.marriageStatus"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in marriageStatusOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="行业">
                            <Select
                                v-model="myForm.basic.jobCode"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in jobs"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="何时结婚">
                            <Select
                                v-model="myForm.basic.marriageTimeType"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in marriageTimeTypeOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="车产情况">
                            <Select
                                v-model="myForm.basic.buyCarCond"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in buyCarCondOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="学历">
                            <Select
                                v-model="myForm.basic.education"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in educationOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="房产情况">
                            <Select
                                v-model="myForm.basic.houseCond"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in houseCondOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <div>
                <Divider orientation="left">对象要求</Divider>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="年龄范围">
                            <Select
                                v-model="myForm.mateRequire.ageRange"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in ageRangeOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="身高范围">
                            <Select
                                v-model="myForm.mateRequire.tallRange"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in tallRangeOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="车产条件">
                            <Select
                                v-model="myForm.mateRequire.carCond"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in mateRequireCarCondOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="房产条件">
                            <Select
                                v-model="myForm.mateRequire.houseCond"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in mateRequireHouseCondOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="结婚状态">
                            <Select
                                v-model="myForm.mateRequire.marriageStatus"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in marriageStatusOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="月入条件">
                            <Select
                                v-model="myForm.mateRequire.monthlySalary"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in monthlySalaryOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="最低学历">
                            <Select
                                v-model="myForm.mateRequire.minEducation"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in educationOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <div v-if="null">
                <Divider orientation="left">用户标签</Divider>
                <div v-for="tagCategory in myForm.tags" class="tag-tab">
                    <p class="tag-category">{{ tagCategory.name }}</p>
                    <Tag
                        color="orange"
                        type="border"
                        :key="i"
                        v-for="(tag, i) in tagCategory.tags"
                        >{{ tag.name }}</Tag
                    >
                    <Button
                        v-if="mode !== PAGE_MODE.DETAIL"
                        icon="ios-add"
                        type="dashed"
                        size="small"
                        @click="showTagSelectModal = true"
                        >设置标签</Button
                    >
                </div>
            </div>
            <div>
                <Divider orientation="left">自我介绍</Divider>
                <Input
                    v-model="myForm.basic.opinion"
                    :disabled="mode === PAGE_MODE.DETAIL"
                    placeholder="请输入自我介绍"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 5 }"
                ></Input>
            </div>
            <div class="drawer-footer" v-show="mode !== PAGE_MODE.DETAIL">
                <Button type="primary" @click="onSubmit" :loading="btnLoading"
                    >提交</Button
                >
            </div>
        </Form>
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
        <check-modal
            ref="checkHeaderModal"
            v-model="showHeaderCheckModal"
            title="头像审核"
            @on-submit="onHeaderCheck"
        />
        <tag-select
            v-model="showTagSelectModal"
            :selected="this.myForm.tags"
            @on-submit="onTagsSelect"
        />
        <points-modal v-model="showPointsModal" :code="code"/>
    </div>
</template>

<script>
import {
  addMember,
  checkHeader,
  getMemberDetail,
  updateMemberDetail,
} from "@/api/member/member";
import CheckModal from "@/components/check";
import AreaCascader from "@/components/area/areaCascader";
import { loadJobs } from "@/api/data/data";
import TagSelect from "./tag-category-select";
import PointsModal from './member-points-records'
import {
    accountStatusOptions,
    ageRangeOptions,
    buyCarCondOptions,
    educationOptions,
    houseCondOptions,
    marriageStatusOptions,
    marriageTimeTypeOptions,
    mateRequireCarCondOptions,
    mateRequireHouseCondOptions,
    monthlySalaryOptions,
    sexOptions,
    tallRangeOptions,
    TransferToBoolean,
} from "@/common/utils/viewui-utils";
import DateUtils from "@/common/utils/DateUtils";
import { PAGE_MODE } from "@/common/constants";
import ImageUpload from "@/components/upload/fileUpload";
import {addGroup, editGroup} from "@/api/group/group";
export default {
    name: "add-member",
    props: ["code", "mode"],
    components: { CheckModal, AreaCascader, TagSelect,PointsModal,ImageUpload },
    data() {
        return {
            showPointsModal:false,
            birthDateOptions: {
                disabledDate(date) {
                    const oldDate = new Date(1920, 1, 1);
                    return (
                        date &&
                        (date.valueOf() > Date.now() - 86400000 ||
                            date.valueOf() < oldDate.valueOf())
                    );
                },
            },
            showTagSelectModal: false,
            accountStatusOptions: accountStatusOptions(),
            sexOptions: sexOptions(),
            monthlySalaryOptions: monthlySalaryOptions(),
            marriageStatusOptions: marriageStatusOptions(),
            marriageTimeTypeOptions: marriageTimeTypeOptions(),
            buyCarCondOptions: buyCarCondOptions(),
            educationOptions: educationOptions(),
            houseCondOptions: houseCondOptions(),

            ageRangeOptions: ageRangeOptions(),
            tallRangeOptions: tallRangeOptions(),
            mateRequireCarCondOptions: mateRequireCarCondOptions(),
            mateRequireHouseCondOptions: mateRequireHouseCondOptions(),
            showHeaderCheckModal: false,
            preview: false,
            previewUrl: null,
            span: 12,
            myForm: {
                tags: [],
                mateRequire: {},
                basic: {},
                points: {},
            },
            userData: {},
            identification: {},
            headerCheck: {},
            jobs: [],
            btnLoading: false,
        };
    },
    watch: {
        code(cur) {
          this.onReset();
        },
        "myForm.basic.birthDate"(cur) {
            // if (typeof cur !== "string"){
            //     this.myForm.basic.age = DateUtils.getInterval(
            //         new Date(),
            //         cur,
            //         "y"
            //     );
            // }
        },
    },
    methods: {
      onReset() {
        this.myForm = { tags: [], mateRequire: {}, basic: {}, points: {} };
        if (this.mode !== PAGE_MODE.ADD) {
          this.fillMemberData();
        }
      },
        async onSubmit() {

            let birthDate = null;
            if (
                this.myForm.basic &&
                this.myForm.basic.birthDate &&
                typeof this.myForm.basic.birthDate !== "string"
            ) {
                birthDate = this.myForm.basic.birthDate.Format(
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            const formData = this.copyJson(this.myForm);
            if (formData.tags) {
                formData.tags = {
                    tagCategories: formData.tags,
                };
            }
            if (formData.basic) {
                if (formData.basic.area) {
                    formData.townCode = formData.basic.area[3];
                }
                if (formData.basic.nativeArea) {
                    formData.nativeTownCode = formData.basic.nativeArea[3];
                }
                formData.basic.birthDate = birthDate;
            }

          const modeAction = new Map([
            [
              PAGE_MODE.EDIT,
              {
                func: updateMemberDetail,
                emit: "on-edit-finish",
                successTxt: "修改成功",
              },
            ],
            [
              PAGE_MODE.ADD,
              {
                func: addMember,
                emit: "on-add-finish",
                successTxt: "添加成功",
              },
            ],
          ]);
          const targetAction = modeAction.get(this.mode);
          this.btnLoading = true;
          let res = await targetAction.func(formData);
            this.btnLoading = false;
            if (res ) {
              this.$Message.success(targetAction.successTxt);
              if (this.mode === PAGE_MODE.ADD) this.onReset();
              this.$emit(targetAction.emit);
            }
        },
        onTagsSelect(tags) {
            this.myForm.tags = tags;
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        async onHeaderCheck(data) {
            let json = {
                ...data,
                id: this.headerCheck.id,
            };
            let ok = await checkHeader(json);
            if (ok == true) {
                this.$refs.checkHeaderModal.finish();
                this.fillMemberData();
            }
        },
        async fillMemberData() {
            let result = await getMemberDetail({ code: this.code });
            const {
                identification,
                tags,
                mateRequire,
                basic,
                headerCheck,
                coins,
            } = result;
            if (basic) {
                if (basic.provinceCode) {
                    basic.area = [
                        parseInt(basic.provinceCode),
                        parseInt(basic.cityCode),
                        parseInt(basic.countyCode),
                        parseInt(basic.townCode),
                    ];
                }

                if (basic.nativeProvinceCode) {
                    basic.nativeArea = [
                        parseInt(basic.nativeProvinceCode),
                        parseInt(basic.nativeCityCode),
                        parseInt(basic.nativeCountyCode),
                        parseInt(basic.nativeTownCode),
                    ];
                }
            }

            this.myForm = result;
            this.myForm.sex = TransferToBoolean(result.sex);
            this.identification = identification || {};
            this.myForm.tags = tags || [];
            this.myForm.mateRequire = mateRequire || {};
            this.myForm.basic = basic || {};
            this.headerCheck = headerCheck || {};
            this.myForm.coins = coins || {};
        },
    },
    mounted() {},
    async created() {
        this.jobs = await loadJobs();
        this.jobs = this.jobs.map(item => {
            return {
                value: item.code,
                label: item.name,
            };
        });
    },
};
</script>

<style scoped lang="less">
.member-detail-form {
    .check-tip {
        background: #000;
        color: #fff;
        opacity: 0.6;
        font-size: 12px;
        display: inline-block;
        line-height: 18px;
        position: absolute;
        top: 47px;
        left: 80px;
        width: 64px;
    }
    /deep/.ivu-input[disabled],
    /deep/.ivu-select-disabled .ivu-select-selection,
    /deep/.ivu-input-number-disabled .ivu-input-number-input,
    /deep/.ivu-input-number-disabled {
        color: inherit !important;
        background-color: #fff !important;
    }
    /deep/.ivu-select-disabled .ivu-select-selection,
    /deep/.ivu-input-wrapper-disabled,
    /deep/.ivu-cascader-disabled,
    /deep/.ivu-input-number-disabled {
        /deep/i {
            display: none;
        }
    }
    /deep/.ivu-form-item {
        margin-bottom: 0 !important;
    }
    .tag-tab {
        margin-bottom: 10px;
        .tag-category {
            font-weight: 400;
            margin-bottom: 5px;
        }
    }
}

.form-item-padding {
    padding: 0 16px 0 5px;
}

.drawer-footer {
    margin-top: 10px;
    width: 100%;
    position: relative;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
.top-info {
    padding: 0 16px;
    div {
        &:first-child {
            margin-top: 0;
        }
        margin-top: 8px;
    }
}
.upload-img-tem {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
</style>
