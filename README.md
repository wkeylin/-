## 项目2组前端技术方案
### 一、业务流程图

![业务流程图](http://image.keyling.cn/%E5%89%8D%E7%AB%AF%E4%B8%9A%E5%8A%A1%E6%B5%81%E7%A8%8B%E5%9B%BE.png "业务流程图")

### 二、技术栈选型
Dva、Ant Design、React全家桶

### 三、模块内容
<table style="text-align:center; width: 800px">
    <tr>
        <th>一级模块</td>
        <th>二级模块</td>
        <th style="width: 300px">所用组件</td>
        <th>负责人</td>
    </tr>
    <tr>
        <td rowspan="5"><b>菜品管理</b></td>
        <td>菜品类别管理</td>
        <td>弹出框Modal、数据展示List</td>
        <td>王奇林</td>
    </tr>
    <tr>
        <td>菜品信息管理</td>
        <td>新增修改菜品弹出框Modal、菜品数据展示List、菜品类型和菜品名称搜索Filter</td>
        <td>马云松</td>
    </tr>
    <tr>
        <td>菜谱管理</td>
        <td>新增修改菜谱弹出框Modal、查看特定菜谱菜品弹出框Modal、菜谱数据展示List、菜谱名称搜索Filter</td>
        <td>马云松</td>
    </tr>
    <tr>
        <td>菜品单位管理</td>
        <td>弹出框Modal、数据展示List、搜索Filter、Form表单</td>
        <td>张乃璎</td>
    </tr>
    <tr>
        <td>配方管理</td>
        <td>弹出框Modal、数据展示List、搜索Filter、可动态增减的Form表单、可展开的Table</td>
        <td>张乃璎</td>
    </tr>
    <tr>
        <td><b>门店管理</b></td>
        <td>门店信息管理</td>
        <td>弹出框Modal、数据展示List、搜索Filter、Form表单</td>
        <td>张乃璎</td>
    </tr>
    <tr>
        <td rowspan="2"><b>供应链</b></td>
        <td>物料管理</td>
        <td>弹出框Modal、数据展示List、搜索Filter、Form表单</td>
        <td>王奇林</td>
    </tr>
    <tr>
        <td>物料单位管理</td>
        <td>弹出框Modal、数据展示List、Form表单</td>
        <td>王奇林</td>
    </tr>
    <tr>
        <td><b>BOM管理</b></td>
        <td>BOM信息展示</td>
        <td>数据展示List、搜索Filter</td>
        <td>王奇林</td>
    </tr>
</table>



### 四、接口

- 菜品管理模块

接口名 | 传入参数 | 返回参数 | 接口功能
---|---|---|---
/dish/listDish |  String dishName|Map<String,Object>|显示所有的在售的菜品
/dish/insertDish | Dish dish|操作是否成功的提示信息|向菜品表里添加一道菜
/dish/updateDish | Dish dish|操作是否成功的提示信息|更新菜品库中在售的菜的信息
/dish/deleteDish | String dishName|操作是否成功的提示信息|停售一道菜
/dish/insertDish/save_ohoto | 插入菜品样图
/dish/getDishById | int id|Map<String,Object>|根据菜品的ID查询一道菜
/dish/getDishByName | String dishNmame|Map<String,Object>|根据菜品名字查询一道菜
/dish/insertInfo | String typeName|Map<String,Object>|查询添加菜品的信息
- 菜谱管理模块

接口名 | 传入参数 | 返回参数|接口工能描述
---|---|---|---
/dishMenu/insertDishMenu | List<DishMenu> dishMenus|Map<String,Object>|生成一份新的菜谱
/dishMenu/updateDishMenu | List<DishMenu> dishMenus|Map<String,Object>|更新菜谱的内容
/dishMenu/deleteDishMenu | String menuName|Map<String,Object>|删除相应菜谱的信息
/dishMenu/listDishMenuItem | String menuName|Map<String,Object>|查询一条菜谱的信息
/dishMenu/listDishMenu | List<DishMenu> dishMenus|Map<String,Object>|查看菜谱的所有信息
/dishMenu/listDishItem |String dish| Map<String,Object>|查询一份菜谱下的菜品信息

- 配方管理模块

接口名 | 输入参数|返回参数|接口功能描述
---|---|---|---
/recipe/listRecipe | String reciprName|Map<String,Object>|根据用户输入的recipeName查出相应配方
/recipe/updateRname | Recipe recipe|Map<String,Object>|用户输入一组表中原有的配方的名称（Rname）信息进行相应的配方名称（Rname）信息更新
/recipe/updateRstate|String rName|Map<String,Object>|用户对于正在使用的配方进行相关物料的去除
/recipe/updateSstate|int id|Map<String,Object>|用户对于正在使用的配方进行相关物料的去除
/recipe/listBom|String rName|Map<String,Object>|展示相应菜品的Bom信息
/recipe/addRecipe|Recipe recipe|Map<String,Object>|添加一条新的配方

接口名 | 输入参数 |返回参数|接口功能描述 
---|---|---|---
/supply/insertSupply |Supply supply|Map<String,Object>|添加一种物料
/supply/deleteSupply | int[] idArray|Map<String,Object>|停用一种物料
/supply/updateSupply | String dishName|Map<String,Object>|更新物料的信息
/supply/listSupplyi | String rName|Map<String,Object>|查询所有物料的信息
/supply/listSupply | String rName|Map<String,Object>|根据前端传入的不同的数据查询相应的信息

- 物料管理模块 

接口名 | 输入参数 |返回参数|接口功能描述 
---|---|---|---
/supply/insertSupply |Supply supply|Map<String,Object>|添加一种物料
/supply/deleteSupply | int[] idArray|Map<String,Object>|停用一种物料
/supply/updateSupply | String dishName|Map<String,Object>|更新物料的信息
/supply/listSupplyi | String rName|Map<String,Object>|查询所有物料的信息
/supply/listSupply | String rName|Map<String,Object>|根据前端传入的不同的数据查询相应的信息

接口名 | 传入参数 | 返回参数 | 接口功能
---|---|---|---
/shop/insertShop | Shop | Map<String,Object> |  新增一家门店
/shop/deleteShop | int[] | Map<String,Object> |  关停一家门店
/shop/updateShop | Shop | Map<String,Object> |  更新一家门店的信息
/shop/listShop | void | Map<String,Object> |  所有门店信息列表
/shop/listShopByCondition | Shop | Map<String,Object> |  根据条件查询门店信息

- 物料单位管理模块

接口名 | 传入参数 | 返回参数 | 接口功能
---|---|---|---
/supplyUnit/addSupplyUnit | supplyUnit(物料单位对象) |操作是否成功的提示信息|增加新的物料的单位
/supplyUnit/updateSupplyUnit | name(新的物料单位名称)|操作是否成功的提示信息|修改原有的物料单位的名字
/supplyUnit/listSupplyUnit | “  ”|List<SupplyUnit>|显示所有的物料单位，给用户提供选择范围

- 菜品单位管理模块

接口名 | 输入参数|返回参数|接口功能描述
---|---|---|---
/dishUnit/addDishUnit | DishUnit dishUnit|Map<String,Object>|添加一种物料的新单位种类
/dishUnit/updateUnit | DishUnit dishUnit|Map<String,Object>|更新引种原有的物料单位的信息
/dishUnit/listDishUnit |String dishUnitName|Map<String,Object>|显示所有的物料单位用于约定用户的

