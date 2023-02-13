<template>
    <div class="flexC">
        <page-header title="礼物列表" description="礼物列表" />
        <div class="pageContent flexC">
            <search-option @on-search="onSearch"/>
          <table-tool @on-refresh="getDataList(pageInfo.current)">
            <Button
                type="primary"
                icon="ios-add"
                @click="onShowAddModal"
                style="display: inline-block"
            >新增礼物
            </Button>
          </table-tool>
          <Table :columns="columns" :data="dataList">
            <template slot-scope="{ row, index }" slot="gift">
              <div class="x-f" style="padding: 10px 0">
                <img :src="row.imgUrl" style="width: 100px"/>
                <span style="margin-left: 5px">{{row.name}}</span>
              </div>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <a
                  type="text"
                  @click="onEdit(row)"
              >编辑</a
              >
              <Divider type="vertical" />
              <a
                  type="text"
                  @click="onDel(row.code)"
              >删除</a
              >
            </template>
          </Table>
            <Page
                class-name="page"
                :total="pageInfo.total"
                :page-size="pageInfo.size"
                :current="pageInfo.current"
                show-elevator
                @on-change="getDataList"
            ></Page>
        </div>
        <Drawer title="礼物" v-model="showDrawer" width="570">
            <gift-form
                :gift-obj="targetGiftObj"
                :mode="formMode"
                @on-edit-finish="onFormOperateFinish"
                @on-add-finish="onFormOperateFinish"
            />
        </Drawer>
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
    </div>
</template>

<script>
import GiftForm from "./components/gift-form";
import SearchOption from "./components/gift-search-filter";
import { PAGE_MODE } from "@/common/constants";
import { delGift, getGiftList } from "@/api/product/gift";

export default {
    name: "index",
    components: { GiftForm, SearchOption },
    data() {
        return {
            preview: false,
            previewUrl: null,
            formMode: null,
            showDrawer: false,
            targetGiftObj: null,
          columns: [
            {
              title: "ID",
              key: "code",
            },
            {
              title: "礼物",
              slot: "gift",
            },
            {
              title: "价格",
              key: "price",
            },
            {
              title: "被赠送方可获得的积分",
              key: "returnPoints",
            },
            {
              title: "状态",
              key: "state",
              render: (h, params) => {
                return h("div", [
                  h("Badge", {
                    props: {
                      color: this.$options.filters[
                          "productUpState"
                          ](params.row.state, true),
                      text: this.$options.filters[
                          "productUpState"
                          ](params.row.state),
                    },
                  }),
                ]);
              },
            },
            {
              title: "操作",
              slot: "action",
              fixed: "right",
              align: "center",
              width: 150,
            },
          ],
            searchCond: {
                options: {},
                sortByCreateTime: null,
                sortBySort: null,
            },
            pageInfo: {},
            dataList: [],
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        onDel(code) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delGift({
                        code: code,
                    });
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {},
            });
        },
        onFormOperateFinish() {
            this.getDataList(this.pageInfo.current);
            this.showDrawer = false;
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                ...this.searchCond.options,
            };
            let { records, total, size, current } = await getGiftList(
                searchQuery
            );
            this.dataList = records;
            this.pageInfo = {
                total,
                size,
                current,
            };
            this.tableLoading = false;
        },
        onShowAddModal() {
            this.formMode = PAGE_MODE.ADD;
            this.showDrawer = true;
            this.targetGiftObj = null;
        },
        onEdit(obj) {
            this.targetGiftObj = this.copyJson(obj);
            this.showDrawer = true;
            this.formMode = PAGE_MODE.EDIT;
            event.stopPropagation();
        },
    },
    watch: {},
    filters: {},
};
</script>

<style scoped lang="less">
.list-goods-list-item {
    margin-top: 10px;
    text-align: center;
    position: relative;
    img {
        width: 100px;
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
}
</style>
