/*
 * @Author: wql
 * @Date: 2018-08-10 10:16:43
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 21:58:02
 */
import _ from 'lodash'
import { message } from 'antd'
import { listUnit, update, insert } from 'services/unit'
import modelExtend from 'dva-model-extend'
import { pageModel } from './common'


export default modelExtend(pageModel, {
  namespace: 'unit',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/unit') {
          const payload = location.query || { current: 1, pageSize: 4 }
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
      const data = yield listUnit(payload)
      if (data.status) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.current) || 1,
              pageSize: Number(payload.pageSize) || 4,
              total: data.total,
            },
          },
        })
      } else {
        message.warning(data.statusText)
      }
    },
    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ unit }) => unit.currentItem.id)
      let { name } = payload
      name = _.trim(name)
      const newUnit = { name, id }
      const data = yield call(update, newUnit)
      if (data.status) {
        yield put({ type: 'hideModal' })
        message.success(data.statusText)
        yield put({ type: 'query' })
      } else {
        message.warning(data.statusText)
      }
    },
    * create ({ payload }, { call, put }) {
      let { name } = payload
      name = _.trim(name)
      const data = yield call(insert, { name })
      if (data.status) {
        yield put({ type: 'hideModal' })
        message.success(data.statusText)
        yield put({ type: 'query' })
      } else {
        message.warning(data.statusText)
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
  },
})
