/*
 * @Author: wql 
 * @Date: 2018-08-14 15:55:59 
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-14 20:36:41
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Cascader, Select } from 'antd'

const { Option } = Select
const FormItem = Form.Item
const Filter = ({
  form: {
    getFieldDecorator,
  },
  handleFilter,
  rName,
  dishList,
}) => {
  function onChange (value) {
    handleFilter(value)
  }
  const optionsDish = dishList.map((option) => {
    return (<Option key={option.name}>{option.name}</Option>)
  })
  return (
    <Row style={{ marginBottom: '20px' }}>
      <Col span={24}>
        <Form layout="inline" style={{ marginLeft: '20px' }}>
          <FormItem label="菜品筛选" >
            {getFieldDecorator('name', {
              initialValue: { key: rName },
              rules: [
                {
                  required: true,
                },
              ],
            })(<Select labelInValue style={{ width: 120 }} onChange={onChange}>
              {optionsDish}
            </Select>)}
          </FormItem>
        </Form>
      </Col>
    </Row>
  )
}
Filter.propTypes = {
  form: PropTypes.object,
  dishList: PropTypes.array,
  handleFilter: PropTypes.func,
  rName: PropTypes.string,
}
export default Form.create()(Filter)
