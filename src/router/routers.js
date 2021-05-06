import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    // component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      },
      {
        path: 'forget',
        component: (resolve) => require(['@/views/system/user/forget'], resolve),
        name: '忘记密码',
        meta: { title: '忘记密码' }
      }
    ]
  },
  {
    path: '/test/index',
    component: (resolve) => require(['@/views/test/testIndex/index'], resolve),
    hidden: true,
    name: '测试链接页',
    meta: { title: '测试链接页' }
  },
  {
    path: 'test/jsmap',
    hidden: true,
    component: (resolve) => require(['@/views/test/jsmap/index'], resolve),
    name: 'js测试地图',
    meta: { title: 'js测试地图' }
  },
  {
    path: '/operators',
    component: Layout,
    name: '供应商入驻',
    redirect: 'noredirect',
    children: [
      {
        path: '/enter',
        // hidden: false,
        component: (resolve) => require(['@/views/operators/enter/index'], resolve),
        name: '入驻申请',
        meta: { title: '入驻申请' }
      },
      {
        path: 'enter-setting',
        // hidden: false,
        component: (resolve) => require(['@/views/operators/enterSetting/index'], resolve),
        name: '入驻申请设置',
        meta: { title: '入驻申请设置' }
      }
    ]
  }

]

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
