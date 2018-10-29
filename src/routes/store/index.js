/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-11 11:41:25
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:14:03
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'

import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const Store = ({ location, dispatch, store, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, menuData, currentItem, modalVisible, modalType, selectedRowKeys } = store

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['store/update'],
    title: `${modalType === 'create' ? '创建门店' : '修改门店信息'}`,
    wrapClassName: 'vertical-center-modal',
    menuData,
    modalType,
    onOk (data) {
      dispatch({
        type: `store/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'store/hideModal',
      })
    },
  }
  const filterProps = {
    filter: {
      ...location.query,
    },
    onInputChange (data) {
      if (data) {
        dispatch({
          type: 'store/queryShopByCondition',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'store/query',
        })
      }
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/store',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/store',
      }))
    },
    onAdd () {
      dispatch({
        type: 'store/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'store/switchIsMotion' })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['store/query'],
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
        type: 'store/multiDelete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'store/showModal',
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
          type: 'store/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }
  const handleDeleteItems = () => {
    dispatch({
      type: 'store/multiDelete',
      payload: selectedRowKeys,
    })
  }
  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'确认删除这些记录吗?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="danger" size="large" style={{ marginLeft: 8 }}>删除</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>

  )
}

Store.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  store: PropTypes.object,
}
export default connect(({ store, loading }) => ({ store, loading }))(Store)
