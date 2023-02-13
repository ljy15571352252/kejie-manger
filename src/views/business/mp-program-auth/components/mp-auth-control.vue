<template>
    <div>
        <Form ref="searchForm" :model="versionForm" :label-width="130">
            <Row>
                <Col :span="6">
                    <FormItem label="发布小程序：" prop="curMpType">
                        <Select
                            v-model="versionForm.curMpType"
                            style="width: 200px"
                        >
                            <Option
                                v-for="item in mpProgramOptions"
                                :value="item.value"
                                :key="item.value"
                                >{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="6">
                    <FormItem label="当前小程序版本：">
                        <span
                            >{{ versionForm.curSelectVersion.version
                            }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                                versionForm.curSelectVersion.description
                            }}</span
                        >
                        <Button @click="showVersionSelectorModal = true" class="margin-left-10"
                            >更改版本</Button
                        >
                    </FormItem>
                </Col>
            </Row>
        </Form>

        <Row :gutter="20" >
            <Col :span="9">
                <Card dis-hover class="impower-box">
                    <div class="num">1</div>
                    <div class="x-start">
                        <div class="img">
                            <Icon type="md-options" color="#FFB800" size="48" />
                            <p>预览调试</p>
                        </div>
                        <div class="info">
                            <div class="tit">
                                发布前请先获取体验码预览效果，体验完成没问题再点击提交审核按钮进行审核
                                获取体验码
                            </div>
                            <div class="x-bc margin-top-20 btnbox">
                                <Button
                                    @click="onShowExperienceCode"
                                    type="primary"
                                    >获取体验码</Button
                                >
                                <Button
                                    @click="onShowBindExperiencerModal"
                                    type="warning"
                                    >绑定体验者</Button
                                >
                                <Button
                                    @click="onShowUnBindExperiencerModal"
                                    type="error"
                                    >解绑体验者</Button
                                >
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col :span="8">
                <Card dis-hover class="impower-box">
                    <div class="num">2</div>
                    <div class="x-start">
                        <div class="img">
                            <Icon
                                type="md-cloud-upload"
                                color="#FFB800"
                                size="48"
                            />
                            <p>发布审核</p>
                        </div>
                        <div class="info">
                            <div class="tit">
                                发布提交后将在数个工作日审核，具体以微信官方为准。成功后将会有微信消息通知，您也可以主动获取审核状态
                            </div>
                            <div class="x-bc margin-top-20 btnbox">
                                <Button @click="onSubmitAudit" type="primary">提交审核</Button>
                                <Button @click="getAuditStatus"
                                        type="warning" >获取审核状态</Button
                                >
                                <Button @click="onPublishRelease"
                                        type="success" >发布上线</Button
                                >
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col :span="7">
                <Card dis-hover class="impower-box">
                    <div class="num">3</div>
                    <div class="x-start">
                        <div class="img">
                            <Icon type="md-barcode" color="#FFB800" size="48" />
                            <p>小程序码</p>
                        </div>
                        <div class="info">
                            <div class="tit">
                                查看下载小程序码，微信好友转发或者营销刊物制作
                            </div>
                            <div class="btnbox">
                                <Button @click="onShowMpCode" type="primary"
                                    >查看小程序码
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>

        <div class="margin-top-20">
            <Table
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                @on-sort-change="onSortChange"
            >
                <template slot-scope="{ row }" slot="type">
                    {{ row.type | mpOperType }}
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
        <experiencer-modal
            v-model="showExpModal"
            :appid="authInfo.appid"
            :bind="expBind"
            @on-success="getDataList(1)"
        />
        <version-selector
            v-model="showVersionSelectorModal"
            :type="versionForm.curMpType"
            :selected-code="null"
            @on-select="onVersionSelect"
        />
        <Modal :title="previewTit" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
    </div>
</template>

<script>
import ExperiencerModal from "./experiencer-modal";
import VersionSelector from "./versions-selector";
import {
    getLatestAuditMpProgram,
    getMpProgramAuditStatus,
    getMpProgramCode,
    getMpProgramExperienceCode,
    getMpProgramOperateLogs,
    releaseMpProgram,
    submitMpProgramAudit,
} from "@/api/configset/wxconfig";
import { mpProgramOptions } from "@/common/utils/viewui-utils";

