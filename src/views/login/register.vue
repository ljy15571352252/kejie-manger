<template>
    <div class="login-page">
        <div class="container demo-2">
            <div class="content">
                <div id="large-header" class="large-header">
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
                            ref="registerForm"
                            class="login-from"
                            :model="registerJson"
                            :rules="registerCheck"
                        >
                            <FormItem prop="mobile">
                                <Input
                                    prefix="ios-phone-portrait"
                                    type="text"
                                    v-model="registerJson.mobile"
                                    autofocus
                                    clearable
                                    placeholder="请输入手机号码"
                                />
                            </FormItem>
                          <FormItem prop="mobileCode" style="text-align: left">
                            <Input  prefix="ios-phone-portrait" style="width: 200px;margin-right: 10px" v-model.trim="registerJson.mobileCode" placeholder="请输入手机验证码"/>
                            <validate-code-component  :mobile="registerJson.mobile"></validate-code-component>
                          </FormItem>
<!--                            <FormItem prop="username">-->
<!--                                <Input-->
<!--                                    prefix="ios-person-outline"-->
<!--                                    type="text"-->
<!--                                    v-model="registerJson.username"-->
<!--                                    clearable-->
<!--                                    placeholder="请输入用户名"-->
<!--                                />-->
<!--                            </FormItem>-->
                            <FormItem prop="password">
                                <Input
                                    prefix="ios-lock-outline"
                                    type="password"
                                    v-model="registerJson.password"
                                    clearable
                                    placeholder="至少6位密码，区分大小写"
                                />
                            </FormItem>
                            <FormItem prop="passConfirm">
                                <Input
                                    prefix="ios-lock-outline"
                                    type="password"
                                    v-model="registerJson.passConfirm"
                                    clearable
                                    placeholder="请再次输入密码"
                                />
                            </FormItem>

                            <FormItem>
                                <Button
                                    type="primary"
                                    long
                                    :loading="loading"
                                    @click="register"
                                >
                                    <span v-if="!loading">注册</span>
                                    <span v-else>请稍后...</span>
                                </Button>
                            </FormItem>
                            <div class="tr">
                                <router-link to="/login"
                                    >使用已有账户登录</router-link
                                >
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
import {registerAcc} from "@/api/user/user";
import validateCodeComponent from "@/components/validate/validateCodeComponent";
export default {
    name: "register",
  components:{validateCodeComponent},
    data() {
      const valideRePassword = (rule, value, callback) => {
        if (value !== this.registerJson.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
        return {
            siteTitle: siteTitle,
            loading: false,
            isLogin: true, // 是否登陆模式
            registerJson: {
                mobile: "",
                username: "",
                password: "",
                passConfirm: "",
                mobileCode:""
            },
            registerCheck: {
              mobileCode: [
                {required: true, message: '请输入手机验证码', trigger: 'blur'},
              ],
              mobile: [
                {required: true, message: '请输入手机号', trigger: 'blur'},
              ],
              password: [
                {required: true, message: '请输入新密码', trigger: 'blur'},
                {min: 6, message: '请至少输入6个字符', trigger: 'blur'},
                {max: 32, message: '最多输入32个字符', trigger: 'blur'}
              ],
              passConfirm: [
                {required: true, message: '请再次输入新密码', trigger: 'blur'},
                {validator: valideRePassword, trigger: 'blur'}
              ]
            },
        };
    },
    created() {},
    mounted() {
        this.bgInit();
    },
    methods: {
        register() {
            this.$refs["registerForm"].validate(async valid => {
                if (valid) {
                  let fd=this.copyJson(this.registerJson)
                  fd.username=fd.mobile
                  this.loading=true
                  let [res]=await this.promiseResult(registerAcc(fd))
                  this.loading=false
                  if (res ){
                    this.$Message.success("注册成功");
                    setTimeout(() => {
                      this.$router.push('/login')
                    }, 1000)
                  }
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
                window.cancelAnimationFrame = function (id) {
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
                (function () {
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

                this.draw = function () {
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
        },
    },
    watch: {},
    filters: {},
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
        }
    }
}
</style>
