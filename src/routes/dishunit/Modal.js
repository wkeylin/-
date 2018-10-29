/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-10 12:21:09
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:09:06
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
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
        oldData: item.dishUnitName,
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
      <Form layout="horizontal">
        <FormItem label="单位名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('dishUnitName', {
            initialValue: item.dishUnitName,
            rules: [
              {
                required: true,
                message: '请输入单位名称',
              }, {
                pattern: /^[\u4e00-\u9fa5]+$/,
                message: '请输入汉字',
              }, {
                max: 5,
                message: '最多输入5个汉字',
              },
            ],
          })(<Input />)}
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
