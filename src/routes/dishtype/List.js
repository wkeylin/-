/*
 * @Author: wql 
 * @Date: 2018-08-14 16:23:37 
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 22:00:50
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col, Popconfirm } from 'antd'
import queryString from 'query-string'


const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const columns = [
    {
      title: '类别编码',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '类别名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (<div>
          <Row>
            <Col className="gutter-row" span={4} offset={8} onClick={() => onEditItem(record)}>
              <Button type="primary">编辑</Button>
            </Col>
            <Col className="gutter-row" span={4} >
              <Popconfirm title={'确定删除这个类别?'} placement="left" onConfirm={() => onDeleteItem(record)}>
                <Button type="danger">删除</Button>
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
  onDeleteItem: PropTypes.func,
}
export default List
