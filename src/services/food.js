/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import { request, config } from 'utils'

const { api } = config
const { listDish, insertDish, deleteDish, updateDish, queryDishName, queryAddInfo, queryCost } = api

export async function query (params) {
  return request({
    url: listDish,
    method: 'get',
    data: params,
  })
}
export async function queryDishByName (params) {
  return request({
    url: queryDishName,
    method: 'get',
    data: params,
  })
}
export async function queryAddMessages () {
  return request({
    url: queryAddInfo,
    method: 'get',
  })
}
export async function queryDishCost (params) {
  return request({
    url: queryCost,
    method: 'get',
    data: params,
  })
}
export async function create (params) {
  return request({
    url: insertDish,
    method: 'post',
    data: params,
  })
}
export async function remove (params) {
  return request({
    url: deleteDish,
    method: 'delete',
    data: params,
  })
}
export async function removesome (params) {
  return request({
    url: deleteDish,
    method: 'delete',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: updateDish,
    method: 'put',
    data: params,
  })
}
