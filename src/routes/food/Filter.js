/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Select } from 'antd'

const Search = Input.Search
const Option = Select.Option
const FormItem = Form.Item

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const Filter = ({
  onAdd,
  onFilterChange1,
  onFilterChange2,
  dishTypeName,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleTypeName = (value) => {
    // 点击查菜品类型时菜名查询置为空
    setFieldsValue({ name: undefined })
    const typeName = value.label
    onFilterChange1(typeName)
  }
  const handleName = () => {
    // 点击查名字时菜品类型查询置为空
    setFieldsValue({ typeName: [] })
    const name = getFieldsValue().name
    onFilterChange2(name)
  }

  // 通过提交空菜品类型查询返回全部菜品信息列表来重置
  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleTypeName('')
  }

  let dishTypeOptions = []
  if (dishTypeName) {
    dishTypeOptions = dishTypeName.map(type => (<Option key={type.id}>{type.name}</Option>))
  }

  return (
    <Form>
      <Row gutter={24}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
          <FormItem hasFeedback>
            {getFieldDecorator('typeName', {
            })(
              <Select labelInValue placeholder="全部菜品类型" onChange={handleTypeName} size="large">
                {dishTypeOptions}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
          <FormItem hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                {
                  pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,9}$/,
                  message: '菜品名应由十位以下汉字，字母，或数字组成',
                },
              ],
            })(
              <Search placeholder="请输入菜名" size="large" onSearch={handleName} />
            )}
          </FormItem>
        </Col>
        <Col {...ColProps} xl={{ span: 16 }} md={{ span: 12 }} sm={{ span: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div >
              <Button size="large" onClick={handleReset}>重置</Button>
            </div>
            <div>
              <Button style={{ textAlign: 'right' }} size="large" type="primary" onClick={onAdd}>新增菜品</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  dishTypeName: PropTypes.array,
  onFilterChange1: PropTypes.func,
  onFilterChange2: PropTypes.func,
}

export default Form.create()(Filter)
