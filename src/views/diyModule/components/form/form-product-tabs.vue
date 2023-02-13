<template>
  <Card
    title="商品分类设置"
    icon="ios-options"
    shadow
  >
    <Form :model="formDynamic">

      <!-- <FormItem label="样式：">
        <RadioGroup
          v-model="formDynamic.type"
          type="button"
          button-style="solid"
        >
          <Radio label="line">
            <span>样式一</span>
          </Radio>
          <Radio label="card">
            <span>样式二</span>
          </Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem label="标签顺序：">
        <br>
        <p class="m-aux-text">拖拽交替标签顺序</p>
        <Tabs
          type="card"
          :draggable="true"
          closable
          @on-click="checkName"
          @on-drag-drop="handleDragDrop"
          @on-tab-remove="handleTabRemove"
          :before-remove="beforeHandleTabRemove"
        >
          <!--   
        -->
          <TabPane
            v-for="(tab, index) in formDynamic.items"
            :key="index"
            :label="tab.subName?tab.subName:tab.name"
          >

          </TabPane>
          <template #extra>
            <Button
              @click="handleTabsAdd"
              size="small"
            >增加</Button>
          </template>
        </Tabs>
      </FormItem>
    </Form>
    <!--  -->
    <Modal
      v-model="showModal"
      title="链接名"
      :mask-closable="false"
      :loading="submitBtnLoading"
    >
      <Form
        :model="myForm"
        ref="myForm"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem
          label="链接名："
          prop="name"
        >
          <Input
            v-model="myForm.subName"
            placeholder="请输入链接名："
          ></Input>
        </FormItem>
        <FormItem
          label="实际链接名："
          prop="name"
        >
          <!-- <Input
            v-model="myForm.name"
            placeholder="请输入实际链接名："
            :disabled="isEdit"
          ></Input> -->
          <Select
            v-model="myForm.name"
            clearable
            :disabled="isEdit"
          >
            <Option
              v-for="item in nameOptions"
              :value="item"
              :key="item"
            >{{ item }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          @click="showModal=false,myForm={}"
        >取消</Button>
        <Button
          type="primary"
          :loading="submitBtnLoading"
          @click="onSubmit"
        >提交</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            myForm: {
                name: "",
                idx: ""
            },
            isEdit: false,
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: "链接名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            nameOptions: ["推荐", "同城", "呼啦圈", "商品分类", "活动", "视频"]
        };
    },
    computed: {
        ...mapState("diyModule", ["formDynamic", "active"])
    },
    methods: {
        ...mapMutations("diyModule", ["isSwitch", "cateTabRemove"]),
        changeSwitch(status) {
            this.isSwitch(status);
        },
        handleDragDrop(a, b) {
            this.formDynamic.items.splice(
                b,
                1,
                ...this.formDynamic.items.splice(
                    a,
                    1,
                    this.formDynamic.items[b]
                )
            );
        },
        onSubmit() {
            if (this.isEdit) {
                let editIndex = this.myForm.idx;
                let editForm = {
                    name: this.myForm.name,
                    subName: this.myForm.subName
                };
                this.formDynamic.items.splice(editIndex, 1, editForm);
            } else {
                this.formDynamic.items.push({
                    name: this.myForm.name,
                    subName: this.myForm.subName
                });
            }
            this.showModal = false;
        },
        checkName(idx) {
            this.showModal = true;
            this.isEdit = true;
            this.myForm.name = this.formDynamic.items[idx].name;
            this.myForm.subName = this.formDynamic.items[idx].subName;
            this.myForm.idx = idx;
        },
        handleTabsAdd() {
            this.showModal = true;
            this.isEdit = false;
            this.myForm = {};
        },
        beforeHandleTabRemove(idx) {
            this.cateTabRemove(idx);
            return Promise.reject();
        },
        handleTabRemove(idx) {
            // this.cateTabRemove(idx);
            // this.formDynamic.items.splice(idx, 1);
        }
    }
};
</script>

<style lang="less">
.ivu-tabs {
    width: 100%;
    .ivu-tabs-bar {
        width: 100%;
    }
}
</style>