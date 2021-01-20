const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  user: state => state.user.user,
  activeTab: state => state.menu.activeTab,
  systemMenus: state => state.menu.systemMenus,
  visitedViews: state => state.tagsView.visitedViews,
  permission_routes: state => state.permission.routes,
  cachedViews: state => state.tagsView.cachedViews,
}
export default getters
