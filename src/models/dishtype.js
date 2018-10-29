/*
 * @Author: wql
 * @Date: 2018-08-10 10:16:43
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 21:48:52
 */
import _ from 'lodash'
import { list, update, insert, delete1 } from 'services/dishType'
import { Modal, message } from 'antd'
import modelExtend from 'dva-model-extend'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'dishType',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/TdishType') {
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
      const data = yield list(payload)
      if (data) {
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
      const id = yield select(({ dishType }) => dishType.currentItem.id)
      let { name } = payload
      name = _.trim(name)
      const newdishType = { name, id }
      const data = yield call(update, newdishType)
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
    * delete ({ payload }, { call, put, select }) {
      const { item } = payload
      const data = yield call(delete1, item)
      const { current, pageSize } = yield select(_ => _.dishType.pagination)
      if (data.status) {
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
          },
        })
      } else {
        Modal.info({
          title: '删除操作结果提示',
          content: (<div>
            {data.statusText}
          </div>
          ),
          onOk () {},
        })
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
