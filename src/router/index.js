/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    { path: '/404', component: _import('common/404'), name: 'theme', meta: { title: '404' } },
    { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
    /*{path:'/policy-pack',component:_import('modules/policy-pack/policy-pack'),name:'policy-pack',meta:{title:'月政策包管理',isTab: true }},*/
    {path:'/policy-pack-add-or-update',component: _import('modules/policy-pack/policy-pack-add-or-update'),name:'policy-pack-add-or-update',meta: { title: '月政策包新增or编辑',isTab: true }},
    {path:'/policy-pack-view',component:_import('modules/policy-pack/policy-pack-view'),name:'policy-pack-view',meta:{title:'月政策包查看',isTab: true }},
    /*{path:'/policy',component:_import('modules/policy/policy'),name:'policy',meta:{title:'政策管理',isTab: true }},*/
    {path:'/policy-original-text-add-or-update',component:_import('modules/policy/policy-original-text-add-or-update'),name:'policy-original-text-add-or-update',meta:{title:'政策原文新增or编辑',isTab: true }},
    {path:'/policy-original-view',component:_import('modules/policy/policy-original-view'),name:'policy-original-view',meta:{title:'政策原文查看',isTab: true }},
    {path:'/policy-article-add-or-update',component:_import('modules/policy/policy-article-add-or-update'),name:'policy-article-add-or-update',meta:{title:'文章新增or编辑',isTab: true }},
    {path:'/policy-article-view',component:_import('modules/policy/policy-article-view'),name:'policy-article-view',meta:{title:'文章查看',isTab: true }},
    {path:'/policy-unscramble',component:_import('modules/policy/policy-unscramble'), name:'policy-unscramble', meta:{title:'逐条解读',isTab: true }},
    {path:'/policy-unscramble-view', component:_import('modules/policy/policy-unscramble-view'), name:'policy-unscramble-view', meta:{title:'逐条解读查看',isTab: true }},
    {path:'/policy-unscramble-extend', component:_import('modules/policy/policy-unscramble-extend'), name:'policy-unscramble-extend', meta:{title:'深度解读',isTab: true }},
    {path:'/policy-unscramble-extend-view', component:_import('modules/policy/policy-unscramble-extend-view'), name:'policy-unscramble-extend-view', meta:{title:'深度解读查看',isTab: true }},
    {path:'/policy-unscramble-contrast', component:_import('modules/policy/policy-unscramble-contrast'), name:'policy-unscramble-contrast', meta:{title:'对比解读',isTab: true }},
    {path:'/policy-unscramble-contrast-view', component:_import('modules/policy/policy-unscramble-contrast-view'), name:'policy-unscramble-contrast-view', meta:{title:'对比解读查看',isTab: true }},
    {path:'/policy-unscramble-official', component:_import('modules/policy/policy-unscramble-official'), name:'policy-unscramble-official', meta:{title:'官方解读',isTab: true }},
    {path:'/policy-unscramble-official-view', component:_import('modules/policy/policy-unscramble-official-view'), name:'policy-unscramble-official-view', meta:{title:'官方解读查看',isTab: true }},
    {path:'/policy-report-expert', component:_import('modules/policy/policy-report-expert'), name:'policy-report-expert', meta:{title:'专家预测',isTab: true }},
    {path:'/policy-report-expert-view', component:_import('modules/policy/policy-report-expert-view'), name:'policy-report-expert-view', meta:{title:'专家预测查看',isTab: true }},
    {path:'/policy-report-idea', component:_import('modules/policy/policy-report-idea'), name:'policy-report-idea', meta:{title:'参考意见',isTab: true }},
    {path:'/policy-report-idea-view', component:_import('modules/policy/policy-report-idea-view'), name:'policy-report-idea-view', meta:{title:'参考意见查看',isTab: true }},
    {path:'/policy-evaluation', component:_import('modules/policy/policy-evaluation'), name:'policy-evaluation', meta:{title:'测评',isTab: true }},
    {path:'/policy-question-add-or-update', component:_import('modules/policy/policy-question-add-or-update'), name:'policy-question-add-or-update', meta:{title:'测评试题新增or编辑',isTab: true },},
    {path:'/policy-question-view', component:_import('modules/policy/policy-question-view'), name:'policy-question-view', meta:{title:'试题查看',isTab: true }},
    /*{path:'/question', component:_import('modules/question/question'), name:'question', meta:{title:'试题管理',isTab: true }},*/
    {path:'/question-add-or-update', component:_import('modules/question/question-add-or-update'), name:'question-add-or-update', meta:{title:'试题管理新增or编辑',isTab: true },},
    {path:'/banner-view',component:_import('modules/banner/banner-view'),name:'banner-view',meta:{title:'广告位查看',isTab: true }},
    {path:'/banner-add-or-update',component:_import('modules/banner/banner-add-or-update'),name:'banner-add-or-update',meta:{title:'广告位新增or编辑',isTab: true }},
    {path:'/user',component:_import('modules/user/user'),name:'user',meta:{title:'普通用户管理',isTab: true }},
    {path:'/company',component:_import('modules/user/company'),name:'company',meta:{title:'企业用户管理',isTab: true }},
    {path:'/company-view',component:_import('modules/user/company-view'),name:'company-view',meta:{title:'企业用户查看',isTab: true }},
    {path:'/companyManage-view',component:_import('modules/user/companyManage-view'),name:'companyManage-view',meta:{title:'企业查看',isTab: true }},
    {path:'/companyManage-add',component:_import('modules/user/companyManage-add'),name:'companyManage-add',meta:{title:'企业新增',isTab: true }},
    {path:'/company-account',component:_import('modules/user/company-account'),name:'company-account',meta:{title:'账户管理',isTab: true }},
    /*{path:'/user-question', component:_import('modules/coach/user-question'), name:'user-question', meta:{title:'用户测评结果',isTab: true }},*/
    {path:'/user-question-view', component:_import('modules/coach/user-question-view'), name:'user-question-view', meta:{title:'用户测评结果查看',isTab: true }},
    /*{path:'/user-report-res', component:_import('modules/coach/user-report-res'), name:'user-report-res', meta:{title:'用户报告结果',isTab: true }},*/
    {path:'/user-report-res-view', component:_import('modules/coach/user-report-res-view'), name:'user-report-res-view', meta:{title:'用户报告结果查看',isTab: true }},
    /*{path:'/member-order', component:_import('modules/order/member-order'), name:'member-order', meta:{title:'会员订单',isTab: true }},
    {path:'/exam-order', component:_import('modules/order/exam-order'), name:'exam-order', meta:{title:'补考订单',isTab: true }},*/
    {path:'/company-question-view', component:_import('modules/question-record/company-question-view'), name:'company-question-view', meta:{title:'企业问答查看',isTab: true }},
    {path:'/question-record-view', component:_import('modules/question-record/question-record-view'), name:'question-record-view', meta:{title:'问题管理查看',isTab: true }}
    ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ]);
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    // console.log('\n')
    // console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    //console.log(mainRoutes.children)
    // console.log('%c!<-------------------- 动态(菜单)路j由 e -------------------->', 'color:blue')
  }
}

export default router
