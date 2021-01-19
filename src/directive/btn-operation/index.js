import Vue from 'vue'

/**权限指令**/
const has = Vue.directive('has', {
  inserted: function (el, binding, vnode) {
    // console.log("vnode.context.$route: ",vnode.context.$route)
    // 获取当前用户的页面按钮权限
    let btnPermissionsStr = vnode.context.$route.meta.operations;
    // console.log("btnPermissionsStr: ",btnPermissionsStr)
    // console.log(binding.value, _.indexOf(btnPermissionsStr, binding.value))
    if (_.indexOf(btnPermissionsStr, binding.value) == -1) {
      el.parentNode.removeChild(el);
    }
  }
});
export {has}
