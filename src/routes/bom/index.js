/*
 * @Author: wql
 * @Date: 2018-08-14 15:56:13
 * @Last Modified by: wql
 * @Last Modified time: 2018-08-14 19:26:13
 */

import { connect } from 'dva'
import React from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import queryString from 'query-string'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const Bom = ({ location, dispatch, bom, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, dishList, rName } = bom
  const listProps = {
    dataSource: list,
    loading: loading.effects['bom/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          rName,
          current: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
  }
  const handleFilter = (payload) => {
    const { key: keyName } = payload
    dispatch({
      type: 'updateState',
      payload: {
        rName: keyName,
      },
    })
    dispatch({
      type: 'bom/query',
      payload: {
        rName: keyName,
      },
    })
  }
  const filterProps = {
    handleFilter,
    dishList,
    rName,
  }
  return (
    <Page inner >
      <Filter {...filterProps} />
      <List {...listProps} />
    </Page>
  )
}
Bom.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  bom: PropTypes.object,
}
export default connect(({ bom, loading }) => ({ bom, loading }))(Bom)
