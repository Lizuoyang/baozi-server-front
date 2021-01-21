import request from '@/utils/request'
const prefix = '/sys/user'

export function login(data) {
  return request({
    url: prefix + '/login',
    method: 'post',
    data
  })
}

export function saveUser(data) {
  return request({
    url: prefix + `/save` ,
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: prefix + `/update`,
    method: 'post',
    data
  })
}

export function checkInfo(name, value) {
  return request({
    url: prefix + `/check/account/` + name + `/` + value ,
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: prefix + `/info/` + token ,
    method: 'get'
  })
}

export function getUserList(data) {
  return request({
    url: prefix + '/list/page',
    method: 'post',
    data
  })
}

export function logout(token) {
  return request({
    url: prefix + `/login/out/` + token,
    method: 'get'
  })
}
