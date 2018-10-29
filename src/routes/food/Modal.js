/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-16 14:39:50
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon, Select, Upload, Button, message } from 'antd'

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
  addMessages,
  handleTypeNameChange,
  dishCost,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  name,
  action,
  file,
  modalType,
  onHandleImage,
  ...modalProps
}) => {
  const handleImage = (value) => {
    if (value.file.response) {
      onHandleImage(value.file.response.statusText, item)
    }
  }
  const beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJPG) {
      message.error('只能传图片格式文件')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过2M')
    }
    return isJPG && isLt2M
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      // 因为这三个都是对象，所以要先解构出来再在下面取它们的label值
      const { name, typeName, unit } = { ...getFieldsValue() }

      const data = {
        ...getFieldsValue(),
        name: name.label,
        typeName: typeName.label,
        unit: unit.label,
      }
      onOk(data)
    })
  }

  const handleTypeName = (value) => {
    let typeName = value.label
    handleTypeNameChange(typeName)
  }

  let dishNameOptions = []
  let dishTypeOptions = []
  let dishUnitOptions = []
  if (addMessages.dishes && addMessages.types && addMessages.units) {
    dishNameOptions = addMessages.dishes.map((dish, key) => (<Option key={key} >{dish}</Option>))
    dishTypeOptions = addMessages.types.map((type, key) => (<Option key={key} >{type.name}</Option>))
    dishUnitOptions = addMessages.units.map((unit, key) => (<Option key={key} >{unit.dishUnitName}</Option>))
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  let modalTypeBol = modalType === 'create'
  if (modalType === 'create') {
    return (
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="菜品名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              // 绿色小箭头初始出现（试了好几次只有去掉initialValue可解决问题，但这样修改就只能新来一个Modal了，暂时不知道怎么改）
              rules: [
                {
                  required: true,
                  message: '请选择菜品名称',
                },
              ],
            })(
              <Select labelInValue onChange={handleTypeName}>
                {dishNameOptions}
              </Select>
            )}
          </FormItem>
          <FormItem label="菜品类别" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeName', {
              rules: [
                {
                  required: true,
                  message: '请选择菜品类别',
                },
              ],
            })(
              <Select labelInValue>
                {dishTypeOptions}
              </Select>
            )}
          </FormItem>
          <FormItem label="单位" hasFeedback {...formItemLayout}>
            {getFieldDecorator('unit', {
              rules: [
                {
                  required: true,
                  message: '请选择菜品单位',
                },
              ],
            })(
              <Select labelInValue >
                {dishUnitOptions}
              </Select>
            )}
          </FormItem>
          <FormItem label="成本价/元" hasFeedback {...formItemLayout}>
            {getFieldDecorator('cost', {
              initialValue: modalTypeBol ? dishCost.price : item.cost,
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="折扣价/元" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discount', {
              initialValue: item.discount,
              rules: [
                {
                  required: true,
                  message: '请输入折扣价',
                },
                {
                  pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
                  message: '请输入最大九位整数跟两位小数格式',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="售价/元" hasFeedback {...formItemLayout}>
            {getFieldDecorator('sale', {
              initialValue: item.sale,
              rules: [
                {
                  required: true,
                  message: '请输入售价',
                },
                {
                  pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
                  message: '请输入最大九位整数跟两位小数格式',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="菜品图片" hasFeedback {...formItemLayout}>
            {getFieldDecorator('imgUrl', {
              initialValue: file,
              rules: [
                {
                  required: true,
                  message: '请选择菜品图片',
                },
              ],
            })(<Input disabled />)}
            <Upload
              name={name}
              action={action}
              onChange={handleImage}
              accept={'image/*'}
              beforeUpload={beforeUpload}
            >
              <Button>
                <Icon type="upload" /> 点击上传
              </Button>
            </Upload>
          </FormItem>
        </Form>
      </Modal>
    )
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="菜品名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            // 绿色小箭头初始出现（试了好几次只有去掉initialValue可解决问题，但不知原因）
            initialValue: { key: item.name },
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select labelInValue onChange={handleTypeName}>
              {dishNameOptions}
            </Select>
          )}
        </FormItem>
        <FormItem label="菜品类别" hasFeedback {...formItemLayout}>
          {getFieldDecorator('typeName', {
            initialValue: { key: item.typeName },
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select labelInValue>
              {dishTypeOptions}
            </Select>
          )}
        </FormItem>
        <FormItem label="单位" hasFeedback {...formItemLayout}>
          {getFieldDecorator('unit', {
            initialValue: { key: item.unit },
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select labelInValue >
              {dishUnitOptions}
            </Select>
          )}
        </FormItem>
        <FormItem label="成本价/元" hasFeedback {...formItemLayout}>
          {getFieldDecorator('cost', {
            initialValue: modalTypeBol ? dishCost.price : item.cost,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="折扣价/元" hasFeedback {...formItemLayout}>
          {getFieldDecorator('discount', {
            initialValue: item.discount,
            rules: [
              {
                required: true,
                message: '请输入折扣价',
              },
              {
                pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                message: '请输入可以精确到小数点后两位的有效数字',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="售价/元" hasFeedback {...formItemLayout}>
          {getFieldDecorator('sale', {
            initialValue: item.sale,
            rules: [
              {
                required: true,
                message: '请输入售价',
              },
              {
                pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                message: '请输入可以精确到小数点后两位的有效数字',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="菜品图片" hasFeedback {...formItemLayout}>
          {getFieldDecorator('imgUrl', {
            initialValue: item.imgUrl,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled style={{ dispaly: 'none' }} />)}
          <Upload
            name={name}
            action={action}
            onChange={handleImage}
            accept={'image/*'}
            beforeUpload={beforeUpload}
          >
            <Button>
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
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
  handleTypeNameChange: PropTypes.func,
  addMessages: PropTypes.object,
  dishCost: PropTypes.object,
  modalType: PropTypes.string,
  fileList: PropTypes.array,
  name: PropTypes.string,
  action: PropTypes.string,
  file: PropTypes.string,
  onHandleImage: PropTypes.func,
}

// 经过 Form.create 包装的组件将会自带 this.props.form 属性，this.props.form 提供的 API 如下：

export default Form.create()(modal)
