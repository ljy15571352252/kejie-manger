<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { REFRESH_USER_TOKEN } from "@/store/actionTypes";
import {profile} from "@/config";

export default {
  mounted() {
    if (!profile.isDev)
      this.$store.dispatch(REFRESH_USER_TOKEN);
  },
};
</script>
<style lang="less">
@import "./common/css/public.less";
</style>
