<template>
    <div>
        <div v-if="!isEmptyObject(temData)">
            <banners
                v-model="name===temData.banners.name"
                :data="temData.banners"
                @on-update="updateData"
                @on-cancel="onCancel"
            />
          <introduce  v-model="name===temData.introduce.name"
                      :data="temData.introduce"
                      @on-update="updateData"
                      @on-cancel="onCancel"/>
        </div>
    </div>
</template>

<script>
import banners from "@/views/gw/page/fragment/matchmarker/fragment/banners";
import Introduce from "@/views/gw/page/fragment/matchmarker/fragment/introduce";
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
      Introduce,
      banners
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
