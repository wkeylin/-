/*
 * @Author: wql
 * @Date: 2018-08-11 08:14:41
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-14 19:34:47
 */
import { message } from 'antd'
import { list, dishList } from 'services/bom'
import modelExtend from 'dva-model-extend'
import { pageModel } from './common'


export default modelExtend(pageModel, {
  namespace: 'bom',
  state: {
    dishList: [],
    key: '',
    rName: '',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bom') {
          const payload = location.query || { rName: '西红柿炒鸡蛋' }
          dispatch({
            type: 'updateState',
            payload: {
              ...payload,
            },
          })
          dispatch({
            type: 'query',
            payload: {
              ...payload,
            },
          })
          dispatch({
            type: 'queryDishList',
          })
        }
      })
    },
  },
  effects: {
    * queryDishList ({ payload }, { put, call }) {
      const data = yield call(dishList)
      if (data.status) {
        yield put({
          type: 'updateState',
          payload: {
            dishList: data.data,
            payload,
          },
        })
      } else {
        message.warning(data.statusText)
      }
    },
    * query ({ payload }, { put, call }) {
      const data = yield call(list, payload)
      if (data.status) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.data,
            pagination: {
              current: payload.current,
              pageSize: payload.pageSize,
            },
          } })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            list: [],
            pagination: {
              current: payload.current,
              pageSize: payload.pageSize,
            },
          } })
        message.warning(data.statusText)
      }
    },
  },
  reducers: {
    updateData (state, { payload }) {
      return {
        ...state,
        pagination: {
          ...payload,
        },
      }
    },
  },
})
