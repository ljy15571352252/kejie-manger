<template>
  <div>
    <Modal v-model="value"
           title="优势编辑"
           @on-cancel="cancel">
      <div style="clear: both">
        <Form  ref="myForm" :model="formData" :rules="rules" :label-width="100">
          <FormItem label="标题" style="width: 350px" prop="title">
            <Input v-model="formData.title" placeholder="标题"></Input>
          </FormItem>
        </Form>
        <Collapse v-model="displayTarget" accordion>
          <Panel :name="(index+1).toString()" v-for="(item,index) in formData.items" :key="index">
            第{{index+1}}个优势
            <Form slot="content" ref="myForm" :model="item" :rules="rules" :label-width="100">
              <FormItem label="icon" style="width: 350px" prop="icon">
                <image-upload @on-upload-success="(url)=>{item.icon=url}">
                  <div class="img" style="border: 1px solid">
                    <img :src="item.icon" v-if="item.icon"/>
                    <span v-if="!item.icon">+</span>
                  </div>
                </image-upload>
              </FormItem>
              <FormItem label="标题" style="width: 350px" prop="label">
                <Input v-model="item.label" placeholder="标题"></Input>
              </FormItem>
              <FormItem label="文字描述" style="width: 350px" prop="text">
                <Input v-model="item.text" placeholder="请输入文字描述"></Input>
              </FormItem>
            </Form>
          </Panel>
        </Collapse>
      </div>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="submitChange">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ImageUpload from '@/components/upload/ImageUpload'

  export default {
    components: {ImageUpload},
    name: "youshi",
    props: {
      data: Object,
      value: Boolean
    },
    data() {
      return {
        name: 'youshi',
        displayTarget: '1',
        formData:{
          title:'',
          items:[]
        },
        rules: {
          title:[
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          icon:[
            {required: true, message: '图标不能为空', trigger: 'change'}
          ],
          label: [
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          url: [
            {required: true, message: '请输入文字描述', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {},
    computed: {},
    methods: {
      submitChange() {
        let isValid = true
        this.$refs['myForm'].map(form => {
          form.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
        if (!isValid) {
          this.$Message.error('请补充编辑内容')
          return
        }
        this.$emit('on-update', {name: this.name, data: this.formData})
      }, cancel() {
        this.$emit('on-cancel')
      }
    },
    created() {

    },
    mounted() {
      this.formData = this.copyJson(this.data.data)
    }
  }
</script>

<style scoped lang="less">
  /deep/.ivu-input-group-prepend{
    padding: 0;
  }
  .del-item {
    height: 38px;
    line-height: 38px;
    float: right;
    padding-right: 10px
  }

  .img {
    display: inline-block;
    width: 281px;
    height: 175px;
    text-align: center;
    line-height: 175px;
    color: #ccc;
    font-weight: bold;
    font-size: 30px;
    cursor: pointer;
    border-radius: 3px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .img {
    display: inline-block;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    color: #ccc;
    font-weight: bold;
    font-size: 30px;
    cursor: pointer;
    border-radius: 3px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
