<template>
  <div class="flexC">
    <page-header
      title="交换微信费用设置"
      description="交换微信费用设置"
    />
    <div class="pageContent flexC">
      <Button
        type="primary"
        icon="ios-add"
        @click="onShowAddModal"
        style="width: 150px;margin-bottom: 20px"
      >新增交换微信
      </Button>
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
      title="交换微信费用"
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
import VipCardForm from "./components/add-form";
import { PAGE_MODE } from "@/common/constants";
import { ChargeConfigList } from "@/api/finance/finance";
export default {
    name: "index",
    components: { VipCardForm },
    data() {
        return {
            formMode: null,
            showDrawer: false,
            targetVipCardObj: {},
            dataList: [],
            columns: [
                {
                    title: "ID",
                    key: "code"
                },
                {
                    title: "名称",
                    key: "name"
                },
                {
                    title: "费用详情",
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
                                "编辑"
                            )
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
        onFormOperateFinish() {
            this.getDataList();
            this.showDrawer = false;
        },
        async getDataList() {
            this.dataList = await ChargeConfigList({
                type: 4
            });
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetVipCardObj.type = 4;
        },
        onEdit(obj) {
            obj.type = 4;
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
