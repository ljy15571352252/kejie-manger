<template>
    <Upload
        ref="upload"
        :before-upload="handleBeforeUpload"
        :on-success="handleUploadSuccess"
        :show-upload-list="false"
        :action="uploadUrl"
        name="file"
        :on-progress="handlerUploadProgress"
        :multiple="multiple"
    >
        <slot></slot>
        <Progress
            :percent="uploadingFile.percentage" 
            v-if="showProgress && uploadingFile && uploadingFile.showProgress"
        ></Progress>
    </Upload>
</template>

<script>
import { profile } from "@/config";
const IMAGE = "image";
const VIDEO = "video";
const UploadActionMap = new Map([
    [VIDEO, profile.uploadVideoAction],
    [IMAGE, profile.uploadImgAction],
]);
export default {
    name: "fileUpload",
    props: {
        showProgress: {
            type: Boolean,
            default: false,
        },
        uploadType: {
            type: String,
            default: IMAGE,
        },
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
            uploadingFile: null,
        };
    },
    watch: {},
    components: {},
    computed: {
        uploadUrl() {
            return UploadActionMap.get(this.uploadType);
        },
    },
    methods: {
        handlerUploadProgress(event, file, fileList) {
            this.uploadingFile = file;
        },
        handleBeforeUpload(file) {
            if (this.uploadType === IMAGE) {
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
            }
            if (this.uploadType === VIDEO) {
                return this.checkValidVideoFile(file);
            }
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
