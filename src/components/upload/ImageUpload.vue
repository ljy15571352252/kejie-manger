<template>
    <Upload
        ref="upload"
        :before-upload="beforeUploadImg"
        :on-success="handleUploadSuccess"
        :show-upload-list="false"
        :action="uploadUrl"
        name="file"
        :multiple="multiple"
    >
        <slot></slot>
    </Upload>
</template>

<script>
import { profile } from "@/config";

export default {
    name: "ImageUpload",
    props: {
        multiple: {
            /** 是否多选 **/
            type: Boolean,
            default: false,
        },
        limitCount: {
            /** 限制多选数量 **/
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            uploadUrl: profile.uploadImgAction,
        };
    },
    watch: {},
    components: {},
    computed: {},
    methods: {
        beforeUploadImg(file) {
            if (this.multiple) {
                const check =
                    this.$refs.upload.fileList.length < this.limitCount;
                if (!check) {
                    this.$Notice.warning({
                        title: "最多只能上传" + this.limitCount + "张图片",
                    });
                    return false;
                }
            }
            return this.checkValidImageFile(file);
        },
        handleUploadSuccess(res, file) {
            file.url = res.data;
            this.$emit("on-upload-success", res.data);
        },
    },
    created() {},
    mounted() {
        if (this.multiple) this.$emit("on-mounted", this.$refs.upload.fileList);
    },
};
</script>

<style scoped lang="less"></style>
