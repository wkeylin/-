/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

/* global window */
import modelExtend from 'dva-model-extend'
import { message } from 'antd'
import { create, remove, update, query, removesome, queryMenuDish, queryMenuByName, queryAddMessages, queryMenuItem } from 'services/menu'
import { pageModel } from './common'

export default modelExtend(pageModel, {
  namespace: 'menu',
  state: {
    currentItem: {},
    modalVisible: false,
    dishModalVisible: false,
    modalType: 'create',
    dishModal: '',
    selectedRowKeys: [],
    // 穿梭框需要的左边数据
    addMessages: [],
    // 穿梭框需要的右边数据
    reduceMessages: [],
    leftData: [],
    rightData: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/menu') {
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
    // 查询菜谱列表数据
    * query ({ payload = {} }, { put }) {
      const data = yield query(payload)
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
        message.error('菜谱列表显示失败')
      }
    },
    // 修改菜谱请求的特定菜谱的菜品data1和全部菜品库的菜品data2
    * queryMenuItem ({ payload = {} }, { put }) {
      const data = yield queryMenuItem(payload)
      if (data.status) {
        const dishName = data.data2.map(obj => obj.name)
        let leftData = []
        for (let i = 0; i < dishName.length; i++) {
          const leftdata = {
            key: dishName[i],
            title: dishName[i],
          }
          leftData.push(leftdata)
        }
        yield put({
          type: 'menuItem',
          payload: {
            // 后端返回的菜品类型
            addMessages: leftData,
            reduceMessages: data.data1.map(obj => obj.dishName),
          },
        })
      }
    },
    // 查看特定菜谱的菜名列表
    * queryMenuDish ({ payload = {} }, { put }) {
      const data = yield queryMenuDish(payload)
      if (data) {
        yield put({
          type: 'menuItem',
          payload: {
            dishList: data.data,
          },
        })
      }
    },
    // 查询菜谱名
    * queryNameList ({ payload = {} }, { put }) {
      const data = yield queryMenuByName(payload)
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
    // 新建菜谱获取全部菜谱数据放到左边栏
    * queryAddMessages ({ payload = {} }, { put }) {
      const data = yield queryAddMessages(payload)
      if (data.status) {
        const dishName = data.data.map(obj => obj.name)
        let leftData = []
        for (let i = 0; i < dishName.length; i++) {
          const leftdata = {
            key: dishName[i],
            title: dishName[i],
          }
          leftData.push(leftdata)
        }
        yield put({
          type: 'queryAddInfo',
          payload: {
            addMessages: leftData,
          },
        })
      }
    },
    // 删除菜谱
    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, payload)
      const { selectedRowKeys } = yield select(_ => _.menu)
      const { current, pageSize } = yield select(({ menu }) => menu.pagination)
      if (data.status) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('删除菜谱成功')
      } else {
        message.error(data.statusText)
        throw data
      }
    },
    // 多重删除菜谱（和单选删除用的同一个接口）
    * multiDelete ({ payload }, { call, put, select }) {
      const { current, pageSize } = yield select(({ menu }) => menu.pagination)
      const data = yield call(removesome, payload)
      if (data.status) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('多重删除菜谱成功')
      } else {
        message.error(data.statusText)
        throw data
      }
    },
    // 新建菜谱
    * create ({ payload }, { call, put, select }) {
      const { current, pageSize } = yield select(({ menu }) => menu.pagination)
      const data = yield call(create, payload)
      if (data.status) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('新增菜谱成功')
      } else if (data.statusText === '菜单已存在') {
        message.warning(data.statusText)
      } else {
        message.error(data.statusText)
        throw data
      }
    },
    // 修改菜谱
    * update ({ payload = {} }, { select, call, put }) {
      const { current, pageSize } = yield select(({ menu }) => menu.pagination)
      const data = yield call(update, payload)
      if (data.status) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query', payload: { current, pageSize } })
        message.success('修改菜谱成功')
      } else if (data.statusText) {
        message.warning(data.statusText)
      } else {
        message.error('修改菜谱失败')
        throw data
      }
    },
  },
  reducers: {
    menuItem (state, { payload }) {
      return { ...state, ...payload }
    },
    queryAddInfo (state, { payload }) {
      return { ...state, ...payload }
    },
    updateRightMessage (state, { payload }) {
      return { ...state, ...payload }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },
    showDishModal (state, { payload }) {
      return { ...state, ...payload, dishModalVisible: true }
    },
    hideDishModal (state, { payload }) {
      return { ...state, ...payload, dishModalVisible: false }
    },
  },
})
