<template>
    <div>
        <div v-if="!isEmptyObject(temData)">
            <banners
                v-model="name===temData.banners.name"
                :data="temData.banners"
                @on-update="updateData"
                @on-cancel="onCancel"
            />
          <function-list v-model="name===temData.functionList.name"
                         :data="temData.functionList"
                         @on-update="updateData"
                         @on-cancel="onCancel"/>
          <mid-banner v-model="name===temData.midBanner.name"
                      :data="temData.midBanner"
                      @on-update="updateData"
                      @on-cancel="onCancel"/>
          <youshi v-model="name===temData.youshi.name"
                  :data="temData.youshi"
                  @on-update="updateData"
                  @on-cancel="onCancel"/>
          <modules v-model="name===temData.modules.name"
                   :data="temData.modules"
                   @on-update="updateData"
                   @on-cancel="onCancel"/>
        </div>
    </div>
</template>

<script>
import Banners from "@/views/gw/page/fragment/gw_index/fragment/banners.vue";
import FunctionList from "@/views/gw/page/fragment/gw_index/fragment/functionList";
import MidBanner from "@/views/gw/page/fragment/gw_index/fragment/midBanner";
import Youshi from "@/views/gw/page/fragment/gw_index/fragment/youshi";
import Modules from "@/views/gw/page/fragment/gw_index/fragment/modules";
export default {
    name: "gw_index",
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
      Modules,
      Youshi,
      MidBanner,
      FunctionList,
        Banners,
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
