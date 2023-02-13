<template>
  <div class="flexC">
    <page-header
      title="设备详情"
      description="设备详情"
      no-margin
    />
    <div class="pageContent flexC">
      <Form
        :model="myForm"
        ref="myForm"
        :rules="ruleValidate"
        class="member-detail-form"
        :label-width="120"
      >
        <FormItem
          label="设备名称"
          class="form-item-padding"
          prop="name"
        >
          <Input
            v-model="myForm.name"
            placeholder="请输入设备名称"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="设备码"
          class="form-item-padding"
          prop="deviceCode"
        >
          <Input
            v-model="myForm.deviceCode"
            placeholder="请输入设备码"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="产权人"
          class="form-item-padding"
          prop="contact"
        >
          <Input
            v-model="myForm.contact"
            placeholder="请输入产权人"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="产权人手机"
          class="form-item-padding"
          prop="contactMobile"
        >
          <Input
            v-model="myForm.contactMobile"
            placeholder="请输入产权人手机号"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="设备图片"
          prop="logoUrl"
          style="margin-top: 15px"
        >
          <div style="margin-bottom: 15px; display:flex;">
            <div
              class="demo-upload-list"
              v-for="(item, index) in myForm.imgList"
              :key="index"
            >
              <template>
                <img :src="item" />
                <div class="demo-upload-list-cover">
                  <Icon
                    type="ios-eye-outline"
                    @click.native="onImagePreview(item)"
                  ></Icon>
                  <Icon
                    type="ios-trash-outline"
                    @click.native="handleRemove(index)"
                  ></Icon>
                </div>
              </template>
            </div>
            <image-upload
              :multiple="true"
              :limit-count="5"
              @on-upload-success="
                                url => {
                                    myForm.imgList.push(url);
                                }
                            "
            >
              <div
                class="upload-img-tem"
                style="border: 1px dashed #ccc"
              >
                +
              </div>
            </image-upload>
          </div>
        </FormItem>
        <FormItem
          label="地区"
          class="form-item-padding"
          style="display:flex;"
        >
          <area-cascader
            v-model="myForm.area"
            target="town"
            style="width: 400px"
            @on-change="getAreaName"
          ></area-cascader>
        </FormItem>
        <FormItem
          label="详细地址"
          class="form-item-padding"
          prop="address"
        >
          <Input
            v-model="myForm.address"
            placeholder="请输入详细地址"
            style="width: 200px"
            @on-change="getDetailAddredd"
          ></Input>
          <map-search
            map-height="300px"
            ref="mapCom"
            @on-auto-complete="onMapAutoComplete"
            @on-marker-select="onMapPointSelect"
            style="margin-bottom: 20px;margin-top:20px"
          />
        </FormItem>

        <FormItem
          label="行业"
          prop="trade"
          class="form-item-padding"
        >
          <Select
            v-model="myForm.trade"
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
        <FormItem
          label="设备屏幕"
          class="form-item-padding"
        >
          <i-switch
            v-model="myForm.scapeType"
            size="large"
            :true-value='1'
            :false-value="0"
          >
            <template #open>
              <span>横屏</span>
            </template>
            <template #close>
              <span>竖屏</span>
            </template>
          </i-switch>
        </FormItem>
        <FormItem
          label="设备状态"
          class="form-item-padding"
        >
          <i-switch
            v-model="myForm.state"
            size="large"
            :true-value='1'
            :false-value="0"
          >
            <template #open>
              <span>在线</span>
            </template>
            <template #close>
              <span>离线</span>
            </template>
          </i-switch>
        </FormItem>
        <FormItem
          label="备注"
          class="form-item-padding"
        >
          <Input
            v-model="myForm.remark"
            type="textarea"
            style="width: 200px"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入备注"
          ></Input>
        </FormItem>
        <FormItem
          label="租金设置"
          class="form-item-padding"
        >
          <Button
            type="primary"
            @click="addTable"
          >添加</Button>
          <Table
            border
            :columns="columns"
            :data="myForm.table"
            :width="700"
          >
            <template
              slot-scope="{ row, index}"
              slot="timerange"
            >
              <TimePicker
                v-model="myForm.table[index].timerange"
                format="HH:mm:ss"
                type="timerange"
                placement="bottom-end"
                transfer
                placeholder="请选择开始和结束时间"
                style="width: 200px"
              />
            </template>
            <template
              slot-scope="{  row, index }"
              slot="playTime"
            >
              <Input
                v-model="myForm.table[index].playTime"
                placeholder="请输入播放时间"
                style="width: 120px"
              ></Input>
            </template>
            <template
              slot-scope="{  row, index }"
              slot="balance"
            >
              <Input
                v-model="myForm.table[index].balance"
                placeholder="请输入金额"
                style="width: 120px"
              ></Input>
            </template>
            <template
              slot-scope="{  row, index }"
              slot="freeStatus"
            >
              <i-switch
                v-model="myForm.table[index].freeStatus"
                size="large"
                :true-value='1'
                :false-value="0"
              >
                <template #open>
                  <span>使用中</span>
                </template>
                <template #close>
                  <span>闲置</span>
                </template>
              </i-switch>
            </template>
            <template
              slot-scope="{ row, index }"
              slot="action"
            >
              <Button
                type="error"
                size="small"
                @click="remove(index)"
              >删除</Button>
            </template>
          </Table>
        </FormItem>
        <div style="margin-top: 20px">
          <Button
            type="primary"
            @click="onSubmit"
            :loading="btnLoading"
          >提交</Button>
        </div>
      </Form>
    </div>
    <Modal
      title="图片预览"
      v-model="preview"
    >
      <img
        :src="previewUrl"
        v-if="previewUrl"
        style="width: 100%"
      />
    </Modal>
  </div>
