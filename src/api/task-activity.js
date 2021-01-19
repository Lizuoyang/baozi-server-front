import request from '@/utils/request'
const baseUrl = '/api/rwbao/'

export function getActivityList (data) {
  return request({
    url: baseUrl+`list/activity`,
    method: 'post',
    data
  })
}

export function getActivityDataList (data) {
  return request({
    url: baseUrl+`list/data`,
    method: 'post',
    data
  })
}

export function delActivityBatch (data) {
  return request({
    url: baseUrl+`delete`,
    method: 'post',
    data
  })
}

export function updateActivity (data) {
  return request({
    url: baseUrl+`update`,
    method: 'post',
    data
  })
}

export function updateActivityCoupon (data) {
  return request({
    url: baseUrl+`update/coupon`,
    method: 'post',
    data
  })
}

export function addActivity (data) {
  return request({
    url: baseUrl+`add`,
    method: 'post',
    data
  })
}

export function getCounponList (data) {
  return request({
    url: baseUrl+`list/coupon`,
    method: 'post',
    data
  })
}

export function getCounponById (params) {
  return request({
    url: baseUrl+`get/counpon`,
    method: 'get',
    params
  })
}

export function stopActivityBatch (data, actionBy) {
  return request({
    url: baseUrl+`stop?updatedBy=` + actionBy ,
    method: 'post',
    data
  })
}

export function reviewActivityBatch (id, actionBy) {
  return request({
    url: baseUrl+`check/` + id + `?updatedBy=` + actionBy ,
    method: 'get',
  })
}

export function getActivity (id) {
  return request({
    url: baseUrl + id ,
    method: 'get',
  })
}
