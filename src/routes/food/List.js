/*
 * @Author: mys
 * @Date: 2018-08-14 16:24:06
 * @Last Modified by:   mys
 * @Last Modified time: 2018-08-14 14:36
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import queryString from 'query-string'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, onBOM, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenueClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '你确定要删除这道菜品吗?',
        onOk () {
          // 删除菜品时传给后端一整个数组便于后端操作
          onDeleteItem([record.id])
        },
      })
    } else if (e.key === '3') {
      // 跳转到查看BOM的弹窗,利用routerRedux
      onBOM(record.name)
    }
  }
  const columns = [
    {
      title: '菜品图片',
      dataIndex: 'imgUrl',
      render: (text, record) => (
        <Avatar shape={'square'} style={{ verticalAlign: 'middle' }} size="large" src={record.imgUrl} />
      ),
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
      key: 'cost',
      render: (text, value) => {
        return <span>{parseFloat(value.cost).toFixed(2)}</span>
      },
    }, {
      title: '折扣价/元',
      key: 'discount',
      render: (text, value) => {
        return <span>{parseFloat(value.discount).toFixed(2)}</span>
      },
    }, {
      title: '售价/元',
      key: 'sale',
      render: (text, value) => {
        return <span>{parseFloat(value.sale).toFixed(2)}</span>
      },
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenueClick(record, e)} menuOptions={[{ key: '1', name: '修改菜品' }, { key: '2', name: '删除菜品' }, { key: '3', name: '查看BOM' }]} style={{ width: 30 }} />
      },
    },
  ]
  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true })}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
  onBOM: PropTypes.func,
}
export default List
