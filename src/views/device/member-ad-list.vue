<template>
  <div class="flexC">
    <page-header
      title="广告素材库"
      description="广告素材库"
      no-margin
    />
    <div class="pageContent flexC">
      <Table
        :loading="tableLoading"
        :columns="columns"
        :data="tableData"
      >
        <div
          slot-scope="{ row, index }"
          slot="action"
          class="x-f flex-wrap"
        >

          <a
            type="text"
            @click="showDetail(row.code,row.nickName)"
          >查看</a>

        </div>
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
  </div>
</template>

<script>
import { getMemberList } from "@/api/member/member";
export default {
    name: "index",
    data() {
        return {
            searchCond: {
                options: {},
                sortByCreateTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "用户ID",
                    key: "code"
                },
                {
                    title: "用户名称",
                    key: "nickName"
                },
                {
                    title: "操作",
                    slot: "action",
                    fixed: "right",
                    align: "center",
                    width: 150
                }
            ],
            tableData: []
        };
    },
    created() {
        this.getDataList(1);
        if (this.$route.params.advselect) {
            this.advSelect = 1;
        } else {
            this.advSelect = 0;
        }
    },
    mounted() {},
    methods: {
        onSearch(params) {
            this.searchCond.options = params;
            this.getDataList(1);
        },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                ...this.searchCond.options
            };
            let { records, total, size, current } = await getMemberList(
                searchQuery
            );
            this.tableData = records;
            this.pageInfo = {
                total,
                size,
                current
            };
            this.tableLoading = false;
        },

        showDetail(code, name) {
            this.$router.push({
                name: "matral-detail",
                params: { code: code, name: name }
            });
        }
    },
    watch: {},
    filters: {}
};
</script>

<style lang="less">
.main-page {
}
</style>
