import request from '@/utils/request'
const baseUrl = '/api/tag/'

export function getTagList (corpId) {
  return request({
    url: baseUrl+`list`,
    method: 'get',
    params: {corpId}
  })
}

export function getTagUsers (params) {
  return request({
    url: baseUrl+`get`,
    method: 'post',
    params
  })
}

export function delTagUsers (data) {
  return request({
    url: baseUrl+`delTagUsers`,
    method: 'post',
    data
  })
}

export function addTagUsers (data) {
  return request({
    url: baseUrl+`addTagUsers`,
    method: 'post',
    data
  })
}

export function updateTag (data) {
  return request({
    url: baseUrl+`update`,
    method: 'post',
    data
  })
}

export function addTag (params) {
  return request({
    url: baseUrl+`create`,
    method: 'post',
    params
  })
}

export function deleteTag (data) {
  return request({
    url: baseUrl+`delete`,
    method: 'post',
    data
  })
}
