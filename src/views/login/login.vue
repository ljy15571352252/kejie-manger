<template>
  <div class="login-page">
    <div class="container demo-2">
      <div class="content">
        <div
          id="large-header"
          class="large-header"
        >
          <canvas id="demo-canvas"></canvas>
          <div class="login-div flexC">
            <div class="logo flexC">
              <img
                src="../../../static/main/logo-dark.png"
                alt=""
              />
              <span>{{ siteTitle }}</span>
            </div>
            <Form
              ref="loginForm"
              class="login-from"
              :model="loginJson"
              :rules="loginCheck"
            >
              <FormItem prop="username">
                <Input
                  prefix="ios-person-outline"
                  type="text"
                  v-model="loginJson.username"
                  autofocus
                  clearable
                  placeholder="请输入用户名"
                />
              </FormItem>
              <FormItem prop="password">
                <Input
                  prefix="ios-lock-outline"
                  type="password"
                  v-model="loginJson.password"
                  clearable
                  placeholder="请输入密码"
                />
              </FormItem>
              <FormItem
                prop="isSave"
                class="isSave flexR"
              >
                <Checkbox v-model="loginJson.isSave">自动登录
                </Checkbox>
                <!-- <a>忘记密码</a> -->
                <div class="tr">
                  <!-- <router-link to="/forget-password">忘记密码</router-link> -->
                </div>
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  long
                  :loading="loading"
                  @click="login"
                >
                  <span v-if="!loading">登录</span>
                  <span v-else>请稍后...</span>
                </Button>
              </FormItem>
              <div class="tr">
                <!-- <router-link to="/register">没有账户？立即注册</router-link> -->
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { siteTitle } from "@/config";
import { GET_USER_INFO, LOGIN } from "@/store/actionTypes";
import { profile } from "@/config";
import { SET_USER_TOKEN } from "@/store/mutationTypes";
import { USER_TOKEN } from "@/common/storageKeys";

