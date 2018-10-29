/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-12 00:19:18
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:06:09
 */
import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { create, remove, update, query, updateDetail, updateName, removeDetail, querySupply } from 'services/formula'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'formula',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/formula') {
          const payload = location.query || { current: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'querySupply',
            payload,
          })
        }
      })
    },
  },
  effects: {
    * query ({ payload = {} }, { put }) { // 查询配方及物料信息
      const data = yield query(payload)

      // NOTE: 将取到的数组去重用于获取total值
      const _ = require('lodash')
      const recipes = _.uniqBy(data.data, 'rname')

      if (data) {
        if (!data.status) {
          message.warning(data.statusText)
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: recipes.length,
            },
          },
        })
      }
    },

    * querySupply ({ payload = {} }, { put }) { // 查询物料列表
      const data = yield querySupply(payload)
      if (data) {
        if (data.data) {
          yield put({
            type: 'querySupplySuccess',
            payload: {
              supplyData: data.data,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.length,
              },
            },
          })
        } else {
          yield put({
            type: 'querySupplySuccess',
            payload: {
              supplyData: [],
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.length,
              },
            },
          })
        }
      }
    },

    * updateName ({ payload }, { select, call, put }) { // 修改配方名称
      const data = yield call(updateName, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.formula.pagination)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
            total,
          },
        })
      } else {
        message.error(data.statusText)
        throw data
      }
    },

    * delete ({ payload }, { select, call, put }) { // 删除某个配方
      const data = yield call(remove, { rName: payload })
      if (data.success) {
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.formula.pagination)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
            total,
          },
        })
      } else {
        message.error(data.statusText)
        throw data
      }
    },

    * updateDetail ({ payload }, { select, call, put }) { // 修改单条物料
      const data = yield call(updateDetail, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.formula.pagination)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
            total,
          },
        })
      } else {
        message.error(data.statusText)
        throw data
      }
    },

    * deleteDetail ({ payload }, { call, put, select }) { // 删除单条物料
      const data = yield call(removeDetail, { id: payload })
      if (data.success) {
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.formula.pagination)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
            total,
          },
        })
      } else {
        message.error(data.statusText)
        throw data
      }
    },

    * create ({ payload }, { select, call, put }) { // 添加配方
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.formula.pagination)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
            total,
          },
        })
      } else {
        message.error(data.statusText)
        throw data
      }
    },
    * update ({ payload }, { select, call, put }) { // 添加所用物料
      const data = yield call(update, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.formula.pagination)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
            total,
          },
        })
      } else {
        message.error(data.statusText)
        throw data
      }
    },
  },
  reducers: {
    querySupplySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },
  },
})
