/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm, message } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'

import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const Food = ({ location, dispatch, food, loading }) => {
  location.query = queryString.parse(location.search)
  const { file, name, action, list, dishTypeName, addMessages, dishCost, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = food

  const { pageSize } = pagination
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    addMessages,
    dishCost,
    modalType,
    confirmLoading: loading.effects['food/update'],
    title: `${modalType === 'create' ? '新增菜品' : '修改菜品'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `food/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'food/hideModal',
      })
    },
    handleTypeNameChange (data) {
      dispatch({
        type: 'food/queryCost',
        payload: {
          name: data,
        },
      })
    },
    onHandleImage (file, updateItem) {
      console.log('文件名', file)
      dispatch({
        type: 'food/updateData',
        payload: {
          file,
          currentItem: { ...updateItem, imgUrl: file },
        },
      })
    },
    name,
    action,
    file,
  }
  const filterProps = {
    dishTypeName,
    filter: {
      ...location.query,
    },
    onFilterChange1 (value) {
      dispatch({
        type: 'food/queryTypeList',
        payload: {
          typeName: value,
          current: 1,
          pageSize,
        },
      })
    },
    onFilterChange2 (value) {
      dispatch({
        type: 'food/queryNameList',
        payload: {
          name: value,
        },
      })
    },
    onAdd () {
      dispatch({
        type: 'food/cleanAddForm',
        payload: {
          addMessages: {},
          dishCost: {},
          file: '',
        },
      })
      dispatch({
        type: 'food/showModal',
        payload: {
          modalType: 'create',
        },
      })
      dispatch({
        type: 'food/queryAddMessages',
        payload: {

        },
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['food/query'],
    // pagination,
    location,
    // onChange (page) {
    //   const { query, pathname } = location
    //   dispatch(routerRedux.push({
    //     pathname,
    //     query: {
    //       ...query,
    //       page: page.current,
    //       pageSize: page.pageSize,
    //     },
    //   }))
    // },
    onDeleteItem (record) {
      dispatch({
        type: 'food/delete',
        payload: record,
      })
    },
    onEditItem (item) {
      // 点击操作栏的修改信息按钮进入，这里的currentItem:item是选中的那一行的数据record
      dispatch({
        type: 'food/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
      dispatch({
        type: 'food/queryAddMessages',
        payload: {

        },
      })
      dispatch({
        type: 'food/queryMenuItem',
        payload: {

        },
      })
    },
    onBOM (bomName) {
      // Redirect到的BOM里，传菜名
      const { query } = location
      dispatch(routerRedux.push({
        pathname: '/bom',
        query: {
          ...query,
          rName: bomName,
        },
      }))
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'food/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }
  const handleDeleteItems = () => {
    dispatch({
      type: 'food/multiDelete',
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
            {`已选择 ${selectedRowKeys.length} 项菜品 `}
            <Popconfirm title={'你确定要删除这几项菜品吗?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>批量删除</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>

  )
}
Food.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  food: PropTypes.object,
}
export default connect(({ food, loading }) => ({ food, loading }))(Food)
