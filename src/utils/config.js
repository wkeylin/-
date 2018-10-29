const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: 'AntD Admin',
  prefix: 'antdAdmin',
  footerText: 'Ant Design Admin  © 2018 web',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    listShop: '/shop/listShop', // 查看门店列表
    listDishMenu: '/dishMenu/listDishMenu', // 获取菜谱列表供门店信息管理时使用
    insertShop: '/shop/insertShop', // 新增门店
    deleteShop: '/shop/deleteShop', // 删除门店
    updateShop: '/shop/updateShop', // 修改门店
    listDishUnit: '/dishUnit/listDishUnit', // 查询菜品单位
    addDishUnit: '/dishUnit/addDishUnit', // 添加菜品单位
    updateDishUnit: '/dishUnit/updateDishUnit', // 修改菜品单位
    listShopByCondition: '/shop/listShopByCondition', // 按条件查询门店
    listRecipe: '/recipe/listRecipe', // 查询或查找配方列表
    listSupplyi: '/supply/listSupplyi', // 查询物料列表
    deleteRecipeItem: '/recipe/updateSstate', // 删除配方中的物料
    deleteRecipe: '/recipe/updateRstate', // 删除配方
    addRecipe: '/recipe/addRecipe', // 新增配方或新增配方里的物料
    updateRecipeName: '/recipe/updateRname', // 修改配方名称
    updateOneRecipe: '/recipe/updateOneRecipe', // 修改单条物料
    // 菜品信息接口
    insertDish: '/dish/insertDish',
    listDish: '/dish/listDish',
    deleteDish: '/dish/deleteDish',
    updateDish: '/dish/updateDish',
    queryDishId: '/dish/getDishById',
    queryDishName: '/dish/getDishByName',
    queryAddInfo: '/dish/insertInfo',
    queryCost: '/dish/calcDishPrice',
    // 菜谱管理接口
    queryDishMenuItem: '/dishMenu/listDishMenuItem',
    insertDishMenu: '/dishMenu/insertDishMenu',
    deleteDishMenu: '/dishMenu/deleteDishMenu',
    updateDishMenu: '/dishMenu/updateDishMenu',
    listDishItem: '/dishMenu/listDishItem',
  },
}
