/*
 * @Author: wql
 * @Date: 2018-08-11 08:19:49
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-12 12:54:08
 */

import { request } from 'utils'

export async function list (params) {
  return request({
    url: '/supply/listSupplyi',
    // url: '/supply/listSupply',
    method: 'get',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/supply/updateSupply',
    method: 'put',
    data: params,
  })
}
export async function insert (params) {
  return request({
    url: '/supply/insertSupply',
    method: 'post',
    data: params,
  })
}
export async function delete1 (params) {
  return request({
    url: '/supply/deleteSupply',
    method: 'delete',
    data: params,
  })
}
export async function search (params) {
  return request({
    url: '/supply/listSupply',
    method: 'post',
    data: params,
  })
}
// export async function check (params) {
//   return request({
//     url: '/suppunit/check',
//     method: 'get',
//     data: params,
//   })
// }
