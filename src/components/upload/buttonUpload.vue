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
    <Button icon="ios-cloud-upload-outline">{{uploadType == "image" ? '上传图片' : '上传视频'}}</Button>
    <Progress
      :percent="uploadingFile.percentage"
      v-if="showProgress && uploadingFile && uploadingFile.showProgress"
    ></Progress>
  </Upload>
</template>

<script>
import { profile } from "@/config";
const UploadActionMap = new Map([
    ["video", profile.uploadVideoAction],
    ["image", profile.uploadImgAction]
]);
export default {
    name: "fileUpload",
    props: {
        showProgress: {
            type: Boolean,
            default: false
        },
        // 上传视频类型 VIDEO/IMAGE
        uploadType: {
            type: String,
            default: "image"
        },
        multiple: {
            /** 是否多选 **/
            type: Boolean,
            default: false
        },
        limitCount: {
            /** 限制多选数量 **/
            type: Number,
            default: 1
        }
    },
    computed: {
        // 获取上传地址
        uploadUrl() {
            return UploadActionMap.get(this.uploadType);
        }
    },
     data() {
        return {
            uploadingFile: null
        };
    },
    methods: {
        // 上传图片时
        handlerUploadProgress(event, file, fileList) {
            this.uploadingFile = file;
        },
        // 上传图片前
        handleBeforeUpload(file) {
            if (this.uploadType === "image") {
                if (this.multiple) {
                    const check =
                        this.$refs.upload.fileList.length < this.limitCount;
                    if (!check) {
                        this.$Notice.warning({
                            title: "最多只能上传" + this.limitCount + "张图片"
                        });
                        return false;
                    }
                }
                return this.checkValidImageFile(file);
            }
            if (this.uploadType === "video") {
                return this.checkValidVideoFile(file);
            }
        },
        // 上传图片成功
        handleUploadSuccess(res, file) {
            console.log(res, file);
            file.url = res.data;
            this.$emit("on-upload-success", res.data, file.name);
        }
    }
};
</script>

<style scoped lang="less"></style>
