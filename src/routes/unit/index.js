/*
 * @Author: wql 
 * @Date: 2018-08-14 16:24:06 
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 21:58:12
 */

import { connect } from 'dva'
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Row, Col, Button } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Modal from './Modal'

const Unit = ({ location, dispatch, unit, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, currentItem, modalVisible, modalType, selectedRowKeys } = unit
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['unit/update'],
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `unit/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'unit/hideModal',
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['unit/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          current: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onEditItem (item) {
      dispatch({
        type: 'unit/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }
  const handleAdd = () => {
    dispatch({
      type: 'unit/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }
  return (
    <Page inner >
      <Row style={{ marginBottom: 24, textAlign: 'left', fontSize: 13 }}>
        <Col>
          <Button onClick={handleAdd} type="primary" size="large" style={{ marginLeft: 8 }}>添加</Button>
          {selectedRowKeys.length ? `选中 ${selectedRowKeys.length} 个` : ''}
        </Col>
      </Row>
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}
Unit.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  unit: PropTypes.object,
}

export default connect(({ unit, loading }) => ({ unit, loading }))(Unit)
