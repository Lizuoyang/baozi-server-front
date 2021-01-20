import request from '@/utils/request'

const prefix = '/api/sys/tem'
export function getAllSystemMenuList() {
  return request({
    url: prefix + '/list',
    method: 'get',
  })
}

export function getPageSystemMenuList(data) {
  return request({
    url: prefix + '/list/page',
    method: 'post',
    data
  })
}

export function saveOrUpdateSystem(data) {
  return request({
    url: prefix + '/update',
    method: 'post',
    data
  })
}

