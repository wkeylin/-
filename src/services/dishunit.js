/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-10 16:21:50
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-14 14:43:09
 */

import { request, config } from 'utils'

const { api } = config
const { listDishUnit, updateDishUnit, addDishUnit } = api

export async function query (params) {
  return request({
    url: listDishUnit,
    method: 'get',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: updateDishUnit,
    method: 'post',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: addDishUnit,
    method: 'post',
    data: params,
  })
}
