/* global window */
/* global document */
import config from 'config'
import queryString from 'query-string'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menu: [
      {
        id: '1',
        name: '菜品管理',
        bpid: '1',
        icon: 'coffee',
        route: '/food',
      },
      {
        id: '12',
        bpid: '1',
        mpid: '1',
        name: '菜品信息',
        icon: 'book',
        route: '/food',
      },
      {
        id: '11',
        bpid: '1',
        mpid: '1',
        name: '菜品类别',
        icon: 'bars',
        route: '/TdishType',
      },
      {
        id: '13',
        bpid: '1',
        mpid: '1',
        name: '菜谱管理',
        icon: 'solution',
        route: '/menu',
      },
      {
        id: '14',
        bpid: '1',
        mpid: '1',
        name: '菜品单位',
        icon: 'edit',
        route: '/Tdishunit',
      }, {
        id: '15',
        bpid: '1',
        mpid: '1',
        name: '配方管理',
        icon: 'contacts',
        route: '/formula',
      },
      {
        id: '2',
        bpid: '1',
        name: '门店管理',
        icon: 'home',
        route: '/store',
      },
      {
        id: '21',
        bpid: '2',
        mpid: '2',
        name: '门店信息管理',
        icon: 'api',
        route: '/store',
      },
      {
        id: '3',
        bpid: '1',
        name: '供应链',
        icon: 'fork',
        route: '/food',
      },
      {
        id: '31',
        bpid: '3',
        mpid: '3',
        name: '物料管理',
        icon: 'shopping-cart',
        route: '/materials',
      }, {
        id: '33',
        bpid: '3',
        mpid: '3',
        name: '物料单位',
        icon: 'edit',
        route: '/unit',
      },
      {
        id: '50',
        bpid: '12',
        mpid: '-1',
        route: '/bom',
        name: 'Bom信息',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {
    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
