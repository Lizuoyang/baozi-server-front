import request from '@/utils/request'

const prefix = '/api/user'

export function getDepartUserList(data) {
  return request({
    url: prefix + `/list/page`,
    method: 'post',
    data
  })
}

export function saveDepartUser(data) {
  return request({
    url: prefix + `/add`,
    method: 'post',
    data
  })
}

export function importDepartUser(data, corpId) {
  return request({
    url: prefix + `/import?corpId=` + corpId,
    method: 'post',
    data
  })
}

export function delDepartUser(data,corpId) {
  return request({
    url: prefix + '/delete?corpId=' + corpId,
    method: 'post',
    data
  })
}

export function getNewJobId(params) {
  return request({
    url: prefix + `/genJobId`,
    method: 'get',
    params
  })
}


