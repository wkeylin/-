/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-11 15:22:19
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:14:18
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import queryString from 'query-string'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenueClick = (record, e) => {
    e.preventDefault()
    if (e.target.text === '修改') {
      onEditItem(record)
    } else if (e.target.text === '删除') {
      confirm({
        title: '确认删除这条信息吗？',
        onOk () {
          onDeleteItem([record.id])
        },
      })
    }
  }

  const columns = [
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '门店位置',
      dataIndex: 'position',
      key: 'position',
    }, {
      title: '详细地址',
      dataIndex: 'detailAddress',
      key: 'detailAddress',
    }, {
      title: '联系人',
      dataIndex: 'contactMan',
      key: 'contactMan',
    }, {
      title: '联系方式',
      dataIndex: 'contactWay',
      key: 'contactWay',
    }, {
      title: '所用菜谱',
      dataIndex: 'recipeName',
      key: 'recipeName',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (<div>
          <a href="#" className={classnames({ [styles.option]: true })} onClick={handleMenueClick.bind(this, record)}>修改</a><a href="#" onClick={handleMenueClick.bind(this, record)}>删除</a>
        </div>)
      },
    },
  ]
  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}
export default List
