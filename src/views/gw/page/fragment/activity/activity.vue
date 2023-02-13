<template>
    <div>
        <div v-if="!isEmptyObject(temData)">
            <banners
                v-model="name===temData.banners.name"
                :data="temData.banners"
                @on-update="updateData"
                @on-cancel="onCancel"
            />
         <right-banners
             v-model="name===temData.rightBanners.name"
             :data="temData.rightBanners"
             @on-update="updateData"
             @on-cancel="onCancel"
         />
            <leftActivity
                v-model="name===temData.leftActivity.name"
                :data="temData.leftActivity"
                @on-update="updateData"
                @on-cancel="onCancel"
            />
        </div>
    </div>
</template>

<script>
import banners from "@/views/gw/page/fragment/activity/fragment/banners";
import RightBanners from "@/views/gw/page/fragment/activity/fragment/rightBanners";
import leftActivity from "@/views/gw/page/fragment/activity/fragment/leftActivity";

export default {
    name: "activity",
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
         RightBanners,
        banners,
        leftActivity
    },
    methods: {
        onCancel() {
            this.callback(this.temData);
        },
      updateData ({name, data}) {
            console.log(name, data)
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
