<!-- 添加关联信息页面插件 -->
<template>
    <div class="AddRelative">
        <ListAutoLayout> 
            <PersonRelative @cancel="cancel" shield="cert" ref="PersonRelative" />

            <template slot="footer">
                <div style="padding:10px;text-align:right;">
                    <RawButton type="submit"  @inClick="submit()" style="margin-right:5px;">确定</RawButton>
                    <RawButton type="cancel"  @inClick="cancel()">取消</RawButton>
                </div>
            </template>
        </ListAutoLayout>
    </div>
</template>

<script>
import PersonRelative from '../PersonRelative'
import ListAutoLayout from '@/components/list/ListAutoLayout'

export default {
  name: 'AddRelative',
  components:{ListAutoLayout,PersonRelative},
  data(){
    return {
        
    }
  },
  methods:{
    submit(){
      this.$emit('addItem',this.$refs.PersonRelative.addedItems)
    },
    cancel(){this.$emit('cancel')}
  }
}
</script>

<style lang="less" scoped>
.AddRelative{width:100%;height:100%;box-sizing:border-box;padding:10px;overflow:hidden;}
</style>