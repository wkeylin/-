/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-11 17:35:50
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 13:44:59
 */
import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Button, Row, Col, Input, Cascader } from 'antd'
import city from 'utils/city'

const FormItem = Form.Item
const Search = Input.Search

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const Filter = ({
  onAdd,
  onInputChange,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
    onFieldsChange,
  },
}) => {
  const handleFields = (fields) => {
    return fields
  }

  onFieldsChange = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    const data = {
      ...fields,
    }
    if (fields.position instanceof Array) {
      data.position = data.position.join('-')
    }
    if (fields.position === undefined) {
      data.position = ''
    }
    if (fields.name === undefined) {
      data.name = ''
    }
    if (fields.name !== undefined) {
      data.name = data.name.trim()
    }
    onInputChange(data)
  }

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
    onInputChange() // 为了搜索框清空并刷新界面
  }

  const { name, position } = filter

  /* NOTE:
    onChange方法+onFieldsChange方法：
    解决了Form表单在某些情况下取不到Cascader值的问题
    在onChange方法中对获取到的value值进行处理，因为直接取出的value值是个数组，而后台要求用'-'连接为字符串
    处理过后使用setFieldsValue对fields进行设置，并且调用onFieldsChange方法

    而Search框是直接调用onFieldsChange方法的
    因此onFieldsChange方法中也可能出现fields.position是个数组的情况
    所以在onFieldsChange方法中也要对position值进行处理

    onFieldsChange方法将两个搜索框的值拼接为一个符合后端接口规定的对象
    再调用父组件的onInputChange方法去dispatch到按条件查询的接口
   */
  const onChange = (value) => {
    const fields = getFieldsValue()
    if (value === undefined || value.length === 0) { // 级联框value没有值
      fields.position = ''
    } else { // 级联框value有值
      fields.position = value.join('-')
    }
    setFieldsValue(fields)
    onFieldsChange()
  }


  let initialCreateTime = []
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0])
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1])
  }

  return (
    <Form>
      <Row gutter={24}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
          <FormItem>
            {getFieldDecorator('position', {
              initialValue: position,
            })(<Cascader size="large" options={city} onChange={onChange} placeholder="请选择门店位置" />)}
          </FormItem>
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
          <FormItem>
            {getFieldDecorator('name', {
              initialValue: name,
            })(<Search placeholder="请输入门店名称，按下回车搜索" size="large" onSearch={onFieldsChange} onPressEnter={onFieldsChange} />)}
          </FormItem>
        </Col>
        <Col {...ColProps} xl={{ span: 16 }} md={{ span: 12 }} sm={{ span: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div >
              <Button size="large" onClick={handleReset}>重置</Button>
            </div>
            <div>
              <Button size="large" type="primary" onClick={onAdd}>新增门店</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  isMotion: PropTypes.bool,
  switchIsMotion: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onInputChange: PropTypes.func,
}

export default Form.create()(Filter)
