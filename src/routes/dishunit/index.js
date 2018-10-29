/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-09 01:03:15
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:08:06
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import queryString from 'query-string'

import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const DishUnit = ({ location, dispatch, dishunit, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType } = dishunit
  const { pageSize } = pagination

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['dishunit/update'],
    title: `${modalType === 'create' ? '创建菜品单位' : '修改菜品单位'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `dishunit/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'dishunit/hideModal',
      })
    },
  }

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/dishunit',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/dishunit',
      }))
    },
    onAdd () {
      dispatch({
        type: 'dishunit/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'dishunit/switchIsMotion' })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['dishunit/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'dispatch/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'dishunit/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

DishUnit.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  dishunit: PropTypes.object,
}

export default connect(({ dishunit, loading }) => ({
  dishunit,
  loading,
}))(DishUnit)
