<template>
    <div>
        <Form
            :model="memberForm"
            ref="memberForm"
            :rules="ruleValidate"
            class="member-detail-form"
        >
            <Row>
                <Col
                    :span="mode !== PAGE_MODE.ADD ? 10 : 24"
                    style="text-align: center"
                >
                    <FormItem prop="logo">
                        <image-upload
                            @on-upload-success="
                                url => {
                                    $set(memberForm, 'logo', url);
                                }
                            ">
                            <div
                                class="upload-img-tem"
                                style="border: 1px dashed"
                            >
                                <img :src="memberForm.headUrl" v-if="memberForm.headUrl" />
                                <span v-if="!memberForm.headUrl">+</span>
                            </div>
                        </image-upload>
                        <a type="text" @click="onImagePreview">图片预览</a>
                    </FormItem>
                </Col>
                <Col span="14" class="top-info" v-if="mode !== PAGE_MODE.ADD">
                    <div>会员 ID：{{ memberForm.id }}</div>
                    <div>注册时间：{{ memberForm.registerTime }}</div>
                    <div>上一次更新：{{ memberForm.updateTime }}</div>
                </Col>
            </Row>
            <div>
                <Divider orientation="left">基本信息</Divider>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="名称" prop="nickName">
                            <Input
                                v-model="memberForm.nickName"
                                placeholder="请输入名称"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="性别" prop="sex">
                            <Select
                                v-model="memberForm.sex"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item,index in sexOptions"
                                    :value="item.value"
                                    :key="index"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="手机" prop="mobileNumber">
                            <Input
                                v-model="memberForm.mobileNumber"
                                placeholder="请输入您的手机"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            ></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="账号状态" prop="status">
                            <Select
                                v-model="memberForm.status"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in storeStateOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <!-- <Row>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="在线状态" prop="imStatus">
                            <Select
                                v-model="memberForm.status"
                                :disabled="mode === PAGE_MODE.DETAIL"
                            >
                                <Option
                                    v-for="item in storeStateOptions"
                                    :value="item.value"
                                    :key="item.value"
                                    >{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="12" class="form-item-padding">
                        <FormItem label="手机是否验证" prop="isMobileVerify">
                            <br>
                            <Badge
                                :style="{'float':'center'}"
                                :offset="[0,0]"
                                :text="$options.filters['mobileVerify'](memberForm.isMobileVerify)"
                                :color="$options.filters['mobileVerify'](memberForm.isMobileVerify,true)">
                            </Badge>
                        </FormItem>
                    </Col>
                </Row> -->
                <!-- <FormItem label="地区" prop="area">
                    <area-cascader
                        v-model="memberForm.area"
                        target="county"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></area-cascader>
                </FormItem> -->
                <!-- <FormItem label="详细地址" prop="address">
                    <Input
                        v-model="memberForm.address"
                        placeholder="请输入详细地址"
                        :disabled="mode === PAGE_MODE.DETAIL"
                    ></Input>
                </FormItem> -->
            </div>
        </Form>
        <Modal title="图片预览" v-model="preview">
            <img :src="previewUrl" v-if="preview" style="width: 100%" />
        </Modal>
        <Tabs :value="columns" @on-click="changeTabs">
            <TabPane label="查看余额" name="1">
                <member-table :tableData="balanceTable" :pageInfo="balancePage" :columns="columns"></member-table>
            </TabPane>
            <TabPane label="查看消费记录" name="2">
                <member-table :tableData="consumeTable" :pageInfo="consumePage"></member-table>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import AreaCascader from "@/components/area/areaCascader";
import ImageUpload from "@/components/upload/ImageUpload";
// 状态选项
import { storeStateOptions, sexOptions } from "@/common/utils/viewui-utils";
// 操作模式
import { PAGE_MODE } from "@/common/constants";
// 会员详情接口、会员余额接口
import { getMemberDetail, getBalanceLogs, getConsumeRecords } from "@/api/member/member";
// 表格组件
import MemberTable from './member-table'

export default {
    nickName: "member-form",
    props: ["codeObj", "mode"],
    components: { ImageUpload,AreaCascader, MemberTable },
    data() {
        return {
            // 状态选项
            storeStateOptions: storeStateOptions(),
            // 性别选项
            sexOptions:sexOptions(),
            // 图片预览
            preview: false,
            // 预览图片url
            previewUrl: null,
            // 会员表单
            memberForm: {},
            // 表单验证规则
            ruleValidate: {},
            btnLoading: false,
            // 会员余额所需参数
            balanceParams:{},
            // 会员余额
            balanceTable:[],
            balancePage:{},
            // 会员消费明细
            consumeTable:[],
            consumePage:{},
            // 当前标签索引
            columns:'1'
        };
    },
    watch: {
        // 监听codeObj（对象，需要开启深度监听），发生变化则重置
        codeObj:{
            deep:true,
            handler(){
                this.onReset();
                // 当前操作不为添加
                if (this.mode !== PAGE_MODE.ADD) this.fillData();
            }
        },
        // 监听操作模式，发生变化则重置
        mode(cur) {
            this.onReset();
            if (cur !== PAGE_MODE.ADD) this.fillData();
        },
    },
    methods: {
        // 重置详情
        onReset() {
            this.memberForm = {};
            this.balanceTable = []
        },
        // 图片预览
        onImagePreview(url) {
            this.preview = true;
            this.previewUrl = url;
        },
        // 获取会员详情数据
        async fillData() {
            // 请求接口获得数据
            this.memberForm = await getMemberDetail(this.codeObj);
            this.balanceParams.memberCode = this.memberForm.code
            // 判断当前性别
            if(this.memberForm.sex === true){
                this.memberForm.sex = 1
            }else if(this.memberForm.sex === false){
                this.memberForm.sex = 0
            }else{
                this.memberForm.sex = 1
            }

            // 当前操作为查看详情
            if (this.mode === PAGE_MODE.DETAIL){
                this.balanceLogs()
                this.consumeRecords()
            }
        },
        // 查看余额
        async balanceLogs(){
            let { records, total, size, current } = await getBalanceLogs(this.balanceParams)
            this.balanceTable = records
            this.balancePage = {
                total,
                size,
                current,
            };
        },
        async consumeRecords(){
            let { records, total, size, current } = await getConsumeRecords(this.balanceParams)
            this.consumeTable = records
            this.consumePage = {
                total,
                size,
                current,
            };
            console.log('consumeRecords',records)
        },
        // 
        changeTabs(data){
            this.columns = data
        }
    },
    mounted() {
    },
    async created() {},
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
    padding: 0 16px 16px 5px;
}

.drawer-footer {
    margin-top: 10px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
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
</style>
