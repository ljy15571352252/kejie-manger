<template>
  <div class="flexC">
    <page-header title="图片管理" />
    <Tabs
      v-model="curTab"
      @on-click="getCurrentTab"
    >
      <TabPane
        label="图片管理"
        name="imgTab"
      >
        <div class="pageContent flexC form-content">
          <!-- <table-tool
            class="tableTool"
            :hasRefresh="false"
            style="margin-bottom:10px;"
          >
            <Button
              type="primary"
              ghost
              icon="md-add"
              @click="addGroup()"
            >添加分组
            </Button>
            <div class="img-btn">
              <Checkbox
                border
                v-model="checkAll"
                @on-change="changeCheckAll"
              >{{checkText}}</Checkbox>
              <Button
                icon="md-repeat"
                @click="transferAlbum"
              >批量转移</Button>
              <Button
                icon="md-trash"
                @click="delAlbum"
              >删除图片</Button>
              <upload-button
                style="margin:15px;"
                :uploadType="uploadImgType"
                @on-upload-success="uploadImgSuccess"
              />
            </div>
          </table-tool> -->
          <Row :gutter="32">
            <Col span="6">
            <Tree
              :data="groupList"
              :render="renderContent"
              check-strictly
              @on-select-change="onImgSelectChange"
            ></Tree>
            </Col>
            <Col
              span="18"
              style="margin-top:8px;"
            >
            <search-option @on-search="searchAblum" />
            <Row
              :gutter="16"
              wrap
              class="imgList"
            >
              <Col
                span="6"
                v-for="(item,i) in albumList"
                :key="i"
              >
              <div
                class="imgInfo"
                @click="checkImg(i)"
                :key="i"
                :class="{'active':item.checked}"
              >
                <img
                  :src="item.url"
                  alt=""
                >
                <p>{{item.name}}</p>
                <p>注册来源：{{item.store.name?item.store.name:'暂无'}}</p>
                <!-- <div style="margin-left:8px;margin-right:8px;">
                  <a
                    class="updateName"
                    @click="checkImgName(item)"
                  >图片改名</a>
                  <a
                    class="previewImg"
                    @click="onImagePreview(item.url)"
                  >大图预览</a>
                </div> -->
                <div style="margin-top:5px;">
                  <span>
                    <Icon type="ios-person" />{{item.memberCode}}</span><span>
                    <Icon type="ios-phone-portrait" />{{item.userMobile}}</span>
                </div>
              </div>
              </Col>
            </Row>
            </Col>
          </Row>

        </div>
      </TabPane>
      <TabPane
        label="视频管理"
        name="videoTab"
      >
        <div class="pageContent flexC form-content">
          <!-- <table-tool
            class="tableTool"
            :hasRefresh="false"
            style="margin-bottom:10px;"
          >
            <Button
              type="primary"
              ghost
              icon="md-add"
              @click="addGroup()"
            >添加分组
            </Button>
            <div class="img-btn">
              <Checkbox
                border
                v-model="checkVideoAll"
                @on-change="changeVideoCheckAll"
              >{{checkVideoText}}</Checkbox>
              <Button
                icon="md-repeat"
                @click="transferVideo"
              >批量转移</Button>
              <Button
                icon="md-trash"
                @click="delVideo"
              >删除视频</Button>
              <upload-button
                style="margin:15px;"
                :uploadType="uploadVideoType"
                :showProgress="true"
                @on-upload-success="uploadVideoSuccess"
              />
            </div>
          </table-tool> -->
          <Row :gutter="32">
            <Col span="6">
            <Tree
              :data="groupList"
              :render="renderContent"
              check-strictly
              @on-select-change="onVideoSelectChange"
            ></Tree>
            </Col>
            <Col
              span="18"
              style="margin-top:8px;"
            >
            <search-video-option @on-search="searchVideo" />
            <Row
              :gutter="16"
              wrap
              class="imgList"
            >
              <Col
                span="6"
                v-for="(item,i) in albumList"
                :key="i"
              >
              <div
                class="imgInfo"
                @click="checkVideo(i)"
                :key="i"
                :class="{'active':item.checked}"
              >
                <video
                  :src="item.url"
                  alt=""
                />
                <p>{{item.name}}</p>
                <p>注册来源：{{item.store.name?item.store.name:'暂无'}}</p>
                <!-- <div style="margin-left:8px;margin-right:8px;">
                  <a
                    class="updateName"
                    @click="checkVideoName(item)"
                  >视频改名</a>
                  <a
                    class="previewImg"
                    @click="onVideoPreview(item.url)"
                  >播放视频</a>
                </div> -->

                <div style="margin-top:5px;">
                  <span>
                    <Icon type="ios-person" />{{item.memberCode}}</span><span>
                    <Icon type="ios-phone-portrait" />{{item.userMobile}}</span>
                </div>
              </div>
              </Col>
            </Row>
            </Col>
          </Row>
        </div>
      </TabPane>
    </Tabs>
    <group-modal
      v-model="showGroupModal"
      :groupObj="groupObj"
      :mediaType='1'
      :mode="formMode"
      @on-group-success="onGroupSuccess"
    ></group-modal>
    <group-modal
      v-model="showVideoGroupModal"
      :groupObj="groupObj"
      :mediaType='2'
      :mode="formMode"
      @on-group-success="onVideoGroupSuccess"
    ></group-modal>
    <!-- 图片预览 -->
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
    <!-- 图片处理 -->
    <transfer-modal
      v-model="showTransferModal"
      :checkedData="checkedData"
      @on-success="onSuccess"
    ></transfer-modal>
    <!-- 修改图片名称 -->
    <upload-modal
      v-model="showUploadModal"
      :groupCode="imgCheckData"
    ></upload-modal>
    <!-- 视频处理 -->
    <transfer-video-modal
      v-model="showTransferVideoModal"
      :checkedData="checkedVideoData"
      @on-success="onSuccess"
    ></transfer-video-modal>
    <!-- 修改视频名称 -->
    <upload-video-modal
      v-model="showVideoUploadModal"
      :groupCode="videoCheckData"
    ></upload-video-modal>
  </div>
