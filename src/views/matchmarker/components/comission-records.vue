<template>
    <div>
        <Modal
            v-model="showModal"
            title="收益明细"
            ok-text="提交"
            @on-visible-change="onVisibleChange"
        >
            <div v-if="!dataList" style="text-align: center;padding: 20px 0">
                暂无数据
            </div>
            <div v-for="item in dataList">
                <Row>
                    <Col :span="12">
                        订单类型：{{item.type | commissionOrderType}}
                    </Col>
                    <Col :span="12">
                        订单编号：{{item.orderCode}}
                    </Col>
                </Row>
                <Row>
                    <Col :span="12">
                        交易金额：{{item.orderAmount | price}}
                    </Col>
                    <Col :span="12">
                        交易时间：{{item.orderFinishTime}}
                    </Col>
                </Row>
                <Row>
                    <Col :span="12">
                        下单用户：{{item.member.nickName}}
                    </Col>
                    <Col :span="12">
                        用户  ID：{{item.member.code}}
                    </Col>
                </Row>
                <div>
                    用户手机：{{item.member.mobileNumber}}
                </div>
                <div>
                    描述：{{item.description}}
                </div>
                <Divider/>
            </div>
            <Page
                    class-name="page"
                    :total="pageInfo.total"
                    :page-size="pageInfo.size"
                    :current="pageInfo.current"
                    show-elevator
                    @on-change="getDataList"
            ></Page>
        </Modal>
    </div>
</template>

<script>
    import {getMatchMarkerCommissionRecords} from "@/api/matchmarker/matchmarker";

export default {
    name: "comission-records",
    props: ["value","code"],
    data() {
        return {
            pageInfo: {},
            showModal: false,
            dataList:[]
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
        code(cur){
            this.dataList=[]
            this.getDataList(1)
        }
    },
    methods: {
        async getDataList(page) {
            const searchQuery = {
                page: page,
                matchMarkerCode:this.code,
                sortByCreateTime: 'desc',
            };
            let { records, total, size, current } = await getMatchMarkerCommissionRecords(
                searchQuery
            );
            this.dataList = records;
            this.pageInfo = {
                total,
                size,
                current,
            };
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
    },
};
</script>

<style scoped lang="less">
    /deep/.ivu-modal-footer{display: none}
</style>
