<template>
    <div class="flexC">
        <page-header title="小程序授权" />
        <div class="pageContent flexC">
            <iframe
                v-show="isShowIFrame"
                id="mainFrame"
                :src="iframeUrl"
                frameborder="0"
                style="padding: 0; width: 100%; height: 100vh"
            >
            </iframe>
            <div v-if="authData">
                <mp-auth-control :auth-info="authData" />
            </div>
        </div>
    </div>
</template>

<script>
import { getMPAuthUrl } from "@/api/wechat";
import {
    saveWeixinAuthInfo,
    getWeixinAuthInfo,
} from "@/api/configset/wxconfig";
import MpAuthControl from "./components/mp-auth-control";
export default {
    name: "index",
    components: { MpAuthControl },
    data() {
        return {
            isShowIFrame: false,
            iframeUrl: null,
            authData: null,
        };
    },
    watch: {},
    methods: {
        async saveAuthDataByCode(code) {
            let res = await saveWeixinAuthInfo({ code });
            this.authData = res;
        },
        receiveMessage(event) {
            if (event.origin === window.location.origin) {
                const { auth_code } = event.data;
                if (!auth_code) return;
                this.isShowIFrame = false;
                this.iframeUrl = null;
                this.saveAuthDataByCode(auth_code);
                this.removeIframeListener();
            }
        },
        removeIframeListener() {
            window.removeEventListener("message", this.receiveMessage);
        },
    },
    mounted() {},
    async created() {
        const { auth_code, expires_in } = this.$route.query;
        if (auth_code) {
            /** 此时在iframe内 **/
            window.parent.postMessage(
                { auth_code, expires_in },
                window.location.origin
            );
            return;
        }
      let res = await getWeixinAuthInfo({ type: 2 });
      console.log('res',res)
      if (res ) {
        this.authData=res
        return;
      }
        this.isShowIFrame = true;
        this.$nextTick(async () => {
            let url = await getMPAuthUrl({ redirect: window.location.href });
            window.addEventListener("message", this.receiveMessage); // 监听iframe的事件
            console.log(url)
            this.iframeUrl = url;
        });
    },
    destroyed() {
        this.removeIframeListener();
    },
};
</script>

<style scoped lang="less"></style>
