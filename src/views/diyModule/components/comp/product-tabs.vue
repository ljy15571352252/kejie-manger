<template>
  <div class="component-tabs">
    <div class="zoom-view">
      <div class="mobile-item-mask">
        <div class="handle-box">
          <div class="handle-btn">
            <span>商品分类</span>
            <Icon
              type="md-trash"
              size="15"
              @click="removeModule()"
            ></Icon>
          </div>
        </div>
      </div>
      <div class="component-box padding-10">
        <Tabs :type="formDynamic.type">
          <TabPane
            v-for="(item,index) in formDynamic.items"
            :label="item.name"
            :key="index"
          ></TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: ["id"],
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
.component-tabs {
    background-color: #fff;
}
</style>