<template>
  <div>
    <Form
      :model="myForm"
      ref="myForm"
      :rules="ruleValidate"
      class="member-detail-form"
    >
      <Row>
        <Col
          :span="mode !== PAGE_MODE.ADD ? 10 : 24"
          style="text-align: center"
        >
        <FormItem prop="headUrl">
          <image-upload @on-upload-success="
                                url => {
                                    $set(myForm, 'headUrl', url);
                                }
                            ">
            <div
              class="upload-img-tem"
              style="border: 1px dashed"
            >
              <img
                :src="myForm.headUrl"
                v-if="myForm.headUrl"
              />
              <span v-if="!myForm.headUrl">+</span>
            </div>
          </image-upload>
        </FormItem>
        </Col>
        <Col
          span="14"
          class="top-info"
          v-if="mode !== PAGE_MODE.ADD"
        >
        <div>红娘 ID：{{ myForm.code }}</div>
        <div>注册时间：{{ myForm.createTime }}</div>
        </Col>
      </Row>
      <div>
        <Divider orientation="left">账号信息</Divider>
        <Row>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="红娘昵称"
            prop="nickName"
          >
            <Input
              v-model="myForm.nickName"
              placeholder="请输入红娘昵称"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></Input>
          </FormItem>
          </Col>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="手机号码"
            prop="mobile"
          >
            <Input
              v-model="myForm.mobile"
              placeholder="请输入绑定红娘手机号码"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="性别"
            prop="sex"
          >
            <Select
              v-model="myForm.sex"
              :disabled="mode === PAGE_MODE.DETAIL"
            >
              <Option
                v-for="item in sexOptions"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}
              </Option>
            </Select>
          </FormItem>
          </Col>
          <Col
            :span="12"
            class="form-item-padding"
            v-if="mode === PAGE_MODE.DETAIL"
          >
          <FormItem
            label="账号状态"
            prop="status"
          >
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
          <div
            class="notice-error margin-top-10"
            v-if="myForm.status!==1"
          >
            <div>{{myForm.status | accountStatus}}{{myForm.disableDays}}天（{{myForm.disableReason}}）</div>
          </div>
          </Col>
        </Row>
        <FormItem
          label="地区"
          prop="area"
        >
          <area-cascader
            v-model="myForm.area"
            target="town"
            :disabled="mode === PAGE_MODE.DETAIL"
          ></area-cascader>
        </FormItem>
        <FormItem
          label="微信二维码"
          prop="wechatQrCode"
          style="margin-top: 15px"
        >
          <image-upload @on-upload-success="
                            url => $set(myForm, 'wechatQrCode', url)
                        ">
            <div
              class="upload-img-tem"
              style="border: 1px dashed"
            >
              <img
                alt="微信二维码"
                :src="myForm.wechatQrCode"
                v-show="myForm.wechatQrCode"
              />
              <span v-show="!myForm.wechatQrCode">+</span>
            </div>
          </image-upload>
        </FormItem>
      </div>
      <div>
        <Divider orientation="left">绑定所在区域</Divider>
        <Row>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="红娘地址"
            prop="mapSearch"
          >
            <AutoComplete
              v-model="myForm.mapSearch"
              @on-search="searchFromMap"
              placeholder="地址搜索"
              @on-select="setPlace"
            >
              <Option
                v-for="(option, index) in mapSearchResult"
                :value="option.value"
                :key="index"
              >
                <span>
                  <Icon
                    type="ios-search-outline"
                    style="margin-right: 5px"
                  />{{ option.label }}</span>
                <span style="float: right; color: #ccc">{{
                  option.area
                  }}</span>
              </Option>
            </AutoComplete>
          </FormItem>
          </Col>
          <Col
            :span="6"
            class="form-item-padding"
          >
          <FormItem
            label="经度"
            prop="lon"
          >
            <Input
              v-model="myForm.lon"
              disabled
            ></Input>
          </FormItem>
          </Col>
          <Col
            :span="6"
            class="form-item-padding"
          >
          <FormItem
            label="纬度"
            prop="lat"
          >
            <Input
              v-model="myForm.lat"
              disabled
            ></Input>
          </FormItem>
          </Col>
        </Row>
        <FormItem
          label="详细地址"
          prop="address"
          class="form-item-padding"
        >
          <Input
            v-model="myForm.address"
            type="textarea"
            :disabled="mode === PAGE_MODE.DETAIL"
          ></Input>
        </FormItem>
        <map-search
          map-height="300px"
          ref="mapCom"
          @on-auto-complete="onMapAutoComplete"
          @on-marker-select="onMapPointSelect"
          style="margin-bottom: 20px"
        />
      </div>
      <div>
        <Divider orientation="left">提成设置</Divider>
        <Row>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="vip套餐提成比例"
            prop="commissionConfig.vipCardCommissionPercentage"
          >
            <InputNumber
              v-model="
                                    myForm.commissionConfig
                                        .vipCardCommissionPercentage
                                "
              style="width: 240px"
              :min="0"
              :max="100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></InputNumber>
          </FormItem>
          </Col>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="查看联系方式单次购买提成"
            prop="commissionConfig.contactCommissionAmount"
          >
            <InputNumber
              v-model="
                                    myForm.commissionConfig
                                        .contactCommissionAmount
                                "
              :min="0"
              style="width: 240px"
              :formatter="amountFormat"
              :parser="amountParser"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></InputNumber>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="线下牵线单次提成"
            prop="commissionConfig.offlinePullCommissionAmount"
          >
            <InputNumber
              v-model="
                                    myForm.commissionConfig
                                        .offlinePullCommissionAmount
                                "
              :min="0"
              style="width: 240px"
              :formatter="amountFormat"
              :parser="amountParser"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></InputNumber>
          </FormItem>
          </Col>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="实名认证提成"
            prop="commissionConfig.identificationCommissionAmount"
          >
            <InputNumber
              v-model="
                                    myForm.commissionConfig
                                        .identificationCommissionAmount
                                "
              :min="0"
              style="width: 240px"
              :formatter="amountFormat"
              :parser="amountParser"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></InputNumber>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col
            :span="12"
            class="form-item-padding"
          >
          <FormItem
            label="参加活动提成比例"
            prop="commissionConfig.activityCommissionPercentage"
          >
            <InputNumber
              v-model="
                                    myForm.commissionConfig
                                        .activityCommissionPercentage
                                "
              style="width: 240px"
              :min="0"
              :max="100"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              :disabled="mode === PAGE_MODE.DETAIL"
            ></InputNumber>
          </FormItem>
          </Col>
          <!--                    <Col :span="12" class="form-item-padding">
                        <FormItem
                            label="置顶购买提成比例"
                            prop="commissionConfig.topCommissionPercentage"
                        >
                            <InputNumber
                                v-model="
                                    myForm.commissionConfig
                                        .topCommissionPercentage
                                "
                                style="width: 240px"
                                :min="0"
                                :max="100"
                                :formatter="value => `${value}%`"
                                :parser="value => value.replace('%', '')"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></InputNumber>
                        </FormItem>
                    </Col>-->
        </Row>
      </div>

      <div
        class="drawer-footer"
        v-show="mode !== PAGE_MODE.DETAIL"
      >
        <Button
          type="primary"
          @click="onSubmit"
          :loading="btnLoading"
        >提交</Button>
      </div>
    </Form>
    <Modal
      title="图片预览"
      v-model="preview"
    >
      <img
        :src="previewUrl"
        v-if="preview"
        style="width: 100%"
      />
    </Modal>
  </div>
