<template>
  <div class="flexC">
    <page-header
      title="广告详情"
      description="广告详情"
      no-margin
    />
    <div class="pageContent flexC">
      <Form
        :model="myForm"
        ref="myForm"
        :rules="ruleValidate"
        class="member-detail-form"
        :label-width="140"
      >
        <FormItem
          label="广告名称"
          class="form-item-padding"
          prop="name"
        >
          <Input
            :disabled="!detail"
            v-model="myForm.name"
            placeholder="请输入广告名称"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="设备"
          class="form-item-padding"
        >
          <Input
            :disabled="!detail"
            v-model="myForm.deviceName"
            placeholder="请选择设备"
            style="width: 200px"
          ></Input>
          <Button
            icon="md-add"
            type="primary"
            @click="addDevices"
          >选择设备
          </Button>
        </FormItem>
        <FormItem
          label="会员"
          class="form-item-padding"
        >
          <Input
            :disabled="!detail"
            v-model="myForm.memberName"
            placeholder="请选择设备"
            style="width: 200px"
          ></Input>
          <Button
            :disabled="!detail"
            icon="md-add"
            type="primary"
            @click="addMember"
          >选择会员
          </Button>
        </FormItem>
        <FormItem
          label="尺寸比例"
          class="form-item-padding"
        >
          <Input
            :disabled="!detail"
            v-model="myForm.sizeRate"
            placeholder="请输入尺寸比例"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="广告内容"
          class="form-item-padding"
        >
          <Button
            :disabled="!detail"
            icon="md-add"
            type="primary"
            @click="addAdv"
            style="display:block;"
          >选择广告
          </Button>
          <img
            v-if="myForm.mediaUrl && myForm.mediaType == 1"
            :src="myForm.mediaUrl"
            class="ad_img"
            alt=""
            @click="onImagePreview(myForm.mediaUrl)"
          >
          <video
            class="ad_video"
            v-else-if="myForm.mediaUrl && myForm.mediaType == 2"
            :src="myForm.mediaUrl"
            alt=""
            @click="onVideoPreview(myForm.mediaUrl)"
          />
        </FormItem>
        <FormItem
          label="平台扣点%"
          class="form-item-padding"
        >
          <Input
            :disabled="!detail"
            v-model="myForm.discountRate"
            placeholder="请输入平台扣点"
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="时间"
          class="form-item-padding"
        >
          <!-- <DatePicker
            :disabled="!detail"
            v-model="myForm.timeSet"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            placeholder="请选择开始和结束时间"
            style="width: 300px"
          /> -->
          <Table
            border
            :columns="columns"
            :data="myForm.table"
            :width="700"
            @on-selection-change="onSelectionChange"
          >
            <template
              slot-scope="{ row, index}"
              slot="timerange"
            >
              {{row.timerange[0]}}-{{row.timerange[1]}}
            </template>
            <template
              slot-scope="{  row, index }"
              slot="playTime"
            >
              {{row.playTime}}
            </template>
            <template
              slot-scope="{  row, index }"
              slot="balance"
            >
              {{row.balance}}
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
                disabled
              >
                <template #open>
                  <span>使用中</span>
                </template>
                <template #close>
                  <span>闲置</span>
                </template>
              </i-switch>
            </template>
          </Table>
        </FormItem>
        <div
          style="margin-top: 20px"
          v-if="detail"
        >
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
        v-if="preview"
        style="width: 100%"
      />
    </Modal>
    <Modal
      title="视频预览"
      v-model="previewVideo"
    >
      <video
        :src="previewVideoUrl"
        autoplay
        muted
        controls
        v-if="previewVideo"
        style="width: 100%"
      />
    </Modal>
  </div>
</template>

