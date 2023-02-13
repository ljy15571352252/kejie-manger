<template>
    <div>
        <Modal v-model="value"
               title="轮播图编辑"
               @on-cancel="cancel">
            <div>
                <Input v-model="activityName" placeholder="活动名称" style="width: 200px"></Input>
                <Button type="success" @click="addItem" style="float: right;margin-bottom: 10px">新增活动</Button>
            </div>
            <div>
                <Tabs :value="selectIndex" style="width: 100%" type="card" closable @on-tab-remove="handleClose">
                    <Tab-pane :name="(index).toString()" :label="item.title" v-for="(item, index) in modelList" :key="item.title">
                        <div style="clear: both">
                            <Collapse v-model="displayTarget" accordion v-if="item.children && item.children.length > 0">
                                <Panel :name="(i+1).toString()" v-for="(data,i) in item.children" :key="i">
                                    第{{i+1}}个banner
                                    <div class="del-item">
                                        <Button type="success" size="small" @click="addList($event,item)" v-if="i === 0">新增</Button>
                                        <Button type="error" size="small" @click="delItem($event,item, i)" v-else>删除</Button>
                                    </div>
                                    <Form slot="content" ref="myForm" :model="data" :rules="rules" :label-width="100">
                                        <FormItem label="活动图片" prop="src">
                                            <image-upload @on-upload-success="(url)=>{data.src=url}">
                                                <div class="img" style="border: 1px solid">
                                                    <img :src="data.src" v-if="data.src"/>
                                                    <span v-if="!data.src">+</span>
                                                </div>
                                            </image-upload>
                                        </FormItem>
                                        <FormItem label="活动标题" style="width: 350px" prop="activityName">
                                            <Input v-model="data.activityName" placeholder="活动时间"></Input>
                                        </FormItem>
                                        <FormItem label="活动时间" style="width: 350px" prop="activityTime">
                                            <Input v-model="data.activityTime" placeholder="活动时间"></Input>
                                        </FormItem>
                                        <FormItem label="活动地址" style="width: 350px" prop="activityAddress">
                                            <Input v-model="data.activityAddress" placeholder="活动地址"></Input>
                                        </FormItem>
                                        <FormItem label="咨询电话" style="width: 350px" prop="telephone">
                                            <Input v-model="data.telephone" placeholder="咨询电话"></Input>
                                        </FormItem>
                                        <FormItem label="活动类型" style="width: 350px" prop="activityType">
                                            <Input v-model="data.activityType" placeholder="活动类型"></Input>
                                        </FormItem>
                                        <FormItem label="活动费用" style="width: 350px" prop="activityCost">
                                            <Input v-model="data.activityCost" placeholder="活动费用"></Input>
                                        </FormItem>
                                    </Form>
                                </Panel>
                            </Collapse>
                        </div>

                    </Tab-pane>
                </Tabs>
            </div>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="submitChange">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import ImageUpload from '@/components/upload/ImageUpload'

    export default {
        name: "leftActivity",
        props: {
            data: Object,
            value: Boolean
        },
        data() {
            return {
                name: 'leftActivity',
                displayTarget: '1',
                selectIndex: '0',
                activityName: '',
                modelList: [
                    {
                        title: '',
                        children: [
                            {
                                activityName: '',
                                src: '',
                                activityTime: '',
                                activityAddress: '',
                                telephone: '',
                                activityType: '',
                                activityCost: '',
                            }
                        ]
                    }
                ],
                rules: {
                    src: [
                        {required: true, message: '请上传图片', trigger: 'change'}
                    ],
                    activityName: [
                        {required: true, message: '请输入活动标题', trigger: 'blur'}
                    ],
                    activityTime: [
                        {required: true, message: '请输入活动时间', trigger: 'blur'}
                    ],
                    activityAddress: [
                        {required: true, message: '请输入活动地址', trigger: 'blur'}
                    ],
                    telephone: [
                        {required: true, message: '请输入咨询电话', trigger: 'blur'}
                    ],
                    activityType: [
                        {required: true, message: '请输入活动类型', trigger: 'blur'}
                    ],
                    activityCost: [
                        {required: true, message: '请输入活动费用', trigger: 'blur'}
                    ],
                }
            }
        },
        watch: {},
        computed: {},
        components: {ImageUpload},
        methods: {
            handleClose(index) {
                this.modelList.splice(index, 1)
            },
            delItem(e, item, i) {
                e.stopPropagation()
                if (item.children.length <= 1) {
                    this.$Message.warning('至少需要一个活动')
                    return
                }
                this.$Modal.confirm({
                    title: '删除',
                    content: '<p>您确定要删除第' + (i + 1) + '个banner吗？</p>',
                    onOk: () => {
                        item.children.splice(i, 1)
                    },
                    onCancel: () => {
                    }
                })
            },
            addList(e, item) {
                e.stopPropagation()
                item.children.push({
                    activityName: '',
                    src: '',
                    activityTime: '',
                    activityAddress: '',
                    telephone: '',
                    activityType: '',
                    activityCost: '',
                })
            },
            addItem() {
                if (!this.activityName) {
                    this.$Message.info('请输入活动名称')
                    return
                }
                if (this.modelList.some(item => item.title === this.activityName)) {
                    this.$Message.info('活动名称重复')
                    return
                }
                this.modelList.push({
                    title:  this.activityName,
                    children: [
                        {
                            activityName: '',
                            src: '',
                            activityTime: '',
                            activityAddress: '',
                            telephone: '',
                            activityType: '',
                            activityCost: '',
                        }
                    ]
                })
            },
            submitChange() {
                if (this.modelList.length <= 0) {
                    this.$Message.error('请添活动数据')
                    return
                }
                let isValid = true
                this.$refs['myForm'].map(form => {
                    form.validate(valid => {
                        if (!valid) {
                            isValid = false
                        }
                    })
                })
                if (!isValid) {
                    this.$Message.error('请补充编辑内容')
                    return
                }
                this.$emit('on-update', {name: this.name, data: this.modelList})
            }, cancel() {
                this.$emit('on-cancel')
            }
        },
        created() {

        },
        mounted() {
            this.modelList = this.copyJson(this.data.data)
        }
    }
</script>

<style scoped lang="less">
    /deep/.ivu-input-group-prepend{
        padding: 0;
    }
    .del-item {
        height: 38px;
        line-height: 38px;
        float: right;
        padding-right: 10px
    }

    .img {
        display: inline-block;
        width: 281px;
        height: 175px;
        text-align: center;
        line-height: 175px;
        color: #ccc;
        font-weight: bold;
        font-size: 30px;
        cursor: pointer;
        border-radius: 3px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .Tag{
        margin: 10px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
    }
</style>
