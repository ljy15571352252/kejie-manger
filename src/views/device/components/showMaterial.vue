<template>
  <div class="flexC">
    <page-header
      title="素材库详情"
      description="素材库详情"
      no-margin
    />
    <div class="pageContent flexC">
      <Form
        :model="myForm"
        ref="myForm"
        class="member-detail-form"
        :label-width="140"
      >
        <FormItem
          label="会员"
          class="form-item-padding"
        >
          <Input
            v-model="myForm.nickName"
            placeholder="请输入会员名称"
            disabled
            style="width: 200px"
          ></Input>
        </FormItem>
        <FormItem
          label="素材库"
          class="form-item-padding"
        >
          <Tabs
            v-model="mediaType"
            @on-click="getMediaData"
          >
            <TabPane
              label="图片"
              name="1"
            >
              <div
                class="imgInfo"
                v-if="tableData.length>0"
              >
                <img
                  v-for="(item,i) in tableData"
                  :key="i"
                  :class="currindex == i?'active':''"
                  :src="item.url"
                  alt=""
                  @click="onImagePreview(i,item.url)"
                >
              </div>
              <div
                v-else
                style="height:200px;line-height:200px;text-align:center;"
              >
                暂无数据
              </div>
            </TabPane>
            <TabPane
              label="视频"
              name="2"
            >
              <div
                class="imgInfo"
                v-if="tableData.length>0"
              >
                <video
                  v-for="(item,i) in tableData"
                  :key="i"
                  :class="currentVideoIndex == i?'active':''"
                  :src="item.url"
                  alt=""
                  @click="onVideoPreview(i,item.url)"
                />
              </div>
              <div
                v-else
                style="height:200px;line-height:200px;text-align:center;"
              >
                暂无数据
              </div>
            </TabPane>
          </Tabs>
        </FormItem>
        <div style="margin-top: 20px">
          <Button
            type="primary"
            @click="onSubmit"
          >确认</Button>
        </div>
      </Form>
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
            myForm: {},
            preview: false,
            previewVideo: false,
            previewUrl: "",
            previewVideoUrl: "",
            pageInfo: {},
            tableLoading: false,
            tableData: [],
            mediaType: "1",
            currindex: 0,
            currentVideoIndex: 0
        };
    },
    created() {
        if (!!this.$route.params) {
            this.myForm.nickName = this.$route.params.name;
            this.myForm.code = this.$route.params.code;
            this.getDataList(1);
        }
    },
    mounted() {},
    methods: {
        onVideoPreview(index, url) {
            this.previewVideo = true;
            this.previewVideoUrl = url;
            this.currentVideoIndex = index;
        },
        onImagePreview(index, url) {
            this.preview = true;
            this.previewUrl = url;
            this.currindex = index;
        },
        onSubmit() {
            this.$router.go(-1);
        },
        getMediaData() {
            this.tableData = [];
            this.getDataList(1);
        },
        async getDataList(page) {
            this.tableLoading = true;
            if (!this.myForm.code) {
                this.tableLoading = false;
                this.$Message.error("请从素材库进!");
            } else {
                const searchQuery = {
                    page: page,
                    memberCode: this.myForm.code,
                    mediaType: this.mediaType
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
            }
        }
    },
    watch: {},
    filters: {}
};
</script>

<style scoped lang="less">
.upload-img-tem {
    width: 80px;
    height: 80px;
    line-height: 80px;
}
.member-detail-form {
    .check-tip {
        background: #000;
        color: #fff;
        opacity: 0.6;
        font-size: 12px;
        display: inline-block;
        line-height: 18px;
        position: absolute;

        top: 47px;
        left: 80px;
        width: 64px;
    }
    /deep/.ivu-input[disabled],
    /deep/.ivu-select-disabled .ivu-select-selection,
    /deep/.ivu-input-number-disabled .ivu-input-number-input,
    /deep/.ivu-input-number-disabled {
        color: inherit !important;
        background-color: #fff !important;
    }
    /deep/.ivu-select-disabled .ivu-select-selection,
    /deep/.ivu-input-wrapper-disabled,
    /deep/.ivu-cascader-disabled,
    /deep/.ivu-input-number-disabled {
        /deep/i {
            display: none;
        }
    }
    /deep/.ivu-form-item {
        margin-bottom: 0 !important;
    }
    .tag-tab {
        margin-bottom: 10px;
        .tag-category {
            font-weight: 400;
            margin-bottom: 5px;
        }
    }
}

.form-item-padding {
    padding: 10px 16px 16px 5px;
}

.drawer-footer {
    margin-top: 10px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}

.top-info {
    padding: 0 16px;
    div {
        &:first-child {
            margin-top: 0;
        }
        margin-top: 8px;
    }
}
/deep/ .ivu-form-item-content {
    margin-left: 0 !important;
}
.imgInfo {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    img {
        height: 150px;
        width: 150px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        padding: 10px;
        cursor: pointer;
        margin-right: 10px;
    }
    video {
        height: 150px;
        width: 150px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        padding: 10px;
        cursor: pointer;
         margin-right: 10px;
    }
    p {
        font-size: 14px;
        text-align: center;
        overflow: hidden; //溢出隐藏
        white-space: nowrap; //禁止换行
        text-overflow: ellipsis; //...
    }
    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &:after {
        content: "";
        display: block;
        clear: both;
    }
    &:hover {
        box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
    }
}
.active {
    border: 1px solid #e51d1d;
}
</style>