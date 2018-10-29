/*
 * @Author: NaiyingZhang
 * @Date: 2018-08-12 13:50:41
 * @Last Modified by: NaiyingZhang
 * @Last Modified time: 2018-08-16 19:10:27
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import queryString from 'query-string'
import styles from './List.less'

const confirm = Modal.confirm
const error = Modal.error

const List = ({ onDeleteItem, onEditItem, onEditDetailItem, onDeleteDetailItem, onEditName, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)
  const { dataSource } = tableProps
  const totalRecipes = dataSource

  /*
    NOTE: 将取到的数组去重用于展示
    recipes和tableProps中的dataSource都是去重后的
    totalRecipes是全部的
   */
  const _ = require('lodash')
  const recipes = _.uniqBy(dataSource, 'rname')
  tableProps.dataSource = recipes

  const expandedRowRender = (record) => {
    /*
      NOTE:
      这里能够取到当前点击的是哪个配方，也能够得到所有的配方与物料关联信息，因此没有再调用后台接口
      而是直接由前端根据所有信息，判断哪一条信息是与当前配方有关的物料信息，将它过滤到recipeDetail中
     */
    let recipeDetail = totalRecipes.map((item) => {
      if (item.rname === record.rname) {
        return item
      }
      return undefined
    })
    recipeDetail = _.compact(recipeDetail)

    const handleMenuClick = (detail, e) => {
      e.preventDefault()
      if (e.target.text === '修改') {
        onEditDetailItem(detail)
      } else if (e.target.text === '删除') {
        confirm({
          title: '确认删除这条信息吗？',
          onOk () {
            onDeleteDetailItem(detail.id)
          },
        })
      }
    }

    const columns = [
      { title: '物料名称', dataIndex: 'sname', key: 'sname' },
      { title: '物料用量', dataIndex: 'scount', key: 'scount' },
      { title: '物料单位', dataIndex: 'sunitName', key: 'sunitName' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, detail) => (
          <span className="table-operation">
            <a href="#" className={classnames({ [styles.option]: true })} onClick={handleMenuClick.bind(this, detail)}>修改</a>
            <a href="#" onClick={handleMenuClick.bind(this, detail)}>删除</a>
          </span>
        ),
      },
    ]
    return (
      <Table
        columns={columns}
        dataSource={recipeDetail}
        rowKey={detail => detail.id}
      />
    )
  }


  const handleMenueClick = (record, e) => {
    e.preventDefault()
    if (e.target.text === '添加所用物料') {
      onEditItem(record)
    } else if (e.target.text === '修改配方名称') {
      onEditName(record)
    } else if (e.target.text === '删除') {
      if (!record.dishState) {
        confirm({
          title: '确认删除这条信息吗？',
          onOk () {
            onDeleteItem(record.rname)
          },
        })
      } else {
        error({
          title: '无法删除',
          content: '该配方有关联的菜品，无法删除，请先删除同名菜品',
        })
      }
    }
  }
  const columns = [
    {
      title: '配方名称',
      dataIndex: 'rname',
      key: 'rname',
    }, {
      title: '操作',
      key: 'operation',
      width: 300,
      render: (text, record) => {
        return (
          <div>
            <a href="#" className={classnames({ [styles.option]: true })} onClick={handleMenueClick.bind(this, record)}>修改配方名称</a>
            <a href="#" className={classnames({ [styles.option]: true })} onClick={handleMenueClick.bind(this, record)}>添加所用物料</a>
            <a href="#" onClick={handleMenueClick.bind(this, record)}>删除</a>
          </div>
        )
      },
    },
  ]


  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandedRowRender={expandedRowRender}
      rowKey={record => record.rname}
      {...tableProps}
    />
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onEditName: PropTypes.func,
  location: PropTypes.object,
  onEditDetailItem: PropTypes.func,
  onDeleteDetailItem: PropTypes.func,
}
export default List
