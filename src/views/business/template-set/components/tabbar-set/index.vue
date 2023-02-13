<template>
  <div>
    <Row :gutter="20">
      <Col flex="385px">
      <div class="mobile-template">
        <div class="top-head">
          <img src="static/images/mobile_topbar.png" />
          <h4>首页</h4>
        </div>
        <div class="foot-tab">
          <div
            class="item"
            v-for="(tab,index) in formList"
            :key="index"
            @click="changetabUrl(index)"
          >
            <!-- -->
            <img
              :src="activeImg==index?tab.iconPrefix?tab.iconPrefix:'https://tgdat.oss-cn-hangzhou.aliyuncs.com/groupon/tgstatic/uploadimg/zanwutupian.png':tab.icon?tab.icon:'https://tgdat.oss-cn-hangzhou.aliyuncs.com/groupon/tgstatic/uploadimg/zanwutupian.png'"
              alt=""
            >
            <p>{{ tab.name }}</p>
          </div>
        </div>
      </div>
      <Button
        type="primary"
        class="margin-top-20"
        @click="submit"
      >保存</Button>
      </Col>
      <Col flex="800px">
      <Alert type="warning">
        底部Tab最少2个、最多5个；保存后即可在小程序/公众号上查看。
      </Alert>
      <Row :gutter="10">
        <Col
          :span="10"
          v-for="(item, index) in formList"
          :key="index"
          class="margin-bottom-10"
        >
        <Card
          class="nav-card"
          dis-hover
        >
          <a
            class="close-btn"
            @click="delNav(index,item)"
          >
            <Icon
              type="ios-close"
              size="30"
            />
          </a>
          <Form
            class="form"
            ref="myForm"
            :model="item"
            :rules="rules"
            :label-width="93"
          >
            <FormItem
              label="导航名称："
              prop="name"
            >
              <Input
                type="text"
                placeholder="请输入导航名称"
                v-model="item.name"
              >
              </Input>
            </FormItem>
            <FormItem
              label="图标："
              prop="icon"
            >
              <!-- <Poptip trigger="click"> -->
              <!-- <div
                                            slot="content"
                                            class="icon-container"
                                        >
                                            <div
                                                v-for="(i, iKey) in icons"
                                                :key="iKey"
                                                @click="onIconSelect(index, i)"
                                                class="icon-choose-btn"
                                            >
                                                <i
                                                    :class="`${i.prefix} ${i.prefix}-${i.icon}`"
                                                ></i>
                                            </div>
                                        </div> -->
              <div
                class="icon-selector"
                @click="onShowImgSelector(index, false)"
              >
                <span class="edit-icon">
                  <Icon type="ios-create-outline" />
                </span>

                <img
                  :src="item.icon?item.icon:'https://tgdat.oss-cn-hangzhou.aliyuncs.com/groupon/tgstatic/uploadimg/zanwutupian.png'"
                  alt=""
                >

              </div>
              <!-- </Poptip> -->
            </FormItem>
            <FormItem
              label="点击后图标："
              prop="icon"
            >

              <div
                class="icon-selector"
                @click="onShowImgSelector(index,true)"
              >
                <span class="edit-icon">
                  <Icon type="ios-create-outline" />
                </span>

                <img
                  :src="item.iconPrefix?item.iconPrefix:'https://tgdat.oss-cn-hangzhou.aliyuncs.com/groupon/tgstatic/uploadimg/zanwutupian.png'"
                  alt=""
                >

              </div>
              <!-- </Poptip> -->
            </FormItem>
            <FormItem
              label="链接："
              prop="path"
            >
              <Button @click="onShowPageModuleSelector(index)">选择链接</Button>
              <span
                class="margin-left-10"
                v-if="item.pathName"
              >{{ item.pathName }}</span>
            </FormItem>
            <FormItem
              label="排序："
              prop="sort"
            >
              <InputNumber
                :precision="0"
                v-model="item.sort"
              >选择链接</InputNumber>
            </FormItem>
          </Form>
        </Card>
        </Col>
      </Row>
      <Button
        @click="addNav"
        v-show="formList.length<5"
      >添加导航</Button>
      </Col>
    </Row>
    <page-module-selector
      v-model="showPageModuleSelector"
      @on-select="onPageSelect"
      :targetpath="targetpath"
    />
    <!-- 图片 -->
    <img-select
      v-model="uploadModel"
      @selectImgCheck="selectImgCheck"
    />
  </div>
</template>

