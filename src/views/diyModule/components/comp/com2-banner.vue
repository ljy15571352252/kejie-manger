<template>
  <div class="component-banner">
    <div class="zoom-view">
      <div class="mobile-item-mask">
        <div class="handle-box">
          <div class="handle-btn">
            <span>轮播图</span>
            <Icon
              type="md-trash"
              size="15"
              @click="removeModule()"
            ></Icon>
          </div>
        </div>
      </div>
      <div
        :class="[formDynamic.set.margintop=='yes'?'paddingtop':'',formDynamic.set.marginleft=='yes'? 'paddingleft' : '', formDynamic.set.marginbottom=='yes'? 'paddingbottom':'','component-box'] "
        :style="{'height':formDynamic.items.length>0?'100%':formDynamic.set.height+'px'}"
      >
        <Carousel
          v-model="formDynamic.curIndex"
          :autoplay="setting.autoplay"
          :autoplay-speed="formDynamic.set.autoplayspeed"
          :dots="setting.dots"
          :radius-dot="formDynamic.set.radiusdot=='yes'?true:false"
          :trigger="setting.trigger"
          :arrow="setting.arrow"
          :height="formDynamic.set.height"
          v-if="formDynamic.set.imgnum==1"
        >
          <CarouselItem
            v-for="(item,index) in formDynamic.items"
            :key="index"
          >
            <div class="demo-carousel">
              <div class="img-inner">
                <img
                  :src="item.logoUrl ? item.logoUrl : 'https://tgdat.oss-cn-hangzhou.aliyuncs.com/groupon/tgstatic/uploadimg/zanwutupian.png'"
                  alt=""
                >
              </div>
            </div>
          </CarouselItem>
        </Carousel>
        <div
          class="demo-carousel2"
          :style="{'height':formDynamic.set.height+'px'}"
          v-else
        >

          <img
            src="https://jiadehao.oss-cn-shenzhen.aliyuncs.com/temp/604464d9492854e4aa97021ae3adf710.jpg"
            alt=""
            :class="formDynamic.set.imgnum==1?'img-inner':formDynamic.set.imgnum==2?'img-inner2':formDynamic.set.imgnum==3?'img-inner3':formDynamic.set.imgnum==4?'img-inner4':'img-inner'"
          >
          <img
            src="https://jiadehao.oss-cn-shenzhen.aliyuncs.com/temp/604464d9492854e4aa97021ae3adf710.jpg"
            alt=""
            :class="formDynamic.set.imgnum==1?'img-inner':formDynamic.set.imgnum==2?'img-inner2':formDynamic.set.imgnum==3?'img-inner3':formDynamic.set.imgnum==4?'img-inner4':'img-inner'"
          >
          <img
            src="https://jiadehao.oss-cn-shenzhen.aliyuncs.com/temp/604464d9492854e4aa97021ae3adf710.jpg"
            alt=""
            :class="formDynamic.set.imgnum==1?'img-inner':formDynamic.set.imgnum==2?'img-inner2':formDynamic.set.imgnum==3?'img-inner3':formDynamic.set.imgnum==4?'img-inner4':'img-inner'"
          >
          <img
            src="https://jiadehao.oss-cn-shenzhen.aliyuncs.com/temp/604464d9492854e4aa97021ae3adf710.jpg"
            alt=""
            :class="formDynamic.set.imgnum==1?'img-inner':formDynamic.set.imgnum==2?'img-inner2':formDynamic.set.imgnum==3?'img-inner3':formDynamic.set.imgnum==4?'img-inner4':'img-inner'"
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
                autoplay: true,
                autoplaySpeed: 2000,
                dots: "inside",
                radiusDot: false,
                trigger: "click",
                arrow: "hover",
                height: 180
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

<style lang="less">
.component-banner {
    background-color: #fff;
    .demo-carousel {
        height: 100%;
        .img-inner {
            background-color: #f8f8f8;
            width: 100%;
            height: 100%;
            text-align: center;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    .demo-carousel2 {
        // height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: hidden;
        .img-inner2 {
            background-color: #f8f8f8;
            width: 50%;
            height: 100%;
            text-align: center;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .img-inner3 {
            background-color: #f8f8f8;
            width: 33.33%;
            height: 100%;
            text-align: center;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .img-inner4 {
            background-color: #f8f8f8;
            width: 50%;
            height: 50%;
            text-align: center;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
}
.paddingtop {
    padding-top: 10px;
}
.paddingleft {
    padding-right: 10px;
    padding-left: 10px;
}
.paddingbottom {
    padding-bottom: 10px;
}
</style>