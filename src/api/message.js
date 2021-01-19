import request from '@/utils/request'

const prefix = '/api/message'
export function getRuleListPage(data) {
  return request({
    url: prefix + `/rule/list/page`,
    method: 'post',
    data
  })
}

export function getLogListPage(data) {
  return request({
    url: prefix + `/log/list/page`,
    method: 'post',
    data
  })
}

export function getLogContent(id) {
  return request({
    url: prefix + `/getContext/` + id,
    method: 'get',
  })
}

export function getRuleObj(id) {
  return request({
    url: prefix + `/get/` + id,
    method: 'get',
  })
}

export function delRuleBatch(data) {
  return request({
    url: prefix + `/delete`,
    method: 'post',
    data
  })
}

export function createRule(data) {
  return request({
    url: prefix + `/create`,
    method: 'post',
    data
  })

}export function updateRule(data) {
  return request({
    url: prefix + `/updateRule`,
    method: 'post',
    data
  })
}

