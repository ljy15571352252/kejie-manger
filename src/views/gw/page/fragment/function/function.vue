<template>
    <div>
        <div v-if="!isEmptyObject(temData)">
            <!--banner-->
            <banners
                v-model="name===temData.banners.name"
                :data="temData.banners"
                @on-update="updateData"
                @on-cancel="onCancel"
            />
            <!--功能表-->
            <menubar
                v-model="name===temData.menubar.name"
                :data="temData.menubar"
                @on-update="updateData"
                @on-cancel="onCancel"
            />
        </div>
    </div>
</template>

<script>
import banners from "@/views/gw/page/fragment/function/fragment/banners";
import menubar from "@/views/gw/page/fragment/function/fragment/menubar";
export default {
    name: "function",
    props: {
        name: String,
        pageType: Number,
        pageJson: Object,
        callback: Function,
    },
    data() {
        return {
            temData: {},
        };
    },
    watch: {},
    components: {
      banners,
      menubar,
    },
    methods: {
        onCancel() {
            this.callback(this.temData);
        },
      updateData ({name, data}) {
        for (let key in this.temData) {
          let item = this.temData[key]
          if (item.name === name) {
            item.data = data
            break
          }
        }
        this.callback(this.temData)
      }
    },
    created() {},
    mounted() {
        this.temData = this.copyJson(this.pageJson);
    },
};
</script>

<style scoped lang="less"></style>
