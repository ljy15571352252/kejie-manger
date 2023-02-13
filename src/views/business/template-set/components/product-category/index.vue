<template>
  <Row
    type="flex"
    class="code-row-bg"
    wrap
    :gutter="32"
  >

    <Col
      class="col"
      span="4"
      v-for="(item,index) in custIndexList"
      :key="index"
    >
    <div :class="item.enable==1?'active diy-module':'diy-module'">
      <img
        :src="item.imgUrl?item.imgUrl:'../../../../../../static/images/member_personal_center.png'"
        alt=""
        @click="enableTem(item.enable,item.code)"
      />
      <div class="preview-module">
        <p>{{item.name}}</p>
        <Button
          icon="md-eye"
          @click="getImagePreview(item.imgUrl)"
        >大图预览</Button>
        <Button
          icon="md-settings"
          @click="useTem(item.code)"
        >应用模板</Button>
        <Button
          v-if="item.enable!=1"
          icon="md-trash"
          type="error"
          @click="delTem(item.code,item.storeCode)"
        >删除模板</Button>
      </div>
      <p class="used">当前模板</p>
    </div>
    </Col>

    <Col
      class="col add-module"
      span="4"
    >
    <div
      class="diy-module"
      @click="addModule"
    >
      <Icon
        class="add-icon"
        color="#e51d1d"
        type="ios-add-circle"
        size="64"
      />
    </div>
    </Col>
    <Modal
      title="图片预览"
      v-model="preview"
      scrollable
      footer-hide
    >
      <div class="imgBox">
        <img
          :src="previewUrl"
          v-if="preview"
          style="width: 100%;"
        />
      </div>

    </Modal>
  </Row>
</template>

<script>
import {
    getCustTemplateList,
    enableCustTemplate,
    delCustTemplate
} from "@/api/store/store";
export default {
    name: "index",
    data() {
        return {
            previewUrl: "",
            preview: false,
            custIndexList: []
        };
    },
    created() {
        this.getTemList();
    },
    methods: {
        async getTemList() {
            const { records, total } = await getCustTemplateList();
            this.custIndexList = records;
        },
        async enableTem(enable, code) {
            if (enable == 1) {
                this.$Message.error("当前模板正在启用中~");
            } else {
                const res = await enableCustTemplate({ code: code });
                if (res ) {
                    this.$Message.success("自定义模板启用成功");
                    this.getTemList();
                }
            }
        },
        useTem(code) {
              let routeUrl = this.$router.resolve({
                path: "/diyModule/add",
                query: {
                    code
                }
            });
            window.open(routeUrl.href, "_blank");
        },
        addModule() {
             let routeUrl = this.$router.resolve({
                path: "/diyModule/add",
            });
            window.open(routeUrl.href, "_blank");
        },
        delTem(code,storeCode) {
            this.$Modal.confirm({
                title: "删除自定义板块？",
                content: "<p>删除之后无法恢复，确定要删除吗？</p>",
                onOk: () => {
                    delCustTemplate({
                        code,
                        storeCode
                    }).then(res => {
                        if (res ) {
                            this.$Message.success("删除成功");
                            this.getTemList();
                        } else {
                            this.$Message.error("删除失败");
                        }
                    });
                },
                onCancel: () => {}
            });
        },
        getImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        }
    }
};
</script>

<style lang="less">
.col {
    text-align: center;
    margin: 0 0 30px 0;
    height: 300px;
    cursor: pointer;
    position: relative;

    .diy-module {
        position: relative;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        img {
            width: 100%;
        }
        .preview-module {
            position: absolute;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            bottom: -118px;
            padding: 10px 0;
            transition: all 0.3s;
            p {
                font-size: 16px;
                color: #fff;
            }
            button {
                width: 80%;
                margin-top: 5px;
            }
        }
        .used {
            font-size: 14px;
            color: #fff;
            background-color: #e51d1d;
            padding: 5px 15px;
            position: absolute;
            top: 0;
            left: 0;
            border-bottom-right-radius: 20px;
            display: none;
        }
        &.active {
            border: 1px dashed #e51d1d;
            .used {
                display: block;
            }
        }
    }

    &.add-module {
        .diy-module {
            border: 1px dashed #e51d1d;
        }
        &::after {
            content: "添加自定义模板";
            font-size: 16px;
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 100px;
        }
    }

    &:hover {
        .preview-module {
            bottom: 0;
        }
    }
}
.add-icon {
    line-height: 250px;
}
.ivu-tabs-nav .ivu-tabs-tab:hover {
    color: #e51d1d;
}
// /deep/.ivu-modal-body {
//     height: 600px;
//     overflow-y: auto;
// }
.imgBox {
    height: 600px;
    width: 100%;
    overflow-y: auto;
}
</style>