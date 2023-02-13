<template>
  <Row>
    <Col flex="395px">
    <div class="template-img">
      <img src="/static/images/member_personal_center.png" />
    </div>
    </Col>
    <Col flex="auto">
    <Form
      ref="myForm"
      :model="myForm"
      :rules="rules"
      :label-width="93"
    >
      <FormItem
        label="展现形式："
        prop="name"
      >
        <RadioGroup v-model="myForm.displayType">
          <Radio
            :label="i.value"
            v-for="(i, index) in displayTypeOptions"
            :key="index"
          >
            {{ i.label }}
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="完善资料：">
        <i-switch
          v-model="myForm.isBind"
          size="large"
          :true-value='1'
          :false-value="0"
        >
          <template #open>
            <span>显示</span>
          </template>
          <template #close>
            <span>隐藏</span>
          </template>
        </i-switch>
      </FormItem>
      <FormItem label="关注列表：">
        <i-switch
          v-model="myForm.atten"
          size="large"
          :true-value='1'
          :false-value="0"
        >
          <template #open>
            <span>显示</span>
          </template>
          <template #close>
            <span>隐藏</span>
          </template>
        </i-switch>
      </FormItem>
      <FormItem label="红娘中心：">
        <i-switch
          v-model="myForm.isMerchant"
          size="large"
          :true-value='1'
          :false-value="0"
        >
          <template #open>
            <span>显示</span>
          </template>
          <template #close>
            <span>隐藏</span>
          </template>
        </i-switch>
      </FormItem>
      <Card
        dis-hover
        v-for="(i, index) in myForm.menus"
        :key="index"
        class="menu-board"
      >
        <div class="x-bc">
          <div>
            {{ i.title }}
            <span
              v-if="i.description"
              class="margin-left-10 gray-color"
            >{{ i.description }}</span>
          </div>
          <div
            v-if="i.extraDesc"
            class="gray-color"
          >
            {{ i.extraDesc }}
          </div>
        </div>
        <Row
          class="margin-top-10 padding-left-10"
          :gutter="40"
        >
          <Col
            :span="6"
            v-for="(item, iIndex) in i.items"
            :key="iIndex"
            class="margin-top-20"
          >
          <div class="icon-panel">
            <Poptip
              trigger="click"
              transfer
            >
              <div
                slot="content"
                class="icon-container"
              >
                <div
                  v-for="(ic, iKey) in icons"
                  :key="iKey"
                  @click="
                                                onIconSelect(index, iIndex, ic)
                                            "
                  class="icon-choose-btn"
                >
                  <i :class="`${ic.prefix} ${ic.prefix}-${ic.icon}`"></i>
                </div>
              </div>
              <div class="icon-selector">
                <span class="edit-icon">
                  <Icon type="ios-create-outline" />
                </span>
                <i
                  v-show="item.icon"
                  :class="`${item.iconPrefix} ${item.iconPrefix}-${item.icon}`"
                ></i>
              </div>
            </Poptip>
          </div>
          <div class="x-bc margin-top-10">
            <Checkbox
              :label="item.code"
              v-model="item.selected"
            ></Checkbox>
            <Input
              type="text"
              v-model="item.name"
              class="text-inp"
            />
          </div>
          </Col>
        </Row>
      </Card>
    </Form>
    <Button
      @click="submit"
      type="primary"
    >保存</Button>
    </Col>
  </Row>
</template>

<script>
import {
    getStorePlatformMenus,
    getPlatformMenus,
    updateStorePlatformMenu
} from "@/api/store/store";
import { displayTypeOptions } from "@/common/utils/viewui-utils";
import { getIcons } from "@/api/data/data";

export default {
    name: "index",
    props: ["storeCode"],
    data() {
        return {
            icons: [],
            displayTypeOptions: displayTypeOptions(),
            menuType: 1,
            myForm: {
                menus: [],
                 isBind: 1,
                atten: 1,
                isMerchant: 1
            },
            rules: {
                displayType: [
                    {
                        required: true,
                        message: "请选择展示方式",
                        trigger: "change",
                        type: "number"
                    }
                ]
            },
            newStoreCode: ""
        };
    },
    watch: {
        storeCode(val,oldval) {
            console.log(val,oldval);
        }
    },
    methods: {
        submit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    let fd = this.copyJson(this.myForm);
                    let menuJson = [];
                    for (let index in fd.menus) {
                        let menu = fd.menus[index];
                        let selectItems = menu.items.filter(i => i.selected);
                        if (this.isEmptyObject(selectItems)) continue;
                        selectItems = selectItems.map(item => {
                            return {
                                code: item.code,
                                iconPrefix: item.iconPrefix,
                                name: item.name,
                                icon: item.icon
                            };
                        });
                        menuJson.push({
                            menuCode: menu.code,
                            menus: selectItems
                        });
                    }
                     let otherConf = {
                        isBind: fd.isBind,
                        atten: fd.atten,
                        isMerchant: fd.isMerchant
                    };
                    let menuJsonConfig = JSON.stringify(menuJson);
                    let otherConfig = JSON.stringify(otherConf);
                    if (this.isEmptyObject(menuJson)) {
                        this.$Message.error("请勾选功能按钮");
                        return;
                    }
                    let res = await updateStorePlatformMenu({
                        menuJson:menuJsonConfig,
                        otherConf: otherConfig,
                        displayType: fd.displayType,
                           type:1
                    });
                    if (res ) {
                        this.$Message.success("保存成功");
                    }
                }
            });
        },
        onIconSelect(index, menuItemIndex, { icon, prefix }) {
            this.$set(
                this.myForm.menus[index].items[menuItemIndex],
                "icon",
                icon
            );
            this.$set(
                this.myForm.menus[index].items[menuItemIndex],
                "iconPrefix",
                prefix
            );
        }
    },
    async mounted() {
        this.icons = await getIcons({ type: 1 });
        let allMenus = await getPlatformMenus({ type: this.menuType });
        let { menuJson, displayType,otherConf } = await getStorePlatformMenus({
            type: this.menuType,
            storeCode: this.storeCode
        });
        menuJson = JSON.parse(menuJson);
          otherConf = otherConf
            ? JSON.parse(otherConf)
            : {
                  isBind: 1,
                  atten: 1,
                  isMerchant: 1
              };
        let finalMenus = allMenus.map(item => {
            let storeMenus = menuJson.filter(i => i.menuCode === item.code)[0];
            item.items.map(i => {
                i.selected = !this.isEmptyObject(
                    storeMenus.menus.filter(j => j.code === i.code)
                );
            });
            return item;
        });
        this.myForm.menus = finalMenus;
        this.myForm.displayType = displayType;
            this.myForm.isBind = otherConf.isBind;
        this.myForm.atten = otherConf.atten;
        this.myForm.isMerchant = otherConf.isMerchant;
    }
};
</script>

<style scoped lang="less">
.menu-board {
    width: 700px;
    margin-bottom: 20px;
    .text-inp {
        width: 100px;
        text-align: center;
    }
}
.icon-selector {
    border: 1px solid #ccc;
    width: 36px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
    transition: 0.2s;

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
.template-img {
    width: 375px;
    img {
        width: 100%;
    }
}
.icon-panel {
    width: 36px;
    height: 36px;
    margin: 0 auto;
}
</style>
