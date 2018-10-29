/*
 * @Author: wql
 * @Date: 2018-08-14 13:49:14
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 21:56:20
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Input, Popconfirm } from 'antd'

const Search = Input.Search

const FormItem = Form.Item
const Filter = ({
  handleAdd,
  selectedRowKeys,
  handelDelAll,
  handleSearch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
  const handleClear = () => {
    resetFields()
    handleSearch({ id: '', name: '' })
  }
  const handleSubmit = () => {
    validateFields((err) => {
      if (err) {
        return
      }
      const data = { ...getFieldsValue() }
      handleSearch(data)
    })
  }
  const ColProps = {
    xs: 24,
    sm: 12,
    style: {
      marginBottom: 16,
    },
  }
  return (
    <Form layout="inline">
      <Row gutter={24}>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 3 }}>
          <Popconfirm title={'确定要删除这些原料?'} placement="left" onConfirm={handelDelAll}>
            <Button disabled={!selectedRowKeys.length} type="danger" size="large">全部删除</Button>
          </Popconfirm>
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 7 }}>
          <FormItem
            label="名称查询"
          >
            {getFieldDecorator('name', {
              initialValue: '',
            })(
              <Search
                placeholder="输入原料名称查询"
                onSearch={value => handleSubmit(value)}
                style={{ width: 200 }}
              />
            )}
          </FormItem>
        </Col>
        <Col {...ColProps} xl={{ span: 16 }} md={{ span: 14 }} sm={{ span: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div >
              <Button
                type="default"
                onClick={handleClear}
                size="large"
              >
              清空
              </Button>
            </div>
            <div>
              <Button onClick={handleAdd} type="primary" size="large">添加物料</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  )
}

Filter.propTypes = {
  handleAdd: PropTypes.func,
  selectedRowKeys: PropTypes.array,
  handelDelAll: PropTypes.func,
  form: PropTypes.object,
  handleSearch: PropTypes.func,
  updateData: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  dispatch: PropTypes.func,
}

export default Form.create({
  onFieldsChange (item1, item2) {
    if (item2.id) {
      let idtmp = parseInt(item2.id.value, 0)
      item1.updateData({
        id: idtmp,
      })
    } else {
      item1.updateData({
        name: item2.name.value,
      })
    }
  },
})(Filter)
