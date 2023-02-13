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
            :label="tab.name"
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
    <selectLink
      v-model="showModal"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :tableLoading="tableLoading"
      :columns="columns"
      :targetName="targetName"
      @changeData="changeData"
      @selectCheck="selectCheck"
    />
    <!-- <Modal
      v-model="showModal"
      title="标签名"
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
          label="标签名称："
          prop="name"
        >
          <Input
            v-model="myForm.name"
            placeholder="请输入标签名称"
            :disabled="isEdit"
          ></Input>
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
    </Modal> -->
  </Card>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import selectLink from "../selectLink";
import { getProductCategoryPageList } from "@/api/product/product";
export default {
    components: { selectLink },
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
                        message: "标签名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            pageInfo: {
                total: 4,
                size: 1,
                current: 1
            },
            isBanner: false,
            tableLoading: false,
            page: 1,
            targetName: "",
            tableData: [],
            currentSelect: 0
        };
    },
    computed: {
        ...mapState("diyModule", ["formDynamic", "active"])
    },
    created() {
        this.getProductCateData();
    },
    methods: {
        ...mapMutations("diyModule", ["cateTabRemove", "updateGoodsTabs"]),
        async getProductCateData() {
            this.columns = [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },

                {
                    title: "分类名称",
                    key: "name",
                    align: "center"
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center"
                }
            ];
            this.tableLoading = true;
            let {
                records,
                total,
                size,
                current
            } = await getProductCategoryPageList({
                page: this.page
            });
            this.tableData = records;
            this.pageInfo = {
                total,
                size,
                current
            };
            this.tableLoading = false;
        },
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
                this.formDynamic.items.splice(
                    this.myForm.idx,
                    1,
                    this.myForm.name
                );
            } else {
                this.formDynamic.items.push(this.myForm.name);
            }
            this.showModal = false;
        },
        checkName(idx) {
            this.showModal = true;
            // this.isEdit = true;
            // this.myForm.name = this.formDynamic.items[idx];
            this.targetName = this.formDynamic.items[idx];
            this.currentSelect = idx;
            // this.myForm.idx = idx;
        },
        handleTabsAdd() {
            // if (this.formDynamic.items.length < 6) {
            this.showModal = true;
            // this.isEdit = false;
            // this.myForm = {};
            this.currentSelect = this.formDynamic.items.length;
            // } else {
            //     this.$Message.error("最多只能添加六个！");
            // }
        },
        beforeHandleTabRemove(idx) {
            // if (this.formDynamic.items.length == 3) {
            //     this.$Message.error("至少存在三个！");
            //     return Promise.reject();
            // } else
            // if (this.formDynamic.items[idx] == "推荐") {
            //     this.$Message.error("不能删除推荐选项！");
            //     return Promise.reject();
            // } else {
            // this.cateTabRemove(idx);
            return Promise.reject();
            // }
        },
        handleTabRemove(idx) {
            // this.cateTabRemove(idx);
            // this.formDynamic.items.splice(idx, 1);
        },
        selectCheck(item, idx) {
            if (item) {
                // 1
                // item.currentSelect = this.currentSelect
                //  this.updateGoodsTabs(item);
                // 2
                // this.formDynamic.items[this.currentSelect] = item.name;
                // 3
                this.$set(
                    this.formDynamic.items,
                    this.currentSelect,
                    item
                );
            }
        },
        changeData(page, name) {
            this.page = page;
            this.getProductCateData();
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