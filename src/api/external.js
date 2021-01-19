import request from '@/utils/request'
const baseUrl = '/api/externalContact/'

export function getExternalContactList (corpId) {
  return request({
    url: baseUrl+`selectGroupsandChild`,
    method: 'get',
    params: {corpId}
  })
}