export default {
    name: "mp-auth-control",
    props: ["authInfo"],
    components: { ExperiencerModal, VersionSelector },
    data() {
        return {
            mpProgramOptions: mpProgramOptions(),
            showExpModal: false,
            expBind: true,
            showVersionSelectorModal: false,
            versionForm: {
                auditId: null,
                curMpType: 1,
                curSelectVersion: {},
            },
            previewTit: "",
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
                    title: "时间",
                    key: "createTime",
                    sortable: true,
                },
                {
                    title: "操作",
                    slot: "type",
                },
                {
                    title: "描述",
                    key: "description",
                },
            ],
            tableData: [],
        };
    },
    watch: {
        authInfo(cur) {
            if (!this.isEmptyObject(cur)) this.getLatestAuditVersion();
        },
    },
    methods: {
        async getLatestAuditVersion() {
            let res = await getLatestAuditMpProgram({
                appid: this.authInfo.appid,
            });
            if (res) {
                this.versionForm.auditId = res.auditid;
                this.versionForm.curSelectVersion = res.codeTem;
            }
        },
        async onShowExperienceCode() {
            if (this.isEmptyObject(this.versionForm.curSelectVersion)) {
                this.$Message.info("请先选择小程序版本");
                return;
            }
            let res = await getMpProgramExperienceCode({
                appid: this.authInfo.appid,
                codeTemCode: this.versionForm.curSelectVersion.code,
            })
            // let res = await getMpProgramExperienceCode({
            //     appid: this.authInfo.appid,
            //     auditId: null,
            // });
            if (res) {
                this.previewTit = "小程序体验码";
                this.preview = true;
                this.previewUrl = res;
            }
            this.getDataList(1);
        },
        async onShowMpCode() {
            let res = await getMpProgramCode({ appid: this.authInfo.appid });
            if (res) {
                this.previewTit = "小程序码";
                this.preview = true;
                this.previewUrl = res;
            }
            this.getDataList(1);
        },
        onShowBindExperiencerModal() {
            this.showExpModal = true;
            this.expBind = true;
        },
        onShowUnBindExperiencerModal() {
            this.showExpModal = true;
            this.expBind = false;
        },
        async onSubmitAudit() {
            if (this.isEmptyObject(this.versionForm.curSelectVersion)) {
                this.$Message.error("请选择发布版本");
                return;
            }
            let res = await submitMpProgramAudit({
                appid: this.authInfo.appid,
                codeTemCode: this.versionForm.curSelectVersion.code,
            });
            if (res) {
                this.versionForm.auditId = res;
                this.$Message.success("提交成功，请耐心等待审核通过");
            }
            this.getDataList(1);
        },
        async getAuditStatus() {
            if (this.isEmptyObject(this.versionForm.auditId)) {
                this.$Message.error("请先提交版本审核");
                return;
            }
            let { status, reason } = await getMpProgramAuditStatus({
                auditId: this.versionForm.auditId,
            });
            this.$Message.info(
                `审核结果：${this.$options.filters["mpAuditStatus"](
                    status
                )} ${reason}`
            );
        },
        async onPublishRelease() {
            let res = await releaseMpProgram({ appid: this.authInfo.appid });
            if (res) {
                this.$Message.success("发布成功");
            }
        },
        async getDataList(page) {
            this.tableLoading = true;
            const searchQuery = {
                page: page,
                ...this.searchCond.options,
                sortByCreateTime: this.searchCond.sortByCreateTime,
            };
            let { records, total, size, current } =
                await getMpProgramOperateLogs(searchQuery);
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
        onVersionSelect(version) {
            this.versionForm.curSelectVersion = version;
        },
    },
    mounted() {
        this.getDataList(1);
    },
};
</script>

<style scoped lang="less">
.impower-box {
    position: relative;
    .num {
        position: absolute;
        top: 10px;
        left: -10px;
        width: 36px;
        height: 36px;
        background: #ffb800;
        border-radius: 50%;
        line-height: 36px;
        color: #fff;
        font-size: 20px;
        font-style: italic;
        padding-left: 13px;
        box-sizing: border-box;
    }
    .img {
        display: inline-block;
        margin-left: 30px;
        width: 120px;
        height: 232px;
        flex-shrink: 0;
        text-align: center;
        padding-top: 80px;
        background: url(/static/images/phone-bg.png) no-repeat;
        background-size: 120px auto;
        box-sizing: border-box;
        p {
            font-size: 16px;
            color: #bcbcbc;
            margin-top: 10px;
        }
    }
    .info {
        position: relative;
        height: 235px;
        margin-left: 15px;
        .tit {
            font-size: 16px;
        }

        .tit {
            font-size: 16px;
        }
        .tit {
            font-size: 16px;
        }
        .btnbox {
            position: absolute;
            bottom: 20px;
            width: 100%;
        }
    }
}
</style>
