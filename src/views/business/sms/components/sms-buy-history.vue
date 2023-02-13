<template>
    <div>
        <Modal
            v-model="showModal"
            title="购买记录"
            @on-visible-change="onVisibleChange"
        >
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
            >
            </Table>
            <Page
                class-name="page"
                :total="pageInfo.total"
                :page-size="pageInfo.size"
                :current="pageInfo.current"
                show-elevator
                @on-change="getDataList"
            ></Page>
        </Modal>
    </div>
</template>

<script>

import { getBuySysOrderHistory } from "@/api/configset/smsconfig";

export default {
    name: "sms-buy-history",
    props: {
        value: Boolean,
    },
    data() {
        return {
            showModal: false,
            columns: [
                {
                    title: "购买条数",
                    key: "count",
                },
                {
                    title: "购买时间",
                    key: "payTime",
                },
                {
                    title: "剩余数量",
                    key: "afterBuyRemainCount",
                },
            ],
            tableData: [],
            pageInfo: {},
            tableLoading: false,
            searchCond: {
                options: {},
                sortByRegisterTime: null,
            },
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },

    },
    methods: {
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
            };
            let { records, total, size, current } = await getBuySysOrderHistory(
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
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
    },
    mounted() {
        this.getDataList(1);
    },
};
</script>

<style scoped></style>
