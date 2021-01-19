import request from '@/utils/request'
const baseUrl = '/api/externalContact/'

  //列表查询
export function getList (data) {
  return request({
    url: baseUrl+`listPage`,
    method: 'post',
    data
  })
}
  //查询详细
export function getInfo (params) {
  return request({
    url: baseUrl+`getInfo/`+params.id,
    method: 'get',
    params
  })
}

//查询所有标签
export function getTags (params) {
  return request({
    url: baseUrl+`selectGroupsandChild`,
    method: 'get',
    params
  })
}
