<template>
    <Card class="common-card">
        <p slot="title">
            <Icon type="ios-globe" />
            PC端页面列表
        </p>
        <Row>
            <Col>
                <Card
                    class="adCard"
                    v-for="(item, index) in pageList"
                    :key="index"
                >
                    <div class="img">
                        <img :src="item.image" />
                    </div>
                    <div class="info">
                        <p style="font-weight: bold; margin-bottom: 3px">
                            {{ item.type | pageTemplateType }}
                        </p>
                        <div class="btn">
                            <Button type="primary" @click="editPage(item)"
                                >编辑</Button
                            >
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
        <Modal v-model="isShowIFrame" title="编辑模板" fullscreen>
            <iframe
                id="mainFrame"
                frameborder="0"
                style="padding: 0; width: 100%; height: 100%"
            >
            </iframe>
            <div slot="footer">
                <Button @click="isShowIFrame = false">取消</Button>
                <Button type="primary" @click="save">保存</Button>
            </div>
        </Modal>
        <div v-if="!isEmptyObject(componentArr)">
            <div
                v-for="(item, i) in componentArr"
                v-if="componentName === item"
                :key="i"
            >
                <async-load-comp
                    :name="item"
                    :dir="'views/gw/page/fragment/' + item"
                    :prop="childProp"
                />
            </div>
        </div>
    </Card>
</template>

<script>
import { getGwPageList, updateGwPageData, getGwPageData } from "@/api/gw/gw";
import { profile } from "@/config";
import AsyncLoadComp from "@/components/asyncLoadComp.vue";


const PAGE_MAP = new Map([
    [1, "首页"],
    [2, "功能表页面"],
    [3, "活动数据页面"],
    [4, "合伙人数据页面"],
    [5, "红娘助手数据页面"],
]);
const COMPONENT_MAP = new Map([
    [1, "gw_index"],
    [2, "function"],
    [3, "activity"],
    [4, "merchant"],
    [5, "matchmarker"],
]);
export default {
    name: "carPageTemplate",
    filters: {
        pageTemplateType(val, color) {
            return PAGE_MAP.get(val);
        },
    },
    data() {
        return {
            pageTemplateDomain: profile.GW_PAGE_SITE,
            componentName: "",
            componentArr: [],
            isShowIFrame: false,
            childProp: {
                name: "",
                pageType: null,
                pageJson: {},
                callback: this.submitChange,
            },
            pageList: [],
        };
    },
    watch: {
        "searchItem.target"() {
            this.getDataList();
        },
    },
    computed: {},
    components: { AsyncLoadComp },
    methods: {
        async save() {
            const json = {};
            for (let key in this.childProp.pageJson) {
                let item = this.childProp.pageJson[key];
                json[key] = item.data;
            }
            let result = await updateGwPageData({
                type: this.childProp.pageType,
                content: JSON.stringify(json),
            });
            if (result == true) {
                this.$Message.success("保存成功");
            }
            this.isShowIFrame = false;
        },
        async editPage(item) {
            this.$Spin.show();
            let { content } = await getGwPageData({ type: item.type });
            this.$Spin.hide();
            content = JSON.parse(content);
            Object.keys(content).map(key => {
                content[key] = {
                    name: key,
                    data: content[key],
                };
            });
            if (item.type === 2 && !content.hasOwnProperty('menubar')) {
                content.menubar = {
                    name: 'menubar',
                    data: [],
                }
            }
            if (item.type === 3 && !content.hasOwnProperty('leftActivity')) {
                content.leftActivity = {
                    name: 'leftActivity',
                    data: [],
                }
            }
            console.log(content)
            this.childProp = {
                name: "",
                pageType: item.type,
                pageJson: content,
                callback: this.submitChange,
            };
            const name = COMPONENT_MAP.get(item.type);
            let index = this.componentArr.indexOf(name);
            if (index === -1) this.componentArr.push(name);
            this.componentName = name;
            this.isShowIFrame = true;

            document.getElementById("mainFrame").src =
                this.pageTemplateDomain + item.templatePath;
        },
        async getDataList() {
            this.pageList = await getGwPageList();
        },
        receiveMessage(event) {
            if (event.origin === this.pageTemplateDomain) {
                this.childProp.name = event.data.key;
            }
        },
        submitChange(data) {
          this.childProp.pageJson = data;
            const json = {};
            for (let key in data) {
                let item = data[key];
                json[key] = item.data;
            }
            let targetFramne = document.getElementById("mainFrame");
            targetFramne.contentWindow.postMessage(json, "*");
            this.childProp.name = "";
        },
    },
    created() {
        this.getDataList();
    },
    mounted() {
        window.addEventListener("message", this.receiveMessage);
    },
    destroyed() {
        window.removeEventListener("message", this.receiveMessage);
    },
};
</script>

<style scoped lang="less">
/deep/ .ivu-modal-body {
    padding: 0;
}

.adCard {
    width: 450px;
    float: left;
    overflow: hidden;
    margin: 0 10px 15px;

    .img {
        width: 100%;
        height: 200px;
        margin-bottom: 10px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .info {
        p {
            overflow: hidden;

            span {
                text-align: left;
                display: inline-block;
                width: 100px;
            }

            span:nth-child(2) {
                padding-left: 28px;
                float: right;
            }
        }

        .btn {
            overflow: hidden;

            Button {
                float: right;
                margin-left: 10px;
            }
        }
    }
}
</style>