</template>

<script>
import { workOptions } from "@/common/utils/viewui-utils";
import { editDevice, deviceDetail, addDevice } from "@/api/merchant/merchant";
import AreaCascader from "@/components/area/areaCascader";
import MapSearch from "@/components/map/map-search";
import ImageUpload from "@/components/upload/fileUpload";
export default {
    name: "addOrEdit",
    components: { AreaCascader, MapSearch, ImageUpload },
    data() {
        return {
            preview: false,
            previewUrl: "",
            uploadList: [],
            mapSearchResult: [],
            mapSearchLoading: false,
            workOptions: workOptions(),
            myForm: {
                table: [],
                imgList: []
            },
            columns: [
                {
                    title: "开始时间结束时间",
                    slot: "timerange"
                },
                {
                    title: "播放时间设置",
                    width: 150,
                    slot: "playTime"
                },
                {
                    title: "金额",
                    width: 150,
                    slot: "balance"
                },
                {
                    title: "是否闲置",
                    width: 100,
                    slot: "freeStatus"
                },
                {
                    title: "操作",
                    slot: "action",
                    width: 80,
                    align: "center"
                }
            ],
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "请输入设备名称",
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "请输入详细地址",
                        trigger: "blur"
                    }
                ],
                deviceCode: [
                    {
                        required: true,
                        message: "请输入设备编号",
                        trigger: "blur"
                    }
                ],
                contact: [
                    {
                        required: true,
                        message: "请输入产权人",
                        trigger: "blur"
                    }
                ],
                contactMobile: [
                    {
                        required: true,
                        message: "请输入产权人手机",
                        trigger: "blur"
                    }
                ],
                status: [
                    {
                        required: true,
                        message: "请选择设备状态",
                        trigger: "change"
                    }
                ]
            },
            btnLoading: false
        };
    },
    methods: {
        getDetailAddredd(val) {
            let querySearch =
                this.myForm.provinceName +
                this.myForm.cityName +
                this.myForm.countyName +
                this.myForm.townName +
                val.data;
            this.$refs.mapCom.queryPlace(querySearch);
        },
        onMapAutoComplete(results) {
            this.mapSearchResult = results;
            this.mapSearchLoading = false;
        },
        onMapPointSelect(item) {
            this.$set(
                this.myForm,
                "lat",
                parseFloat(item.point.lat).toFixed(2)
            );
            this.$set(
                this.myForm,
                "lng",
                parseFloat(item.point.lng).toFixed(2)
            );
            this.$set(this.myForm, "address", `${item.title}`);
        },
        onReset() {
            this.myForm = { table: [], imgList: [] };
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        handleRemove(index) {
            this.$Modal.confirm({
                title: "删除图片",
                content: "<p>您确定要删除该图片吗？</p>",
                onOk: () => {
                    this.myForm.imgList.splice(index, 1);
                },
                onCancel: () => {}
            });
        },
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    if (this.myForm.area) {
                        this.myForm.source = 1;
                        this.myForm.provinceCode = this.myForm.area[0];
                        this.myForm.cityCode = this.myForm.area[1];
                        this.myForm.countyCode = this.myForm.area[2];
                        this.myForm.townCode = this.myForm.area[3];
                        this.myForm.rentConfig = JSON.stringify(
                            this.myForm.table
                        );
                        this.myForm.images =
                            this.myForm.imgList.length > 0
                                ? this.myForm.imgList.join(",")
                                : "";
                        // this.myForm.contact = JSON.parse(
                        //     localStorage.getItem("userData")
                        // ).username;
                        // this.myForm.contactMobile = JSON.parse(
                        //     localStorage.getItem("userData")
                        // ).mobile;
                        if (this.code) {
                           this.myForm.storeCode = this.storeCode;
                            this.myForm.code = this.code;
                            this.myForm.updateUserType = 4;
                            this.myForm.updateBy = JSON.parse(
                                localStorage.getItem("userData")
                            ).code;
                            this.btnLoading = false;
                            let res = await editDevice(this.myForm);
                            if (res ) {
                                this.$Message.success("修改成功！");
                                this.$router.go(-1);
                            } else {
                                this.$Message.error("修改失败！");
                            }
                        } else {
                            this.myForm.creatorUserType = 4;
                            this.myForm.createBy = JSON.parse(
                                localStorage.getItem("userData")
                            ).code;
                            this.btnLoading = false;
                            let res = await addDevice(this.myForm);
                            console.log(res);
                            if (res ) {
                                this.$Message.success("添加成功！");
                                this.$router.go(-1);
                            } else {
                                this.$Message.error("添加失败！");
                            }
                        }
                    } else {
                        this.$Message.error("请选择地区再提交！");
                    }
                }
            });
        },
        async fillData() {
            let result = await deviceDetail({ code: this.code, storeCode:this.storeCode});
            if (result.provinceCode) {
                result.area = [
                    parseInt(result.provinceCode),
                    parseInt(result.cityCode),
                    parseInt(result.countyCode),
                    parseInt(result.townCode)
                ];
            }
            if (result.rentConfig) {
                result.table = JSON.parse(result.rentConfig);
            } else {
                result.table = [];
            }
            result.imgList = result.images ? (result.imgList = result.images.split(",")) : [];
            this.myForm = result;
        },
        getAreaName(data) {
            this.myForm.provinceName = data[0];
            this.myForm.cityName = data[1];
            this.myForm.countyName = data[2];
            this.myForm.townName = data[3];
            let querySearch =
                this.myForm.provinceName +
                this.myForm.cityName +
                this.myForm.countyName +
                this.myForm.townName;
            console.log(querySearch);
            this.$refs.mapCom.queryPlace(querySearch);
        },
        remove(index) {
            this.mymyForm.table.splice(idx, 1);
        },
        addTable() {
            this.myForm.table.push({
                timerange: []
            });
        }
    },

    mounted() {},
    async created() {
        if (this.$route.query.code) {
            this.code = this.$route.query.code;
            this.storeCode = this.$route.query.storeCode
            this.fillData();
        } else {
            this.onReset();
        }
    }
};
</script>

<style scoped lang="less">
/deep/ .ivu-form-item-error-tip {
    margin-left: 120px;
}

.upload-img-tem {
    width: 118px;
    height: 118px;
    line-height: 118px;
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
    padding: 10px 16px 16px 5px;
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
/deep/ .ivu-form-item-content {
    margin-left: 0 !important;
}
</style>