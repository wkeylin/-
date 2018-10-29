/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input } from 'antd'

const Search = Input.Search
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
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleMenuName = () => {
    let menuName = getFieldsValue().menuName
    onFilterChange(menuName)
  }

  // 重置fields们再setFieldsValue到表单元素里，再查询，既清空了输入框又回到了什么都没查的状态
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
    handleMenuName()
  }

  return (
    <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        <Form>
          <FormItem hasFeedback>
            {getFieldDecorator('menuName', {
              rules: [
                {
                  pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,9}$/,
                  message: '菜谱名应由十位以下汉字，字母，或数字组成',
                },
              ],
            })(<Search placeholder="请输入菜谱名称查询" size="large" onSearch={handleMenuName} />)}
          </FormItem>
        </Form>
      </Col>
      <Col {...ColProps} xl={{ span: 10 }} md={{ span: 16 }} sm={{ span: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div >
            <Button type="primary" size="large" className="margin-right" onClick={handleMenuName}>搜索</Button>
            <Button size="large" onClick={handleReset}>重置</Button>
          </div>
          <div>
            <Button size="large" type="primary" onClick={onAdd}>新增菜谱</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  dishTypeName: PropTypes.array,
}

export default Form.create()(Filter)
