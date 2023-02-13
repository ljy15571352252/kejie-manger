<template>
  <div class="module-setting">
    <component
      :is="activeComponent"
      :formOptions="formOptions"
    ></component>
  </div>
</template>

<script>
// 中横线转驼峰
var camelCase = function(s) {
    return s.replace(/-\w/g, function(x) {
        return x.slice(1).toUpperCase();
    });
};
// 批量引入子组件
const allComponents = require.context("./form", false, /\.vue$/);

// console.log(allComponents.keys())
// ["./tem-a.vue", "./tem-b.vue", "./tem-c.vue", "./tem-d.vue"]

//制作组件数组，在下方components中注册使用
let resComponents = {};
allComponents.keys().forEach(comName => {
    let name = camelCase(comName);
    const comp = allComponents(comName);
    resComponents[name.replace(/^\.\/(.*)\.\w+$/, "$1")] = comp.default;
});
import { mapState } from "vuex";

export default {
    name: "ModuleSetting",
    components: resComponents,
    data() {
        return {
            activeComponent: "formPage",
            formOptions: {
                input: "",
                select: "",
                style: "first",
                checkbox: [],
                switch: true,
                date: "",
                time: "",
                slider: [20, 50],
                textarea: ""
            }
        };
    },
    computed: {
        ...mapState("diyModule", ["bodyList", "activeOption"])
    },
    watch: {
        activeOption(newV) {
            if (!newV.name) {
                return (this.activeComponent = "formPage");
            }
            this.activeComponent =
                "form" +
                newV.name.slice(0, 1).toUpperCase() +
                newV.name.slice(1);
        }
    },
    created() {
        // console.log(this.formList)
        // console.log(this.formItem)
    }
};
</script>

<style lang="less">
.module-setting {
    background: #f8f9fa;
    bottom: 0;
    padding: 0 8px;
    position: absolute;
    right: 0;
    top: 0;
    width: 360px;
    z-index: 102;
    overflow-y: scroll;
    .ivu-card {
        background-color: #f8f9fa;
        .ivu-card-body {
            padding: 20px 0;
        }
    }

    .m-aux-text {
        color: #9797a1;
        font-size: 12px;
        line-height: 20px;
        padding: 8px 0;
    }
}
</style>