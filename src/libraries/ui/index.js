//网站统一UI框架(注册)
import Vue from 'vue'
import './global.css'

import { Button,Select,Option,Tooltip,
         Tabs,TabPane,Input,
         Switch,Checkbox,Popover,
         Dropdown,DropdownMenu,DropdownItem,
         Cascader,RadioGroup,Radio,Slider} from 'element-ui';

import DatePicker from '@/components/DatePicker'
export default {
    register(){
        Vue.prototype.$ELEMENT = { size: 'small', zIndex: 4000 };
        Vue.use(Button)
        Vue.use(Select)
        Vue.use(Tabs)
        Vue.use(TabPane)
        Vue.use(Option)
        Vue.use(Input)
        //Vue.use(DatePicker)
        Vue.use(Switch)
        Vue.use(Checkbox)
        Vue.use(Dropdown)
        Vue.use(DropdownMenu)
        Vue.use(DropdownItem)
        Vue.use(Popover)
        Vue.use(Cascader)
        Vue.use(RadioGroup)
        Vue.use(Radio)
        Vue.use(Slider)
        
        //重新封装插件
        Vue.use(vue=>{
            vue.component(Tooltip.name,{
                template:`<Tooltip v-bind="$attrs">
                            <slot></slot>
                            <div slot="content" v-if="$slots.content">
                                <slot name="content"></slot>
                            </div>
                          </Tooltip>`,
                components:{Tooltip},
            });
        })
        
        Vue.component('ElDatePicker',DatePicker)
        //重新封装日期插件
        // Vue.use(vue=>{
        //     vue.component(DatePicker.name,{
        //         props:['value'],
        //         template:`<DatePicker v-model="time" @pick="change" v-bind="$attrs" :unlink-panels="true" />`,
        //         components:{DatePicker},
        //         data(){
        //             return {
        //                 time:[],
        //             }
        //         },
        //         methods:{
        //             change(v){
        //                 console.log(v);
        //             }
        //         }
        //     });
        // })
    }
}