import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/Login'
import Home from 'components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path:'/home',
      component:Home
    }
  ]
})
// 给router对象注册一个导航守卫
// 将来所有的导航（路由发生了跳转）都要经过beforeEach
// to: 去哪儿
// from: 从哪儿
// next: 是否放行  next():表示直接放行   next('/login')表示跳转到/login
router.beforeEach((to, from, next) => {
  // 如果要去登录页，直接放行
  if (to.path === '/login') {
    // 直接放行
    next()
    return
  }
  // 如果不是登录， 判断是否有token，如果有，放行，如果没有，去登录
  let token = localStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router