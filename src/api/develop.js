import request from '@/utils/request'
const baseQr = '/api/qrcode/'//渠道码
const baseWelcome = '/api/welcome/'//欢迎语
const baseState = '/api/state/'
//导出数据
const ExportUrl=process.env.VUE_APP_BASE_API+"/api/qrcode/export";
export default {
  URL: ExportUrl
}
export function fetchExport(params) {
  return request({
    url: baseQr+`export`,
    method: 'get',
    params: params,
    xsrfHeaderName: 'Authorization',
    responseType: 'blob'
  })
}
  //客户渠道码
export function getQrList (data) {
  return request({
    url: baseQr+`qrList`,
    method: 'post',
    data
  })
}
//添加客户渠道码
export function addQrCode (data) {
  return request({
    url: baseQr+`add`,
    method: 'post',
    data
  })
}
//修改渠道码
export function updateQrCode (data) {
  return request({
    url: baseQr+`update`,
    method: 'post',
    data
  })
}
//删除
export function deleteQrCode (data) {
  return request({
    url: baseQr+`delete`,
    method: 'post',
    data
  })
}


//欢迎语列表
export function getWelcomeList (params) {
  return request({
    url: baseWelcome+`list`,
    method: 'get',
    params
  })
}

//默认欢迎语
export function getDefaultWelcome (params) {
  return request({
    url: baseWelcome+`default`,
    method: 'get',
    params
  })
}
//添加欢迎语
export function addWelcome (data) {
  return request({
    url: baseWelcome+`add`,
    method: 'post',
    data
  })
}
//添加默认欢迎语
export function addDefaultWelcome (data) {
  return request({
    url: baseWelcome+`saveDefault`,
    method: 'post',
    data
  })
}
//编辑欢迎语
export function updateWelcome (data) {
  return request({
    url: baseWelcome+`update`,
    method: 'post',
    data
  })
}
//删除欢迎语
export function deleWelcome (data) {
  return request({
    url: baseWelcome+`delete`,
    method: 'post',
    data
  })
}




//渠道列表
export function getStateList (params) {
  return request({
    url: baseState+`list`,
    method: 'get',
    params
  })
}
//添加渠道
export function addState (data) {
  return request({
    url: baseState+`add`,
    method: 'post',
    data
  })
}
//修改渠道
export function updateState (data) {
  return request({
    url: baseState+`update`,
    method: 'post',
    data
  })
}
//根据id查询渠道明细
export function getStateById (params) {
  return request({
    url: baseState+params,
    method: 'get',
  })
}
//删除渠道
export function delState (data) {
  return request({
    url: baseState+'delete',
    method: 'post',
    data
  })
}

