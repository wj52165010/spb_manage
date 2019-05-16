export default{
    beforeDestroy(){
        _.each(this.$data,d=>d && d.destroy && d.destroy())
    }
}