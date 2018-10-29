/*
 * @Author: wql
 * @Date: 2018-08-11 08:14:41
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-17 09:20:51
 */
import _ from 'lodash'
import { list, update, insert, delete1, search } from 'services/materials'
import { Modal, message } from 'antd'
import { listUnit } from 'services/unit'
import modelExtend from 'dva-model-extend'
import { pageModel } from './common'


export default modelExtend(pageModel, {
  namespace: 'materials',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    unitList: [],
    isDisabled: true,
    id: 0,
    name: '',
    sortedInfo: {},
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/materials') {
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
    * query ({ payload = { } }, { put, call }) {
      const data = yield call(list, payload)
      const unitList = yield call(listUnit, payload)
      if (unitList.status) {
        yield put({
          type: 'updateData',
          payload: {
            unitList: unitList.data,
          },
        })
      }
      if (data.status) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.current) || 1,
              pageSize: Number(payload.pageSize) || 4,
              total: data.data.length,
            },
          },
        })
      } else {
        message.warning(data.statusText)
      }
    },
    * delete ({ payload }, { call, put, select }) {
      let { id } = payload
      const { selectedRowKeys } = yield select(_ => _.materials)
      const { current, pageSize } = yield select(_ => _.materials.pagination)
      let arr = Array.of(id)
      const data = yield call(delete1, { id: arr })
      if (data.status) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
            warning: data.data,
          },
        })
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
          },
        })
        Modal.info({
          title: '删除结果提示',
          content: (
            <div>
              <p>{ data.statusText}</p>
            </div>
          ),
          onOk () {},
        })
      } else {
        throw data
      }
    },
    * multDelete ({ payload }, { call, put, select }) {
      const { selectedRowKeys } = yield select(_ => _.materials)
      const { current, pageSize } = yield select(_ => _.materials.pagination)
      const data = yield call(delete1, { id: selectedRowKeys })
      if (data.status) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: [],
            warning: data.data,
          },
        })
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
          },
        })
        Modal.info({
          title: '删除结果提示',
          content: (
            <div>
              <p>{ data.statusText}</p>
            </div>
          ),
          onOk () {},
        })
      } else {
        throw data
      }
    },
    * search ({ payload }, { call, put, select }) {
      const { current, pageSize } = yield select(_ => _.materials.pagination)
      if (payload.data.name === '' && payload.data.id === '') {
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
          },
        })
      } else {
        let { name } = payload.data
        name = _.trim(name)
        const data = yield call(search, { name, current, pageSize })
        if (data.status) {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.data,
              pagination: {
                current,
                pageSize,
                total: data.data.length,
              },
            },
          })
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              list: [],
            },
          })
        }
      }
    },
    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ materials }) => materials.currentItem.id)
      const { current, pageSize } = yield select(_ => _.materials.pagination)
      let { name, unit, price, count } = payload
      unit = unit.key
      name = _.trim(name)
      const newMaterials = { name, price, unit, id, count }
      const data = yield call(update, newMaterials)
      if (data.status) {
        yield put({ type: 'hideModal' })
        message.success(data.statusText)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
          },
        })
      } else {
        message.warning(data.statusText)
      }
    },
    * create ({ payload }, { call, put, select }) {
      let { name, unit, price, count } = payload
      const { current, pageSize } = yield select(item => item.materials.pagination)
      count = parseFloat(count)
      price = parseFloat(price)
      unit = unit.key
      name = _.trim(name)
      const newMaterials = { name, price, unit, count }
      const data = yield call(insert, newMaterials)
      if (data.status) {
        yield put({ type: 'hideModal' })
        message.success(data.statusText)
        yield put({
          type: 'query',
          payload: {
            current,
            pageSize,
          },
        })
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
    updateData (state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
