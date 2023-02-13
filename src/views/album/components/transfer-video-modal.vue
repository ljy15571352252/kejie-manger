<template>
    <div>
        <Modal
            v-model="showModal"
            title="转移分组"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-visible-change="onVisibleChange"
        >
            <Form
                :model="myForm"
                ref="myForm"
            >
                <FormItem prop="groupCode">
                    <Tree :data="groupList" :render="renderContent" @on-select-change="onSelectChange"></Tree>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="onVisibleChange(false)"
                    >取消</Button
                >
                <Button
                    type="primary"
                    :loading="submitBtnLoading"
                    @click="onSubmit"
                    >转移</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import { getGroupList, transferAlbumList } from "@/api/member/gallery";

export default {
    name: "domain-modal",
    props: ["value", "checkedData"],
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            groupList:[],
            myForm: {
                groupCode : ''
            },
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
    },
    async created(){
        this.groupList = await getGroupList({
            mediaType:2
        });
            this.groupList.map(item => {
                this.$set(item,'expand',true)
                item.render = (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', [
                                h('span', data.name)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right'
                                }
                            })
                        ]);
                    }
            })
    },
    methods: {
        renderContent (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('span', data.name)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right'
                    }
                })
            ]);
        },
        onSelectChange(item){
            let groupCode = ''
            if(item.length){
                groupCode = item[0].code
                
            }
            this.myForm.groupCode = groupCode
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        async onSubmit() {
            if(this.myForm.groupCode){
                this.myForm.codeList = this.checkedData
                const formData = this.copyJson(this.myForm);
                this.submitBtnLoading = true;
                let res = await transferAlbumList(formData)
                this.submitBtnLoading = false;
                if (res ) {
                    this.$Message.success('转移成功');
                    this.showModal = false
                    this.$emit('on-success')
                }
            }else{
                this.$Message.error('请选择分组');
            }
            
                
                // const targetAction = modeAction.get(this.mode);
                // let res = await targetAction.func(formData);
                
                // if (res) {
                //     this.$Message.success(targetAction.successTxt);
                //     if (this.mode === PAGE_MODE.ADD) this.onReset();
                //     this.$emit(targetAction.emit);
                //     this.onVisibleChange(false);
                // }
        },
    },
};
</script>

<style scoped lang="less">
/deep/.ivu-tree{
    border-bottom: 1px solid #e2e2e2;
    ul{
        font-size: 14px;
        line-height: 43px;
    }
    > .ivu-tree-children{
        > li{
            border: 1px solid #e2e2e2;
            border-bottom: none;
            margin: 0;
            .ivu-tree-children{
                border-top: 1px solid #e2e2e2;
                li{
                    margin: 0;
                }
            }
        }   
        
    }
    .ivu-tree-title-selected,.ivu-tree-title:hover, .ivu-tree-title-selected:hover{
        color: #e51d1d;
        background: #fff;
    }
    .ivu-tree-arrow{
        margin-left: 15px;
    }
}
</style>
