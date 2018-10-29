/*
 * @Author: wql
 * @Date: 2018-08-10 10:20:41
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-13 20:35:16
 */

import { request } from 'utils'

export async function list (params) {
  return request({
    url: '/dishType/listDishType',
    method: 'get',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/dishType/updateDishType',
    method: 'put',
    data: params,
  })
}
export async function insert (params) {
  return request({
    url: '/dishType/insertDishType',
    method: 'post',
    data: params,
  })
}
export async function delete1 (params) {
  return request({
    url: '/dishType/deleteDishType',
    method: 'delete',
    data: params,
  })
}
