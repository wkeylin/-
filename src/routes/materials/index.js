/*
 * @Author: wql
 * @Date: 2018-08-14 13:49:25
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-17 09:11:44
 */

import { connect } from 'dva'
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Modal from './Modal'
import Filter from './Filter'

const Material = ({ location, dispatch, materials, loading }) => {
  location.query = queryString.parse(location.search)
  const { sortedInfo, id, name, isDisabled, unitList, list, currentItem, modalVisible, modalType, selectedRowKeys } = materials
  const handleSearch = (data) => {
    dispatch({
      type: 'materials/search',
      payload: {
        data,
      },
    })
  }
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    unitList,
    modalType,
    maskClosable: false,
    title: `${modalType === 'create' ? '添加物料' : '更新物料'}`,
    confirmLoading: loading.effects['materials/update'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `materials/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'materials/hideModal',
      })
    },
  }
  const handelDel = (id) => {
    return dispatch({
      type: 'materials/delete',
      payload: {
        id,
      },
    })
  }

  const handelDelAll = () => {
    dispatch({
      type: 'materials/multDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['materials/query'],
    location,
    handelDel,
    sortedInfo,
    onChange (page, filters, sorter) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          current: page.current,
          pageSize: page.pageSize,
        },
      }))
      dispatch({
        type: 'materials/updateData',
        payload: {
          sortedInfo: sorter,
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'materials/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'materials/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
      getCheckboxProps: (record) => {
        if (record.count === 0) {
          return { disabled: false }
        }
        return { disabled: true }
      },
    },
  }
  const handleAdd = () => {
    dispatch({
      type: 'materials/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }
  const updateData = (form) => {
    dispatch({
      type: 'materials/updateData',
      payload: {
        ...form,
      },
    })
  }
  const filterProps = {
    handleAdd,
    selectedRowKeys,
    handelDelAll,
    isDisabled,
    updateData,
    handleSearch,
    id,
    name,
    dispatch,
    loading: loading.effects['materials/query'],
  }
  return (
    <Page inner >
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}
Material.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  materials: PropTypes.object,
}
export default connect(({ materials, loading }) => ({ materials, loading }))(Material)
