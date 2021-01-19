import request from '@/utils/request'
const baseUrl = '/api/ectag/'

//标签列表
export function getList (params) {
  return request({
    url: baseUrl+`listAll`,
    method: 'get',
    params
  })
}
//编辑
export function editTags (data) {
  return request({
    url: baseUrl+`update`,
    method: 'post',
    data
  })
}
//添加
export function addTags (data) {
  return request({
    url: baseUrl+`addEcTag`,
    method: 'post',
    data
  })
}
//删除
export function deleteTags (ids, corpId) {
  return request({
    url: baseUrl+`delete?corpId=`+corpId,
    method: 'post',
    data: ids
  })
}
