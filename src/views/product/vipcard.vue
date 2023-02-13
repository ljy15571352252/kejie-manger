<template>
  <div class="flexC">
    <page-header
      title="vip套餐"
      description="vip套餐"
    />
    <div class="pageContent flexC">
      <!-- <Button
                type="primary"
                icon="ios-add"
                @click="onShowAddModal"
                style="width: 150px;margin-bottom: 20px"
                >新增vip套餐
            </Button> -->
      <Table
        :columns="columns"
        :data="dataList"
      >
        <template
          slot-scope="{ row, index }"
          slot="levelInfo"
        >
         ￥{{ row.price }} / {{
          validaysTransform(row.validDays)
          }}
        </template>
      </Table>
    </div>
    <Drawer
      title="vip套餐"
      v-model="showDrawer"
      width="570"
    >
      <vip-card-form
        :vip-card-obj="targetVipCardObj"
        :mode="formMode"
        @on-edit-finish="onFormOperateFinish"
        @on-add-finish="onFormOperateFinish"
      />
    </Drawer>
  </div>
</template>

<script>
import VipCardForm from "./components/vipcard-form";

import { PAGE_MODE } from "@/common/constants";
import { delVipCard, getVipCardList } from "@/api/product/vipcard";

export default {
    name: "index",
    components: { VipCardForm },
    data() {
        return {
            pageInfo:{},
            formMode: null,
            showDrawer: false,
            targetVipCardObj: null,
            dataList: [],
            columns: [
                {
                    title: "ID",
                    key: "code"
                },
                {
                    title: "vip套餐",
                    slot: "levelInfo"
                },
                {
                    title: "操作",
                    key: "action",
                    fixed: "right",
                    align: "center",
                    width: 150,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "a",
                                {
                                    props: {
                                        type: "text"
                                    },
                                    on: {
                                        click: () => {
                                            this.onEdit(params.row);
                                        }
                                    }
                                },
                                "详情"
                            ),
                            h("Divider", {
                                props: { type: "vertical" }
                            })
                            // h(
                            //     "a",
                            //     {
                            //         props: {
                            //             type: "text",
                            //         },
                            //         on: {
                            //             click: () => {
                            //                 this.onDel(params.row.code);
                            //             },
                            //         },
                            //     },
                            //     "删除"
                            // ),
                        ]);
                    }
                }
            ]
        };
    },
    created() {
        this.getDataList();
    },
    mounted() {},
    methods: {
        validaysTransform(days) {
            if (days === 365) return "年";
            if (days === 30) return "月";
            if (days === 7) return "周";
            return days + "天";
        },
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delVipCard({
                        code: code
                    });
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {}
            });
        },
        onFormOperateFinish() {
            this.getDataList();
            this.showDrawer = false;
        },
        async getDataList() {
            let { records, total, size, current } = await getVipCardList();
            this.dataList = records;
            this.pageInfo = {
                total,
                size,
                current
            };
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetVipCardObj = null;
        },
        onEdit(obj) {
            this.targetVipCardObj = this.copyJson(obj);
            this.showDrawer = true;
            this.formMode = PAGE_MODE.EDIT;
            event.stopPropagation();
        }
    },
    watch: {},
    filters: {}
};
</script>

<style scoped lang="less">
.list-goods-list-item {
    margin-top: 10px;
    text-align: center;
    position: relative;
    img {
        width: 60%;
    }
}
.list-goods-list-item-title {
    font-size: 16px;
    font-weight: 700;
    margin: 8px 0;
}
.list-goods-list-item-desc {
    font-size: 14px;
    color: #808695;
}
.list-goods-list-item-price {
    font-size: 14px;
    color: #ff6700;
    margin: 8px 0;
    s {
        margin-left: 8px;
        color: #808695;
    }
}
</style>