<script>
import {
    editDeviceAd,
    deviceAdDetail,
    addDeviceAd
} from "@/api/merchant/merchant";
export default {
    name: "addOrEdit",
    data() {
        return {
            myForm: {},
            selectDataList: [],
            columns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
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
                }
            ],
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "请输入广告名称",
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
                ]
            },
            btnLoading: false,
            preview: false,
            previewUrl: "",
            previewVideoUrl: "",
            previewVideo: false,
            detail: true
        };
    },
    methods: {
        onVideoPreview(url) {
            this.previewVideo = true;
            this.previewVideoUrl = url;
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        onReset() {
            // this.myForm = {};
            let memberInfo = JSON.parse(sessionStorage.getItem("memberInfo"));
            let deviceInfo = JSON.parse(sessionStorage.getItem("deviceInfo"));
            let ablumInfo = JSON.parse(sessionStorage.getItem("advSourceInfo"));
            let ringList = JSON.parse(
                deviceInfo.rentConfig ? deviceInfo.rentConfig : []
            );
            if (memberInfo) {
                this.$set(this.myForm, "memberCode", memberInfo.code);
                this.$set(this.myForm, "memberName", memberInfo.nickName);
            }
            if (deviceInfo) {
                this.$set(this.myForm, "deviceCode", deviceInfo.code);
                this.$set(this.myForm, "deviceName", deviceInfo.name);
                this.$set(this.myForm, "table", ringList);
            }

            if (ablumInfo) {
                this.$set(this.myForm, "mediaUrl", ablumInfo.url);
                this.$set(this.myForm, "mediaType", ablumInfo.mediaType);
            }
        },
        async onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.btnLoading = true;
                    this.myForm.timeSet = JSON.stringify(this.selectDataList);
                    if (this.code) {
                        this.myForm.code = this.code;
                        this.myForm.storeCode = this.storeCode;
                        this.myForm.updateUserType = 4;
                        this.myForm.updateBy = JSON.parse(
                            localStorage.getItem("userData")
                        ).code;
                        this.btnLoading = false;
                        let res = await editDeviceAd(this.myForm);
                        if (res ) {
                            this.$Message.success("修改成功！");
                            this.$router.go(-1);
                        } else {
                            this.$Message.error("修改失败！");
                        }
                        sessionStorage.removeItem("memberInfo");
                        sessionStorage.removeItem("deviceInfo");
                        sessionStorage.removeItem("advSourceInfo");
                    } else {
                        this.myForm.creatorUserType = 4;
                        this.myForm.createBy = JSON.parse(
                            localStorage.getItem("userData")
                        ).code;
                        this.btnLoading = false;
                        let res = await addDeviceAd(this.myForm);
                        if (res ) {
                            this.$Message.success("添加成功！");
                            this.$router.go(-1);
                        } else {
                            this.$Message.error("添加失败！");
                        }
                        sessionStorage.removeItem("memberInfo");
                        sessionStorage.removeItem("deviceInfo");
                        sessionStorage.removeItem("advSourceInfo");
                    }
                }
            });
        },
        async fillData() {
            let result = await deviceAdDetail({
                code: this.code,
                storeCode: this.storeCode
            });
            result.deviceName = result.device.name ? result.device.name : "";
            result.memberName = result.user.nickName
                ? result.user.nickName
                : "";
            this.myForm = result;
            this.myForm.table = result.timeSet
                ? JSON.parse(result.timeSet)
                : [];
            this.selectDataList = result.timeSet
                ? JSON.parse(result.timeSet)
                : [];
            let memberInfo = JSON.parse(sessionStorage.getItem("memberInfo"));
            let deviceInfo = JSON.parse(sessionStorage.getItem("deviceInfo"));
            let ablumInfo = JSON.parse(sessionStorage.getItem("advSourceInfo"));
            let ringList = JSON.parse(
                deviceInfo.rentConfig ? deviceInfo.rentConfig : []
            );
            if (memberInfo) {
                this.$set(this.myForm, "memberCode", memberInfo.code);
                this.$set(this.myForm, "memberName", memberInfo.nickName);
            }
            if (deviceInfo) {
                this.$set(this.myForm, "deviceCode", deviceInfo.code);
                this.$set(this.myForm, "deviceName", deviceInfo.name);
                this.$set(this.myForm, "table", ringList);
            }

            if (ablumInfo) {
                this.$set(this.myForm, "mediaUrl", ablumInfo.url);
                this.$set(this.myForm, "mediaType", ablumInfo.mediaType);
            }
        },
        addDevices() {
            this.$router.push({
                name: "device-list",
                params: { advselect: "1" }
            });
        },
        addMember() {
            this.$router.push({
                name: "member-list",
                params: { advselect: "1" }
            });
        },
        addAdv() {
            if (!!this.myForm.memberCode) {
                this.$router.push({
                    name: "select-material",
                    params: {
                        name: this.myForm.memberName,
                        code: this.myForm.memberCode
                    }
                });
            } else {
                this.$Message.error("请先选择会员");
            }
        },
        onSelectionChange(selection) {
            this.selectDataList = selection;
        }
    },

    mounted() {},
    async created() {
        if (this.$route.query.code) {
            this.code = this.$route.query.code;
            this.detail = this.$route.query.detail;
            this.storeCode = this.$route.query.storeCode;
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
.ad_img {
    height: 150px;
    width: 150px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    padding: 10px;
    cursor: pointer;
    margin-right: 10px;
}
.ad_video {
    height: 150px;
    width: 150px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    margin-right: 10px;
    padding: 10px;
    cursor: pointer;
}
</style>