/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-11 15:28:47
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 10:57:42
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Cascader } from 'antd'
import city from 'utils/city'

const FormItem = Form.Item
const Option = Select.Option

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
  menuData,
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
      const formValues = {
        ...getFieldsValue(),
      }
      const data = {
        ...getFieldsValue(),
        position: formValues.position.join('-'),
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const menuOptions = menuData.map(menu => <Option key={menu.menuName}>{menu.menuName}</Option>)
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="门店名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '门店名称不能为空',
              }, {
                pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
                message: '请输入汉字、字母或数字',
              }, {
                max: 20,
                message: '最长20个字符',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="门店位置" hasFeedback {...formItemLayout}>
          {getFieldDecorator('position', {
            initialValue: modalType === 'create' ? item.position : item.position.split('-'),
            rules: [
              {
                required: true,
                message: '门店位置不能为空',
              },
            ],
          })(<Cascader size="large" options={city} placeholder="请选择门店位置" />)}
        </FormItem>
        <FormItem label="详细地址" hasFeedback {...formItemLayout}>
          {getFieldDecorator('detailAddress', {
            initialValue: item.detailAddress,
            rules: [
              {
                required: true,
                message: '门店详细地址不能为空',
              }, {
                pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\\-]+$/,
                message: '请输入汉字、字母、数字或减号',
              }, {
                max: 40,
                message: '最长40个字符',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="联系人" hasFeedback {...formItemLayout}>
          {getFieldDecorator('contactMan', {
            initialValue: item.contactMan,
            rules: [
              {
                required: true,
                message: '联系人不能为空',
              }, {
                pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
                message: '请输入汉字或字母',
              }, {
                max: 10,
                message: '最长10个字符',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="联系方式" hasFeedback {...formItemLayout}>
          {getFieldDecorator('contactWay', {
            initialValue: item.contactWay,
            rules: [
              {
                required: true,
                message: '联系电话不能为空',
              }, {
                pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                message: '请输入正确格式的手机号',
              }, {
                max: 20,
                message: '最长20个字符',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="所用菜谱" hasFeedback {...formItemLayout}>
          {getFieldDecorator('recipeName', {
            initialValue: item.recipeName,
            rules: [
              {
                required: true,
                message: '所用菜谱不能为空',
              },
            ],
          })(<Select>{menuOptions}</Select>)}
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
  menuData: PropTypes.array,
  modalType: PropTypes.string,
}

export default Form.create()(modal)
