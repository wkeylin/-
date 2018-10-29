/*
 * @Author:wql
 * @Date: 2018-08-14 15:56:23
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-15 11:41:50
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import queryString from 'query-string'


const List = ({ handleClick, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)
  let dataSource = tableProps.dataSource
  let total = 0
  dataSource.map((item) => {
    total += parseFloat(item.price) * parseFloat(item.sCount)
    return total
  })
  const columns = [
    {
      title: '名称',
      dataIndex: 'sName',
      key: 'sName',
    }, {
      title: '数量',
      dataIndex: 'sCount',
      key: 'sCount',
    }, {
      title: '单位',
      dataIndex: 'sUnitName',
      key: 'sUnitName',
    }, {
      title: '物料成本',
      dataIndex: 'price',
      key: 'price',
      render: (text, value) => {
        return <span>{parseFloat(value.price).toFixed(2)}</span>
      },
    }, {
      title: '共计成本',
      key: 'total',
      render: (text, record, value) => {
        const obj = {
          children: {},
          props: {},
        }
        obj.props.rowSpan = (value === 0) ? dataSource.length : 0
        obj.children = (
          <span>{parseFloat(total).toFixed(2)}</span>
        )
        return obj
      },
    },
  ]
  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  location: PropTypes.object,
  handleClick: PropTypes.func,
}
export default List
