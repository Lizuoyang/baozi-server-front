import request from '@/utils/request'


const prefix = '/api/material'
export function getTextList(data) {
  return request({
    url: prefix + '/getList',
    method: 'post',
    data
  })
}
export function addMaterial(data) {
  return request({
    url: prefix + '/addMaterial',
    method: 'post',
    data
  })
}
export function updateMaterial(data) {
  return request({
    url: prefix + '/updateMaterial',
    method: 'post',
    data
  })
}
export function deleteMaterial(data) {
  return request({
    url: prefix + '/deleteMaterial',
    method: 'post',
    data
  })
}

export function removeUploadFile(fileKey) {
  return request({
    url: prefix + '/upload/remove',
    method: 'get',
    params: {
      fileKey
    }
  })
}
