<template>
  <div class="flexC">
    <page-header title="加盟商" description="加盟商详情"/>
    <div class="pageContent flexC">
      <Form
          :model="myForm"
          ref="myForm"
          :rules="ruleValidate"
          class="member-detail-form"
      >
        <Row  v-if="mode === PAGE_MODE.DETAIL">
          <Col>
              <div>
                  <Avatar
                      :src="myForm.logoUrl"
                      size="64"
                      shape="square"
                      style="position: relative; cursor: pointer"
                      @click.native="onImagePreview(myForm.logoUrl)"
                  >
                  </Avatar>
              </div>
          </Col>
          <Col span="14" class="top-info" v-if="mode !== PAGE_MODE.ADD">
            <div>加盟商 ID：{{ myForm.code }}</div>
            <div>注册时间：{{ myForm.createTime }}</div>
          </Col>
        </Row>
        <div>
          <Divider orientation="left">基本信息</Divider>
          <Row>
            <Col :span="3"   v-if="mode !== PAGE_MODE.DETAIL">
              <FormItem

                  label="logo"
                  prop="logoUrl"
                  style="margin-top: 15px"
              >
                <image-upload
                    @on-upload-success="
                                        url => {
                                            $set(myForm, 'logoUrl', url);
                                        }
                                    "
                >
                  <div
                      class="upload-img-tem"
                      style="border: 1px dashed"
                  >
                    <img
                        :src="myForm.logoUrl"
                        v-if="myForm.logoUrl"
                    />
                    <span v-if="!myForm.logoUrl">+</span>
                  </div>
                </image-upload>
              </FormItem>
            </Col>
            <Col :span="3" class="form-item-padding">
              <FormItem label="加盟商名称" prop="name">
                <Input
                    v-model="myForm.name"
                    placeholder="请输入加盟商名称"
                    :disabled="mode === PAGE_MODE.DETAIL"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="3" class="form-item-padding">
              <FormItem label="加盟商电话" prop="phone">
                <Input
                    v-model="myForm.phone"
                    placeholder="请输入加盟商手机号码"
                    :disabled="mode === PAGE_MODE.DETAIL"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="3" class="form-item-padding">
              <FormItem label="联系人" prop="contact">
                <Input
                    v-model="myForm.contact"
                    placeholder="请输入联系人姓名"
                    :disabled="mode === PAGE_MODE.DETAIL"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="3" class="form-item-padding">
              <FormItem label="联系人手机" prop="contactMobile">
                <Input
                    v-model="myForm.contactMobile"
                    placeholder="请输入联系人手机号码"
                    :disabled="mode === PAGE_MODE.DETAIL"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="3" class="form-item-padding">
              <FormItem
                  label="状态"
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
            </Col>
            <Col :span="6" class="form-item-padding">
              <FormItem label="地区" prop="area">
                <area-cascader
                    v-model="myForm.area"
                    @on-change="changeArea"
                    target="county"
                    :disabled="mode === PAGE_MODE.DETAIL"
                ></area-cascader>
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
                placeholder="请输入详细地址"
                style="width: 500px"
                :disabled="mode === PAGE_MODE.DETAIL"
            ></Input>
          </FormItem>
        </div>

        <div v-if="mode === PAGE_MODE.ADD">
          <Divider orientation="left">账号信息</Divider>
          <Row>
            <Col :span="3" class="form-item-padding">
              <FormItem label="昵称" prop="acc.nickName">
                <Input
                    v-model="myForm.acc.nickName"
                    placeholder="请输入昵称"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="3" class="form-item-padding">
              <FormItem label="手机号码" prop="acc.mobile">
                <Input
                    v-model="myForm.acc.mobile"
                    placeholder="请输入手机"
                    type="tel"
                ></Input>
              </FormItem>
            </Col>
            <Col :span="5" class="form-item-padding">
              <FormItem label="验证码" prop="acc.mobileCode">
                <Input
                    v-model="myForm.acc.mobileCode"
                    placeholder="请输入验证码"
                ></Input>
                <Button
                  class="mobile-code"
                  :disabled="disabled"
                  @click="getCode"
                >
                  {{btnTxt}}
                </Button>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="用户名" prop="acc.username"  class="form-item-padding" :label-width="80">
            <Input
                v-model="myForm.acc.username"
                style="width: 240px"
                placeholder="请输入登录用户名"
            ></Input>
          </FormItem>
          <FormItem label="密码" prop="acc.password"  class="form-item-padding" :label-width="80">
            <Input
                v-model="myForm.acc.password"
                type="password"
                style="width: 240px"
                placeholder="请输入登录密码"
            ></Input>
          </FormItem>
          <FormItem label="确认密码" prop="acc.rePass"  class="form-item-padding" :label-width="80">
            <Input
                v-model="myForm.acc.rePass"
                type="password"
                style="width: 240px"
                placeholder="请确认密码"
            ></Input>
          </FormItem>
        </div>

        <div   style="margin-top: 20px" v-show="mode !== PAGE_MODE.DETAIL">
          <Button type="primary" @click="onSubmit" :loading="btnLoading"
          >提交</Button
          >
        </div>
      </Form>
      <Modal title="图片预览" v-model="preview">
        <img :src="previewUrl" v-if="preview" style="width: 100%" />
      </Modal>
    </div>
  </div>
