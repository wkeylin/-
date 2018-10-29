/*
 * @Author: wql
 * @Date: 2018-08-14 13:49:45
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 22:03:08
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, InputNumber } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const modal = ({
  item = {},
  onOk,
  unitList,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFields,
  },
  modalType,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        if (values.price > 9999.99) {
          setFields({
            price: {
              value: 0,
              errors: [new Error('最大值9999.99，请重新输入')],
            },
          })
        } else {
          if (values.count > 99999.99) {
            setFields({
              count: {
                value: 0,
                errors: [new Error('最大值99999.99，请重新输入')],
              },
            })
            return
          }
          const data = {
            ...getFieldsValue(),
          }
          onOk(data)
        }
      }
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  let options
  if (unitList) {
    options = unitList.map((option) => {
      return <Option key={option.name}>{option.name}</Option>
    })
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal" >
        <FormItem label="物料名称" hasFeedback {...formItemLayout} >
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                min: 1,
                max: 10,
                message: '最多输入十个字符',
              },
              {
                pattern: '^[\u4e00-\u9fa5a-zA-Z0-9]+$',
                message: '只能输入汉字、英文、数字',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="物料数量" hasFeedback {...formItemLayout} >
          {getFieldDecorator('count', {
            initialValue: item.count,
            rules: [
              {
                required: true,
                message: '请输入数量',
              },
            ],
          })(<InputNumber precision={2} min={0} />)}
        </FormItem>
        <FormItem label="物料单位" hasFeedback {...formItemLayout} >
          {getFieldDecorator('unit', {
            initialValue: { key: item.unit ? item.unit : unitList[0].name },
            rules: [
              {
                required: true,
              },
            ],
          })(<Select labelInValue style={{ width: 120 }} disabled={modalType === 'update'}>
            {options}
          </Select>)}
        </FormItem>
        <FormItem label="物料单价" hasFeedback {...formItemLayout} >
          {getFieldDecorator('price', {
            initialValue: item.price,
            rules: [
              {
                required: true,
                message: '请输入单价',
              },
            ],
          })(<InputNumber precision={2} min={0} />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  unitList: PropTypes.array,
  modalType: PropTypes.string,
}

export default Form.create({
})(modal)
