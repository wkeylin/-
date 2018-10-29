/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Transfer, Input, Form } from 'antd'

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
  addMessages,
  reduceMessages,
  rightMessage,
  modalType,
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
      const menuName = getFieldsValue().menuName
      onOk(menuName, item.menuName)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1
  }

  const handleChange = (targetKeys, direction) => {
    // targetKeys就是左移右移后的右边框的键值们
    if (direction === 'right') {
      rightMessage(targetKeys)
    } else if (direction === 'left') {
      rightMessage(targetKeys)
    }
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="菜谱名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('menuName', {
            initialValue: item.menuName,
            rules: [
              {
                required: true,
                message: '菜谱名不能为空',
              },
              {
                pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,9}$/,
                message: '菜谱名由十位以下汉字，字母，数字组成',
              },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
      <Transfer
        // 在 Transfer 中，dataSource里的数据值需要指定 key 值。
        dataSource={addMessages}
        showSearch
        listStyle={{
          width: 192,
          height: 300,
        }}
        operations={['添加菜品', '移除菜品']}
        filterOption={filterOption}
        // targetKeys显示在右侧框的数据
        targetKeys={reduceMessages}
        // selectedKeys={reduceMessages}
        onChange={handleChange}
        render={item1 => item1.title}
      />
    </Modal>
  )
}

modal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  addMessages: PropTypes.array,
  reduceMessages: PropTypes.array,
  rightMessage: PropTypes.func,
  form: PropTypes.object.isRequired,
  modalType: PropTypes.string,
}

// 经过 Form.create 包装的组件将会自带 this.props.form 属性，this.props.form 提供的 API 如下：

export default Form.create()(modal)