</template>

<script>
import SearchOption from "./components/album-search-filter";
import SearchVideoOption from "./components/video-search-filter";
import { getGroupList, getAlbumList } from "@/api/member/gallery";
import GroupModal from "./components/group-modal.vue";
import TransferModal from "./components/transfer-modal.vue";
import UploadModal from "./components/upload-modal.vue";
import UploadVideoModal from "./components/video_upload_model.vue";
import TransferVideoModal from "./components/transfer-video-modal.vue";
import { PAGE_MODE } from "@/common/constants";
import UploadButton from "@/components/upload/buttonUpload";
export default {
    data() {
        return {
            groupObj: null,
            formMode: null,
            showGroupModal: false,
            showTransferModal: false,
            showUploadModal: false,
            preview: false,
            previewUrl: null,
            buttonProps: {
                type: "default",
                size: "small"
            },
            albumList: [],
            pageInfo: {},
            curGroup: [],
            checkAll: false,
            groupCode: "",
            checkedData: [],
            imgCheckData: null,
            groupList: [],
            curTab: "imgTab",
            showVideoUploadModal: false,
            showTransferVideoModal: false,
            // 图片上传
            uploadImgType: "image",
            updateImgForm: {},
            // 视频上传
            uploadVideoType: "video",
            updatedVideoForm: {},
            checkVideoAll: false,
            checkedVideoData: [],
            curVideoGroup: {},
            videoCheckData: {},
            previewVideoUrl: "",
            previewVideo: false,
            showVideoGroupModal: false
        };
    },
    components: {
        SearchOption,
        GroupModal,
        TransferModal,
        UploadModal,
        UploadVideoModal,
        TransferVideoModal,
        SearchVideoOption,
        UploadButton
    },
    methods: {
        renderContent(h, { root, node, data }) {
            return h(
                "span",
                {
                    style: {
                        display: "inline-block",
                        width: "100%"
                    }
                },
                [
                    h("span", [
                        h("Icon", {
                            props: {
                                type: "ios-paper-outline"
                            },
                            style: {
                                marginRight: "8px"
                            }
                        }),
                        h("span", data.name)
                    ])
                ]
            );
        },
        checkImg(index) {
            this.albumList[index].checked = !this.albumList[index].checked;
            const check = this.albumList.find(item => item.checked === false);
            if (check) {
                this.checkAll = false;
            } else {
                this.checkAll = true;
            }
        },

        // 获取图片分组列表
        async getAlbumGrooup(data) {
            this.groupList = await getGroupList(data);
            if (this.groupList.length>0) {
                this.groupList.map(item => {
                    this.$set(item, "expand", true);
                    item.render = (h, { root, node, data }) => {
                        return h(
                            "span",
                            {
                                style: {
                                    display: "inline-block",
                                    width: "100%"
                                }
                            },
                            [
                                h("span", [
                                    h("Icon", {
                                        props: {
                                            type: "ios-folder-outline"
                                        },
                                        style: {
                                            marginRight: "8px"
                                        }
                                    }),
                                    h("span", data.name)
                                ])
                            ]
                        );
                    };
                });
                this.curGroup = [];
                this.getExpandList(this.groupList);
                if (this.curTab == "imgTab") {
                    this.updateImgForm.groupCode = this.groupList[0].code;
                    this.updateImgForm.storeCode = this.groupList[0].storeCode;
                } else {
                    this.updatedVideoForm.groupCode = this.groupList[0].code;
                    this.updatedVideoForm.storeCode = this.groupList[0].storeCode;
                }
                this.curGroup.push(this.groupList[0]);
            }else{
                this.groupList = [];
            }
        },
        getExpandList(arr) {
            arr.forEach(item => {
                //递归
                if (item.children) {
                    this.$set(item, "expand", true);
                    this.getExpandList(item.children);
                }
            });
        },
        async getAlbum(data) {
            const { current, records, size, total } = await getAlbumList(data);
            if (records !== undefined) {
                this.albumList = this.albumList.concat(records);
                this.pageInfo = {
                    total,
                    size,
                    current
                };
            }
            if (this.albumList.length > 0) {
                this.albumList.map(item => {
                    this.$set(item, "checked", false);
                });
            }
        },
        // 修改图片名称
        checkImgName(item) {
            this.imgCheckData = item;
            this.showUploadModal = true;
        },
        // 搜素图片
        searchAblum(data) {
            let { createTimeRange, memberCode, nickName, userMobile } = data;
            this.albumList = [];
            this.getAlbum({
                mediaType: 1,
                createTimeRange,
                name: nickName,
                memberCode,
                userMobile
            });
        },

        // 分组操作
        addGroup(data) {
            event.stopPropagation();
            if (this.curTab == "imgTab") {
                this.showGroupModal = true;
            } else {
                this.showVideoGroupModal = true;
            }
            this.formMode = PAGE_MODE.ADD;
            if (data) {
                this.groupObj = data;
            } else {
                this.groupObj = null;
            }
        },
        editGroup(data) {
            event.stopPropagation();
            if (this.curTab == "imgTab") {
                this.showGroupModal = true;
            } else {
                this.showVideoGroupModal = true;
            }
            this.formMode = PAGE_MODE.EDIT;
            this.groupObj = data;
        },
        delGroup(data) {
            event.stopPropagation();
            this.$Modal.confirm({
                title: "提示",
                content: "确定删除当前分组？",
                onOk: async () => {
                    let res = await delGroupList(data.code);
                    if (res ) {
                        this.$Message.success("删除成功");
                        this.getAlbumGrooup({
                            mediaType: this.curTab == "imgTab" ? 1 : 2
                        });
                        this.albumList = [];
                        this.getAlbum({
                            mediaType: this.curTab == "imgTab" ? 1 : 2
                        });
                    }
                },
                onCancel: () => {}
            });
        },
        // 相册操作
        async delAlbum() {
            this.getCheckData();
            if (this.checkedData.length === 0) {
                this.$Message.error("请至少选择一张图片");
                return;
            } else {
                const data = this.copyJson({ codeList: this.checkedData });
                let res = await delAlbumList(data);
                if (res ) {
                    this.$Message.success("删除成功");
                    if (this.curTab == "imgTab") {
                        this.onImgSelectChange(this.curGroup);
                    } else {
                    }
                }
            }
        },
        transferAlbum() {
            this.getCheckData();
            if (this.checkedData.length === 0) {
                this.$Message.error("请至少选择一张图片");
                return;
            } else {
                this.showTransferModal = true;
            }
        },
        getCheckData() {
            let checkedData = [];
            this.albumList.map(item => {
                if (item.checked) {
                    checkedData.push(item.code);
                }
            });
            this.checkedData = checkedData;
        },
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        changeCheckAll() {
            if (this.checkAll) {
                this.albumList.map(item => (item.checked = true));
            } else {
                this.albumList.map(item => (item.checked = false));
            }
        },
        onGroupSuccess() {
            this.getAlbumGrooup({
                mediaType: 1
            });
            this.albumList = [];
            this.getAlbum({
                mediaType: 1
            });
        },
        onSuccess() {
            if (this.curTab == "imgTab") {
                this.onImgSelectChange(this.curGroup);
            } else {
                this.onVideoSelectChange(this.curGroup);
            }
        },
        // 上传图片
        async uploadImgSuccess(url, name) {
            this.updateImgForm.url = url;
            this.updateImgForm.name = name;
            this.updateImgForm.mediaType = 1;
            const formData = this.copyJson(this.updateImgForm);
            let res = await addAlbumSource(formData);
            if (res ) {
                this.$Message.success("上传成功");
                this.onImgSelectChange(this.curGroup);
            }
        },
        // 选中图片左侧tab输入框
        onImgSelectChange(item) {
            const _this = this;
            _this.albumList = [];
            _this.curGroup = item;
            _this.checkAll = false;
            let groupCode = "";
            if (item.length) {
                groupCode = item[0].code;
                if (item[0].children && item[0].children.length > 0) {
                    item[0].children.map(i => {
                        _this.getAlbum({ groupCode: i.code, mediaType: 1 });
                    });
                }
                _this.getAlbum({ groupCode: groupCode, mediaType: 1 });
            } else {
                _this.getAlbum({
                    mediaType: 1
                });
            }
            _this.groupCode = groupCode;
            _this.updateImgForm.groupCode = groupCode;
            _this.updateImgForm.storeCode = item[0].storeCode;
        },
        checkVideo(index) {
            this.albumList[index].checked = !this.albumList[index].checked;
            const check = this.albumList.find(item => item.checked === false);
            if (check) {
                this.checkVideoAll = false;
            } else {
                this.checkVideoAll = true;
            }
        },
        // 修改视频名称
        checkVideoName(item) {
            this.videoCheckData = item;
            this.showVideoUploadModal = true;
        },
        // 视频选中左侧分组
        onVideoSelectChange(item) {
            const _this = this;
            _this.albumList = [];
            _this.curGroup = item;
            _this.checkVideoAll = false;
            let groupCode = "";
            if (item.length) {
                groupCode = item[0].code;
                if (item[0].children && item[0].children.length > 0) {
                    item[0].children.map(i => {
                        _this.getAlbum({ groupCode: i.code, mediaType: 2 });
                    });
                }
                _this.getAlbum({ groupCode: groupCode, mediaType: 2 });
            } else {
                _this.getAlbum({
                    mediaType: 2
                });
            }
            _this.updatedVideoForm.groupCode = groupCode;
            _this.updatedVideoForm.storeCode = item[0].storeCode;
        },
        onVideoGroupSuccess() {
            this.getAlbumGrooup({
                mediaType: 2
            });
            this.albumList = [];
            this.getAlbum({
                mediaType: 2
            });
        },
        // 视频操作
        changeVideoCheckAll() {
            if (this.checkVideoAll) {
                this.albumList.map(item => (item.checked = true));
            } else {
                this.albumList.map(item => (item.checked = false));
            }
        },
        onVideoPreview(url) {
            this.previewVideo = true;
            this.previewVideoUrl = url;
        },
        getCheckVideoData() {
            let checkedVideoData = [];
            this.albumList.map(item => {
                if (item.checked) {
                    checkedVideoData.push(item.code);
                }
            });
            this.checkedVideoData = checkedVideoData;
        },
        onVideoSuccess() {
            this.onVideoSelectChange(this.curGroup);
        },
        uploadVideo() {
            this.showVideoUploadModal = true;
        },
        // 上传视频
        async uploadVideoSuccess(url, name) {
            this.updatedVideoForm.url = url;
            this.updatedVideoForm.name = name;
            this.updatedVideoForm.mediaType = 2;
            const formData = this.copyJson(this.updatedVideoForm);
            let res = await addAlbumSource(formData);
            if (res ) {
                this.$Message.success("上传成功");
                this.onVideoSelectChange(this.curGroup);
            }
        },
        // 搜素视频
        searchVideo(data) {
            let { createTimeRange, memberCode, nickName, userMobile } = data;
            this.albumList = [];
            this.getAlbum({
                mediaType: 2,
                createTimeRange,
                name: nickName,
                memberCode,
                userMobile
            });
        },
        async delVideo() {
            this.getCheckVideoData();
            if (this.checkedVideoData.length === 0) {
                this.$Message.error("请至少选择一个视频");
                return;
            } else {
                const data = this.copyJson({ codeList: this.checkedVideoData });
                let res = await delAlbumList(data);
                if (res ) {
                    this.$Message.success("删除成功");
                    this.onVideoSelectChange(this.curGroup);
                }
            }
        },
        transferVideo() {
            this.getCheckVideoData();
            if (this.checkedVideoData.length === 0) {
                this.$Message.error("请至少选择一个视频");
                return;
            } else {
                this.showTransferVideoModal = true;
            }
        },
        // 当前选中项
        getCurrentTab(name) {
            if (name == "imgTab") {
                this.albumList = [];
                this.groupList = [];
                this.getAlbumGrooup({
                    mediaType: 1
                });
                this.getAlbum({
                    mediaType: 1
                });
            } else if (name == "videoTab") {
                this.albumList = [];
                this.groupList = [];
                this.getAlbumGrooup({
                    mediaType: 2
                });
                this.getAlbum({
                    mediaType: 2
                });
            }
        }
    },
    created() {
        this.getAlbumGrooup({
            mediaType: 1
        });
        this.getAlbum({
            mediaType: 1
        });
    },
    computed: {
        // 图片
        checkText() {
            if (this.checkAll) {
                return "全不选";
            } else {
                return "全选";
            }
        },
        // 视频
        checkVideoText() {
            if (this.checkVideoAll) {
                return "全不选";
            } else {
                return "全选";
            }
        }
    }
};
</script>

<style scoped lang="less">
.tableTool {
    display: flex;
    justify-content: space-between;
    .img-btn {
        display: flex;
        align-items: center;
        button {
            margin-left: 15px;
        }
    }
}
.ivu-tree {
    /deep/ul {
        font-size: 14px;
    }
    /deep/.ivu-tree-children {
        li {
            &:first-child {
                .ivu-tree-title {
                    width: 80%;
                    line-height: 24px;
                }
            }
        }
    }
}
/deep/ .ivu-tabs-nav-scroll {
    background-color: #fff;
}
.pageHead {
    border-bottom: none;
}
.imgInfo {
    cursor: pointer;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    img {
        width: 100%;
        height: 10vw;
    }
    video {
        width: 100%;
        height: 10vw;
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
    a {
        font-size: 14px;
        color: #e51d1d;
    }
    .updateName {
        float: left;
    }
    .previewImg {
        float: right;
    }
    &:after {
        content: "";
        display: block;
        clear: both;
    }
    &:hover {
        box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
    }

    &.active {
        border: 1px solid #e51d1d;
    }
}
</style>
