<template>
  <div>
    <Modal
      v-model="showModal"
      title="添加设备ID"
      :mask-closable="false"
      :loading="submitBtnLoading"
      @on-visible-change="onVisibleChange"
    >
      <Form
        :model="addModelData"
        ref="myForm"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          label="设备编号"
          class="form-item-padding"
          prop="deviceCode"
        >
          <Input
            v-model="addModelData.deviceCode"
            placeholder="请输入设备编号"
            style="width: 200px"
          ></Input>
        </FormItem>
            <FormItem
          label="是否绑定"
          class="form-item-padding"
        >
          <i-switch
            v-model="addModelData.isBind"
            size="large"
            :true-value='1'
            :false-value="0"
          >
            <template #open>
              <span>已绑定</span>
            </template>
            <template #close>
              <span>未绑定</span>
            </template>
          </i-switch>
        </FormItem>
        <FormItem
          label="地区"
          class="form-item-padding"
          style="display:flex;"
        >
          <area-cascader
            v-model="addModelData.area"
            target="town"
            style="width: 360px"
            @on-change="getAreaName"
          ></area-cascader>
        </FormItem>
       <FormItem
          label="产品类型"
          prop="productType"
          class="form-item-padding"
        >
          <Select
            v-model="addModelData.productType"
            style="width: 200px"
          >
            <Option
              v-for="item in workOptions"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="onVisibleChange(false)"
        >取消</Button>
        <Button
          type="primary"
          :loading="submitBtnLoading"
          @click="onSubmit"
        >提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import AreaCascader from "@/components/area/areaCascader";
import { workOptions } from "@/common/utils/viewui-utils";
export default {
    name: "sever-modal",
    props: ["value", "data"],
    components: { AreaCascader },
    data() {
        return {
            workOptions:workOptions(),
            showModal: false,
            submitBtnLoading: false,
            addModelData: {},
            ruleValidate: {
                deviceCode: [
                    {
                        required: true,
                        message: "请输入设备编号",
                        trigger: "blur"
                    }
                ],
                // productType: [
                //     {
                //         required: true,
                //         message: "请选择产品类型",
                //         trigger: "change"
                //     }
                // ],
            }
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
            this.addModelData = {};
        },
        data(val) {
            if (val) {
                val.area = [
                    parseInt(val.provinceCode),
                    parseInt(val.cityCode),
                    parseInt(val.countyCode),
                    parseInt(val.townCode)
                ];
                this.addModelData = val;
            } else {
                this.addModelData = {};
            }
        }
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        getAreaName(data) {
            this.addModelData.provinceName = data[0];
            this.addModelData.cityName = data[1];
            this.addModelData.countyName = data[2];
            this.addModelData.townName = data[3];
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    this.addModelData.provinceCode = this.addModelData.area[0];
                    this.addModelData.cityCode = this.addModelData.area[1];
                    this.addModelData.countyCode = this.addModelData.area[2];
                    this.addModelData.townCode = this.addModelData.area[3];
                    if (this.addModelData.code) {
                        this.addModelData.updateUserType = 4;
                        this.addModelData.updateBy = JSON.parse(
                            localStorage.getItem("userData")
                        ).code;
                        this.submitBtnLoading = false;
                        this.$emit("on-success", this.addModelData);
                        this.onVisibleChange(false);
                    } else {
                        this.addModelData.creatorUserType = 4;
                        this.addModelData.createBy = JSON.parse(
                            localStorage.getItem("userData")
                        ).code;
                        this.submitBtnLoading = false;
                        this.$emit("on-success", this.addModelData);
                        this.onVisibleChange(false);
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
/deep/ .ivu-form-item-content {
    margin-left: 0 !important;
}

.form-item-padding {
    padding: 0px 16px 16px 5px;
}
/deep/ .ivu-form-item-error-tip {
    margin-left: 120px;
}
</style>
