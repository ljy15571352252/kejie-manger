<template>
    <div class="flexC">
        <page-header title="相册管理" description="相册管理列表" />
        <div class="pageContent flexC">
            <search-option @on-search="onSearch" />
            <table-tool @on-refresh="getDataList(pageInfo.current)">
            </table-tool>
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
            >
                <div
                    slot-scope="{ row, index }"
                    slot="user"
                    class="table-padding"
                >
                    <Avatar
                        :src="row.member.headUrl"
                        shape="square"
                        size="54"
                    />
                    <span class="margin-left-10">{{
                        row.member.nickName
                    }}</span>
                </div>
                <template slot-scope="{ row, index }" slot="imageUrl">
                    <div>
                        <img
                            :src="row.imageUrl"
                            style="
                                width: 100px;
                                padding: 10px 0;
                                margin-right: 8px;
                                cursor: pointer;
                            "
                            @click="onImagePreview(row.imageUrl)"
                        />
                    </div>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <a type="text" @click="onDel(row)">删除</a>
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
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
    </div>
</template>

<script>
import SearchOption from "./components/gallery-search-filter";
import {getGalleryList,delGalleries} from "@/api/member/gallery";

export default {
    name: "index",
    components: { SearchOption },
    data() {
        return {
            preview: false,
            previewUrl: null,
            searchCond: {
                options: {},
                sortByCreateTime: null,
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "会员ID",
                    key: "memberCode",
                    render: (h, params) => {
                        return h("span", {}, params.row.member.code);
                    },
                },

                {
                    title: "发布用户",
                    slot: "user",
                },
                {
                    title: "图片",
                    slot: "imageUrl",
                },
                {
                    title: "发布时间",
                    key: "createTime",
                    sortable: true,
                },

                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                },
            ],
            tableData: [],
        };
    },
    created() {
        this.getDataList(1);
    },
    mounted() {},
    methods: {
        onDel({ id }) {
            this.$Modal.confirm({
                title: "删除",
                content: "<p>您确定要删除吗？</p>",
                onOk: async () => {
                    let res = await delGalleries([id]);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getDataList(this.pageInfo.current);
                    }
                },
                onCancel: () => {},
            });
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
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            let { records, total, size, current } = await getGalleryList(
                searchQuery
            );
            this.tableData = records;
            this.pageInfo = {
                total,
                size,
                current,
            };
            this.tableLoading = false;
        },
        onSortChange({ key, order }) {
            if (key === "createTime") {
                this.searchCond.sortByCreateTime =
                    order === "normal" ? null : order;
            }
            this.getDataList(1);
        },
    },
    watch: {},
    filters: {},
};
</script>

<style lang="less">
.main-page {
}
</style>
