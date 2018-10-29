/*
 * @Author: wql
 * @Date: 2018-08-12 13:03:15
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-14 17:08:42
 */
import { request } from 'utils'

export async function list (params) {
  return request({
    url: '/recipe/listBom',
    method: 'get',
    data: params,
  })
}
export async function dishList (params) {
  return request({
    url: '/dish/listDish',
    // url: '/supply/listSupply',
    method: 'get',
    data: params,
  })
}
export async function storeList (params) {
  return request({
    url: '/shop/listShopByCondition',
    method: 'post',
    data: params,
  })
}
