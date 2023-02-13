<template>
  <div class="component-banner">
    <div
      class="zoom-view"
      style="right:0;bottom:100px;"
    >
      <div class="mobile-item-mask">
        <div class="handle-box">
          <div class="handle-btn">
            <span>悬浮窗</span>
            <Icon
              type="md-trash"
              size="15"
              @click="removeModule()"
            ></Icon>
          </div>
        </div>
      </div>
      <div
        class="component-box"
        :style="{'height':setting.height+'px'}"
      >
        <div
          v-for="(item,index) in formDynamic.items"
          :key="index"
          class="img-inner"
          :style="{'width':formDynamic.items.length==2?'50%':formDynamic.items.length==3?'33.3%':formDynamic.items.length==4?'25%':'25%'}"
        >

          <img
            :src="item.logoUrl ? item.logoUrl : 'https://tgdat.oss-cn-hangzhou.aliyuncs.com/groupon/tgstatic/uploadimg/zanwutupian.png'"
            alt=""
          >

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: ["id"],
    data() {
        return {
            formDynamic: {},
            setting: {
                height: 80
            }
        };
    },
    methods: {
        removeModule() {
            this.$emit("remove-module", this.id);
        }
    },
    computed: {
        ...mapState("diyModule", ["bodyList"])
    },
    created() {
        this.bodyList.map(item => {
            if (item.id === this.id) {
                this.formDynamic = item.formDynamic;
            }
        });
    }
};
</script>

<style scoped lang="less">
.zoom-view {
    background-color: #fff;
    position: absolute;
    z-index: 999;
    width: 100%;
}
.component-banner {
    background-color: #fff;
    .component-box {
        padding: 10px 20px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        .img-inner {
            // background-color: #f8f8f8;
            margin: 0 10px;
            height: 100%;
            border-radius: 50%;
            text-align: center;
            img {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 50%;
            }
        }
    }
}
</style>