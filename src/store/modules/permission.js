import {  constantRoutes } from '@/router'
import ro from "element-ui/src/locale/lang/ro";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roleCode, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roleCode)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roleCode) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roleCode, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roleCode)
      }
      res.push(tmp);
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, asyncRoutes) {
    return new Promise(resolve => {
      let accessedRoutes = asyncRoutes
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
