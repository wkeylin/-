/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-11 17:39:24
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:15:04
 */
import { request, config } from 'utils'

const { api } = config
const { listShop, listDishMenu, insertShop, deleteShop, updateShop, listShopByCondition } = api

export async function query (params) {
  return request({
    url: listShop,
    method: 'get',
    data: params,
  })
}

export async function queryDishMenu (params) {
  return request({
    url: listDishMenu,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: insertShop,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: deleteShop,
    method: 'delete',
    data: params,
  })
}

export async function removesome (params) {
  return request({
    url: deleteShop,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: updateShop,
    method: 'post',
    data: params,
  })
}

export async function queryShopByCondition (params) {
  return request({
    url: listShopByCondition,
    method: 'post',
    data: params,
  })
}