</template>

<script>
import {PAGE_MODE} from "@/common/constants";
import {addMerchant, editMerchant, getMerchantDetail} from "@/api/merchant/merchant";
import AreaCascader from "@/components/area/areaCascader";
import ImageUpload from "@/components/upload/fileUpload";
import {accountStatusOptions} from "@/common/utils/viewui-utils";

export default {
  name: "addOrEdit",
  components: { AreaCascader, ImageUpload },
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.myForm.acc.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      //验证码部分所需的数据
      btnTxt:"获取验证码",
      disabled:false,
      time:0,
      // 
      storeCode:'',
      accountStatusOptions: accountStatusOptions(),
      preview: false,
      previewUrl: null,
      span: 12,
      myForm: {
        acc: {},
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "logo不能为空",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "加盟商电话不能为空",
            trigger: "blur",
          },
        ],
        contact: [
          {
            required: true,
            message: "联系人不能为空",
            trigger: "blur",
          },
        ],
        contactMobile: [
          {
            required: true,
            message: "请输入联系人电话",
            trigger: "change",
          },  
        ],
        status: [
          {
            type: "number",
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
        area: [
          {
            required: true,
            type:'array',
            message: "请选择地区",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "change",
          },
        ],
        "acc.username": [
          {
            required: true,
            message: "请输入加盟商登录账号",
            trigger: "blur",
          },
        ],
        "acc.mobile": [
          {
            required: true,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        "acc.mobileCode": [
          {
            required: true,
            message: "请输入正确的手机验证码",
            trigger: "blur",
          },
        ],
        "acc.password": [
          {
            required: true,
            message: "请输入加盟商登录密码",
            trigger: "blur",
          },
        ],
        "acc.rePass":[
          {required: true, message: '请确认密码', trigger: 'blur'},
          {validator: valideRePassword, trigger: 'blur'}
        ]
      },
      btnLoading: false,
    };
  },
  methods: {
    // 地区
    input(cur){
      this.myForm.area = [...cur]
      [this.myForm.provinceCode,this.myForm.cityCode,this.myForm.countyCode] = cur.map(item => item.toString());
    },
    // 修改地址
    changeArea(arr){
      [this.myForm.provinceName,this.myForm.cityName,this.myForm.countyName] = arr;
    },
    onReset() {
      this.myForm = { 
        acc: {}
      };
    },
    async onSubmit() {
      // const modeAction = new Map([
      //   [
      //     PAGE_MODE.EDIT,
      //     {
      //       func: editMerchant,
      //       emit: "on-edit-finish",
      //       successTxt: "修改成功",
      //     },
      //   ],
      //   [
      //     PAGE_MODE.ADD,
      //     {
      //       func: addMerchant,
      //       emit: "on-add-finish",
      //       successTxt: "添加成功",
      //     },
      //   ],
      // ]);
      this.$refs["myForm"].validate(async valid => {
        if (valid) {
          this.addOrEdit();
          // const targetAction = modeAction.get(this.mode);

          // this.btnLoading = true;
          // [this.myForm.provinceCode,this.myForm.cityCode,this.myForm.countyCode] = this.myForm.area.map(item => item.toString());

          // const formData = this.copyJson(this.myForm);
          // if (this.mode === PAGE_MODE.ADD) this.myForm.acc.status = 1;
          // if (this.mode === PAGE_MODE.ADD) formData.acc.status = 1;
          // console.log(formData)
          // console.log(this.myForm)
          // let res = await targetAction.func(this.myForm).then(res => {
          //   this.btnLoading = false;
          //   this.$Message.success(targetAction.successTxt);
          //   if (this.mode === PAGE_MODE.ADD) this.onReset();
          //   this.$emit(targetAction.emit);
          // }).then(res => {
          //   this.btnLoading = false;
          //   this.$Message.error('fail')
          // });
          // this.btnLoading = false;
          // if (res) {
          //   this.$Message.success(targetAction.successTxt);
          //   if (this.mode === PAGE_MODE.ADD) this.onReset();
          //   this.$emit(targetAction.emit);
          // }
        }else{
          this.$Message.error('验证失败!');
        }
      })
    },
      // 新增/修改
      async addOrEdit(){
        [this.myForm.provinceCode,this.myForm.cityCode,this.myForm.countyCode] = this.myForm.area.map(item => item.toString());
        // json拷贝
        const formData = this.copyJson(this.myForm)
        
        if (this.mode === PAGE_MODE.ADD) this.myForm.acc.status = 1;
        if (this.mode === PAGE_MODE.ADD) formData.acc.status = 1;
        console.log(formData)
        const modeAction = new Map([
            [
                PAGE_MODE.EDIT,
                {
                    func: editMerchant,
                    emit: "on-edit-finish",
                    successTxt: "修改成功",
                },
            ],
            [
                PAGE_MODE.ADD,
                {
                    func: addMerchant,
                    emit: "on-add-finish",
                    successTxt: "添加成功",
                },
            ],
        ]);
        const targetAction = modeAction.get(this.mode);
        this.btnLoading = true;
        let res = await targetAction.func(formData).then(res => {
          this.btnLoading = false;
          this.$Message.success(targetAction.successTxt);
          this.$router.go(-1)
        }).then(res => {
          this.btnLoading = false;

        });
    },
    onImagePreview(url) {
      this.preview = true;
      this.previewUrl = url;
    },
    async fillData() {
      this.myForm = await getMerchantDetail({ code: this.code,storeCode:this.storeCode });
      if (this.myForm.provinceCode) {
        this.myForm.area = [
          parseInt(this.myForm.provinceCode),
          parseInt(this.myForm.cityCode),
          parseInt(this.myForm.countyCode),
        ];
      }
    },
    //获取手机验证码方法
    getCode(){
      //1.校验手机号码
      // if (!this.myForm.acc.mobile){
      //   //手机号校验不通过
      //   this.$message.error({
      //     message: '请输入手机号码！',
      //     type: 'warning',
      //   });
      // }else if (!/^1[3456789]\d{9}$/.test(this.myForm.acc.mobile)){
      //   //此处失去焦点后自动触发校验手机号规则
      // }else {
        //2.【手机号码校验通过】发送axios请求 获取验证码
        this.time = 30;   //设置倒计时的时间（单位：秒）
        this.disabled = true;
        this.timer();     //调用倒计时方法
        // instance.get('/user/getCode?phone=' + this.myForm.acc.mobile).then(res=>{
        //   console.log(this.myForm.acc.mobile);
        //   if (res.data.state){
        //     //短信验证码发送成功时的消息提示
        //     this.$message({
        //       message: res.data.msg,
        //       type: 'success',
        //     });
        //   }else {
        //     //短信验证码发送失败时的消息提示
        //     this.$message({
        //       message: res.data.msg,
        //       type: 'warning',
        //     });
        //   }
        // })
      // }
      setTimeout(()=> {
        console.log('验证码为：'+666666)
      },1000)
    },
    //倒计时方法
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btnTxt = this.time+ "s后重新获取";
        setTimeout(this.timer, 1000);
      } else{
        this.time = 0;
        this.btnTxt = "获取验证码";
        this.disabled = false;
      }
    }
  },
  mounted() {},
  async created() {
    this.code = this.$route.query.code;
    this.storeCode = this.$route.query.storeCode
    const map = new Map([
      ["add", PAGE_MODE.ADD],
      ["edit", PAGE_MODE.EDIT],
      ["detail", PAGE_MODE.DETAIL],
    ]);
    this.mode = map.get(this.$route.params.action);
    if (this.mode === PAGE_MODE.EDIT || this.mode === PAGE_MODE.DETAIL){
      this.fillData()
    }

  },
}
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
    .mobile-code{
      position: absolute;
      right:0;
      bottom: 0;
    }
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
  position: absolute;
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
</style>