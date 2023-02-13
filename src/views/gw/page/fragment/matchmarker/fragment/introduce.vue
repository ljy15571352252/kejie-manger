<template>
    <div>
        <Modal v-model="value" title="介绍" @on-cancel="cancel" :width="1000">
            <Form
                ref="myForm"
                :model="blockData"
                :rules="rules"
                :label-width="100"
            >
                <FormItem label="标题" style="width: 350px" prop="title">
                    <Input v-model="blockData.title" placeholder="标题"></Input>
                </FormItem>
                <FormItem label="内容：" prop="content" style="width: 920px">
                    <script type="text/plain" id="editor"></script>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="submitChange">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: "introduce",
    props: {
        data: Object,
        value: Boolean,
    },
    data() {
        return {
            name: "",
            isInitUEdit: false,
            blockData: {},
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入标题",
                        trigger: "change",
                    },
                ],
                content: [
                    {
                        validator: (rule, value, callback) => {
                            this.blockData.content = this.$ueditor.getContent();
                            if (this.isBlank(this.blockData.content))
                                callback(new Error("请填写内容"));
                            callback();
                        },
                        required: true,
                        message: "请填写内容",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    watch: {
        value(cur) {
            if (!cur) {
                this.$ueditor.setInitContent("");
            } else {
                setTimeout(() => {
                    if (!this.isInitUEdit) {
                        this.$ueditor.init("editor");
                        this.isInitUEdit = true;
                    }
                    if (this.blockData.content)
                        this.$ueditor.setContent(this.blockData.content);
                }, 1000);
            }
        },
    },
    computed: {},
    methods: {
        submitChange() {
            this.$refs["myForm"].validate(valid => {
                if (!valid) {
                    this.$Message.error("请补充编辑内容");
                    return;
                }
                this.$emit("on-update", {
                    name: this.name,
                    data: this.blockData,
                });
            });
        },
        cancel() {
            this.$emit("on-cancel");
        },
    },
    created() {},
    mounted() {
        this.name = this.data.name;
        this.blockData = this.copyJson(this.data.data);
    },
};
</script>

<style scoped lang="less">
/deep/.ivu-input-group-prepend {
    padding: 0;
}
.img {
    display: inline-block;
    width: 281px;
    height: 120px;
    text-align: center;
    line-height: 120px;
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
