import request from '@/utils/request'

const prefix = '/sys/role'
export function getRoleList() {
  return request({
    url: prefix + '/list/all',
    method: 'get',
  })
}

export function getRoleListPage(data) {
  return request({
    url: prefix + '/list/page',
    method: 'post',
    data
  })
}

export function getBindMenusByRoleId(roleId) {
  return request({
    url: prefix + `/menus/` + roleId,
    method: 'get',
  })
}

export function assignMenu(data) {
  return request({
    url: prefix + '/assign/menu',
    method: 'post',
    data
  })
}

export function saveRole(data) {
  return request({
    url: prefix + '/add',
    method: 'post',
    data
  })
}
export function updateRole(data) {
  return request({
    url: prefix + '/update',
    method: 'post',
    data
  })
}


