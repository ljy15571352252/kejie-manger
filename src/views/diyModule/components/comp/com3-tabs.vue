<template>
  <div class="component-tabs">
    <div class="zoom-view">
      <div class="mobile-item-mask">
        <div class="handle-box">
          <div class="handle-btn">
            <span>相亲分类</span>
            <Icon
              type="md-trash"
              size="15"
              @click="removeModule()"
            ></Icon>
          </div>
        </div>
      </div>
      <div class="component-box component-box-tab padding-10">
        <!-- <Tabs :type="formDynamic.type">
          <TabPane
            v-for="(item,index) in formDynamic.items"
            :label="item"
            :key="index"
          ></TabPane>
            <template #extra>
           <Icon type="ios-funnel-outline" />
        </template>
        </Tabs> -->
        <div
          v-for="(item,index) in formDynamic.items"
          :key="index"
          :class="[(item.subName?item.subName.length:item.name.length)>2?'tab_item2':'tab_item', index == currindex?'tab_active':'']"
        >
          {{!!item.subName?item.subName:item.name}}
        </div>
        <div class="right_tab">
          <Icon
            type="ios-funnel-outline"
            color="#e51d1d"
          />
        </div>
      </div>
    </div>
    <div class="img_box">
      <img
        src="http://jiadehao.oss-cn-shenzhen.aliyuncs.com/temp/6e8a91b381bea5b97fa9f86dc37941b8.png"
        alt=""
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: ["id"],
    data() {
        return {
            currindex: 0,
            navigatorId: ""
        };
    },
    methods: {
        removeModule() {
            this.$emit("remove-module", this.id, this.navigatorId );
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
            if (item.compId == 4) {
                this.navigatorId = item.id;
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