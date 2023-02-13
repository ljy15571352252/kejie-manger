<template>
  <div>
    <Modal
      v-model="PageModuleSelector"
      title="选中链接"
      :mask-closable="false"
      style="zIndex:1000;"
      width="900"
      @on-visible-change="onVisibleChange"
    >
      <Tabs
        v-model="tabValue"
        @on-click="tabClick"
      >
        <TabPane
          v-for="item in tabsName"
          :key="item.value"
          :label="item.name"
          :name="item.value"
        >
          <Form
            ref="formInline"
            :model="formInline"
            inline
            :label-width="70"
            v-if="isBanner"
          >
            <FormItem
              v-if="tabValue!=2"
              :label="tabValue==1?'商品名称':tabValue==3?'红娘昵称':tabValue==4?'活动名称':tabValue==5?'视频描述':'名称'"
            >
              <Input
                type="text"
                v-model="formInline.name"
                :placeholder="tabValue==1?'请输入商品名称':tabValue==3?'请输入红娘昵称':tabValue==4?'请输入活动名称':tabValue==5?'请输入视频描述':'请输入名称'"
              >
              </Input>
            </FormItem>
            <FormItem
              label="手机号"
              v-if="['2','3'].indexOf(tabValue)!=-1"
            >
              <Input
                type="text"
                v-model="formInline.phone"
                placeholder="请输入手机号"
              >
              </Input>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                @click="handleSubmit('formInline')"
              >搜素</Button>
            </FormItem>
          </Form>
          <Table
            :loading="tableLoading"
            :columns="columns"
            :data="tableData"
          >
            <template
              slot-scope="{row}"
              slot="action"
            >
            <!--   v-if="targetCode !== row.code || targetName!=row.name" -->
              <Button
              
                type="primary"
                @click="onPageSelect(row)"
              >
                选择
              </Button>
            </template>
          </Table>
          <Page
            class-name="page"
            :total="pageInfo.total"
            :page-size="pageInfo.size"
            :current="pageInfo.current"
            show-elevator
            @on-change="changeData"
          ></Page>
        </TabPane>

      </Tabs>
      <div slot="footer">
        <Button
          type="text"
          @click="onVisibleChange(false)"
        >取消</Button>
        <Button
          type="primary"
          @click="onPageSelect()"
        >提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
    props: [
        "value",
        "tableData",
        "tableLoading",
        "pageInfo",
        "columns",
        "isBanner",
        "targetCode",
        "targetName"
    ],
    data() {
        return {
            tabValue: "1",
            PageModuleSelector: false,
            formInline: {
                phone: "",
                name: ""
            }
            // tabsName: [
            //     {
            //         name: "商品",
            //         value: "1"
            //     },
            //     {
            //         name: "会员",
            //         value: "2"
            //     },
            //     {
            //         name: "红娘",
            //         value: "3"
            //     },
            //     {
            //         name: "活动",
            //         value: "4"
            //     },
            //     {
            //         name: "视频",
            //         value: "5"
            //     },
            //     {
            //         name: "悬浮框",
            //         value: "6"
            //     }
            // ]
        };
    },
    created() {},
    watch: {
        value(val) {
            this.PageModuleSelector = val;
        }
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onPageSelect(row) {
            this.$emit("selectCheck", row, this.tabValue);
            this.onVisibleChange(false);
        },
        tabClick(name) {
            this.formInline = {
                phone: "",
                name: ""
            };
            this.$emit("tabClick", name);
        },
        changeData(page, tabValue) {
            this.$emit("changeData", page, this.tabValue);
        },
        handleSubmit() {
            this.$emit("searchList", this.tabValue, this.formInline);
        }
    },
    computed: {
        tabsName() {
            if (this.isBanner) {
                return [
                    {
                        name: "商品",
                        value: "1"
                    },
                    {
                        name: "会员",
                        value: "2"
                    },
                    {
                        name: "红娘",
                        value: "3"
                    },
                    {
                        name: "活动",
                        value: "4"
                    },
                    {
                        name: "视频",
                        value: "5"
                    }
                ];
            } else {
                return [
                    {
                        name: "悬浮框",
                        value: "1"
                    }
                ];
            }
        }
    }
};
</script>
<style lang="less">
.data-item {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
    .upload {
        .upload-img-tem {
            width: 90px;
            height: 90px;
            line-height: 80px;
            margin-right: 8px;
            font-size: 50px;
        }
    }
    .data-link {
        h4 {
            font-size: 15px;
        }
        .blue {
            color: #3a99e0;
            cursor: pointer;
        }
    }
    .m-aux-text {
        color: #9797a1;
        font-size: 12px;
        line-height: 20px;
        padding: 8px 0;
    }
    .data-del {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 999;
        .ivu-btn {
            width: 36px;
            height: 36px;
            font-size: 18px;
            background: #fff;
            line-height: 36px;
            text-align: center;
        }
    }
}
</style>