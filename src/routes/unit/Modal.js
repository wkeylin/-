/*
 * @Author: wql
 * @Date: 2018-08-14 16:24:19
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 13:12:53
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

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
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  onOk,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal" >
        <FormItem label="单位名称" hasFeedback {...formItemLayout} >
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                type: 'string',
                max: 4,
                message: '请输入最多4个字符',
              },
              {
                pattern: '^[\u4e00-\u9fa5a-zA-Z]+$',
                message: '只能输入汉字、英文',
              },
            ],
          })(<Input />)
          }
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
}

export default Form.create()(modal)
