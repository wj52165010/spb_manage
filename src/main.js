import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'

import Mixin from './mixin'
import AutoCmp from './autoCmp'
import AutoDirective from './autoDirective'
import AutoSer from './autoSer'

import 'assets/font-awesome-4.7.0/less/font-awesome.less'
import 'bootstrap/scss/custom.scss'
import './assets/fonticons/iconfont.css'
import './theme/default/default.less'
import 'assets/Animate.css'
import './libraries/underscore/index.js'


import LoadMapResoure from '@/loadMapResource'
import filters from '@/filters/index'
import RawButton from '@/components/RawButton'
import Nodata from '@/components/Nodata'

import {VTable,VTableBody,VTableHeader,VTableColumn,VTableRow} from '@/components/table/index'


Vue.config.productionTip = false


//注册全局混入对象
Mixin.register();
//注册全局指令对象
AutoDirective.register();
//注册页面组件自动全局注册
AutoCmp.register();
//注册全局ser实例分支
AutoSer.register();
//注册全局过滤器
filters();
//注册全局按钮
Vue.component('RawButton',RawButton);
Vue.component('Nodata',Nodata);

//注册自定义列表插件(可拖动列)
Vue.component(VTable.name,VTable);
Vue.component(VTableBody.name,VTableBody);
Vue.component(VTableHeader.name,VTableHeader);
Vue.component(VTableColumn.name,VTableColumn);
Vue.component(VTableRow.name,VTableRow);


//动态加载百度地图资源
LoadMapResoure(()=>{
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});


