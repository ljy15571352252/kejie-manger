<template>
    <Button :loading="isLoading" type="text" size="small" style="color: #0093ff" @click="getMobileCode">{{mobileCodeTit}}</Button>
</template>

<script>


  import {sendMobileSmsCode} from "@/api/code/code";

  export default {
        name: "validateCodeComponent",
        props:{
            mobile:String,
            isSendByUserInfo:false,//用户的手机不透露，根据后台接口发送验证码
        },
        data() {
            return {
                isLoading:false,
                mobileCodeTit:'获取手机验证码',
            }
        },
        watch: {},
        computed: {},
        methods: {
           async getMobileCode(){
                if(this.isSendByUserInfo){
                    this.isLoading=true
                  let result=true
                  if(result){
                    this.$Message.success('验证码发送成功，请留意稍后到来的短信');
                    let c=60
                    let timeout=setInterval(()=>{
                      this.mobileCodeTit='重新发送（'+c+'）'
                      if(c<=0){
                        this.mobileCodeTit='重新发送'
                        this.isLoading=false
                        clearInterval(timeout)
                      }
                      --c
                    },1000)
                  }else{
                    this.isLoading=false
                    this.$Message.error(result.msg)
                  }
                 return
                }
                if(this.isEmptyObject(this.mobile)){
                    this.$Message.info('请输入手机号码')
                    return
                }
                this.isLoading=true
                let result=await sendMobileSmsCode({mobile:this.mobile})
                if(result){
                  this.$Message.success('验证码发送成功，请留意稍后到来的短信');
                  let c=60
                  let timeout=setInterval(()=>{
                    this.mobileCodeTit='重新发送（'+c+'）'
                    if(c<=0){
                      this.mobileCodeTit='重新发送'
                      this.isLoading=false
                      clearInterval(timeout)
                    }
                    --c
                  },1000)
                }else{
                  this.isLoading=false
                  this.$Message.error(result.msg)
                }


            }
        },
        created() {

        },
        mounted() {

        }
    }
</script>

<style scoped lang="less">

</style>
