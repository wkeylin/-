/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

/* global window */
import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { create, remove, update, query, removesome, queryDishByName, queryAddMessages, queryDishCost } from 'services/food'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'food',
  state: {
    currentItem: {},
    modalVisible: false,
    dishTypeName: [],
    addMessages: {},
    dishCost: {},
    modalType: 'create',
    selectedRowKeys: [],
    name: 'photo',
    action: '/dish/insertDish/save_photo',
    file: '',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/food') {
          const payload = location.query || { current: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },

  },
  effects: {
    // 查询菜品列表数据（同时把所有菜品类型传给我）
    * query ({ payload = {} }, { put }) {
      const data = yield query(payload)
      if (data.status) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
        yield put({
          type: 'queryType',
          payload: {
            dishTypeName: data.typeName,
          },
        })
      } else {
        message.error('菜品主页显示失败')
      }
    },
    // 每次请求菜品列表都要请求左上角菜品类型
    * queryTypeList ({ payload = {} }, { put }) {
      const data = yield query(payload)
      if (data.status) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
        message.error(data.statusText)
      }
    },
    // 查询菜名
    * queryNameList ({ payload = {} }, { put }) {
      const data = yield queryDishByName(payload)
      if (data.status) {
        yield put({
          // querySuccess在common.js里
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      } else {
        message.error(data.statusText)
      }
    },
    // 新增菜品时查询菜品名称+菜品类型+单位（因为先有配方才能有菜名才能新建菜品）
    * queryAddMessages ({ payload = {} }, { put }) {
      const data = yield queryAddMessages(payload)
      if (data.success) {
        yield put({
          type: 'queryAddInfo',
          payload: {
            addMessages: data,
          },
        })
      }
    },
    // 根据新增菜品选择菜品类型后请求成本价
    * queryCost ({ payload = {} }, { put }) {
      const data = yield queryDishCost(payload)
      if (data) {
        yield put({
          type: 'queryDishCost',
          payload: {
            dishCost: data,
          },
        })
        message.success('获取该菜品成本价成功')
      } else {
        message.error(data.statusText)
      }
    },
    // 删除菜品
    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const { selectedRowKeys } = yield select(_ => _.food)
      const { current, pageSize } = yield select(({ food }) => food.pagination)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('删除菜品成功')
      } else {
        message.error(data.statusText)
        throw data
      }
    },
    // 多重删除菜品（和单选删除用的同一个接口）
    * multiDelete ({ payload }, { call, put, select }) {
      const { current, pageSize } = yield select(({ food }) => food.pagination)
      const data = yield call(removesome, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('多重删除菜品成功')
      } else {
        message.error(data.statusText)
        throw data
      }
    },
    // 新建菜品
    * create ({ payload }, { call, put, select }) {
      const { current, pageSize } = yield select(({ food }) => food.pagination)
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('新增菜品成功')
      } else {
        message.error(data.statusText)
        throw data
      }
    },
    // 修改菜品
    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ food }) => food.currentItem.id)
      const { current, pageSize } = yield select(({ food }) => food.pagination)
      const newGood = { ...payload, id }
      const data = yield call(update, newGood)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('查询菜品成功')
      } else {
        message.error(data.statusText)
        throw data
      }
    },
  },
  reducers: {
    queryType (state, { payload }) {
      return { ...state, ...payload }
    },
    queryDishCost (state, { payload }) {
      return { ...state, ...payload }
    },
    cleanAddForm (state, { payload }) {
      return { ...state, ...payload }
    },
    queryAddInfo (state, { payload }) {
      return { ...state, ...payload }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },
    updateData (state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
