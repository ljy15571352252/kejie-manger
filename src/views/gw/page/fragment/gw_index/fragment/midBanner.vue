<template>
  <div>
    <Modal v-model="value"
           title="中间横幅编辑"
           @on-cancel="cancel"
    >
      <Form ref="myForm" :model="blockData" :rules="rules" :label-width="100">
        <FormItem label="请选择图片" prop="src">
          <image-upload @on-upload-success="(url)=>{blockData.src=url}">
            <div class="img" style="border: 1px solid">
              <img :src="blockData.src" v-if="blockData.src"/>
              <span v-if="!blockData.src">+</span>
            </div>
          </image-upload>
          (尺寸：1200*120)
        </FormItem>
        <FormItem label="图片alt" style="width: 350px" prop="alt">
          <Input v-model="blockData.alt" placeholder="图片alt"></Input>
        </FormItem>
        <FormItem label="网址链接" style="width: 350px" prop="url">
          <Input v-model="blockData.url" placeholder="请输入网站链接">
          </Input>
        </FormItem>
      </Form>
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
    name: "midBanner",
    components: {ImageUpload},
    props: {
      data: Object,
      value: Boolean
    },
    data() {
      return {
        name: 'midBanner',
        blockData: {},
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
    methods: {
      submitChange() {
        this.$refs['myForm'].validate(valid => {
          if (!valid) {
            this.$Message.error('请补充编辑内容')
            return
          }
          this.$emit('on-update', {name: this.name, data: this.blockData})
        })

      }, cancel() {
        this.$emit('on-cancel')
      }
    },
    created() {

    },
    mounted() {
      this.name = this.data.name
      this.blockData =this.copyJson(this.data.data)
    }
  }
</script>

<style scoped lang="less">
  /deep/.ivu-input-group-prepend{
    padding: 0;
  }
  .img {
    display: inline-block;
    width: 281px;
    height: 120px;
    text-align: center;
    line-height: 120px;
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
