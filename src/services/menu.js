/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import { request, config } from 'utils'

const { api } = config
const { listDish, listDishMenu, listDishItem, queryDishMenuItem, deleteDishMenu, insertDishMenu, updateDishMenu } = api

export async function query (params) {
  return request({
    url: listDishMenu,
    method: 'get',
    data: params,
  })
}
export async function queryMenuDish (params) {
  return request({
    url: listDishItem,
    method: 'get',
    data: params,
  })
}
export async function queryAddMessages () {
  return request({
    url: listDish,
    method: 'get',
  })
}
export async function queryMenuItem (params) {
  return request({
    url: queryDishMenuItem,
    method: 'get',
    data: params,
  })
}
export async function create (params) {
  return request({
    url: insertDishMenu,
    method: 'post',
    data: params,
  })
}
export async function queryMenuByName (params) {
  return request({
    url: listDishMenu,
    method: 'get',
    data: params,
  })
}
export async function remove (params) {
  return request({
    url: deleteDishMenu,
    method: 'delete',
    data: params,
  })
}
export async function removesome (params) {
  return request({
    url: deleteDishMenu,
    method: 'delete',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: updateDishMenu,
    method: 'put',
    data: params,
  })
}
