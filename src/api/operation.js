import request from '@/utils/request'

const prefix = '/api/sys/operation'

export function getOperationList(params) {
  return request({
    url: prefix + `/list/all` ,
    method: 'get',
    params
  })
}

export function getOperationByCode(code) {
  return request({
    url: prefix + `/get/code/` + code,
    method: 'get',
  })
}

export function removeOperation(id) {
  return request({
    url: prefix + `/remove/` + id ,
    method: 'get'
  })
}

export function addOperation(data) {
  return request({
    url: prefix + `/add` ,
    method: 'post',
    data
  })
}

export function updateOperation(data) {
  return request({
    url: prefix + `/update` ,
    method: 'post',
    data
  })
}
