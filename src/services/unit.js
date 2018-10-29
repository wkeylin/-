/*
 * @Author: wql
 * @Date: 2018-08-10 10:20:41
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-12 20:03:42
 */

import { request } from 'utils'

export async function listUnit (params) {
  return request({
    url: '/supplyUnit/listSupplyUnit',
    method: 'get',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/supplyUnit/updateSupplyUnit',
    method: 'put',
    data: params,
  })
}
export async function insert (params) {
  return request({
    url: '/supplyUnit/addSupplyUnit',
    method: 'post',
    data: params,
  })
}
export async function check (params) {
  return request({
    url: '/suppunit/check',
    method: 'get',
    data: params,
  })
}
