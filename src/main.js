import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import 'wangeditor/dist/wangEditor.min'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

// Lodash.Js 前端通用工具类
import _ from 'lodash'
Vue.prototype._ = _

// 性能测试 - 本地自行开启，不要提交
Vue.config.performance = process.env.NODE_ENV === 'development'
Vue.config.productionTip = process.env.NODE_ENV === 'development'
Vue.config.devtools = process.env.NODE_ENV === 'development'

// Moment.JS 时间处理工具
import Moment from 'moment'
Vue.filter('comverTime', function(data, format) {
  return Moment(data).format(format)
})
Vue.prototype.$moment = Moment

import '@/icons'
import '@/permission'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
 */


/**
 * 设置 Element-Ui组件的默认属性
 *
 */
ElementUI.Table.props.height = {
  default: _.toString(380),
  type: String
}

ElementUI.TableColumn.props.showOverflowTooltip = {
  default: false,
  type: Boolean
}
ElementUI.Switch.props.activeColor.default = '#13ce66'
ElementUI.Switch.props.inactiveColor.default = '#ff4949'
ElementUI.Switch.props.activeValue.default = false
ElementUI.Switch.props.inactiveValue.default = true
// set ElementUI lang to EN
Vue.use(ElementUI, {
  size: 'mini'
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

/**
 * 注册全局指令
 * 1.在需要使用的el-dialog上添加 v-el-drag-dialog 属性即可实现拖拽效果
 */
import elDragDialog from '@/directive/el-drag-dialog'
Vue.use(elDragDialog)

/**
 * 注册全局指令
 * 1.在需要使用el-button上添加 v-waves 树形可实现水波纹效果
 */
import waves from '@/directive/waves'
Vue.directive('waves', waves)
Vue.use(waves)

/**
 * 注册全局组件 - 粒子特效
 */
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

import has from './directive/btn-operation';

import Sticky from '@/components/Sticky'
Vue.component('sticky', Sticky);

/**
 * 引入全局常量
 */
import global from "@/global";
import drag from "@/directive/el-drag-dialog/drag";
Vue.prototype.$g = global

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
