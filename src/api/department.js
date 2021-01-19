import request from '@/utils/request'

const prefix = '/api/department'

export function getDepartSub(params) {
  return request({
    url: prefix + `/getDepartSub`,
    method: 'get',
    params
  })
}

export function getDepartTreeList(params) {
  return request({
    url: prefix + `/list/tree`,
    method: 'get',
    params
  })
}

export function updateDepart(data) {
  return request({
    url: prefix + `/update`,
    method: 'post',
    data
  })
}

export function deleteDepart(params) {
  return request({
    url: prefix + `/delete`,
    method: 'post',
    params
  })
}

export function addDepart(data) {
  return request({
    url: prefix + `/add`,
    method: 'post',
    data
  })
}

