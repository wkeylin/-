/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-10 11:24:43
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:03:42
 */

/* global window */

// 页面的数据，通过modelExtend绑定到当前model中，并将新的model的namespace换成新的namespace
import modelExtend from 'dva-model-extend'

import { config } from 'utils'
import { message } from 'antd'
import { query, update, create } from 'services/dishunit'
import { pageModel } from './common'


// 用于取得前缀的配置，从window.localStorage中取数据要用
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'dishunit',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}dishunitIsMotion`) === true,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/Tdishunit') {
          // NOTE: location是react-router里的对象
          const payload = location.query || { current: 1, pageSize: 10 }

          // NOTE: 这里调用了effects里的异步查询方法
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },
  effects: {
    * query ({ payload = {} }, { put }) {
      const data = yield query(payload)
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
              total: data.total,
            },
          },
        })
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ dishunit }) => dishunit.currentItem.id)
      const newDishUnit = { ...payload, id }
      const data = yield call(update, newDishUnit)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.dishunit.pagination)
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

    * create ({ payload }, { select, call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.dishunit.pagination)
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
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}dishunitIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
  },
})
