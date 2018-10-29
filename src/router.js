import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  })
  const routes = [
    {
      path: '/food',
      models: () => [import('./models/food')],
      component: () => import('./routes/food'),
    }, {
      path: '/unit',
      models: () => [import('./models/unit')],
      component: () => import('./routes/unit'),
    }, {
      path: '/materials',
      models: () => [import('./models/materials')],
      component: () => import('./routes/materials'),
    }, {
      path: '/bom',
      models: () => [import('./models/bom')],
      component: () => import('./routes/bom'),
    }, {
      path: '/TdishType',
      models: () => [import('./models/dishtype')],
      component: () => import('./routes/dishtype'),
    }, {
      path: '/Tdishunit',
      models: () => [import('./models/dishunit')],
      component: () => import('./routes/dishunit'),
    }, {
      path: '/store',
      models: () => [import('./models/store')],
      component: () => import('./routes/store'),
    }, {
      path: '/formula',
      models: () => [import('./models/formula')],
      component: () => import('./routes/formula'),
    },
    {
      path: '/menu',
      models: () => [import('./models/menu')],
      component: () => import('./routes/menu'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/food" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
