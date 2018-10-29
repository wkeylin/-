/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-12 13:49:15
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:12:43
 */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Form, Input, Modal, Icon, Button, Select } from 'antd'
import styles from './Modal.less'

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

const formFirstItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 6 },
    md: { span: 18, offset: 6 },
  },
}


const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data
      if (modalProps.title === '修改物料') {
        const { sCount, sName, sUnitName } = getFieldsValue()
        data = {
          sCount: parseFloat(sCount),
          sName,
          sUnitName,
          id: item.id,
          dishState: item.dishState,
          supplyState: item.supplyState,
          rName: item.rname,
        }
      } else if (modalProps.title === '修改配方名称') {
        data = {
          rName: getFieldsValue().rName,
          oldName: item.rname,
        }
      } else if (modalProps.title === '创建配方') {
        const { supplyData } = { ...modalProps }
        const { names, numbers, rName } = getFieldsValue()
        const list = names.map((supply, index) => {
          let supplyUnit = supplyData.map((unit) => {
            if (unit.name === supply) {
              return unit.unit
            }
            return undefined
          })
          const _ = require('lodash')
          supplyUnit = _.compact(supplyUnit)
          const sUnitName = supplyUnit[0]

          return {
            rName,
            sName: supply,
            sCount: parseFloat(numbers[index]),
            sUnitName,
          }
        })
        data = list
      } else if (modalProps.title === '添加所用物料') {
        const { supplyData } = { ...modalProps }
        const { names, numbers, rName } = getFieldsValue()
        const list = names.map((supply, index) => {
          let supplyUnit = supplyData.map((unit) => {
            if (unit.name === supply) {
              return unit.unit
            }
            return undefined
          })
          const _ = require('lodash')
          supplyUnit = _.compact(supplyUnit)
          const sUnitName = supplyUnit[0]

          return {
            rName,
            sName: supply,
            sCount: parseFloat(numbers[index]),
            sUnitName,
            dishState: item.dishState,
            supplyState: item.supplyState,
          }
        })
        data = list
      }
      onOk(data)
    })
  }

  const { supplyData } = { ...modalProps }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const supplyOptions = supplyData.map((supply) => { return <Option key={supply.name}> {supply.name}</Option> })

  const onSelectSupplyChange = (value) => {
    let fields = getFieldsValue()
    let supplyUnit = supplyData.map((unit) => {
      if (unit.name === value) {
        return unit.unit
      }
      return undefined
    })
    const _ = require('lodash')
    supplyUnit = _.compact(supplyUnit)
    fields.sUnitName = supplyUnit[0]
    setFieldsValue(fields)
  }

  const remove = (k) => {
    const keys = getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }
  const add = () => {
    const keys = getFieldValue('keys')
    const nextKeys = keys.concat(keys.length)
    setFieldsValue({
      keys: nextKeys,
    })
  }

  const handleModalCountFocus = () => {
    /*
      NOTE: 8.15日优化内容
      优化场景：
      上一个版本中，用户在创建配方的时候，填写物料用量却没有显示物料单位是什么，
      导致用户可能忘记该物料单位是什么，无法准确的填写用量，甚至可能需要跳转去物料管理界面查看，用户体验十分差劲。

      原先的实现思路：
      第一版实现思路是在<Select>组件的onSelect触发事件中，获取到当前选择的值，
      根据这个值去物料信息数据中查找到对应单位，显示在组件上。
      体现在用户使用场景上就是，用户选择完某个物料后，该项FormItem后方就会显示该物料的单位。
      但是遇到的问题是，因为是无状态组件，只能根据Form的fields去取值，
      而onSelect事件发生的时候，该Select组件的值还没有更新到fields中，
      也就没办法取到当前选择的哪一个物料，更没法更新。

      目前的实现思路：
      现在的实现思路，是改变了原先假定的用户使用场景后想到的。
      现在的使用场景是，用户选择某个物料，当focus到物料用量输入框时，显示该物料对应的单位。
      在代码中的实现方法，是在物料用量的FormItem的InputNumber组件获取到focus时，也就是它的onFocus事件中，
      获取到表单的fields，此时fields中的names数组里保存的是当前时刻所有选择物料的Select组件的值，并且能够取到utils这个数组。
      这里只要根据names中的值，去匹配到单位后，填写到utils数组中的对应位置，然后更新fields即可。

      实现utils与names的对应关系时的思路（即最终得到正确的units数组的实现逻辑）：
      首先使用map函数，将names中的每一项与undefined进行比较：
        如果该项不为undefined，就将该name值与supplyData（物料信息数据）中的每一项进行比较：
          如果某项与这个name值相等，就将该项中的unit返回；
          如果不相等，不做操作，相当于返回undefined；
        比较过后返回的值是一个数组，包含一个正确的单位，和一些undefined，
        此时使用lodash中的compact将无用值去除，再将那个正确的单位通过下标0取出，即得到正确的单位；

        如果该项为undefined，不做操作，相当于返回undefined；
      使用一个maps去接收map函数返回的值，即是一个与names匹配过后的utils数组，将它赋值给fields中的utils并更新fields即可。

      解决方案三（上网查到http://ju.outofmemory.cn/entry/348216）：
      总的来说不能采用原先的实现思路，即在`onSelect`中根据取到的`name`值设置`unit`的原因
      就是在`onSelect`中通过`getFieldsValue()`取不到当前的`names`数组，
      但必须根据`names`数组中数据的位置去对应着填写`utils`数组，如果得不到`names`数组，能得到`key`值也是可以的，
      但如果传了`key`值就拿不到当前的`value`值，之后有时间可以研究一下怎么做到两个值都传过去。
      如果偏要在`onSelect`事件中对`names`数组进行设置，可以把 `setFieldsValue` 放到下个事件循环中去执行，才能成功。代码如下
      ```
      setTimeout(() => {
        setFieldsValue({ name: targetValues })
      }, 0);
      ```
      此方案待尝试。

      解决方案四（上网查到http://ju.outofmemory.cn/entry/348216）：
      使用官方给出的options.normalize，此方案待尝试。
    */
    let fields = getFieldsValue()
    const names = fields.names

    let maps = names.map((name) => {
      let unit
      if (name !== undefined) {
        unit = supplyData.map((data) => {
          let thisUnit
          if (data.name === name) {
            thisUnit = data.unit
          }
          return thisUnit
        })
        const _ = require('lodash')
        unit = _.compact(unit)
        unit = unit[0]
      }
      return unit
    })
    fields = {
      ...getFieldsValue(),
      names,
      units: maps,
    }
    setFieldsValue(fields)
  }

  getFieldDecorator('keys', { initialValue: [] })
  const keys = getFieldValue('keys')
  const formItems = keys.map((k, index) => {
    return (
      <FormItem
        {...(index === 0 ? formFirstItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '添加物料' : ''}
        required
        key={k}
      >
        <FormItem hasFeedback className={classnames({ [styles.nameFormItem]: true })}>
          {getFieldDecorator(`names[${k}]`, {
            rules: [{
              required: true,
              message: '请将物料信息填写完整',
            }, {
              whitespace: true,
            }],
          })(
            <Select placeholder="请选择所用物料">
              {supplyOptions}
            </Select>
          )}
        </FormItem>
        <FormItem hasFeedback className={classnames({ [styles.countFormItem]: true })} >
          {getFieldDecorator(`numbers[${k}]`, {
            rules: [{
              required: true,
              message: '物料用量不能为空',
            }, {
              pattern: /^(\d{1,3}(\.\d{1,2})?)$/,
              message: '请输入正数          ，整数不可多于三位，小数不可多于两位',
            }],
          })(<Input onFocus={handleModalCountFocus} placeholder="请输入物料用量" style={{ display: 'inline-block', width: '100%' }} />)}
        </FormItem>

        <FormItem className={classnames({ [styles.unitFormItem]: true })} >
          {getFieldDecorator(`units[${k}]`, {
          })(
            <Input disabled className={classnames({ [styles.formItemInput]: true })} />
          )}
        </FormItem>
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => remove(k)}
          />
        ) : null}
      </FormItem>
    )
  })

  const judgeModalBody = () => { // 根据点击按钮的字段值去返回不同的模态框
    if (modalOpts.title === '添加所用物料') {
      return (
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="配方名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('rName', {
                initialValue: item.rname,
                rules: [
                  {
                    required: true,
                    message: '请输入配方名称',
                  }, {
                    pattern: /^[\u4e00-\u9fa5]+$/,
                    message: '请输入汉字',
                  }, {
                    max: 10,
                    message: '最多输入10个汉字',
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('form', {
                initialValue: item.rname,
                rules: [
                  {
                    required: true,
                    message: '请将物料信息填写完整',
                  },
                ],
              })(
                <Form>
                  {formItems}
                  <FormItem {...formItemLayoutWithOutLabel} >
                    <Button type="dashed" onClick={add} className={classnames({ [styles.addItemButton]: true })}>
                      <Icon type="plus" /> 添加一条物料
                    </Button>
                  </FormItem>
                </Form>
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    } else if (modalOpts.title === '修改配方名称') {
      return (
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="配方名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('rName', {
                initialValue: item.rname,
                rules: [
                  {
                    required: true,
                    message: '请输入配方名称',
                  }, {
                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
                    message: '请输入汉字，字母或数字',
                  }, {
                    max: 10,
                    message: '最多输入10个字符',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    } else if (modalOpts.title === '修改物料') {
      return (
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            <FormItem label="物料名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('sName', {
                initialValue: item.sname,
                rules: [
                  {
                    required: true,
                  }, {
                    pattern: /^[\u4e00-\u9fa5]+$/,
                    message: '请输入汉字',
                  }, {
                    max: 10,
                    message: '最多输入10个汉字',
                  },
                ],
              })(
                <Select placeholder="请选择所用物料" onChange={onSelectSupplyChange}>
                  {supplyOptions}
                </Select>
              )}
            </FormItem>
            <FormItem label="物料用量" hasFeedback {...formItemLayout}>
              {getFieldDecorator('sCount', {
                initialValue: item.scount.toString(),
                rules: [
                  {
                    required: true,
                    message: '物料的用量不能为空',
                  }, {
                    pattern: /^(\d{1,3}(\.\d{1,2})?)$/,
                    message: '请输入正数          ，整数不可多于三位，小数不可多于两位',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="物料单位" hasFeedback {...formItemLayout}>
              {getFieldDecorator('sUnitName', {
                initialValue: item.sunitName,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
    return ( // 创建新配方Modal
      <Modal {...modalOpts}>
        <Form layout="horizontal">
          <FormItem label="配方名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('rName', {
              initialValue: item.rName,
              rules: [
                {
                  required: true,
                  message: '请输入配方名称',
                }, {
                  pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
                  message: '请输入汉字，字母或数字',
                }, {
                  max: 10,
                  message: '最多输入10个字符',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('form', {
              initialValue: item.rname,
              rules: [
                {
                  required: true,
                  message: '请将物料信息填写完整',
                },
              ],
            })(
              <Form>
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel} >
                  <Button type="dashed" onClick={add} className={classnames({ [styles.addItemButton]: true })}>
                    <Icon type="plus" /> 添加一条物料
                  </Button>
                </FormItem>
              </Form>
            )}
          </FormItem>
        </Form>
        <text className={classnames({ [styles.modalHint]: true })}>若没有您需要的物料，请先到“物料管理”页面添加物料</text>
      </Modal>
    )
  }
  return judgeModalBody()
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
