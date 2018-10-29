/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-10 12:21:12
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-15 16:08:38
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import classnames from 'classnames'
import queryString from 'query-string'
import styles from './List.less'

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenueClick = (record, e) => {
    // 用于弹出修改modal框
    e.preventDefault()
    onEditItem(record)
  }

  const columns = [{
    title: '单位名称',
    dataIndex: 'dishUnitName',
    key: 'dishUnitName',
  }, {
    title: '操作',
    key: 'operation',
    width: 100,
    render: (record) => {
      return <a href="#" onClick={handleMenueClick.bind(this, record)}>修改</a>
    },
  }]

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
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
