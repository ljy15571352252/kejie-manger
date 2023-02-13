<template>
    <div>
        <Modal
            v-model="showModal"
            title="设置标签"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-ok="onSubmit"
            ok-text="提交"
            @on-visible-change="onVisibleChange"
        >
            <Form :model="myForm" ref="myForm">
                <div v-for="category in tagList">
                    <Divider plain orientation="left">{{
                        category.name
                    }}</Divider>
                    <Select v-model="myForm[category.code].tags" multiple>
                        <Option
                            v-for="(option, index) in category.tags"
                            :value="option.code"
                            :key="index"
                            >{{ option.name }}</Option
                        >
                    </Select>
                </div>
            </Form>
            <div slot="footer">
                <Button
                    type="primary"
                    :loading="submitBtnLoading"
                    @click="onSubmit"
                    >确认</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import { getTagCategories } from "@/api/data/data";
export default {
    name: "tag-category-select",
    props: {
        value: {
            type: Boolean,
        },
        selected: {
            type: Array,
            required: false,
        },
    },
    data() {
        return {
            showModal: false,
            tagList: [],
            submitBtnLoading: false,
            myForm: {},
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
        selected(cur) {
            if (cur) {
                cur.forEach(item => {
                    this.myForm[item.code].tags = item.tags.map(i => i.code);
                });
            }
        },
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onSubmit() {
            let res = this.copyJson(this.myForm);
            res = Object.keys(res).map(code => {
                const category = this.tagList.filter(i => i.code === code)[0];
                let tags = category.tags.filter(i =>
                    res[code].tags.indexOf(i.code)!==-1
                );

                return {
                    code: category.code,
                    name: category.name,
                    tags,
                };
            });
            this.$emit("on-submit", res);
            this.$emit("input", false);
        },
    },
    async created() {
        let data = await getTagCategories();
        this.tagList = data;
        data.forEach(item => {
            this.myForm[item.code] = {};
        });
    },
};
</script>

<style scoped></style>
