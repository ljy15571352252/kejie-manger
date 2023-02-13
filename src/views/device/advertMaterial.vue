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
        <template
          slot-scope="{  row, index }"
          slot="url"
        >
          <img
            style="width:120px;height:120px;"
            :src="row.url"
            alt=""
            @click="onImagePreview(row.mediaType,row.url)"
          >
        </template>
        <div
          slot-scope="{ row, index }"
          slot="action"
          class="x-f flex-wrap"
        >
          <a
            type="text"
            class="break-word"
            @click="selectMember(row)"
          >选择</a>
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
    <Modal
      title="图片预览"
      v-model="preview"
    >
      <img
        :src="previewUrl"
        v-if="preview"
        style="width: 100%"
      />
    </Modal>
    <Modal
      title="视频预览"
      v-model="previewVideo"
    >
      <video
        :src="previewVideoUrl"
        autoplay
        muted
        controls
        v-if="previewVideo"
        style="width: 100%"
      />
    </Modal>
  </div>
</template>

<script>
import { getAlbumList } from "@/api/member/gallery";
export default {
    name: "index",
    data() {
        return {
            preview: false,
            previewVideo: false,
            previewUrl: "",
            previewVideoUrl: "",
            searchCond: {
                options: {},
                sortByCreateTime: null
            },
            pageInfo: {},
            tableLoading: false,
            columns: [
                {
                    title: "用户ID",
                    key: "memberCode"
                },
                {
                    title: "用户名称",
                    key: "",
                    render: (h, params) => {
                        return h("span", {}, params.row.user.nickName);
                    }
                },
                {
                    title: "图片名称",
                    key: "name"
                },
                {
                    title: "图片/视频",
                    key: "mediaType",
                    render: (h, params) => {
                        return h(
                            "span",
                            {},
                            params.row.mediaType == 1
                                ? "图片"
                                : params.row.mediaType == 2
                                ? "视频"
                                : "暂无"
                        );
                    }
                },
                {
                    title: "链接",
                    slot: "url"
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
        if (!!this.$route.params) {
            this.memberCode = this.$route.params.code;
            this.getDataList(1);
        }
    },
    mounted() {},
    methods: {
        onImagePreview(type, url) {
            if (type == 1) {
                this.preview = true;
                this.previewUrl = url;
            } else {
                this.previewVideo = true;
                this.previewVideoUrl = url;
            }
        },

        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                memberCode: this.memberCode
            };
            let { records, total, size, current } = await getAlbumList(
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
        selectMember(row) {
            sessionStorage.setItem("advSourceInfo", JSON.stringify(row));
            this.$router.go(-1);
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
