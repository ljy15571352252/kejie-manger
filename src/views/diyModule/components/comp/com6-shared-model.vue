<template>
  <div class="component-tabs">
    <div class="zoom-view">
      <div class="mobile-item-mask">
        <div class="handle-box">
          <div class="handle-btn">
            <span>共享模板</span>
            <Icon
              type="md-trash"
              size="15"
              @click="removeModule()"
            ></Icon>
          </div>
        </div>
      </div>
      <div class="img_box">
        <img
          src="http://jiadehao.oss-cn-shenzhen.aliyuncs.com/temp/d119edbbbc43d887329f48b2f858dfe3.png"
          alt=""
        >
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
            currindex: 0
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
.component-tabs {
    background-color: #fff;
}
.component-box-tab {
    width: 92%;
    height: 62px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    position: relative;
    // border: 1px solid
    .tab_item {
        flex: 1;
        text-align: center;
        margin: 0 8px;
        padding-bottom: 8px;
    }
    .tab_item2 {
        flex: 2;
        text-align: center;
        margin: 0 8px;
        padding-bottom: 8px;
    }
    .tab_active {
        border-bottom: 2px solid #e51d1d;
        color: #e51d1d;
    }
    .right_tab {
        width: 10%;
        padding-left: 5px;
        position: absolute;
        right: -28px;
        top: 15px;
        border-left: 1px solid #c9c9c9;
    }
}
.img_box {
    width: 100%;
    img {
        width: 100%;
    }
}
</style>