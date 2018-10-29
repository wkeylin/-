/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-12 00:22:03
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:14:49
 */
import { request, config } from 'utils'

const { api } = config
const { listRecipe, addRecipe, deleteRecipe, updateRecipeName, listSupplyi, deleteRecipeItem, updateOneRecipe } = api

export async function query (params) { // 查询配方列表或按条件查询配方列表
  return request({
    url: listRecipe,
    method: 'get',
    data: params,
  })
}

export async function updateName (params) { // 修改配方名称
  return request({
    url: updateRecipeName,
    method: 'get',
    data: params,
  })
}

export async function remove (params) { // 删除配方
  return request({
    url: deleteRecipe,
    method: 'get',
    data: params,
  })
}

export async function updateDetail (params) { // 修改某条物料
  return request({
    url: updateOneRecipe,
    method: 'post',
    data: params,
  })
}

export async function removeDetail (params) { // 删除某条物料
  return request({
    url: deleteRecipeItem,
    method: 'get',
    data: params,
  })
}

export async function querySupply (params) { // 查询物料列表
  return request({
    url: listSupplyi,
    method: 'get',
    data: params,
  })
}


export async function create (params) { // 创建配方
  return request({
    url: addRecipe,
    method: 'post',
    data: params,
  })
}

export async function update (params) { // 添加所用物料
  return request({
    url: addRecipe,
    method: 'post',
    data: params,
  })
}
