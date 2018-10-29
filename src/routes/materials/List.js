/*
 * @Author: wql
 * @Date: 2018-08-14 13:49:34
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-17 09:11:47
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col, Popconfirm } from 'antd'
import queryString from 'query-string'


const List = ({ handelDel, onEditItem, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)
  const { sortedInfo } = tableProps
  const onHandelDel = (record) => {
    handelDel(record)
  }
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
      sortOrder: sortedInfo.columnKey === 'count' && sortedInfo.order,
    }, {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (<div>
          <Row gutter={8}>
            <Col className="gutter-row" span={5} offset={8}>
              <Button type="primary" onClick={() => onEditItem(record)}>修改</Button>
            </Col>
            <Col className="gutter-row" span={4} >
              <Popconfirm title={'确定删除这个物料?'} placement="left" onConfirm={() => onHandelDel(record.id)}>
                <Button type="danger" disabled={record.count}>删除</Button>
              </Popconfirm>
            </Col>
          </Row></div>)
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
  onEditItem: PropTypes.func,
  location: PropTypes.object,
  handelDel: PropTypes.func,
  sortedInfo: PropTypes.object,
}
export default List