export default {
    name: "login",
    data() {
        return {
            siteTitle: siteTitle,
            loading: false,
            loginJson: {
                username: "123456",
                password: "123456",
                isSave: true
            },
            loginCheck: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            }
        };
    },
    created() {},
    mounted() {
        this.bgInit();
    },
    methods: {
        // 登陆
        login(name) {
          /* 开发环境登录跳转的问题*/
            if (profile.isDev) {
                let token = "123456";
                this.$store.commit(SET_USER_TOKEN, token);
                localStorage.setItem(USER_TOKEN, token);
                this.$store.dispatch(GET_USER_INFO).then(res => {
                    this.$router.push({
                        name: this.$indexPage
                    });
                });
                return;
            }
            this.$refs["loginForm"].validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch(LOGIN, this.loginJson)
                        .then(res => {
                            if (res.access_token) {
                                this.loading = false;
                                this.$Message.success("登录成功");
                                /*修复打包后跳转的问题*/
                                this.$router.push({
                                    name: this.$indexPage
                                });
                            } else {
                                this.loading = false;
                            }
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                }
            });
        },
        // 背景canvas动画
        bgInit() {
            let width,
                height,
                largeHeader,
                canvas,
                ctx,
                circles,
                target,
                animateHeader = true;
            // sta
            let lastTime = 0;
            let vendors = ["ms", "moz", "webkit", "o"];
            for (
                let x = 0;
                x < vendors.length && !window.requestAnimationFrame;
                ++x
            ) {
                window.requestAnimationFrame =
                    window[vendors[x] + "RequestAnimationFrame"];
                window.cancelAnimationFrame =
                    window[vendors[x] + "CancelAnimationFrame"] ||
                    window[vendors[x] + "CancelRequestAnimationFrame"];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = (callback, element) => {
                    let currTime = new Date().getTime();
                    let timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    let id = window.setTimeout(() => {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
            }
            // end

            // Main
            initHeader();
            addListeners();

            function initHeader() {
                width = window.innerWidth;
                height = window.innerHeight;
                target = { x: 0, y: height };

                largeHeader = document.getElementById("large-header");
                largeHeader.style.height = height + "px";

                canvas = document.getElementById("demo-canvas");
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext("2d");

                // create particles
                circles = [];
                for (let x = 0; x < width * 0.5; x++) {
                    let c = new Circle();
                    circles.push(c);
                }
                animate();
            }

            // Event handling
            function addListeners() {
                window.addEventListener("scroll", scrollCheck);
                window.addEventListener("resize", resize);
            }

            function scrollCheck() {
                if (document.body.scrollTop > height) animateHeader = false;
                else animateHeader = true;
            }

            function resize() {
                width = window.innerWidth;
                height = window.innerHeight;
                largeHeader.style.height = height + "px";
                canvas.width = width;
                canvas.height = height;
            }

            function animate() {
                if (animateHeader) {
                    ctx.clearRect(0, 0, width, height);
                    for (let i in circles) {
                        circles[i].draw();
                    }
                }
                requestAnimationFrame(animate);
            }

            // Canvas manipulation
            function Circle() {
                let _this = this;

                // constructor
                (function() {
                    _this.pos = {};
                    init();
                    // console.log(_this);
                })();

                function init() {
                    _this.pos.x = Math.random() * width;
                    _this.pos.y = height + Math.random() * 100;
                    _this.alpha = 0.1 + Math.random() * 0.3;
                    _this.scale = 0.1 + Math.random() * 0.3;
                    _this.velocity = Math.random();
                }

                this.draw = function() {
                    if (_this.alpha <= 0) {
                        init();
                    }
                    _this.pos.y -= _this.velocity;
                    _this.alpha -= 0.0005;
                    ctx.beginPath();
                    ctx.arc(
                        _this.pos.x,
                        _this.pos.y,
                        _this.scale * 10,
                        0,
                        2 * Math.PI,
                        false
                    );
                    ctx.fillStyle = "rgba(255,255,255," + _this.alpha + ")";
                    ctx.fill();
                };
            }
        }
    },
    watch: {},
    filters: {}
};
</script>

<style lang="less">
.login-page {
    /* Header */

    .large-header {
        position: relative;
        width: 100%;
        background: #333;
        overflow: hidden;
        background-size: cover;
        background-position: center center;
        z-index: 1;
    }

    .demo-2 .large-header {
        background-image: url("../../../static/login/login-bg-1.jpg");
        background-position: center bottom;
    }

    .login-div {
        position: absolute;
        margin-top: -220px;
        padding: 30px;
        text-align: center;
        top: 50%;
        left: 60%;
        background-color: white;
        border-radius: 5px;
        width: 410px;

        & > .logo {
            img {
                height: 90px;
            }

            span {
                font-size: 14px;
                margin-bottom: 20px;
            }
        }

        & > .login-from {
            .isSave {
                width: 100%;

                .ivu-form-item-content {
                    width: 100%;
                    display: inline-flex;
                    flex-direction: row;
                    justify-content: space-between;
                }
            }

            .other-Login {
                .ivu-form-item-content {
                    & > span {
                        img {
                            width: 24px;
                            margin-left: 16px;
                            cursor: pointer;
                            vertical-align: middle;
                            opacity: 0.7;
                            transition: all 0.2s ease-in-out;
                        }
                    }
                }
            }
        }
    }

    /*.demo-2 ::before {
                content: '';
                width: 20vw;
                height: 20vw;
                min-width: 3.5em;
                min-height: 3.5em;
                background: url(../../assets/login/deco.svg) no-repeat center center;
                background-size: cover;
                position: absolute;
                top: 50%;
                left: 20%;
                border-radius: 50%;
                z-index: -1;
                -webkit-transform: translate3d(-50%,-50%,0);
                transform: translate3d(-50%,-50%,0);
            }*/
}
</style>
