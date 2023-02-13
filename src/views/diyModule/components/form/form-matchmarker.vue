<template>
    <Card title="红娘商户设置" icon="ios-options" shadow >
        <Form :model="formDynamic" :label-width="80">
            
            <!-- <FormItem label="样式：">
                <RadioGroup v-model="formDynamic.style" type="button" button-style="solid">
                    <Radio label="first">
                        <span>样式一</span>
                    </Radio>
                    <Radio label="second">
                        <span>样式二</span>
                    </Radio>
                </RadioGroup>
            </FormItem> -->
            <FormItem label="显示定位">
                <i-switch v-model="formDynamic.locStatus" size="large" @on-change="changeSwitch">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    data(){
        return{
        }
    },
    computed:{
        ...mapState('diyModule',['formDynamic','active'])
    },
    methods:{
        ...mapMutations('diyModule',['isSwitch']),
        changeSwitch(status){
            this.isSwitch(status)
        }
    }
}
</script>

<style>

</style>