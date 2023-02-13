<template>
  <div>
    <Modal
      v-model="uploadModelt"
      title="选中图片"
      :mask-closable="false"
      style="zIndex:1000;"
      width="900"
      @on-visible-change="onVisibleChange"
    >
      <Row style="background:#eee;padding:20px">
        <Col span="6">
        <Card>
          <Tree
            :data="groupList"
            :render="renderContent"
            check-strictly
            expand
            @on-select-change="onImgSelectChange"
          ></Tree>
        </Card>
        </Col>
        <Col
          span="16"
          offset="2"
        >
        <Card>
          <div>
            <Form
              ref="formInline"
              :model="formInline"
              inline
              :label-width="60"
            >
              <FormItem label="图片名">
                <Input
                  type="text"
                  v-model="formInline.name"
                  placeholder="请输入图片名称"
                >
                </Input>
              </FormItem>
              <FormItem label="会员名">
                <Input
                  placeholder="请输入会员昵称"
                  v-model="formInline.memberCode"
                  type="text"
                >
                </Input>
              </FormItem>
              <FormItem label="手机号">
                <Input
                  type="text"
                  v-model="formInline.userMobile"
                  placeholder="请输入手机号"
                >
                </Input>
              </FormItem>
              <FormItem>
                <Row style="width:100%;">
                  <Col span="16">
                  <upload-button
                    :uploadType="uploadImgType"
                    @on-upload-success="uploadImgSuccess"
                  />
                  </Col>
                  <Col span="8">
                  <Button
                    type="primary"
                    @click="handleSubmit('formInline')"
                  >搜素</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
          <div class="img_list">
            <div
              v-for="(item,index) in albumList"
              :key="index"
              :class="currentIndex == index?'img_item img_active':'img_item'"
              @click="currentIndexClick(index,item.url)"
            >
              <img
                :src="item.url"
                alt=""
              >
              <p>{{item.name}}</p>

              <div style="margin-top:5px;">
                <span>
                  <Icon type="ios-person" />{{item.memberCode}}</span><span>
                  <Icon type="ios-phone-portrait" />{{item.userMobile}}</span>
              </div>

            </div>

          </div>
        </Card>
        </Col>
      </Row>
      <div slot="footer">
        <Button
          type="text"
          @click="onVisibleChange(false)"
        >取消</Button>
        <Button
          type="primary"
          @click="onPageSelect()"
        >提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
    getGroupList,
    getAlbumList,
    addAlbumSource
} from "@/api/member/gallery";
import UploadButton from "@/components/upload/buttonUpload";
export default {
    props: ["value"],
    components: {
        UploadButton
    },
    data() {
        return {
            updateImgForm: {},
            curGroup: [],
            uploadImgType: "image",
            groupList: [],
            albumList: [],
            checkGroupCode: "",
            currentIndexUrl: "",
            currentIndex: 0,
            uploadModelt: false,
            formInline: {
                memberCode: "",
                userMobile: "",
                name: ""
            }
        };
    },
    watch: {
        value(cur, old) {
            console.log(cur);
            this.uploadModelt = cur;
        }
    },
    async created() {
        await this.getAlbumGrooup({
            mediaType: 1
        });
        this.getAlbum({
            mediaType: 1,
            groupCode: this.checkGroupCode
        });
    },
    methods: {
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
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
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
                    ]),
                    h("span", {
                        style: {
                            display: "inline-block",
                            float: "right"
                        }
                    })
                ]
            );
        },
        // 选中图片左侧tab输入框
        onImgSelectChange(item) {
            const _this = this;
            _this.albumList = [];
            _this.curGroup = item;
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
            _this.updateImgForm.groupCode = groupCode;
            _this.updateImgForm.storeCode = item[0].storeCode;
        },
        // 获取图片分组列表
        async getAlbumGrooup(data) {
            this.groupList = await getGroupList(data);
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
                            ]),
                            h("span", {
                                class: {
                                    "group-tool": true
                                },
                                style: {
                                    display: "inline-block",
                                    float: "right"
                                }
                            })
                        ]
                    );
                };
            });
            this.curGroup = [];
            this.checkGroupCode = this.groupList[0].code;
            this.updateImgForm.groupCode = this.groupList[0].code;
            this.updateImgForm.storeCode = this.groupList[0].storeCode;
            this.curGroup.push(this.groupList[0]);
            this.getExpandList(this.groupList);
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
            }
        },
        currentIndexClick(index, url) {
            this.currentIndex = index;
        },
        onPageSelect() {
            let imgUrl = this.albumList[this.currentIndex].url;
            this.$emit("selectImgCheck", imgUrl);
            this.onVisibleChange(false);
        },
        handleSubmit() {
            let { memberCode, name, userMobile } = this.formInline;
            this.albumList = [];
            this.getAlbum({
                mediaType: 1,
                name,
                memberCode,
                userMobile
            });
        }
    },
    computed: {}
};
</script>
<style lang="less">
.img_list {
    overflow-y: scroll;
    height: 500px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .img_item {
        width: 45%;
        height: 200px;
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #fff;
        img {
            object-fit: fill;
            width: 100%;
            height: 150px;
        }
        p {
            margin-top: 5px;
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            overflow: hidden; //溢出隐藏
            white-space: nowrap; //禁止换行
            text-overflow: ellipsis; //...
        }
        div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
    .img_active {
        border: 1px solid #e51d1d;
    }
}

.data-item {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
    .upload {
        .upload-img-tem {
            width: 90px;
            height: 90px;
            line-height: 80px;
            margin-right: 8px;
            font-size: 50px;
        }
    }
    .data-link {
        h4 {
            font-size: 15px;
        }
        .blue {
            color: #3a99e0;
            cursor: pointer;
        }
    }
    .m-aux-text {
        color: #9797a1;
        font-size: 12px;
        line-height: 20px;
        padding: 8px 0;
    }
    .data-del {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 999;
        .ivu-btn {
            width: 36px;
            height: 36px;
            font-size: 18px;
            background: #fff;
            line-height: 36px;
            text-align: center;
        }
    }
}
</style>