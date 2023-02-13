<template>
    <div>
        <Form :model="data" ref="data" class="member-detail-form" :label-width="100">
            <Row>
                <Col :span="10" style="text-align: center">
                    <FormItem>
                        <Avatar
                            :src="data.member.headUrl"
                            size="64"
                            shape="square"
                            style="position: relative; cursor: pointer"
                        >
                        </Avatar>
                    </FormItem>
                </Col>
                <Col span="14" class="top-info">
                    <div>下单用户 ID：{{ data.member.code }}</div>
                    <div>下单用户昵称：{{ data.member.nickName }}</div>
                </Col>
            </Row>
            <Divider orientation="left">群组信息</Divider>
            <Row>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="群图片：">
                        <div class="upload-img-tem" style="border: 1px dashed">
                            <img
                                :src="data.group.imageUrl"
                                v-if="data.group.imageUrl"
                            />
                        </div>
                    </FormItem>
                </Col>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="群名称：">
                        {{ data.group.name }}
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="简介：" class="form-item-padding">
                {{ data.group.introduce }}
            </FormItem>
            <FormItem label="标签：" class="form-item-padding">
                <template v-if="data.group.tags">
                    <Tag
                        :key="i"
                        v-for="(tag, i) in data.group.tags.split(',')"
                        >{{ tag }}</Tag
                    >
                </template>
            </FormItem>
            <Row>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="下单时间：">
                        {{ data.createTime }}
                    </FormItem>
                </Col>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="订单状态：">
                        {{ data.state | commonOrderState }}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="默认价格：">
                        {{ data.price | price }}
                    </FormItem>
                </Col>
                <Col :span="12" class="form-item-padding" v-if="data.levelName">
                    <FormItem :label="`${data.levelName}价格：`">
                        {{ data.memberLevelPrice | price }}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="总金额：">
                        {{ data.totalAmount | price }}
                    </FormItem>
                </Col>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="支付金额：">
                        {{ data.payAmount | price }}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="支付类型：">
                        {{ data.payType | payType }}
                    </FormItem>
                </Col>
                <Col :span="12" class="form-item-padding">
                    <FormItem label="支付时间：">
                        {{ data.payTime | price }}
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="完成时间：">
                {{ data.finishTime }}
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { getGroupOrderDetail } from "@/api/group/group";

export default {
    name: "group-order-detail",
    props: ["code",'storeCode'],
    components: {},
    data() {
        return {
            span: 12,
            data: { member: {}, group: {} },
            btnLoading: false,
        };
    },
    watch: {
        code() {
            this.fillData();
        },
    },
    methods: {
        async fillData() {
            this.data = { member: {} };
            this.data = await getGroupOrderDetail({ code: this.code,storeCode:this.storeCode });
        },
    },
    mounted() {},
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
