/*
 * @Author: wql
 * @Date: 2018-08-14 16:24:12
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 21:58:50
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Col } from 'antd'
import queryString from 'query-string'


const List = ({ onEditItem, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (<div>
          <Row gutter={8}>
            <Col className="gutter-row" span={4} offset={10} onClick={() => onEditItem(record)}>
              <Button type="primary">编辑</Button>
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
}
export default List
