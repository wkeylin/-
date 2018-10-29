/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-12 13:50:29
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:10:36
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'

import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const Formula = ({ location, dispatch, formula, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, supplyData, pagination, currentItem, modalVisible, modalType } = formula
  const { pageSize } = pagination

  const judgeModelType = (type) => {
    let title = ''
    if (type === 'create') {
      title = '创建配方'
    } else if (type === 'update') {
      title = '添加所用物料'
    } else if (type === 'updateName') {
      title = '修改配方名称'
    } else if (type === 'updateDetail') {
      title = '修改物料'
    }
    return title
  }

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    supplyData,
    confirmLoading: loading.effects['formula/update'],
    title: judgeModelType(modalType),
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `formula/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'formula/hideModal',
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
        pathname: '/formula',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/formula',
      }))
    },
    onAdd () {
      dispatch({
        type: 'formula/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['formula/query'],
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
    onDeleteItem (rName) { // 点击配方的“删除”
      dispatch({
        type: 'formula/delete',
        payload: rName,
      })
    },
    onEditItem (item) { // 点击“添加所用物料”
      dispatch({
        type: 'formula/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onEditName (item) { // 点击“修改配方名称”
      dispatch({
        type: 'formula/showModal',
        payload: {
          modalType: 'updateName',
          currentItem: item,
        },
      })
    },
    onEditDetailItem (item) { // 点击物料的“修改”
      dispatch({
        type: 'formula/showModal',
        payload: {
          modalType: 'updateDetail',
          currentItem: item,
        },
      })
    },
    onDeleteDetailItem (id) { // 点击物料的“删除”
      dispatch({
        type: 'formula/deleteDetail',
        payload: id,
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

Formula.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  formula: PropTypes.object,
}
export default connect(({ formula, loading }) => ({ formula, loading }))(Formula)
