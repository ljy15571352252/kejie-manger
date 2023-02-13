<template>
    <div>
        <Modal
            v-model="showModal"
            title="页面列表"
            :mask-closable="false"
            @on-ok="onSubmit"
            @on-visible-change="onVisibleChange"
        >
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
            >
                <template slot-scope="{ row, index }" slot="action">
                    <!--    v-if="targetpath != row.name" -->
                    <Button
                     
                        type="primary"
                        @click="onSubmit(row)"
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
                @on-change="getDataList"
            ></Page>
        </Modal>
    </div>
</template>

<script>
import { getStorePlatformPageModules } from "@/api/store/store";

export default {
    name: "page-module-selector",
    props: ["targetpath", "value"],
    data() {
        return {
            showModal: false,
            columns: [
                {
                    title: "ID",
                    key: "code",
                },
                {
                    title: "页面",
                    key: "name",
                },
                {
                    title: "操作",
                    slot: "action",
                    align: "center",
                },
            ],
            tableData: [],
            pageInfo: {},
            tableLoading: false,
        };
    },
    created() {
         console.log(this.targetpath)
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
            let { records, total, size, current } =
                await getStorePlatformPageModules(searchQuery);
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
        onSubmit(item) {
            this.$emit("on-select", item);
            this.$emit("input", false);
        },
    },
    mounted() {
        this.getDataList(1);
       
    },
};
</script>

<style scoped lang="less">
/deep/.ivu-modal-footer{display: none}
</style>