</template>

<script>
import {
    getMatchMarkerDetail,
    addMatchMarker,
    editMatchMarker
} from "@/api/matchmarker/matchmarker";
import AreaCascader from "@/components/area/areaCascader";
import MapSearch from "@/components/map/map-search";
import ImageUpload from "@/components/upload/fileUpload";
import {
    accountStatusOptions,
    sexOptions,
    TransferToBoolean
} from "@/common/utils/viewui-utils";
import { PAGE_MODE } from "@/common/constants";
import { amountFormat, amountParser } from "@/common/utils/viewui-utils";

export default {
    name: "matchmarker-detail",
    props: ["code", "mode"],
    components: { AreaCascader, ImageUpload, MapSearch },
    data() {
        return {
            mapSearchResult: [],
            amountFormat: amountFormat,
            amountParser: amountParser,
            sexOptions: sexOptions(),
            accountStatusOptions: accountStatusOptions(),
            preview: false,
            previewUrl: null,
            span: 12,
            myForm: {
                commissionConfig: {}
            },
            ruleValidate: {
                nickName: [
                    {
                        required: true,
                        message: "昵称不能为空",
                        trigger: "blur"
                    }
                ],
                headUrl: [
                    {
                        required: true,
                        message: "头像不能为空",
                        trigger: "change"
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: "手机不能为空",
                        trigger: "blur"
                    }
                ],
                sex: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择性别",
                        trigger: "change"
                    }
                ],
                status: [
                    {
                        type: "number",
                        required: true,
                        message: "请选择账号状态",
                        trigger: "change"
                    }
                ],
                area: [
                    {
                        required: true,
                        type: "array",
                        message: "请选择地区",
                        trigger: "change"
                    }
                ],

                wechatQrCode: [
                    {
                        required: true,
                        message: "微信二维码不能为空",
                        trigger: "change"
                    }
                ],
                "commissionConfig.vipCardCommissionPercentage": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置vip套餐提成",
                        trigger: "blur"
                    }
                ],
                "commissionConfig.contactCommissionAmount": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置查看联系人提成",
                        trigger: "blur"
                    }
                ],
                "commissionConfig.offlinePullCommissionAmount": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置线下牵线提成",
                        trigger: "blur"
                    }
                ],
                "commissionConfig.identificationCommissionAmount": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置实名认证提成",
                        trigger: "blur"
                    }
                ],
                "commissionConfig.activityCommissionPercentage": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置参加活动提成",
                        trigger: "blur"
                    }
                ]
                /* "commissionConfig.topCommissionPercentage": [
                    {
                        required: true,
                        type: "number",
                        message: "请设置置顶卡提成",
                        trigger: "blur",
                    },
                ],*/
            },
            btnLoading: false
        };
    },
    watch: {
        code() {
            if (this.mode !== PAGE_MODE.ADD) this.fillData();
        },
        mode(cur) {
            this.onReset();

            if (cur !== PAGE_MODE.ADD) this.fillData();
        }
    },
    methods: {
        onReset() {
            this.myForm = { commissionConfig: {} };
        },
        async onSubmit() {
            const modeAction = new Map([
                [
                    PAGE_MODE.EDIT,
                    {
                        func: editMatchMarker,
                        emit: "on-edit-finish",
                        successTxt: "修改成功"
                    }
                ],
                [
                    PAGE_MODE.ADD,
                    {
                        func: addMatchMarker,
                        emit: "on-add-finish",
                        successTxt: "添加成功"
                    }
                ]
            ]);
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    const targetAction = modeAction.get(this.mode);

                    this.btnLoading = true;
                    const formData = this.copyJson(this.myForm);
                    formData.commissionConfig.vipCardCommissionType = 1;
                    formData.commissionConfig.contactCommissionType = 2;
                    formData.commissionConfig.offlinePullCommissionType = 2;
                    formData.commissionConfig.identificationCommissionAmount = 2;
                    formData.commissionConfig.activityCommissionType = 1;
                    formData.commissionConfig.topCommissionType = 1;
                    formData.isVirtual = formData.isVirtual
                        ? formData.isVirtual
                        : false;
                    if (formData.area) {
                        formData.townCode = formData.area[3];
                    }
                    let res = await targetAction.func(formData);
                    this.btnLoading = false;
                    if (res ) {
                        this.$Message.success(targetAction.successTxt);
                        this.onReset();
                        this.$emit(targetAction.emit);
                    }
                }
            });
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        async fillData() {
            let result = await getMatchMarkerDetail({ code: this.code });
            const { commissionConfig, fans, balance } = result;
            if (result.provinceCode) {
                result.area = [
                    parseInt(result.provinceCode),
                    parseInt(result.cityCode),
                    parseInt(result.countyCode),
                    parseInt(result.townCode)
                ];
            }

            this.myForm = result;
            this.myForm.sex = TransferToBoolean(result.sex);
            this.myForm.fans = fans || {};
            this.myForm.balance = balance || {};
            this.myForm.commissionConfig = commissionConfig || {};
        },
        searchFromMap(query) {
            this.mapSearchLoading = true;
            this.$refs.mapCom.autoCompleteSearch(query);
        },
        setPlace(data) {
            this.$refs.mapCom.queryPlace(data);
        },
        onMapAutoComplete(results) {
            this.mapSearchResult = results;
            this.mapSearchLoading = false;
        },
        onMapPointSelect(item) {
            this.$set(this.myForm, "provinceName", item.province);
            this.$set(this.myForm, "cityName", item.city);
            this.$set(this.myForm, "countyName", item.title);

            this.$set(
                this.myForm,
                "lat",
                parseFloat(item.point.lat).toFixed(2)
            );
            this.$set(
                this.myForm,
                "lon",
                parseFloat(item.point.lng).toFixed(2)
            );
            this.$set(this.myForm, "address", `${item.address}${item.title}`);
        }
    },
    mounted() {},
    async created() {}
};
</script>

<style scoped lang="less">
.upload-img-tem {
    width: 80px;
    height: 80px;
    line-height: 80px;
}
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
    padding: 0 16px 16px 5px;
}

.drawer-footer {
    margin-top: 10px;
    width: 100%;
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
</style>
