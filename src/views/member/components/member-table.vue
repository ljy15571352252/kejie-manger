<template>
  <div class="member-table">
    <Table border :columns="columnsChoose" :data="tableData"></Table>
  </div>
</template>

<script>
export default {
    name:'member-table',
    props:['tableData', 'pageInfo', 'columns'],
    data(){
        return {
                columns1: [
                    {
                        title: '类型',
                        key: 'type',
                        sortable: true
                    },
                    {
                        title: '金额',
                        key: 'amount'
                    },
                    {
                        title: '剩余余额',
                        key: 'balance'
                    },
                    {
                        title: 'description',
                        key: 'description'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        sortable: true
                    }
                ]
            }
    },
    computed:{
        columnsChoose(){
            if(this.columns === '1'){
                return this.columns1
            }else{
                return this.columns2
            }
        }
    }
}
</script>

<style>

</style>