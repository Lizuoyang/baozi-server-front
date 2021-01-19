import request from '@/utils/request'
const baseUrl = '/api/wenhuajun/'
  //列表查询
export function getList (data) {
  return request({
    url: baseUrl+`listPage`,
    method: 'post',
    data
  })
}
  //修改
export function updateModal (data) {
  return request({
    url: baseUrl+`update`,
    method: 'post',
    data
  })
}
//添加
export function addeModal (data) {
  return request({
    url: baseUrl+`add`,
    method: 'post',
    data
  })
}
//删除
export function deleModal (data) {
  return request({
    url: baseUrl+`delete`,
    method: 'post',
    data
  })
}
