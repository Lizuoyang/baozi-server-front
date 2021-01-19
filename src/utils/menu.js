import Layout from '@/layout'

export function formatRoutes(menuList) {
  if (_.isEmpty(menuList)) {
    return
  }
  const addRouter = [];
  menuList.forEach(menu => {
    const {
      menuUrl,
      menuType,
      menuName,
      menuIcon,
      systemId,
      children,
      parentId,
      isDelete,
      operationCodes
    } = menu

    let urlSplit = _.split(menuUrl, "/")
    const menuRoute = {
      path: menuUrl,
      hidden: isDelete,
      name: _.upperFirst(urlSplit[urlSplit.length - 2]) + _.upperFirst(urlSplit[urlSplit.length - 1]),
      component: parentId != 0 ? (resolve) => require(["@/views" + menuUrl], resolve) : Layout,
      meta: { title: menuName, icon: menuIcon, systemId: [systemId], operations: operationCodes },
      children: formatRoutes(children)
    }
    addRouter.push(menuRoute)
  })
  return addRouter
}

