import { resetRouter } from '@/router'
import {getMenuListByRoleId} from "@/api/menu";

const getDefaultState = () => {
  return {
    systemMenus: [],
    activeTab: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_ACTIVE_TAB: (state, activeTab) => {
    state.activeTab = activeTab
  },
  SET_SYSTEM_MENUS:  (state, menus) => {
    state.systemMenus = menus
  }
}

const actions = {
  setSystemMenus({ commit }, menus){
    return new Promise(resolve => {
      commit('SET_SYSTEM_MENUS', menus)
      resolve()
    })
  },
  changeActiveTab({ commit }, activeTab) {
    return new Promise(resolve => {
      commit('SET_ACTIVE_TAB', activeTab)
      resolve()
    })
  },
  getMenuByRole({ commit }, roleId) {
    return new Promise((resolve, reject) => {
      getMenuListByRoleId(roleId).then(response => {
        // console.log("getMenuListByRoleId: ",response)
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

