/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-16 14:24
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
import DishModal from './DishModal'

const Menu = ({ location, dispatch, menu, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, dishList, addMessages, reduceMessages, currentItem, modalVisible, dishModalVisible, modalType, dishModal, selectedRowKeys } = menu

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['menu/update'],
    title: `${modalType === 'create' ? '新增菜谱' : '修改菜谱'}`,
    wrapClassName: 'vertical-center-modal',
    addMessages,
    modalType,
    reduceMessages,
    onOk (data, oldName) {
      if (modalType === 'create' && reduceMessages.length === 0) {
        message.warning('不能添加空菜品的菜谱')
      } else if (modalType === 'update' && reduceMessages.length === 0) {
        message.warning('修改的菜谱不能没有菜品')
      } else {
        dispatch({
          type: `menu/${modalType}`,
          payload: {
            menuName: data,
            reduceMessages,
            oldName,
          },
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'menu/hideModal',
      })
    },
    rightMessage (targetKeys) {
      dispatch({
        type: 'menu/updateRightMessage',
        payload: {
          reduceMessages: targetKeys,
        },
      })
    },
  }
  const dishModalProps = {
    dataList: dishList,
    visible: dishModalVisible,
    maskClosable: false,
    title: dishModal,
    wrapClassName: 'vertical-center-modal',
    onOk () {
      dispatch({
        type: 'menu/hideDishModal',
        payload: {
        },
      })
    },
    onCancel () {
      dispatch({
        type: 'menu/hideDishModal',
      })
    },
  }
  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'menu/queryNameList',
        payload: {
          menuName: value,
        },
      })
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/menu',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/menu',
      }))
    },
    onAdd () {
      dispatch({
        type: 'menu/showModal',
        payload: {
          modalType: 'create',
          reduceMessages: [],
        },
      })
      dispatch({
        type: 'menu/queryAddMessages',
        payload: {

        },
      })
    },
  }
  const listProps = {
    dataSource: list,
    loading: loading.effects['menu/query'],
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
        type: 'menu/delete',
        payload: {
          reduceMessages: record,
        },
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'menu/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
      dispatch({
        type: 'menu/queryMenuItem',
        payload: {
          menuName: item.menuName,
        },
      })
    },
    onShow (value) {
      dispatch({
        type: 'menu/showDishModal',
        payload: {
          dishModal: value,
        },
      })
      dispatch({
        type: 'menu/queryMenuDish',
        payload: {
          menuName: value,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'menu/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }
  const handleDeleteItems = () => {
    dispatch({
      type: 'menu/multiDelete',
      // selectedRowKeys是带选项的表格中指定选中项的 key 数组，需要和 onChange 进行配合
      payload: {
        reduceMessages: selectedRowKeys,
      },
    })
  }
  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`已选择 ${selectedRowKeys.length} 项菜谱 `}
            <Popconfirm title={'你确定要删除这几项菜谱吗?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>批量删除</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
      {dishModalVisible && <DishModal {...dishModalProps} />}
    </Page>

  )
}
Menu.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  menu: PropTypes.object,
}
export default connect(({ menu, loading }) => ({ menu, loading }))(Menu)
