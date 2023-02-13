<template>
  <div>
    <Modal v-model="value"
           title="模块图编辑"
           @on-cancel="cancel">
      <div style="clear: both">
        <Collapse v-model="displayTarget" accordion>
          <Panel :name="(index+1).toString()" v-for="(item,index) in modelList" :key="index">
            第{{index+1}}个模块
            <Form slot="content" ref="myForm" :model="item" :rules="rules" :label-width="100">
              <FormItem label="请选择图片" prop="src">
                <image-upload @on-upload-success="(url)=>{item.src=url}">
                  <div class="img" style="border: 1px solid">
                    <img :src="item.src" v-if="item.src"/>
                    <span v-if="!item.src">+</span>
                  </div>
                </image-upload>
                (尺寸：1200*460)
              </FormItem>
              <FormItem label="图片alt" style="width: 350px" prop="alt">
                <Input v-model="item.alt" placeholder="图片alt"></Input>
              </FormItem>
              <FormItem label="网址链接" style="width: 350px" prop="url">
                <Input v-model="item.url" placeholder="请输入网站链接"></Input>
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
    name: "modules",
    props: {
      data: Object,
      value: Boolean
    },
    data() {
      return {
        name: 'modules',
        displayTarget: '1',
        modelList: [],
        rules: {
          src: [
            {required: true, message: '请上传图片', trigger: 'change'}
          ],
          url: [
            {required: true, message: '请输入网址链接', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {},
    computed: {},
    components: {ImageUpload},
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
        this.$emit('on-update', {name: this.name, data: this.modelList})
      }, cancel() {
        this.$emit('on-cancel')
      }
    },
    created() {

    },
    mounted() {
      this.modelList = this.copyJson(this.data.data)
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
</style>
