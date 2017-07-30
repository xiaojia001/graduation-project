import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Goods from '@/components/page/navJibenxinxi/goods'
import Satff from '@/components/page/navJibenxinxi/staff'
import Vendor from '@/components/page/navJibenxinxi/vendor'
import Setting from '@/components/page/navXitongshezhi/setting'
import Stock from '@/components/page/navKucunguanli/stock'
import Inbound from '@/components/page/navKucunguanli/inbound'
import Stockchart from '@/components/page/navChart/stockchart'
import Goodslocation from '@/components/page/navChart/goodslocation'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [

   
    {
        path: '/',
        component: Home,
        name: '库存管理',
        iconCls: 'fa fa fa-th',
        children: [
            { path: '/stock', component: Stock, name: '库存信息',iconCls:'fa fa-flask' },
            { path: '/inbound', component: Inbound, name: '商品入库',iconCls:'fa fa-archive' ,}
        ]
    },
   	{
        path: '/',
        component: Home,
        name: '图表信息',
        iconCls: 'fa fa-area-chart',
        children: [
            { path: '/stockchart', component: Stockchart, name: '库存统计',iconCls: 'fa fa-bar-chart'},
            { path: '/goodslocation', component: Goodslocation, name: '货架分布',iconCls: 'fa fa-pie-chart' },
            //{ path: '/user', component: Page1, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '基础信息',
        iconCls: 'fa fa-database',
        children: [
            { path: '/goods', component:Goods, name: '商品信息',iconCls:'fa fa-shopping-basket' },
            { path: '/staff', component:Satff, name: '员工信息',iconCls:'fa fa-address-card-o' },
            { path: '/vendor', component:Vendor, name: '供货商信息',iconCls:'fa fa fa-truck' },
        ]
      },
    {
    	path:'/login',
    	name:'login',
    	component:Login,
    	hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-gear',
        leaf: true,//只有一个节点
        children: [
            { path: '/setting', component:Setting, name: '系统设置' }
        ]
    }
  ]
})
