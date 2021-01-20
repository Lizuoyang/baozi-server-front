import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {getAllSystemMenuList} from "@/api/system";
import {formatRoutes} from '@/utils/menu'



NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

const filterSystemMenuList = (result, roleCode) => {
  if (_.eq('admin', roleCode)) {
    return result.data;
  } else {
    return result.data.filter(x => !_.eq("system", x.systemCode))
  }
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 全屏加载中遮罩
  await store.dispatch('settings/changeSetting', {
    key: 'fullscreenLoading',
    value: true
  })

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.user
      if (!_.isEmpty(hasGetUserInfo)) {
        next()
      } else {
        try {

          // get user info
          const userInfo =await store.dispatch('user/getInfo')
          // console.log("user info:", userInfo)
          // 获取系统列表
          let systemRes = await getAllSystemMenuList()
          let systemMenus = filterSystemMenuList(systemRes,userInfo.roleCode)
          // console.log("systemMenus: ",systemMenus)
          await store.dispatch('menu/changeActiveTab', _.toString(_.get(systemMenus[0], 'id')))
          await store.dispatch('menu/setSystemMenus', systemMenus)
          //console.log("roleId: ", roleId)
          let menuList = await store.dispatch('menu/getMenuByRole', userInfo.roleId);
          // console.log("menuList: ",menuList)
          let formartRoutes = await formatRoutes(menuList);
          // console.log("role menuList: ", roleId, menuList)
          // console.log("formartRoutes: ",formartRoutes)
          const accessRoutes = await store.dispatch('permission/generateRoutes', _.isEmpty(formartRoutes) ? [] : formartRoutes)
          /*console.log("accessRoutes: ",accessRoutes)
          console.log("store.getters.permission_routes: ", store.getters.permission_routes)
          console.log("router.options.routes before: ", router.options.routes)*/
          //console.log("accessRoutes: ",accessRoutes)

          if (!_.isEmpty(menuList)) {
            let router404 = { path: '*', redirect: '/404', hidden: true }
            accessRoutes.push(router404)
            router.addRoutes(accessRoutes)
          }


          //console.log("router.options.routes: ",router.options.routes)
          // console.log("store.getters.permission_routes: ",store.getters.permission_routes)
          next({...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          await store.dispatch('settings/changeSetting', {
            key: 'fullscreenLoading',
            value: false
          })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(async (x) => {
  await store.dispatch('settings/changeSetting', {
    key: 'fullscreenLoading',
    value: false
  })

  // finish progress bar
  NProgress.done()
})
