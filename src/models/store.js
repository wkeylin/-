/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-11 17:36:51
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:06:43
 */
/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { message } from 'antd'
import { create, queryShopByCondition, update, query, removesome, queryDishMenu } from 'services/store'
import { pageModel } from './common'

const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'store',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}storeIsMotion`) === true,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/store') {
          const payload = location.query || { current: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'queryDishMenu',
            payload,
          })
        }
      })
    },
  },
  effects: {
    * query ({ payload = {} }, { put }) { // 查询门店列表
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
    * queryDishMenu ({ payload = {} }, { put }) { // 查询菜谱列表用于门店信息的增加和修改
      const data = yield queryDishMenu(payload)
      if (data) {
        yield put({
          type: 'queryDishMenuSuccess',
          payload: {
            menuData: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },
    * create ({ payload }, { call, put, select }) { // 新增一条门店信息
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.store.pagination)
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
    * multiDelete ({ payload }, { call, put, select }) {
      const data = yield call(removesome, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.store.pagination)
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
    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ store }) => store.currentItem.id)
      const newGood = { ...payload, id }
      const data = yield call(update, newGood)
      if (data.success) {
        yield put({ type: 'hideModal' })
        if (data.status) {
          message.success(data.statusText)
        } else {
          message.error(data.statusText)
        }
        const { pageSize, current, total } = yield select(state => state.store.pagination)
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
    * queryShopByCondition ({ payload = {} }, { put }) { // 按条件查询门店列表
      const data = yield queryShopByCondition(payload)
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
  },
  reducers: {
    queryDishMenuSuccess (state, { payload }) {
      return { ...state, ...payload }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}storeIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
  },
})
