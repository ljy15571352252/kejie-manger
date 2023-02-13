<template>
  <div class="component-matchmarker">
    <div class="zoom-view">
        <div class="mobile-item-mask">
            <div class="handle-box">
                <div class="handle-btn">
                    <span>红娘商户</span>
                    <Icon type="md-trash" size="15" @click="removeModule()"></Icon>
                </div>
            </div>
        </div>
        <div class="component-box padding-10 x-bc">
            <div class="lt x-f">
                <Icon type="ios-contact" size="44"></Icon>
                <div class="item flexC margin-left-10">
                    <h3>红娘名称</h3>
                    <p v-show="formDynamic.locStatus">红娘位置</p>
                </div>
            </div>
            <div class="rt x-bc">
                <div class="item">
                    <Icon type="ios-share-alt" size="16"></Icon>
                    <p>分享</p>
                </div>
                <div class="item">
                    <h3 style="color:#2770EE;">999+</h3>
                    <p>男粉丝</p>
                </div>
                <div class="item">
                    <h3 style="color:#EE2742;">999+</h3>
                    <p>女粉丝</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    props:['id'],
    methods:{
        removeModule(){
            this.$emit("remove-module",this.id)
        }
    },
    computed:{
        ...mapState('diyModule',['bodyList'])
    },
    created(){
        this.bodyList.map(item => {
            if(item.id === this.id){
                this.formDynamic = item.formDynamic
            }
        })
    }
}
</script>

<style lang="less">
.component-matchmarker{
    background-color: #fff;
    .lt{
        width: 50%;
        .item{
            h3{
                font-size: 16px;
                color: #333;
            }
            p{
                font-size: 12px;
                color: #999;
            }
        }
    }
    .rt{
        text-align: center;
        .item{
            margin-left: 20px;
            h3{
                font-size: 16px;
            }
            p{
                font-size: 12px;
                color: #333333;
            }
        }
    }
}
</style>