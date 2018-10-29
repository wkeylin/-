/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import styles from './List.less'

const columns = [
  {
    title: '菜品图片',
    dataIndex: 'imgUrl',
    render: (text, record) => (<img style={{ width: '64px' }} src={text} alt={`此乃${record.name}`} />),
  }, {
    title: '菜品编码',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '菜品名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '菜品类别',
    dataIndex: 'typeName',
    key: 'typeName',
  }, {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  }, {
    title: '成本价/元',
    dataIndex: 'cost',
    key: 'cost',
  }, {
    title: '折扣价/元',
    dataIndex: 'discount',
    key: 'discount',
  }, {
    title: '售价/元',
    dataIndex: 'sale',
    key: 'sale',
  },
]

const DishModal = ({
  dataList,
  ...modalProps
}) => {
  return (
    <Modal {...modalProps}>
      <Table
        dataSource={dataList}
        className={classnames({ [styles.table]: true })}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </Modal>
  )
}

DishModal.propTypes = {
  dataList: PropTypes.array,
}

export default DishModal
