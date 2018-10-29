/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import queryString from 'query-string'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, onShow, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenueClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '你确定要删除这份“包含菜品”的菜谱吗?',
        onOk () {
          onDeleteItem([record.menuName])
        },
      })
    } else if (e.key === '3') {
      onShow(record.menuName)
    }
  }
  const columns = [
    {
      title: '菜谱编码',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '菜谱名称',
      dataIndex: 'menuName',
      key: 'menuName',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenueClick(record, e)} menuOptions={[{ key: '1', name: '修改菜谱' }, { key: '2', name: '删除菜谱' }, { key: '3', name: '查看菜品' }]} style={{ width: 30 }} />
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
        rowKey={record => record.menuName}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onShow: PropTypes.func,
  location: PropTypes.object,
}
export default List
