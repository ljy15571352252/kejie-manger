<script>
  export default {
    render (h, cxt) {
      let propData={}
      if (this.prop){
        for (let key in this.prop)
          propData[key]=this.prop[key]
      }
      return h(this.name, {
        props:propData
      })
    },
    created() {
      this.$options.components[this.name] = resolve => require([`@/${this.dir}/${this.name}.vue`], resolve)
    },
    props: {
      dir:String,
      name: String,
      prop: Object
    }
  }
</script>
<style>

</style>