<script>
import {
    getStorePlatformTabbars,
    updateStorePlatformTabbars
} from "@/api/store/store";
import { getIcons } from "@/api/data/data";
import PageModuleSelector from "./page-module-selector";
import imgSelect from "./imgSelect";
export default {
    props:['storeCode'],
    name: "index",
    components: { PageModuleSelector, imgSelect },
    data() {
        return {
            targetpath:'',
            showPageModuleSelector: false,
            curSelectPageModuleIndex: 0,
            icons: [],
            formList: [],
            isActiveImg: false,
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入导航名称",
                        trigger: "change"
                    }
                ],
                path: [
                    {
                        required: true,
                        message: "请选择链接页面",
                        trigger: "blur"
                    }
                ],
                icon: [
                    { required: true, message: "请选择图标", trigger: "blur" }
                ]
            },
            uploadModel: false,
            curSelectImgIndex: 0,
            activeImg: 0
        };
    },
    methods: {
        onIconSelect(index, { icon, prefix }) {
            this.$set(this.formList[index], "icon", icon);
            this.$set(this.formList[index], "iconPrefix", prefix);
        },
        // 链接
        onShowPageModuleSelector(index) {
            this.showPageModuleSelector = true;
            this.curSelectPageModuleIndex = index;
            this.targetpath = this.formList[index].name;
       
        },
        onPageSelect(module) {
            this.formList[this.curSelectPageModuleIndex].path = module.path;
            this.formList[this.curSelectPageModuleIndex].pathName = module.name;
        },
        // 图片
        onShowImgSelector(index, active) {
            this.uploadModel = true;
            this.curSelectImgIndex = index;
            this.isActiveImg = active;
        },
        selectImgCheck(name) {
            if (this.isActiveImg) {
                this.formList[this.curSelectImgIndex].iconPrefix = name;
            } else {
                this.formList[this.curSelectImgIndex].icon = name;
            }

            // this.formList[this.curSelectPageModuleIndex].pathName = module.name;
        },

        changetabUrl(index) {
            this.activeImg = index;
        },
        async submit() {
            let isValid = true;
            this.$refs["myForm"].map(form => {
                form.validate(valid => {
                    if (!valid) {
                        isValid = false;
                    }
                });
            });
            if (!isValid) {
                this.$Message.error("请补充表单内容");
                return;
            }
            let res = await updateStorePlatformTabbars(this.formList);
            if (res ) {
                this.$Message.success("编辑成功");
            }
        },
        addNav() {
            if (this.formList.length >= 5) {
                this.$Message.warning("不能超过5个导航");
                return;
            }
            this.formList.push({
                type: 1,
                sort: this.formList.length + 1
            });
        },
        delNav(index, item) {
            if (this.formList.length <= 2) {
                this.$Message.warning("不能少于2个导航");
                return;
            }
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除第" + (index + 1) + "个导航吗？</p>",
                onOk: () => {
                    this.formList.splice(index, 1);
                },
                onCancel: () => {}
            });
        }
    },
    async created() {
        this.icons = await getIcons({ type: 1 });
        this.formList = await getStorePlatformTabbars({
            storeCode:this.storeCode,
        });
    }
};
</script>

<style scoped lang="less">
.icon-container {
    display: flex;
    max-width: 300px;
    max-height: 130px;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: auto;
}
.icon-choose-btn {
    cursor: pointer;
    border: 1px solid #ccc;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    flex: auto;
    i {
        font-size: 20px;
    }
}
.nav-card {
    .close-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        color: #333;
    }

    .form {
        margin-top: 10px;
        width: 230px;

        .icon-selector {
            border: 1px solid #ccc;
            width: 36px;
            height: 36px;
            text-align: center;
            line-height: 36px;
            cursor: pointer;
            transition: 0.2s;
            img {
                width: 100%;
                height: 100%;
                object-fit: fill;
            }
            .edit-icon {
                display: none;
            }

            i {
                font-size: 22px;
            }

            &:hover {
                background: rgba(0, 0, 0, 0.7);

                .edit-icon {
                    display: inline;
                    color: #fff;
                    position: absolute;
                    left: 8px;
                    top: 2px;
                    text-align: center;
                    line-height: 36px;
                }
            }
        }
    }
}

/deep/ .ivu-form-item {
    margin-bottom: 12px;
}

.mobile-template {
    width: 750px;
    height: 1334px;
    border: 1px solid #f2f2f2;
    position: relative;
    zoom: 0.5;

    .top-head {
        img {
            position: absolute;
            top: 0;
            width: 100%;
            height: 128px;
            z-index: 1;
        }

        h4 {
            position: relative;
            z-index: 2;
            padding-top: 40px;
            line-height: 88px;
            font-size: 32px;
            font-weight: 700;
            text-align: center;
            color: #333;
        }
    }

    .foot-tab {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 98px;
        border-top: 1px solid #f2f2f2;
        display: flex;

        .item {
            flex: auto;
            text-align: center;
            padding: 10px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            img {
                width: 33px;
                height: 33px;
                object-fit: fill;
            }
            i {
                font-size: 33px;
            }

            p {
                font-size: 24px;
                line-height: 30px;
                color: #666;
            }

            &.cur {
                color: #333;
            }
        }
    }
}
</style>
