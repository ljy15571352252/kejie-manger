<template>
    <div>
        <Modal v-model="value"
               title="功能表编辑"
               @on-cancel="cancel">
            <Button type="success" @click="addItem" style="float: right;margin-bottom: 10px">新增banner</Button>
            <div style="clear: both">
                <Collapse v-model="displayTarget" accordion>
                    <Panel :name="(index+1).toString()" v-for="(item,index) in modelList" :key="index">
                        第{{index+1}}个功能编辑
                        <div class="del-item">
                            <Button type="error" size="small" @click="delItem($event,index)">删除</Button>
                        </div>
                        <Form slot="content" ref="myForm" :model="item" :rules="rules" :label-width="100">
                            <FormItem label="请选择图片" prop="src">
                                <image-upload @on-upload-success="(url)=>{item.src=url}">
                                    <div class="img" style="border: 1px solid">
                                        <img :src="item.src" v-if="item.src"/>
                                        <span v-if="!item.src">+</span>
                                    </div>
                                </image-upload>
                            </FormItem>
                            <FormItem label="功能名称" style="width: 350px" prop="name">
                                <Input v-model="item.name" placeholder="功能名称"></Input>
                            </FormItem>
                            <FormItem label="描述" style="width: 350px" prop="describe">
                                <Input v-model="item.describe" placeholder="描述"></Input>
                            </FormItem>
                            <FormItem label="详情" style="width: 350px" prop="detaile">
                                <Input v-model="item.detaile" placeholder="详情"></Input>
                            </FormItem>
                        </Form>
                    </Panel>
                </Collapse>
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
        name: "menubar",
        props: {
            data: Object,
            value: Boolean
        },
        data() {
            return {
                name: 'menubar',
                displayTarget: '1',
                modelList: [],
                rules: {
                    src:[
                        {required: true, message: '请上传图片', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入标题', trigger: 'change'}
                    ],
                    describe: [
                        {required: true, message: '请输入文字描述', trigger: 'blur'}
                    ],
                    detaile: [
                        {required: true, message: '请输入详情', trigger: 'blur'}
                    ],
                }
            }
        },
        watch: {},
        computed: {},
        components: {ImageUpload},
        methods: {
            delItem(e, index) {
                e.stopPropagation()
                if (this.modelList.length <= 1) {
                    this.$Message.warning('至少需要一个banner')
                    return
                }
                this.$Modal.confirm({
                    title: '删除',
                    content: '<p>您确定要删除第' + (index + 1) + '个banner吗？</p>',
                    onOk: () => {
                        this.modelList.splice(index, 1)
                    },
                    onCancel: () => {
                    }
                })
            },
            addItem() {
                this.modelList.push({
                    name:'',
                    src: '',
                    describe: '',
                    detaile: '',
                })
            },
            submitChange() {
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
</style>
