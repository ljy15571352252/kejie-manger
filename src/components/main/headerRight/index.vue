<template>
    <div class="header_right flexR">
        <Badge :dot="false">
            <Button type="text">
                <Icon type="ios-paper" size="18" />
                工单
            </Button>
        </Badge>
        <Badge :dot="false">
            <Button type="text">
                <Icon type="ios-megaphone" size="18" />
                公告
            </Button>
        </Badge>
        <Badge :dot="false">
            <Button type="text">
                <Icon type="ios-chatbubbles" size="18" />
                消息
            </Button>
        </Badge>
      <Poptip placement="bottom-end" trigger="hover">
        <div slot="content">
          <div class="flexR">
            <div>
              <img src="http://ssmall-data.oss-cn-shenzhen.aliyuncs.com/temp/63e00741395f03ce948fefb64e22d94a.jpg" class="qrcode-img"/>
              <div class="text-center">
                会员端
              </div>
            </div>
            <Divider type="vertical"/>
            <div>
              <img src="http://ssmall-data.oss-cn-shenzhen.aliyuncs.com/temp/63e00741395f03ce948fefb64e22d94a.jpg" class="qrcode-img"/>
              <div class="text-center">
                红娘助手
              </div>
            </div>
          </div>

        </div>
        <Button type="text">
          <Icon type="md-barcode" size="18" />
          二维码
        </Button>
      </Poptip>

        <!--        <span>
            <Icon
                :type="isMaxWindow ? 'md-contract' : 'md-expand'"
                @click="maxWindow"
                size="18"
            />
        </span>
        <span>
            <Dropdown trigger="click">
                <Badge :count="3">
                    <Icon type="ios-notifications-outline" size="20" />
                </Badge>
                <DropdownMenu slot="list">
                    <message></message>
                </DropdownMenu>
            </Dropdown>
        </span>-->
        <span class="margin-left-10">
            <Dropdown @on-click="personalSettings">
                <a href="javascript:void(0)" style="color: #515a6e">
                    <img
                        :src="userData.headUrl"
                        alt=""
                        class="ivu-avatar ivu-avatar-small"
                        style="margin-right: 5px"
                    />
                    {{ userData.nickName }}
                </a>
                <Icon type="md-arrow-dropdown" />
                <DropdownMenu slot="list">
                    <DropdownItem name="grzx">个人中心</DropdownItem>
                    <DropdownItem name="logout" divided>退出登陆</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </span>
        <!--        <span @click="openSettings">
            <Icon type="md-more" size="20" />
        </span>-->
    </div>
</template>

<script>
import message from "../../message/message";
import { LOGOUT } from "@/store/actionTypes";
import { mapGetters } from "vuex";
export default {
    name: "index",
    components: { message },
    data() {
        return {
            isMaxWindow: false, // 是否最大化窗口
        };
    },
    computed: {
        ...mapGetters(["userData"]),
    },
    methods: {
        openSettings() {
            this.$emit("on-drawer-open");
        },
        // 窗口最大化
        maxWindow() {
            if (this.isMaxWindow) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                this.isMaxWindow = false;
            } else {
                let element = document.documentElement;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
                this.isMaxWindow = true;
            }
        }, // 个人设置功能
        async personalSettings(name) {
            if (name === "logout") {
                await this.$store.dispatch(LOGOUT);
                this.$router.push({
                    name: this.$loginPage,
                });
            }
            if (name === "grzx") {
                this.$router.push("/personal-setting");
            }
        },
    },
};
</script>

<style scoped lang="less">
.qrcode-img{
  width:120px;
  height:120px;
}
</style>
