<template>
   <div>
        <template v-for="(item,index) in dataList">
            <component :is="item" v-if="curItem.compId === index + 1" :key="index" :id="curItem.id" v-on="$listeners"></component>
        </template>
   </div>
</template>

<script>
// 中横线转驼峰
var camelCase = function (s) {
  return s.replace(/-\w/g, function (x) {
    return x.slice(1).toUpperCase();
  });
};
// 批量引入子组件
const allComponents = require.context("./comp", false, /\.vue$/);

// console.log(allComponents.keys())
// ["./tem-a.vue", "./tem-b.vue", "./tem-c.vue", "./tem-d.vue"]

//制作组件数组，在下方components中注册使用
let resComponents = {};
let dataList = [];
allComponents.keys().forEach(comName => {
  let name = camelCase(comName);
  const comp = allComponents(comName);
  resComponents[name.replace(/^\.\/(.*)\.\w+$/, "$1")] = comp.default;
  dataList.push(name.replace(/^\.\/(.*)\.\w+$/, "$1"))
});
export default {
  name: "WaterQuery",
  components: resComponents,
  props:['curItem'],
  data() {
    return {
      dataList: dataList,

    };
  },
  created() {
  },
};
</script>

<style scoped>

</style>