import request from '@/utils/request'

const prefix = '/api/sys/menu'
export function setMenuShow(data) {
  return request({
    url: prefix + `/update/show`,
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: prefix + `/update`,
    method: 'post',
    data
  })
}

export function getNavigationList(data) {
  return request({
    url: prefix + `/navigation/list`,
    method: 'post',
    data
  })
}

export function getMenuListByRoleId(roleId) {
  return request({
    url: prefix + `/list/` + roleId,
    method: 'get'
  })
}

